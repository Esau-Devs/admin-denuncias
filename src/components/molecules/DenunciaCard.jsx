// DenunciaCard.jsx (CÓDIGO COMPLETO MODIFICADO)
import React from 'react';

// AÑADIMOS 'onClick' como prop
const DenunciaCard = ({ denuncia, onClick }) => {
    // Desestructuramos los campos 
    const { id, categoria, descripcion, estado, fecha_creacion } = denuncia;

    const getEstadoColor = (estado) => {
        switch (estado?.toLowerCase()) {
            case 'pendiente': return 'bg-yellow-100 text-yellow-700';
            case 'en_proceso': return 'bg-blue-100 text-blue-700';
            case 'resuelta': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <article
            className="w-full hover:bg-white rounded-2xl border border-zinc-300 shadow-lg hover:shadow-2xl transition-all duration-300 transform cursor-pointer"
            // NUEVO: Al hacer clic, activamos el modal en el padre
            onClick={() => onClick(denuncia)}
        >
            {/* ELIMINAMOS EL <a> TAG y usamos un <div> */}
            <div className="block h-full p-7">
                <header className="flex mb-4 gap-3">
                    <span className={`${getEstadoColor(estado)} text-xs font-bold px-3 py-1 rounded-full uppercase`}
                    >
                        {estado}
                    </span>
                </header>

                <h2 className="text-lg font-bold text-[#0c3b87] mb-3 ">
                    {categoria}
                </h2>

                <p className="text-sm text-gray-700 line-clamp-3 mb-4">
                    {descripcion}
                </p>

                <footer className="mt-auto text-xs text-gray-500">
                    {fecha_creacion}
                </footer>
            </div>
        </article>
    );
};

export default DenunciaCard;