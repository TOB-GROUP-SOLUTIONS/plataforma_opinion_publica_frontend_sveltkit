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
	const fromDate = url.searchParams.get('fromDate') || '';
	const toDate = url.searchParams.get('toDate') || '';
	const userId = locals.user.id;

	const params = new URLSearchParams({
		page,
		search,
		order,
		direction,
		status,
		fromDate,
		toDate,
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
				status_id: 16,
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


			// Paso 3: Actualizar el status del lead (opcional)
            const leadUpdateData = {
                status: 14 // Cambia esto al ID del status que desees
            };

            await api.patch({
                fetch,
                endpoint: `leads/${leadId}`,
                body: JSON.stringify(leadUpdateData),
                token
            });

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


		console.log("FilePaymentConfirmed", FilePaymentConfirmed)

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
				budget_id: budgetId,
				file_id: fileId
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
	},

	updateLead: async ({ cookies, request }) => {
		const token = cookies.get('token');
		const data = await request.formData();
		const leadId = data.get('lead_id');
		const statusId = data.get('status_id');

		const updateData = {
			status: statusId
		};

		const response = await api.patch({
			fetch,
			endpoint: `leads/${leadId}`,
			body: JSON.stringify(updateData),
			token
		});

		if (!response.ok) throw error(500, 'Error al actualizar el lead');

		return { success: true };
	},

	savePersonalRecord: async ({ cookies, request, fetch }) => {
		const token = cookies.get('token');
		const data = await request.formData();
		const leadId = data.get('lead_id');

		const updateData: Record<string, any> = {
			full_name: data.get('full_name') || undefined,
			email: data.get('email') || undefined,
			phone: data.get('phone') || undefined,
			dni: data.get('dni') || undefined,
			birth_date: data.get('birth_date') || undefined,
			parent_full_name: data.get('parent_full_name') || undefined,
			parent_relation: data.get('parent_relation') || undefined,
			parent_email: data.get('parent_email') || undefined,
			is_liceo_student: (data.get('is_liceo_student') !== null && data.get('is_liceo_student') !== '') ? data.get('is_liceo_student') === 'true' : undefined,
			current_level: data.get('current_level') || undefined,
			last_course: data.get('last_course') || undefined,
			last_course_year: data.get('last_course_year') ? parseInt(data.get('last_course_year') as string) : undefined,
			completed_level: (data.get('completed_level') !== null && data.get('completed_level') !== '') ? data.get('completed_level') === 'true' : undefined,
			program_type: data.get('program_type') || undefined,
			institution: data.get('institution') || undefined,
			associated_product: data.get('associated_product') || undefined,
			assigned_to_user_id: data.get('assigned_to_user_id') ? parseInt(data.get('assigned_to_user_id') as string) : undefined,
			allergies: data.get('allergies') || undefined,
			sede: data.get('sede') || undefined,
			special_diet: data.get('special_diet') || undefined,
			preexisting_conditions: data.get('preexisting_conditions') || undefined,
			current_illnesses: data.get('current_illnesses') || undefined,
			medical_observations: data.get('medical_observations') || undefined,
			requires_medication: (data.get('requires_medication') !== null && data.get('requires_medication') !== '') ? data.get('requires_medication') === 'true' : undefined,
			invoice_type: data.get('invoice_type') || undefined,
			business_name: data.get('business_name') || undefined,
			cuit_cuil: data.get('cuit_cuil') || undefined,
			billing_address: data.get('billing_address') || undefined,
			salary: data.get('salary') ? parseFloat(data.get('salary') as string) : undefined
		};

		console.log('Updating lead with data:', updateData);

		const response = await api.patch({
			fetch,
			endpoint: `leads/${leadId}`,
			body: JSON.stringify(updateData),
			token
		});

		console.log('Lead update response:', response);

		if (!response.ok) throw error(500, 'Error al actualizar el lead');

		return { success: true };
	},

	addNote: async ({ cookies, request }) => {
		const token = cookies.get('token');
		const data = await request.formData();
		const budgetId = data.get('id');
		const notes = data.get('notes');

		const response = await api.patch({
			fetch,
			endpoint: `budgets/${budgetId}`,
			body: JSON.stringify({ notes }),
			token
		});

		if (!response.ok) throw error(500, 'Error al agregar la nota');

		return { message: '¡Nota guardada!' };
	},

	addNotePayment: async ({ cookies, request }) => {
		const token = cookies.get('token');
		const data = await request.formData();
		const paymentId = data.get('id');
		const notes = data.get('notes');

		const response = await api.patch({
			fetch,
			endpoint: `payments/${paymentId}`,
			body: JSON.stringify({ notes }),
			token
		});

		if (!response.ok) throw error(500, 'Error al agregar la nota al pago');

		return { message: '¡Nota del pago guardada!' };
	}
};
