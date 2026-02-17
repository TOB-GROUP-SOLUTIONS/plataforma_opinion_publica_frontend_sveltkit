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
		
		// TODO: Implementar la lógica para guardar los datos
		// Por ejemplo:
		const data = {
			lead_id: formData.get('lead_id'),
			full_name: formData.get('full_name'),
			dni: formData.get('dni'),
			birthDate: formData.get('birthDate'),
			email: formData.get('email'),
			parentName: formData.get('parentName'),
			relationshipType: formData.get('relationshipType'),
			parentEmail: formData.get('parentEmail'),
			phone: formData.get('phone'),
			programType: formData.get('programType'),
			school: formData.get('school'),
			product: formData.get('product'),
			blood_type: formData.get('blood_type'),
			allergies: formData.get('allergies'),
			preexisting_conditions: formData.get('preexisting_conditions'),
			current_illnesses: formData.get('current_illnesses'),
			medical_observations: formData.get('medical_observations'),
			requires_medication: formData.get('requires_medication'),
			invoice_type: formData.get('invoice_type'),
			business_name: formData.get('business_name'),
			cuit_cuil: formData.get('cuit_cuil'),
			billing_address: formData.get('billing_address'),
			salary: formData.get('salary')
		};


		return { success: true };
	}
};
