import { error, redirect } from '@sveltejs/kit';
import * as api from '$lib/api';
import type { Actions } from './$types';

export const load = async ({ cookies, locals, url, fetch }: any) => {
	const token = cookies.get('token');

	if (!locals.user) redirect(303, '/');

	const page = url.searchParams.get('page') || '1';
	const search = url.searchParams.get('query') || '';
	const order = url.searchParams.get('order') || 'id';
	const direction = url.searchParams.get('direction') || 'desc';

	const params = new URLSearchParams({
		page,
		search,
		order,
		direction
	});

	const response = await api.get({
		fetch,
		endpoint: 'referrers/paginated',
		params,
		token
	});

	

	if (!response.ok) throw error(500, 'Error al cargar los leads');

    console.log('Response Data:', response.data);

	return {
		referrers: response.data.data,
		meta: response.data.meta,
		searchParams: { page, search, order, direction }
	};
};

export const actions: Actions = {
	delete: async ({ cookies, request }) => {
		const token = cookies.get('token');
		const data = await request.formData();
		const id = data.get('id');

		const response = await api.patch({
			fetch,
			endpoint: `referrers/${id}/delete`,
			token
		});

		if (!response.ok) throw error(500, 'Error al eliminar');

		return { success: true };
	},

	restore: async ({ cookies, request }) => {
		const token = cookies.get('token');
		const data = await request.formData();
		const id = data.get('id');

		const response = await api.patch({
			fetch,
			endpoint: `referrers/${id}/restore`,
			token
		});

		if (!response.ok) throw error(500, 'Error al restaurar');

		return { success: true };
	},

	createReference : async ({ cookies, request }) => {
		const token = cookies.get('token');
		const data = await request.formData();
		const name = data.get('name');
		const contact_email = data.get('contact_email');
		const type = data.get('type');
		const phone = data.get('phone');
		const notes = data.get('notes');

		const CreateReferenceDto = {
			name,
			contact_email,
			type,
			phone,
			notes
		};
		const response = await api.post({
			fetch,
			endpoint: 'referrers',
			token,
			body: JSON.stringify(CreateReferenceDto)
		});
		if (!response.ok) throw error(500, 'Error al crear la referencia');

		return { success: true };
	}
};
