import React, { useState, useEffect } from 'react';

// --- COMPONENTE: TIMELINE VIEWER ---
export const TimelineViewer = ({ denunciaId }) => {
    const [timelineData, setTimelineData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Obtener URL del backend desde variable de entorno
    const API_URL = 'https://backend-api-638220759621.us-west1.run.app';

    useEffect(() => {
        const fetchTimeline = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`${API_URL}/timeline/${denunciaId}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                setTimelineData(data);
                console.log(`✅ Timeline cargado: ${data.length} entrada(s)`);
            } catch (err) {
                console.error('❌ Error al cargar timeline:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (denunciaId) {
            fetchTimeline();
        }
    }, [denunciaId, API_URL]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    if (loading) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Cargando timeline...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center text-red-600">
                <p className="text-sm">⚠️ Error al cargar timeline: {error}</p>
            </div>
        );
    }

    if (timelineData.length === 0) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-gray-500">
                <p className="text-sm">No hay actualizaciones disponibles para esta denuncia.</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="relative">
                {/* Línea vertical del timeline */}
                <div className="absolute left-4 top-6 bottom-0 w-px bg-gray-300"></div>

                {/* Entradas del timeline */}
                <div className="space-y-4">
                    {timelineData.map((entry, index) => {
                        const isLast = index === timelineData.length - 1;

                        return (
                            <div key={entry.id} className="relative pl-12">
                                {/* Punto indicador */}
                                <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center border-2 ${isLast ? 'bg-gray-700 border-gray-700' : 'bg-white border-gray-300'
                                    }`}>
                                    <div className={`w-2 h-2 rounded-full ${isLast ? 'bg-white' : 'bg-gray-400'}`}></div>
                                </div>

                                {/* Tarjeta de contenido */}
                                <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${isLast ? 'ring-2 ring-gray-300' : ''}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-gray-900 text-sm">
                                            {entry.titulo}
                                        </h4>
                                        {isLast && (
                                            <span className="bg-gray-700 text-white text-xs px-2 py-0.5 rounded font-semibold">
                                                Reciente
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                                        {entry.descripcion}
                                    </p>

                                    {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                                        <div className="bg-white rounded p-2 mb-3 text-xs border border-gray-200">
                                            {Object.entries(entry.metadata).map(([key, value]) => (
                                                <div key={key} className="flex gap-2">
                                                    <span className="font-semibold text-gray-500 capitalize">{key}:</span>
                                                    <span className="text-gray-700">{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 pt-2 border-t border-gray-200">
                                        <div className="flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span className="font-medium">{entry.nombre_actualizador}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>{formatDate(entry.fecha_actualizacion)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-full px-3 py-1 text-xs text-gray-600">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">
                        Total de actualizaciones: {timelineData.length}
                    </span>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENTE: ADMIN TIMELINE MANAGER ---
export const AdminTimelineManager = ({ denunciaId, estadoActual, onSuccess, onClose }) => {
    const [modoCreacion, setModoCreacion] = useState('plantillas');
    const [loading, setLoading] = useState(false);
    const [plantillaSeleccionada, setPlantillaSeleccionada] = useState(null);

    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        nuevo_estado: '', // Estado que se guardará en denuncias.estado
        nombre_actualizador: 'Fiscal FGR',
        metadata: {}
    });

    const [metadataFields, setMetadataFields] = useState([]);

    const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:8000';

    // PLANTILLAS COMPLETAS SEGÚN PROCESO FGR
    const todasLasPlantillas = [
        // Las mismas 30 plantillas que antes, pero ahora guardamos el estado completo
        { tipo: 'recepcion', titulo: 'Denuncia Recibida', descripcion: 'Su denuncia ha sido recibida y registrada en el sistema. Se le ha asignado un número de caso y está en proceso de evaluación preliminar.', estado_asociado: 'pendiente' },
        { tipo: 'asignacion_fiscal', titulo: 'Fiscal Asignado', descripcion: 'Se ha asignado un Fiscal Auxiliar para la evaluación inicial de su denuncia.', estado_asociado: 'pendiente' },
        { tipo: 'revision_competencia', titulo: 'Revisión de Competencia', descripcion: 'Se está verificando si los hechos denunciados corresponden a la competencia de la Fiscalía General de la República.', estado_asociado: 'pendiente' },
        { tipo: 'admision_caso', titulo: 'Caso Admitido', descripcion: 'Su denuncia ha sido admitida. Se ha verificado que los hechos corresponden a la competencia de esta institución y se procederá con la investigación formal.', estado_asociado: 'en_proceso' },
        { tipo: 'no_competencia', titulo: 'No Corresponde a FGR', descripcion: 'Tras la evaluación, se determinó que los hechos no corresponden a la competencia de esta institución. La denuncia será remitida a la entidad competente.', estado_asociado: 'no_corresponde' },
        { tipo: 'derivacion', titulo: 'Caso Derivado', descripcion: 'El caso ha sido derivado a la institución competente para su seguimiento correspondiente.', estado_asociado: 'no_corresponde' },
        { tipo: 'inicio_investigacion', titulo: 'Investigación Iniciada', descripcion: 'Se ha iniciado formalmente la investigación del caso. Se realizarán las diligencias necesarias para el esclarecimiento de los hechos.', estado_asociado: 'en_proceso' },
        { tipo: 'recoleccion_evidencia', titulo: 'Recolección de Evidencia', descripcion: 'Se está procediendo con la recolección y análisis de evidencia física y documental relacionada con los hechos denunciados.', estado_asociado: 'en_proceso' },
        { tipo: 'solicitud_pruebas', titulo: 'Solicitud de Pruebas Periciales', descripcion: 'Se han solicitado pruebas técnicas y periciales especializadas para fortalecer la investigación.', estado_asociado: 'en_proceso' },
        { tipo: 'analisis_forense', titulo: 'Análisis Forense en Proceso', descripcion: 'Se está realizando análisis forense de las evidencias recolectadas por parte de expertos técnicos.', estado_asociado: 'en_proceso' },
        { tipo: 'entrevista_denunciante', titulo: 'Entrevista con Denunciante', descripcion: 'Se ha programado o realizado entrevista formal con el denunciante para ampliar detalles del caso.', estado_asociado: 'en_proceso' },
        { tipo: 'entrevista_testigos', titulo: 'Entrevistas a Testigos', descripcion: 'Se están realizando entrevistas a testigos y personas relacionadas con los hechos para obtener declaraciones.', estado_asociado: 'en_proceso' },
        { tipo: 'citacion_implicados', titulo: 'Citación de Implicados', descripcion: 'Se han emitido citaciones para interrogar a las personas involucradas en los hechos denunciados.', estado_asociado: 'en_proceso' },
        { tipo: 'identificacion_sospechoso', titulo: 'Sospechoso Identificado', descripcion: 'Se ha logrado identificar a un posible responsable de los hechos denunciados con base en la investigación realizada.', estado_asociado: 'en_proceso' },
        { tipo: 'solicitud_orden', titulo: 'Solicitud de Orden Judicial', descripcion: 'Se ha solicitado ante el juez competente una orden judicial para proceder con diligencias específicas.', estado_asociado: 'en_proceso' },
        { tipo: 'captura_sospechoso', titulo: 'Captura Realizada', descripcion: 'Se ha procedido con la captura del o los sospechosos identificados conforme a las órdenes judiciales correspondientes.', estado_asociado: 'en_proceso' },
        { tipo: 'analisis_caso', titulo: 'Análisis Legal del Caso', descripcion: 'Se está realizando el análisis jurídico del caso para determinar la tipificación del delito y las acciones a seguir.', estado_asociado: 'en_proceso' },
        { tipo: 'dictamen_fiscal', titulo: 'Dictamen Fiscal', descripcion: 'El fiscal ha emitido su dictamen sobre el caso con base en las pruebas y evidencias recolectadas.', estado_asociado: 'en_proceso' },
        { tipo: 'archivo_falta_pruebas', titulo: 'Caso Archivado - Insuficiencia de Pruebas', descripcion: 'La investigación ha finalizado. No se encontraron elementos probatorios suficientes para continuar el proceso, por lo que se procede a archivar el caso.', estado_asociado: 'resuelta' },
        { tipo: 'archivo_prescripcion', titulo: 'Caso Archivado - Prescripción', descripcion: 'El caso ha sido archivado debido a que la acción penal ha prescrito conforme a los plazos establecidos en la ley.', estado_asociado: 'resuelta' },
        { tipo: 'resolucion_responsable', titulo: 'Caso Resuelto - Responsable Identificado', descripcion: 'La investigación ha concluido exitosamente. Se identificó responsabilidad penal y se continuará el proceso conforme a la ley.', estado_asociado: 'resuelta' },
        { tipo: 'acuerdo_reparacion', titulo: 'Acuerdo de Reparación', descripcion: 'Se ha alcanzado un acuerdo de reparación del daño entre las partes, dando por concluido el proceso.', estado_asociado: 'resuelta' },
        { tipo: 'conciliacion', titulo: 'Conciliación Exitosa', descripcion: 'El caso ha sido resuelto mediante conciliación entre las partes involucradas.', estado_asociado: 'resuelta' },
        { tipo: 'presentacion_acusacion', titulo: 'Acusación Presentada', descripcion: 'Se ha presentado acusación formal ante el juzgado competente con base en las pruebas recolectadas.', estado_asociado: 'resuelta' },
        { tipo: 'judicializacion', titulo: 'Caso Judicializado', descripcion: 'El caso ha sido presentado ante las autoridades judiciales para su procesamiento legal correspondiente.', estado_asociado: 'resuelta' },
        { tipo: 'sentencia_emitida', titulo: 'Sentencia Emitida', descripcion: 'El tribunal ha emitido sentencia en el caso. Se le notificará el resultado cuando la resolución quede firme.', estado_asociado: 'resuelta' },
        { tipo: 'solicitud_informacion', titulo: 'Solicitud de Información Adicional', descripcion: 'Se requiere información adicional para continuar con la investigación. Se le contactará para ampliar detalles.', estado_asociado: 'en_proceso' },
        { tipo: 'actualizacion_general', titulo: 'Actualización del Proceso', descripcion: 'Se ha registrado una actualización en el proceso de su denuncia.', estado_asociado: 'en_proceso' }
    ];

    // Jerarquía de estados
    const estadoJerarquia = {
        'pendiente': 0,
        'en_proceso': 1,
        'resuelta': 2,
        'no_corresponde': 2
    };

    // Filtrar plantillas según el estado actual
    const plantillasPredefinidas = todasLasPlantillas.filter(plantilla => {
        const estadoPlantilla = plantilla.estado_asociado;
        const nivelActual = estadoJerarquia[estadoActual?.toLowerCase()] || 0;
        const nivelPlantilla = estadoJerarquia[estadoPlantilla] || 0;
        return nivelPlantilla >= nivelActual;
    });

    // Estados permitidos para formulario personalizado
    const estadosPermitidos = [
        { value: 'pendiente', label: 'Pendiente', nivel: 0 },
        { value: 'en_proceso', label: 'En Proceso', nivel: 1 },
        { value: 'resuelta', label: 'Resuelta', nivel: 2 },
        { value: 'no_corresponde', label: 'No Corresponde', nivel: 2 }
    ].filter(estado => {
        const nivelActual = estadoJerarquia[estadoActual?.toLowerCase()] || 0;
        return estado.nivel >= nivelActual;
    });

    const handlePlantillaSelect = (plantilla) => {
        setPlantillaSeleccionada(plantilla);
    };

    const handleAgregarPlantilla = async () => {
        if (!plantillaSeleccionada) {
            alert('Seleccione una plantilla');
            return;
        }

        setLoading(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('denuncia_id', denunciaId);
            formDataToSend.append('tipo_actualizacion', plantillaSeleccionada.tipo);
            formDataToSend.append('titulo', plantillaSeleccionada.titulo);
            formDataToSend.append('descripcion', plantillaSeleccionada.descripcion);
            formDataToSend.append('nuevo_estado', plantillaSeleccionada.estado_asociado);
            formDataToSend.append('nombre_actualizador', 'Fiscal FGR');
            formDataToSend.append('metadata_json', JSON.stringify({}));

            const response = await fetch(`${API_URL}/timeline/crear`, {
                method: 'POST',
                credentials: 'include',
                body: formDataToSend
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error al crear timeline');
            }

            const result = await response.json();
            console.log('✅ Timeline agregado:', result);

            alert('✓ Timeline agregado exitosamente');
            setPlantillaSeleccionada(null);

            if (onSuccess) onSuccess();

        } catch (error) {
            console.error('❌ Error al agregar timeline:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const agregarMetadataField = () => {
        setMetadataFields([...metadataFields, { key: '', value: '' }]);
    };

    const actualizarMetadataField = (index, field, value) => {
        const newFields = [...metadataFields];
        newFields[index][field] = value;
        setMetadataFields(newFields);
    };

    const eliminarMetadataField = (index) => {
        const newFields = metadataFields.filter((_, i) => i !== index);
        setMetadataFields(newFields);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.titulo || !formData.descripcion || !formData.nuevo_estado) {
            alert('Complete todos los campos obligatorios');
            return;
        }

        setLoading(true);

        try {
            const metadataObj = {};
            metadataFields.forEach(field => {
                if (field.key && field.value) {
                    metadataObj[field.key] = field.value;
                }
            });

            const formDataToSend = new FormData();
            formDataToSend.append('denuncia_id', denunciaId);
            formDataToSend.append('titulo', formData.titulo);
            formDataToSend.append('descripcion', formData.descripcion);
            formDataToSend.append('nuevo_estado', formData.nuevo_estado);
            formDataToSend.append('nombre_actualizador', formData.nombre_actualizador);
            formDataToSend.append('metadata_json', JSON.stringify(metadataObj));

            const response = await fetch(`${API_URL}/timeline/crear`, {
                method: 'POST',
                credentials: 'include',
                body: formDataToSend
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error al crear timeline');
            }

            const result = await response.json();
            console.log('✅ Timeline personalizado agregado:', result);

            alert('✓ Timeline personalizado agregado exitosamente');

            setFormData({
                titulo: '',
                descripcion: '',
                nuevo_estado: '',
                nombre_actualizador: 'Fiscal FGR',
                metadata: {}
            });
            setMetadataFields([]);

            if (onSuccess) onSuccess();

        } catch (error) {
            console.error('❌ Error al agregar timeline:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white w-full">
            <div className="space-y-4">
                {/* Botones de acción principales */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setModoCreacion('plantillas')}
                        className={`flex-1 py-2 px-3 text-sm font-medium transition rounded-lg ${modoCreacion === 'plantillas'
                            ? 'bg-[#0c3b87] text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Usar Plantilla
                    </button>
                    <button
                        onClick={() => setModoCreacion('formulario')}
                        className={`flex-1 py-2 px-3 text-sm font-medium transition rounded-lg ${modoCreacion === 'formulario'
                            ? 'bg-[#0c3b87] text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Timeline Personalizado
                    </button>
                </div>

                {/* MODO: SELECCIONAR PLANTILLA */}
                {modoCreacion === 'plantillas' && (
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
                            Seleccionar Plantilla
                        </label>
                        {plantillasPredefinidas.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                                <p className="text-sm font-medium">No hay plantillas disponibles para este estado.</p>
                                <p className="text-xs mt-2">Use la opción de Timeline Personalizado.</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto mb-4">
                                    {plantillasPredefinidas.map((plantilla) => (
                                        <button
                                            key={plantilla.tipo}
                                            onClick={() => handlePlantillaSelect(plantilla)}
                                            className={`text-left p-3 rounded-lg border transition ${plantillaSeleccionada?.tipo === plantilla.tipo
                                                ? 'border-[#0c3b87] bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-400'
                                                }`}
                                        >
                                            <h4 className="font-medium text-gray-900 text-sm mb-1">
                                                {plantilla.titulo}
                                            </h4>
                                            <p className="text-xs text-gray-500 line-clamp-2">
                                                {plantilla.descripcion}
                                            </p>
                                            <span className="inline-block mt-2 text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded">
                                                {plantilla.estado_asociado}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={handleAgregarPlantilla}
                                    disabled={!plantillaSeleccionada || loading}
                                    className={`w-full py-2 text-sm rounded-lg font-semibold transition ${!plantillaSeleccionada || loading
                                        ? 'bg-gray-400 cursor-not-allowed text-gray-100'
                                        : 'bg-[#0c3b87] text-white hover:bg-[#092a5f]'
                                        }`}
                                >
                                    {loading ? 'Guardando...' : 'Agregar Timeline'}
                                </button>
                            </>
                        )}
                    </div>
                )}

                {/* MODO: FORMULARIO PERSONALIZADO */}
                {modoCreacion === 'formulario' && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                                Título *
                            </label>
                            <input
                                type="text"
                                name="titulo"
                                value={formData.titulo}
                                onChange={handleInputChange}
                                placeholder="Título de la actualización"
                                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0c3b87] focus:border-[#0c3b87]"
                                maxLength="200"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                                Descripción *
                            </label>
                            <textarea
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleInputChange}
                                placeholder="Descripción detallada de la actualización"
                                rows="4"
                                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0c3b87] focus:border-[#0c3b87] resize-none"
                                required
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                                Nuevo Estado de la Denuncia *
                            </label>
                            <select
                                name="nuevo_estado"
                                value={formData.nuevo_estado}
                                onChange={handleInputChange}
                                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0c3b87] focus:border-[#0c3b87]"
                                required
                            >
                                <option value="">Seleccionar...</option>
                                {estadosPermitidos.map(estado => (
                                    <option key={estado.value} value={estado.value}>
                                        {estado.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                                Fiscal Responsable *
                            </label>
                            <input
                                type="text"
                                name="nombre_actualizador"
                                value={formData.nombre_actualizador}
                                onChange={handleInputChange}
                                placeholder="Nombre del fiscal"
                                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0c3b87] focus:border-[#0c3b87]"
                                required
                            />
                        </div>

                        {/* Metadata */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    Datos Adicionales
                                </label>
                                <button
                                    type="button"
                                    onClick={agregarMetadataField}
                                    className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 transition"
                                >
                                    + Agregar
                                </button>
                            </div>

                            {metadataFields.length > 0 && (
                                <div className="space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    {metadataFields.map((field, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Clave"
                                                value={field.key}
                                                onChange={(e) => actualizarMetadataField(index, 'key', e.target.value)}
                                                className="flex-1 p-2 text-xs border border-gray-300 rounded"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Valor"
                                                value={field.value}
                                                onChange={(e) => actualizarMetadataField(index, 'value', e.target.value)}
                                                className="flex-1 p-2 text-xs border border-gray-300 rounded"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => eliminarMetadataField(index)}
                                                className="p-2 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 text-xs"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Botón submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2 text-sm rounded-lg font-semibold transition ${loading
                                ? 'bg-gray-400 cursor-not-allowed text-gray-100'
                                : 'bg-[#0c3b87] text-white hover:bg-[#092a5f]'
                                }`}
                        >
                            {loading ? 'Guardando...' : 'Crear Timeline Personalizado'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};