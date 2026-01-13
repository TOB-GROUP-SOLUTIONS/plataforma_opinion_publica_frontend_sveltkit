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
