// data.ts (CÓDIGO COMPLETO)

// Define la estructura de una Denuncia
export interface Denuncias {
    id: string;
    user_id: string; 
    categoria: string; 
    ubicacion: string; 
    descripcion: string;
    evidencias: any; // Arreglo de URLs o JSON
    fecha_creacion: string; 
    estado: string; 
}

/**
 * Función para obtener las denuncias desde la API de FastAPI.
 */
export const fetchDenuncias = async (): Promise<Denuncias[]> => {
    try {
        // AJUSTA ESTA URL si es necesario
        const API_URL = "http://127.0.0.1:8001/api/denuncias";
        
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`Error al obtener denuncias: ${response.status} ${response.statusText}`);
        }

        const data: Denuncias[] = await response.json();
        return data;

    } catch (error) {
        console.error("ERROR AL OBTENER DATOS DE FASTAPI:", error);
        throw error;
    }
};

export const updateDenunciaEstado = async (denunciaId: string, nuevoEstado: string) => {
    const API_URL = `http://127.0.0.1:8001/api/denuncias/${denunciaId}`; //
    
    const response = await fetch(API_URL, {
        method: 'PUT', // Usamos PUT para actualizar
        headers: {
            'Content-Type': 'application/json',
            // Añade token de autenticación si es necesario (ej: Authorization: `Bearer ${token}`)
        },
        // Enviamos el nuevo estado en el cuerpo de la petición
        body: JSON.stringify({ estado: nuevoEstado }), 
    });

    if (!response.ok) {
        throw new Error(`Error ${response.status} al actualizar el estado de la denuncia ${denunciaId}.`);
    }

    // Devuelve la respuesta, usualmente el objeto actualizado
    return response.json(); 
};