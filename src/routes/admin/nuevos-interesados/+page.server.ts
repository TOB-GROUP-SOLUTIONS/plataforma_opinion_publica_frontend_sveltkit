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

	const [leadsresponse, usersResponse] = await Promise.all([
		api.get({
			fetch,
			endpoint: 'leads/paginated',
			params,
			token
		}),
		api.get({
			fetch,
			endpoint: 'users',
			token
		})
	]);

	if (!leadsresponse.ok) throw error(500, 'Error al cargar los leads');

	console.log('Response Data:', leadsresponse.data);

	return {
		leads: leadsresponse.data.data,
		meta: leadsresponse.data.meta,
		users: usersResponse.data,
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
			endpoint: `leads/${id}/delete`,
			token
		});

		if (!response.ok) throw error(500, 'Error al eliminar');

		return { success: true };
	},

	createLead: async ({ cookies, request, fetch }) => {
		const token = cookies.get('token');
		const data = await request.formData();

		const CreateLeadDto = {
			full_name: data.get('full_name'),
			email: data.get('email'),
			phone: data.get('phone'),
			city: data.get('city'),
			age: data.get('age') ? parseInt(data.get('age') as string) : null,
			programa: data.get('program'),
			source: data.get('source'),
			objective: data.get('objective')
		};

		try {
			const response = await api.post({
				fetch,
				endpoint: 'leads',
				body: JSON.stringify(CreateLeadDto),
				token
			});

			console.log('Create Lead Response:', response);

			if (!response.ok) throw error(500, 'Error al crear el formulario');


			return { success: true };
		} catch (err: any) {
			return {
				error: err.message || 'Error al guardar el formulario'
			};
		}
	},

	asingToUser: async ({ cookies, request }) => {
		const token = cookies.get('token');
		const data = await request.formData();

		const leadId = data.get('lead_id');
		const userId = data.get('user_id');

		console.log('Asignando lead', leadId, 'to user', userId);

		const UpdateLeadDto = {
			assigned_to: userId
		};

		const response = await api.patch({
			fetch,
			endpoint: `leads/${leadId}`,
			body: JSON.stringify(UpdateLeadDto),
			token
		});

		if (!response.ok) throw error(500, 'Error al asignar el lead');

		return { success: true };
	},

	restore: async ({ cookies, request }) => {
		const token = cookies.get('token');
		const data = await request.formData();
		const id = data.get('id');

		const response = await api.patch({
			fetch,
			endpoint: `leads/${id}/restore`,
			token
		});

		if (!response.ok) throw error(500, 'Error al restaurar');

		return { success: true };
	}
};
