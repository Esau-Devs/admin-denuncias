



export interface Denuncias {
    id: string;
    titulo: string;
    descripcion: string;
    estado: string;
    prioridad: string;
    fecha: string;
}



export const denuncias: Denuncias[] = [
    {
        id: "1",
        titulo: "Acoso laboral",
        descripcion: "Se reportó acoso de parte de un superior.",
        estado: "En Proceso",
        prioridad: "Alta",
        fecha: "2025-07-01",
    },
    {
        id: "2",
        titulo: "Corrupción institucional",
        descripcion: "Uso indebido de fondos públicos.",
        estado: "En proceso",
        prioridad: "Media",
        fecha: "2025-07-02",
    },
    {
        id: "3",
        titulo: "Discriminación laboral",
        descripcion: "Empleado reporta trato desigual por motivos de género.",
        estado: "Pendiente",
        prioridad: "Alta",
        fecha: "2025-06-25",
    },
    {
        id: "4",
        titulo: "Fraude financiero",
        descripcion: "Manipulación de cifras en reportes contables.",
        estado: "Completada",
        prioridad: "Alta",
        fecha: "2025-06-30",
    },
    {
        id: "5",
        titulo: "Violación de privacidad",
        descripcion: "Acceso no autorizado a información confidencial.",
        estado: "En proceso",
        prioridad: "Alta",
        fecha: "2025-07-01",
    },
    {
        id: "6",
        titulo: "Conflicto de intereses",
        descripcion: "Empleado involucrado en contratación de familiares.",
        estado: "Completada",
        prioridad: "Media",
        fecha: "2025-06-28",
    },
    {
        id: "7",
        titulo: "Nepotismo",
        descripcion: "Promociones injustificadas a familiares de directivos.",
        estado: "Pendiente",
        prioridad: "Baja",
        fecha: "2025-06-15",
    },
    {
        id: "8",
        titulo: "Retraso en pagos",
        descripcion: "Retrasos recurrentes en el pago a proveedores.",
        estado: "En proceso",
        prioridad: "Media",
        fecha: "2025-06-29",
    },
    {
        id: "9",
        titulo: "Desvío de recursos",
        descripcion: "Fondos asignados no se usaron para el proyecto previsto.",
        estado: "Completada",
        prioridad: "Alta",
        fecha: "2025-07-03",
    },
    {
        id: "10",
        titulo: "Acoso sexual",
        descripcion: "Empleado reporta conducta inapropiada de un compañero.",
        estado: "En proceso",
        prioridad: "Alta",
        fecha: "2025-06-20",
    },
    {
        id: "11",
        titulo: "Falsificación de documentos",
        descripcion: "Se descubrieron documentos oficiales alterados.",
        estado: "En proceso",
        prioridad: "Media",
        fecha: "2025-06-18",
    },
    {
        id: "12",
        titulo: "Uso personal de recursos institucionales",
        descripcion: "Empleados usando vehículos oficiales para fines personales.",
        estado: "Pendiente",
        prioridad: "Baja",
        fecha: "2025-07-03",
    },
    {
        id: "13",
        titulo: "Violación de normas de seguridad",
        descripcion: "Trabajadores sin equipo de protección.",
        estado: "Pendiente",
        prioridad: "Alta",
        fecha: "2025-06-27",
    },
    {
        id: "14",
        titulo: "Abuso de autoridad",
        descripcion: "Superior impone castigos injustificados.",
        estado: "En proceso",
        prioridad: "Media",
        fecha: "2025-07-02",
    },
    {
        id: "15",
        titulo: "Manejo indebido de residuos",
        descripcion: "Desechos peligrosos fueron mal dispuestos.",
        estado: "Completada",
        prioridad: "Alta",
        fecha: "2025-06-26",
    },
    {
        id: "16",
        titulo: "Manejo indebido de residuos",
        descripcion: "Desechos peligrosos fueron mal dispuestos.",
        estado: "Completada",
        prioridad: "Alta",
        fecha: "2025-06-26",
    },
];


export const Enproceso = denuncias.filter((d) => d.estado === "En proceso").length;
export const Completada = denuncias.filter((d) => d.estado === "Completada").length;
export const Pendiente = denuncias.filter((d) => d.estado === "Pendiente").length;
export const TotalDenuncias = denuncias.length;

export const AllDenuncias = [
    ...denuncias,

]