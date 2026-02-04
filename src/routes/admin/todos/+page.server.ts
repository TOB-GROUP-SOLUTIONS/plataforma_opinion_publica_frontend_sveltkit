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
	const fromdate = url.searchParams.get('fromDate') || '';
	const todate = url.searchParams.get('toDate') || '';

	const params = new URLSearchParams({
		page,
		search,
		order,
		direction,
		status,
		fromdate,
		todate
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
	},

	savePersonalRecord: async ({ cookies, request }) => {
		const token = cookies.get('token');
		const data = await request.formData();
		const leadId = data.get('lead_id');

		const personalData = {
			full_name: data.get('full_name'),
			dni: data.get('dni'),
			birth_date: data.get('birthDate'),
			email: data.get('email'),
			parent_full_name: data.get('parentName'),
			parent_relation: data.get('relationshipType'),
			parent_email: data.get('parentEmail'),
			parent_phone: data.get('phone'),
			program_type: data.get('programType'),
			institution: data.get('school'),
			associated_product: data.get('product'),
			allergies: data.get('allergies'),
			preexisting_conditions: data.get('preexisting_conditions'),
			current_illnesses: data.get('current_illnesses'),
			medical_observations: data.get('medical_observations'),
			requires_medication: data.get('requires_medication'),
			invoice_type: data.get('invoice_type'),
			business_name: data.get('business_name'),
			cuit_cuil: data.get('cuit_cuil'),
			billing_address: data.get('billing_address'),
			salary: data.get('salary') ? parseFloat(data.get('salary') as string) : null
		};

		const response = await api.patch({
			fetch,
			endpoint: `leads/${leadId}`,
			body: JSON.stringify(personalData),
			token
		});

		if (!response.ok) throw error(500, 'Error al guardar la ficha personal');

		return { success: true };
	}
};