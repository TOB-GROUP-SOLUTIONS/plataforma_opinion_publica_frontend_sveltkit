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
	const status = url.searchParams.get('status') || '';
	const userId = locals.user.id;

	const params = new URLSearchParams({
		page,
		search,
		order,
		direction,
		status,
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
		const due_date = data.get('due_date');

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
				valid_until: due_date,
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

	confirmPayment: async ({ cookies, request }) => {
		const token = cookies.get('token');
		const data = await request.formData();
		const budgetId = data.get('budget_id');
		const FilePaymentConfirmed = data.get('file') as File;
		const notes = data.get('notes');



		if (!FilePaymentConfirmed) {
			throw error(400, 'El archivo es requerido');
		}


		console.log(FilePaymentConfirmed)

		try {

			const fileFormData = new FormData();
			fileFormData.append('file', FilePaymentConfirmed);
			fileFormData.append('url', FilePaymentConfirmed.name)

			const fileResponse = await api.post({
				fetch,
				endpoint: 'files/upload',
				body: fileFormData,
				token
			});

			if (!fileResponse.ok) {
				throw error(500, 'Error al subir el archivo');
			}

			console.log('File upload response:', fileResponse);

			const fileId = fileResponse.data.id;

			console.log('File uploaded with ID:', fileId);

			// Paso 2: Crear el payment CON el file_id
			const paymentDto = {
				receipt_id: fileId,
				notes: notes,
				budget_id: budgetId
			};

			const paymentResponse = await api.post({
				fetch,
				endpoint: 'payments',
				body: JSON.stringify(paymentDto),
				token
			});

			if (!paymentResponse.ok) {
				throw error(500, 'Error al crear el pago');
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
