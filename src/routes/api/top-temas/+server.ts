import type { RequestHandler } from '@sveltejs/kit';
import { error, json } from '@sveltejs/kit';
import * as api from '$lib/api';

export const GET: RequestHandler = async ({ cookies, url, fetch }) => {
    const token = cookies.get('token');
    const dias = url.searchParams.get('dias') || '7';

    const response = await api.get({
        fetch,
        endpoint: `articulos/top-temas?dias=${dias}`,
        token
    });

    if (!response.ok) {
        throw error(response.status, 'Error al generar top temas');
    }

    return json(response.data);
};