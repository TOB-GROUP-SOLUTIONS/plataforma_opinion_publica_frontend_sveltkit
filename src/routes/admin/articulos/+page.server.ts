import { error, redirect } from '@sveltejs/kit';
import * as api from '$lib/api';

export const load = async ({ cookies, locals, url, fetch }: any) => {
	const token = cookies.get('token');

	if (!locals.user) redirect(303, '/');

	const page = url.searchParams.get('page') || '1';
	const limit = url.searchParams.get('limit') || '10';
	
    // Extrayendo los filtros que llegan desde la URL (seteados por la TopBar globalmente o la navegacion)
	const dias = url.searchParams.get('dias') || '7'; // Por defecto 7 dias como en el topbar
	const redSocial = url.searchParams.get('redSocial') || '';
	const entidadId = url.searchParams.get('entidadId') || '';

	const params = new URLSearchParams({
		page,
		limit,
	});

    if (dias) params.append('dias', dias);
    if (redSocial) params.append('redSocial', redSocial);
    if (entidadId) params.append('entidadId', entidadId);

	const response = await api.get({
		fetch,
		endpoint: 'articulos',
		params,
		token
	});

	if (!response.ok) throw error(500, 'Error al cargar los artículos');

	return {
		articulos: response.data.data,
		meta: response.data.meta,
	};
};
