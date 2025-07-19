// DenunciaCard.jsx
const DenunciaCard = ({ denuncia }) => {
    const { id, titulo, descripcion, estado, prioridad, fecha } = denuncia;

    const getEstadoColor = (estado) => {
        switch (estado?.toLowerCase()) {
            case 'pendiente': return 'bg-yellow-100 text-yellow-700';
            case 'en proceso': return 'bg-blue-100 text-blue-700';
            case 'completada': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getPrioridadColor = (prioridad) => {
        switch (prioridad?.toLowerCase()) {
            case 'alta': return 'bg-red-100 text-red-600';
            case 'media': return 'bg-orange-100 text-orange-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <article className="w-full  hover:bg-white rounded-2xl border border-zinc-300 shadow-lg hover:shadow-2xl transition-all duration-300 transform ">
            <a href={`denuncia/${id}`} className="block h-full p-7">
                <header className="flex mb-4 gap-3">
                    <span className={`${getEstadoColor(estado)} text-xs font-bold px-3 py-1 rounded-full uppercase`}

                    >
                        {estado}
                    </span>
                    <span className={`${getPrioridadColor(prioridad)} text-xs font-bold px-3 py-1 rounded-full uppercase`}>
                        {prioridad}
                    </span>
                </header>

                <h2 className="text-lg font-bold text-[#0c3b87] mb-3 ">
                    {titulo}
                </h2>

                <p className="text-sm text-gray-700 line-clamp-3 mb-4">
                    {descripcion}
                </p>

                <footer className="mt-auto text-xs text-gray-500">
                    Fecha de denuncia: <span className="font-semibold">{fecha}</span>
                </footer>
            </a>
        </article>
    );
};

export default DenunciaCard;