import { error, redirect, fail } from '@sveltejs/kit';
import * as api from '$lib/api';
import type { Actions } from './$types';

export const load = async ({ cookies, locals, url, fetch }: any) => {
	const token = cookies.get('token');

	if (!locals.user) redirect(303, '/');

	const page = url.searchParams.get('page') || '1';
	const limit = url.searchParams.get('limit') || '10';
	const query = url.searchParams.get('query') || '';

	const params = new URLSearchParams({ page, limit });
    if (query) params.append('query', query);

	const response = await api.get({
		fetch,
		endpoint: 'municipios-objetivo/paginated',
		params,
		token
	});

	if (!response.ok) throw error(500, 'Error al cargar los municipios');

	const payload = response.data;
	const municipiosRaw = Array.isArray(payload)
		? payload
		: Array.isArray(payload?.data)
			? payload.data
			: [];

	const municipios = municipiosRaw.map((item: any) => ({
		...item,
		entidad: item?.entidad ?? item?.municipio ?? ''
	}));

	const meta = payload?.meta ?? {
		currentPage: Number(page),
		perPage: Number(limit),
		total: municipios.length
	};

	return {
		municipios,
		meta,
	};
};

export const actions: Actions = {
	create: async ({ cookies, request, fetch }) => {
		const token = cookies.get('token');
		const data = await request.formData();
		
		const entityData = {
			municipio: data.get('entidad'),
			tipo: data.get('tipo'),
			contexto: data.get('contexto'),
		};

		const response = await api.post({
			fetch,
			endpoint: 'municipios-objetivo',
			body: JSON.stringify(entityData),
			token
		});

		if (!response.ok) return fail(400, { error: 'Error al crear el municipio' });
		return { success: true };
	},

	update: async ({ cookies, request, fetch }) => {
		const token = cookies.get('token');
		const data = await request.formData();
		const id = data.get('id');
		
		const entityData = {
			municipio: data.get('entidad'),
			tipo: data.get('tipo'),
			contexto: data.get('contexto'),
		};

		const response = await api.patch({
			fetch,
			endpoint: `municipios-objetivo/${id}`,
			body: JSON.stringify(entityData),
			token
		});

		if (!response.ok) return fail(400, { error: 'Error al actualizar el municipio' });
		return { success: true };
	},

	delete: async ({ cookies, request, fetch }) => {
		const token = cookies.get('token');
		const data = await request.formData();
		const id = data.get('id');

		const response = await api.destroy({
			fetch,
			endpoint: `municipios-objetivo/${id}`,
			token
		});

		if (!response.ok) return fail(400, { error: 'Error al eliminar el municipio' });
		return { success: true };
	}
};
