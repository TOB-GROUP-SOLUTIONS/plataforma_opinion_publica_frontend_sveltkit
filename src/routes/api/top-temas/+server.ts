import type { RequestHandler } from '@sveltejs/kit';
import { error, json } from '@sveltejs/kit';
import * as api from '$lib/api';

export const GET: RequestHandler = async ({ cookies, url, fetch }) => {
    const token = cookies.get('token');
    const dias = url.searchParams.get('dias') || '7';
    const municipioId = url.searchParams.get('municipioId') || '';
    const entidadId = url.searchParams.get('entidadId') || '';
    const redSocial = url.searchParams.get('redSocial') || '';

    const params = new URLSearchParams();
    if (dias) params.set('dias', dias);
    if (municipioId) params.set('municipioId', municipioId);
    if (entidadId) params.set('entidadId', entidadId);
    if (redSocial) params.set('redSocial', redSocial);

    const response = await api.get({
        fetch,
        endpoint: `articulos/top-temas?${params.toString()}`,
        token
    });

    if (!response.ok) {
        throw error(response.status, 'Error al generar top temas');
    }

    return json(response.data);
};