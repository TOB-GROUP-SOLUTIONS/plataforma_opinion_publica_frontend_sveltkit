import { error, redirect } from '@sveltejs/kit';
import * as api from '$lib/api';

export const load = async ({ cookies, locals, url, fetch }: any) => {
	const token = cookies.get('token');

	if (!locals.user) redirect(303, '/');

	const page = url.searchParams.get('page') || '1';
	const limit = url.searchParams.get('limit') || '10';
	
    // Extrayendo los filtros
	const dias = url.searchParams.get('dias') || '7';
	const redSocial = url.searchParams.get('redSocial') || '';
	const entidadId = url.searchParams.get('entidadId') || '';
    const articulo_id = url.searchParams.get('articulo_id') || '';

	const params = new URLSearchParams({ page, limit });

    if (dias) params.append('dias', dias);
    if (redSocial) params.append('redSocial', redSocial);
    if (entidadId) params.append('entidadId', entidadId);
    if (articulo_id) params.append('articulo_id', articulo_id);

	const response = await api.get({
		fetch,
		endpoint: 'comentarios',
		params,
		token
	});

	if (!response.ok) throw error(500, 'Error al cargar los comentarios');

	return {
		comentarios: response.data.data,
		meta: response.data.meta,
	};
};
