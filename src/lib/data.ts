
// data.ts - Funciones para interactuar con la API de denuncias

// Define la estructura de una Denuncia
export interface Denuncias {
    id: string | number;
    user_id: string;
    categoria: string;
    ubicacion: string;
    descripcion: string;
    evidencias: any; // Arreglo de URLs o JSON
    fecha_creacion: string;
    estado: string;
    // Campos adicionales del endpoint /todas (verificación de integridad)
    firma_valida?: boolean;
    verificada?: boolean;
    alerta_seguridad?: boolean;
    mensaje_alerta?: string;
}

/**
 * 📋 Obtener TODAS las denuncias (endpoint admin con desencriptación)
 * Este endpoint desencripta automáticamente y verifica integridad
 */
export const fetchDenuncias = async (): Promise<Denuncias[]> => {
    try {
        const API_URL = "https://backend-api-638220759621.us-west1.run.app/api/denuncias/todas";

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Error al obtener denuncias: ${response.status} ${response.statusText}`);
        }

        const data: Denuncias[] = await response.json();

        // Log de denuncias comprometidas si hay
        const comprometidas = data.filter(d => d.alerta_seguridad);
        if (comprometidas.length > 0) {
            console.warn(`🚨 ALERTA: ${comprometidas.length} denuncia(s) comprometida(s)`);
        }

        return data;

    } catch (error) {
        console.error("ERROR AL OBTENER DATOS DE FASTAPI:", error);
        throw error;
    }
};

/**
 * 🔄 Actualizar el estado de una denuncia
 * NOTA: El backend espera FormData, no JSON
 */
export const updateDenunciaEstado = async (denunciaId: string | number, nuevoEstado: string) => {
    const API_URL = `https://backend-api-638220759621.us-west1.run.app/api/denuncias/actualizar-estado/${denunciaId}`;

    // El endpoint espera FormData, no JSON
    const formData = new FormData();
    formData.append('nuevo_estado', nuevoEstado);

    const response = await fetch(API_URL, {
        method: 'PUT',
        body: formData, // Enviar como FormData
        // NO incluir Content-Type header, el navegador lo establece automáticamente con boundary
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.detail ||
            `Error ${response.status} al actualizar el estado de la denuncia ${denunciaId}.`
        );
    }

    return response.json();
};