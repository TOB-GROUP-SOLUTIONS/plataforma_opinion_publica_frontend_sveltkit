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
	const status_lead = url.searchParams.get('status_lead') || '';
	const userId = locals.user.id;

	const params = new URLSearchParams({
		page,
		search,
		order,
		direction,
		status_lead,
		userId: String(userId)
	});

	const [leadsresponse, usersResponse] = await Promise.all([
		api.get({
			fetch,
			endpoint: `leads/paginated`,
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

    changeStatus: async ({ cookies, request }) => {
        const token = cookies.get('token');
        const data = await request.formData();

        const leadId = data.get('lead_id');
        const userId = data.get('user_id');


        const UpdateLeadDto = {
            assigned_to: userId,
			interest_level: data.get('status_id')
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

	change_status: async ({ cookies, request }) => {
		const token = cookies.get('token');
		const data = await request.formData();
		const leadId = data.get('lead_id');
		const statusLeadId = data.get('status_id');

		const UpdateLeadDto = {
			status_lead: statusLeadId
		};

		const response = await api.patch({
			fetch,
			endpoint: `leads/${leadId}`,
			body: JSON.stringify(UpdateLeadDto),
			token
		});
		if (!response.ok) throw error(500, 'Error al cambiar el estado del lead');

		return { success: true };
	},

	addBudget: async ({ cookies, request }) => {
		const token = cookies.get('token');
		const data = await request.formData();
		const leadId = data.get('lead_id');
		const budgetFile = data.get('file') as File;
		const expirationDate = data.get('expiration_date');

		if (!budgetFile) {
			throw error(400, 'El archivo es requerido');
		}

		try {
			// Paso 1: Subir el archivo PRIMERO
			const fileFormData = new FormData();
			fileFormData.append('file', budgetFile);
			fileFormData.append('url', budgetFile.name);

			const fileResponse = await api.post({
				fetch,
				endpoint: 'files/upload',
				body: fileFormData,
				token
			});

			if (!fileResponse.ok) {
				throw error(500, 'Error al subir el archivo');
			}

			const fileId = fileResponse.data.id;

			// Paso 2: Crear el presupuesto CON el file_id
			const budgetData = {
				lead_id: leadId,
				budget_number: `BUDGET-${Date.now()}`,
				travelers_count: 1,
				unit_price: 0,
				subtotal: 0,
				final_amount: 0,
				valid_until: expirationDate,
				status_id: 1,
				file_id: fileId
			};

			const budgetResponse = await api.post({
				fetch,
				endpoint: 'budgets',
				body: JSON.stringify(budgetData),
				token
			});

			if (!budgetResponse.ok) {
				throw error(500, 'Error al crear el presupuesto');
			}

			return { success: true };
		} catch (err) {
			console.error('Error en addBudget:', err);
			throw error(500, 'Error procesando el presupuesto');
		}
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
