
import { Search } from "../../icons/AllIcons.jsx";
import { denuncias } from "../../lib/data.ts";
import DenunciaCard from "../molecules/DenunciaCard.jsx";
import { useState } from "react";

export const FiltrarDenuncia = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEstado, setSelectedEstado] = useState('');
    const [selectedPrioridad, setSelectedPrioridad] = useState('');



    const filteredDenuncias = denuncias?.filter((denuncia) => {
        const matchesSearch =
            denuncia.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            denuncia.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
            denuncia.fecha.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase());

        const matchesEstado = selectedEstado === '' || denuncia.estado.toLowerCase() === selectedEstado.toLowerCase();
        const matchesPrioridad = selectedPrioridad === '' || denuncia.prioridad.toLowerCase() === selectedPrioridad.toLowerCase();

        return matchesSearch && matchesEstado && matchesPrioridad;
    });


    return (
        <>
            <section>
                <article className="px-4 mx-auto lg:px-12 w-full bg-white p-4 rounded-lg shadow-lg">
                    <div className="relative flex flex-row items-center justify-center gap-3 rounded-lg">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500" />
                            <input
                                type="search"
                                placeholder="Buscar por título, descripción o fecha"
                                className="w-full p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg bg-gray-50 border border-gray-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="w-40 ">
                            <select
                                id="estado"
                                className="h-11 border border-gray-300 text-gray-600 text-base rounded-lg block w-full px-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={selectedEstado}
                                onChange={(e) => setSelectedEstado(e.target.value)}
                            >
                                <option value="">Todos los estados</option>
                                <option value="pendiente">Pendiente</option>
                                <option value="en proceso">En proceso</option>
                                <option value="completada">Completada</option>
                            </select>
                        </div>

                        <div className="w-40 ">
                            <select
                                id="prioridad"
                                className="h-11 border border-gray-300 text-gray-600 text-base rounded-lg block w-full px-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={selectedPrioridad}
                                onChange={(e) => setSelectedPrioridad(e.target.value)}
                            >
                                <option value="">Todas las prioridades</option>
                                <option value="media">Media</option>
                                <option value="alta">Alta</option>
                            </select>
                        </div>
                    </div>
                </article>
            </section>

            <section className="py-6">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDenuncias?.length > 0 ? (
                        filteredDenuncias.map((denuncia) => (
                            <DenunciaCard key={denuncia.id} denuncia={denuncia} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <div className="text-gray-500 text-lg mb-2">No se encontraron denuncias</div>
                            <div className="text-gray-400">Intenta cambiar los filtros de búsqueda</div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};