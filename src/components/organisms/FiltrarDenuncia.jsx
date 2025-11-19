import React, { useState, useEffect } from 'react';
// 💡 Importar la nueva función updateDenunciaEstado
import { fetchDenuncias, updateDenunciaEstado } from '../../lib/data.ts';
import DenunciaCard from '../molecules/DenunciaCard.jsx';
import { SearchIcon, StateIcon } from '../../icons/AllIcons.jsx';

const FiltrarDenuncia = () => {
    // 1. Estados principales para datos y UI
    const [allDenuncias, setAllDenuncias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. Estados para el filtrado
    const [filter, setFilter] = useState({
        estado: '',
        search: '',
    });

    // 3. Estados para los contadores 
    const [counts, setCounts] = useState({
        total: 0,
        pendiente: 0,
        enproceso: 0,
        resuelta: 0,
    });

    // 4. Estados para el Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDenuncia, setSelectedDenuncia] = useState(null);

    const availableStates = ['pendiente', 'en_proceso', 'resuelta'];

    //  FUNCIÓN DE RECARGA
    const refreshDenuncias = async () => {
        setLoading(true);
        try {
            const data = await fetchDenuncias();
            setAllDenuncias(data);
            setError(null);
        } catch (err) {
            setError('Error al cargar denuncias.');
        } finally {
            setLoading(false);
        }
    };

    // 4. Lógica de carga de datos al inicio (SOLO CARGA INICIAL)
    useEffect(() => {
        refreshDenuncias();
    }, []);

    // 5. Lógica de cálculo de contadores y actualización del DOM
    useEffect(() => {
        if (allDenuncias.length > 0) {
            const safeFilter = (estadoData) => allDenuncias.filter(d =>
                d && d.estado && d.estado.toLowerCase() === estadoData
            ).length;

            const total = allDenuncias.length;
            const pendiente = safeFilter('pendiente');
            const enproceso = safeFilter('en proceso');
            const resuelta = safeFilter('resuelta');

            const newCounts = { total, pendiente, enproceso, resuelta };
            setCounts(newCounts);

            // Despacho de evento para el contador en home.astro
            if (typeof window !== 'undefined') {
                const event = new CustomEvent('denunciaDataLoaded', { detail: newCounts });
                window.dispatchEvent(event);
            }
        }
    }, [allDenuncias]);

    // 6. Manejo de cambios en el filtro
    const handleFilterChange = (e) => {
        setFilter({
            ...filter,
            [e.target.name]: e.target.value,
        });
    };

    // --- FUNCIONES DE MANEJO DE MODAL ---
    const handleCardClick = (denuncia) => {
        setSelectedDenuncia(denuncia);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedDenuncia(null), 300);
    };

    // 7. Lógica de filtrado de denuncias 
    const filteredDenuncias = allDenuncias.filter(denuncia => {
        const denunciaEstado = denuncia.estado ? denuncia.estado.toLowerCase() : '';
        const filtroEstado = filter.estado.toLowerCase().trim();
        const searchLower = filter.search.toLowerCase();

        let estadoMatch = true;

        if (filtroEstado !== '') {
            estadoMatch = denunciaEstado === filtroEstado;
        }

        const searchMatch = //
            denuncia.categoria.toLowerCase().includes(searchLower) ||
            denuncia.descripcion.toLowerCase().includes(searchLower);

        return estadoMatch && searchMatch;
    });


    // --- 8. COMPONENTE MODAL EN LÍNEA  ---
    const DenunciaDetailModal = ({ denuncia, onClose, onUpdateSuccess }) => {
        if (!denuncia) return null;

        //  FIX 1: URL BASE DE SUPABASE STORAGE (TU PROYECTO)
        const SUPABASE_STORAGE_BASE_URL = 'https://aikjdjlykotamrgyogtp.supabase.co/storage/v1/object/public/user-evidence-vault/';

        //  ESTADOS para manejar el selector de estado
        const [currentStatus, setCurrentStatus] = useState(denuncia.estado.toLowerCase());
        const [isSaving, setIsSaving] = useState(false);

        // Lista de estados disponibles
        const availableStatus = ['pendiente', 'en_proceso', 'resuelta'];
        const statusMap = {
            pendiente: 'Pendiente',
            en_proceso: 'En proceso',
            resuelta: 'Resuelta'
        };

        const getEstadoColor = (estado) => {
            switch (estado?.toLowerCase()) {
                case 'pendiente': return 'bg-yellow-100 text-yellow-700';
                case 'en_proceso': return 'bg-blue-100 text-blue-700';
                case 'resuelta': return 'bg-green-100 text-green-700';
                default: return 'bg-gray-100 text-gray-700';
            }
        };

        //  FUNCIÓN PARA GUARDAR EL NUEVO ESTADO
        const handleSaveStatus = async () => {
            if (currentStatus === denuncia.estado.toLowerCase()) {
                alert('El estado ya es el seleccionado.');
                return;
            }

            setIsSaving(true);
            try {
                // Llama a la función de la API
                await updateDenunciaEstado(denuncia.id, currentStatus);
                //  VUELVE A CARGAR LOS DATOS PRINCIPALES
                onUpdateSuccess();
                onClose();

            } catch (error) {
                console.error("Error al guardar el nuevo estado:", error);
                alert('Fallo al actualizar el estado. Revisa la consola y la API.');
            } finally {
                setIsSaving(false);
            }
        };

        // Formatear la fecha
        const formattedDate = new Date(denuncia.fecha_creacion).toLocaleDateString('es-ES', {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        // Lógica de evidencias 
        let evidenciasArray = [];
        if (denuncia.evidencias) {
            if (Array.isArray(denuncia.evidencias)) {
                evidenciasArray = denuncia.evidencias;
            } else if (typeof denuncia.evidencias === 'string') {
                try {
                    const parsed = JSON.parse(denuncia.evidencias);
                    if (Array.isArray(parsed)) {
                        evidenciasArray = parsed;
                    }
                } catch (e) {
                    console.error("Error al parsear evidencias:", e);
                    // Si falla, asumimos que es una sola cadena de texto que debe ser la ruta.
                    evidenciasArray = [denuncia.evidencias];
                }
            }
        }

        return (
            <div className="fixed inset-0 bg-white/5 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl py-8 px-6 md:px-8 w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>

                    <h2 className="text-xl font-bold text-gray-900 mt-0 mb-4">
                        Detalles de Denuncia
                    </h2>

                    <hr className="border-t-2 border-gray-200 opacity-75 mb-6" />

                    {/*  NUEVO BLOQUE: CAMBIADOR DE ESTADO */}
                    <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-3 w-full">
                            <span className="text-sm text-gray-500 font-medium white space-nowrap">Estado actual:</span>
                            <span className={`${getEstadoColor(currentStatus)} text-sm font-bold px-3 py-1 rounded-full uppercase `}>
                                {statusMap[currentStatus]}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <select
                                value={currentStatus}
                                onChange={(e) => setCurrentStatus(e.target.value)}
                                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0c3b87] focus:border-[#0c3b87] w-full"
                                disabled={isSaving}
                            >
                                {availableStatus.map(status => (
                                    <option key={status} value={status}>
                                        {statusMap[status]}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={handleSaveStatus}
                                className={`px-4 py-2 rounded-lg text-white font-semibold transition duration-200 whitespace-nowrap ${isSaving || currentStatus === denuncia.estado.toLowerCase()
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-[#0c3b87] hover:bg-[#092a5f]'
                                    }`}
                                disabled={isSaving || currentStatus === denuncia.estado.toLowerCase()}
                            >
                                {isSaving ? 'Guardando...' : 'Guardar Cambio'}
                            </button>
                        </div>
                    </div>
                    <div className="space-y-4 mb-6 text-sm md:text-base">
                        <p>
                            <span className="text-sm text-gray-500 overflow-hidden break-words">Categoría:</span> {denuncia.categoria}
                        </p>
                        <p>
                            <span className="text-sm text-gray-500">Ubicación:</span> {denuncia.ubicacion}
                        </p>

                        <p className="text-sm text-gray-500 pt-2">Descripción:</p>
                        <p className="text-gray-700 whitespace-pre-wrap p-4 bg-gray-50 border rounded-lg shadow-inner">{denuncia.descripcion}</p>

                        {evidenciasArray.length > 0 && (
                            <div>
                                <p className="text-sm text-gray-500 mt-3">Evidencias ({evidenciasArray.length}):</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {evidenciasArray.map((url, index) => {

                                        //  CORRECCIÓN 1: Evitamos la doble concatenación.
                                        // Si la URL ya empieza por 'http', significa que ya está completa.
                                        const finalUrl = url;

                                        // CORRECCIÓN 2 (Adicional, para seguridad): Limpiamos la URL por si se guardó mal en la DB.
                                        // Esto busca y reemplaza cualquier duplicación del path del bucket.
                                        const cleanedUrl = finalUrl.replace(
                                            /(\/storage\/v1\/object\/public\/user-evidence-vault\/){2,}/,
                                            '/storage/v1/object/public/user-evidence-vault/'
                                        );

                                        return (
                                            <a
                                                key={index}
                                                href={cleanedUrl} // Usamos la URL corregida y limpia
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-900 hover:text-gray-900 hover:underline text-lg truncate max-w-full font-medium"
                                            >
                                                Evidencia {index + 1}
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        <p>
                            <span className="text-sm text-gray-500">Fecha de Creación:
                            </span> <p> {formattedDate}</p>
                        </p>
                    </div>
                </div>
            </div>
        );
    };


    return (
        <div className="py-6">
            {/* ... (Sección de Filtros, código existente) ... */}
            <section className="flex flex-col md:flex-row gap-4 p-4 mb-6 bg-white border border-gray-200 rounded-xl shadow-md">
                {/* 1. Búsqueda por texto */}
                <div className="relative flex-grow">
                    <input
                        type="text"
                        name="search"
                        placeholder="Buscar por Categoría o Descripción..."
                        value={filter.search}
                        onChange={handleFilterChange}
                        className="w-full p-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0c3b87] focus:border-[#0c3b87]"
                    />
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>

                {/* 2. Filtrar por Estado */}
                <div className="relative w-full md:w-56">
                    <select
                        name="estado"
                        value={filter.estado}
                        onChange={handleFilterChange}
                        className="w-full p-2.5 pl-10 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-[#0c3b87] focus:border-[#0c3b87] pr-8"
                    >
                        <option value="">Todos los Estados</option>
                        {availableStates.map(state => (
                            <option key={state} value={state}>
                                {state.charAt(0).toUpperCase() + state.slice(1)}
                            </option>
                        ))}
                    </select>
                    <StateIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
            </section>

            {/* Lista de Denuncias */}
            <div className="py-4">
                {/* ... Lógica de loading ... */}
                {loading && !error && (
                    <div className="flex flex-col items-center justify-center h-48 bg-white rounded-xl shadow-lg">
                        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                        <p className="mt-4 text-lg text-gray-600">Cargando denuncias...</p>
                    </div>
                )}

                {!loading && !error && filteredDenuncias.length === 0 && allDenuncias.length > 0 && (
                    <div className="text-center p-6 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-lg shadow-md">
                        <p className="font-semibold text-lg mb-2">Sin Coincidencias</p>
                        <p>No hay denuncias que coincidan con los filtros aplicados.</p>
                    </div>
                )}

                {/* Grid para mostrar las denuncias */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {!loading && !error && filteredDenuncias.map(denuncia => (
                        <DenunciaCard
                            key={denuncia.id}
                            denuncia={denuncia}

                            onClick={handleCardClick}
                        />
                    ))}
                </div>
            </div>

            {/* Renderizar Modal Condicionalmente */}
            {isModalOpen && (
                <DenunciaDetailModal
                    denuncia={selectedDenuncia}
                    onClose={handleCloseModal}
                    //  PASAMOS LA FUNCIÓN DE RECARGA: onUpdateSuccess
                    onUpdateSuccess={refreshDenuncias}
                />
            )}
        </div>
    );
};

export default FiltrarDenuncia;