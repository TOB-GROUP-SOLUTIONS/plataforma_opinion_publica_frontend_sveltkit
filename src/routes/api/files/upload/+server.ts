import type { RequestHandler } from '@sveltejs/kit';
import * as api from '$lib/api';

export const POST: RequestHandler = async ({ request, fetch }) => {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file || !(file instanceof File)) {
            return new Response(JSON.stringify({ error: 'No se proporcionó un archivo válido' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Preparar el FormData para enviar al backend
        const backendFormData = new FormData();
        backendFormData.append('file', file);
        backendFormData.append('url', file.name); // El backend parece esperar 'url' como Body

        // Enviar al backend usando el helper api.post
        // Nota: El endpoint en el backend es 'files/upload'
        const response = await api.post({
            fetch,
            endpoint: 'files/upload',
            body: backendFormData
        });

        if (!response.ok) {
            console.error('Error del backend al subir archivo:', response.data);
            return new Response(JSON.stringify({ error: 'Error en el servidor de archivos' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Devolver la respuesta del backend (que contiene el ID del archivo)
        return new Response(JSON.stringify(response.data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        console.error('Error procesando subida de archivo:', err);
        return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
