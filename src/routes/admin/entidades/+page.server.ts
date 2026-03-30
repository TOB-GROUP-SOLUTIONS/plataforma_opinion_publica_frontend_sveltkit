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
		endpoint: 'entidades',
		params,
		token
	});

	if (!response.ok) throw error(500, 'Error al cargar las entidades');

	return {
		entidades: response.data.data,
		meta: response.data.meta,
	};
};

export const actions: Actions = {
	create: async ({ cookies, request, fetch }) => {
		const token = cookies.get('token');
		const data = await request.formData();
		
		const entityData = {
			entidad: data.get('entidad'),
			tipo: data.get('tipo'),
			contexto: data.get('contexto'),
		};

		const response = await api.post({
			fetch,
			endpoint: 'entidades',
			body: JSON.stringify(entityData),
			token
		});

		if (!response.ok) return fail(400, { error: 'Error al crear la entidad' });
		return { success: true };
	},

	update: async ({ cookies, request, fetch }) => {
		const token = cookies.get('token');
		const data = await request.formData();
		const id = data.get('id');
		
		const entityData = {
			entidad: data.get('entidad'),
			tipo: data.get('tipo'),
			contexto: data.get('contexto'),
		};

		const response = await api.patch({
			fetch,
			endpoint: `entidades/${id}`,
			body: JSON.stringify(entityData),
			token
		});

		if (!response.ok) return fail(400, { error: 'Error al actualizar la entidad' });
		return { success: true };
	},

	delete: async ({ cookies, request, fetch }) => {
		const token = cookies.get('token');
		const data = await request.formData();
		const id = data.get('id');

		const response = await api.destroy({
			fetch,
			endpoint: `entidades/${id}`,
			token
		});

		if (!response.ok) return fail(400, { error: 'Error al eliminar la entidad' });
		return { success: true };
	}
};
