import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import * as api from '$lib/api';

export const load: PageServerLoad = async ({ locals, params }) => {
	const leadId = params.id;

	if (!leadId) {
		return fail(400, { error: 'ID del lead requerido' });
	}

	const response = await api.get({
		fetch,
		endpoint: `leads/${leadId}`,
	});
	
	return {
		lead: response.data || null,
	};
};

export const actions: Actions = {
	saveFormulario: async ({ request, locals }) => {
		const formData = await request.formData();
		const lead_id = formData.get('lead_id');

		const UpdateLeadDto = {
			// Datos básicos del alumno
			full_name: formData.get('full_name'),
			dni: formData.get('dni'),
			birth_date: formData.get('birth_date'),
			nationality: formData.get('nationality'),
			email: formData.get('email'),
			phone: formData.get('phone'),
			// Padre/tutor
			parent_full_name: formData.get('parent_full_name'),
			parent_relation: formData.get('parent_relation'),
			parent_email: formData.get('parent_email'),
			parent_phone: formData.get('parent_phone'),
			// Info académica
			is_liceo_student: formData.get('is_liceo_student'),
			current_level: formData.get('current_level'),
			sede: formData.get('sede'),
			last_course: formData.get('last_course'),
			last_course_year: formData.get('last_course_year'),
			completed_level: formData.get('completed_level'),
			// Programa contratado
			program_type: formData.get('program_type'),
			institution: formData.get('institution'),
			associated_product: formData.get('associated_product'),
			// Información médica
			special_diet: formData.get('special_diet'),
			allergies: formData.get('allergies'),
			preexisting_conditions: formData.get('preexisting_conditions'),
			current_illnesses: formData.get('current_illnesses'),
			medical_observations: formData.get('medical_observations'),
			requires_medication: formData.get('requires_medication'),
			// Facturación
			invoice_type: formData.get('invoice_type'),
			business_name: formData.get('business_name'),
			cuit_cuil: formData.get('cuit_cuil'),
			billing_address: formData.get('billing_address'),
			salary: formData.get('salary'),
		};

		const response = await api.patch({
			fetch,
			endpoint: `leads/${lead_id}`,
			body: JSON.stringify(UpdateLeadDto),
		});


		if (!response.ok) {
			return fail(500, { error: 'Error al guardar el lead' });
		}	

		return { success: true };
	}
};
