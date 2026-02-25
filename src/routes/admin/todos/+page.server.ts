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

	savePersonalRecord: async ({ cookies, request, fetch }) => {
		const token = cookies.get('token');
		const data = await request.formData();
		const leadId = data.get('lead_id');

		const personalData: Record<string, any> = {
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