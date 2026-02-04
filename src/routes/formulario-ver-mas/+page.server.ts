import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, url }) => {
	// TODO: Obtener el ID del lead desde la URL o parámetros
	const leadId = url.searchParams.get('id');
	
	// TODO: Cargar los datos del lead desde el backend
	// Por ejemplo:
	// const response = await fetch(`${API_URL}/leads/${leadId}`, {
	// 	headers: {
	// 		Authorization: `Bearer ${locals.user?.token}`
	// 	}
	// });
	// const leadData = await response.json();
	
	return {
		// TODO: Retornar los datos reales del lead
		id: leadId || '',
		full_name: '',
		dni: '',
		birthDate: '',
		email: '',
		parent_full_name: '',
		parent_relation: '',
		parentEmail: '',
		phone: '',
		program_type: '',
		institution: '',
		assigned_to: null,
		product: '',
		preexisting_conditions: '',
		current_illnesses: '',
		medical_observations: '',
		requires_medication: '',
		invoice_type: '',
		business_name: '',
		cuit_cuil: '',
		billing_address: '',
		salary: ''
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

		// TODO: Enviar los datos al backend
		// const response = await fetch(`${API_URL}/leads/${data.lead_id}/personal-record`, {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 		Authorization: `Bearer ${locals.user?.token}`
		// 	},
		// 	body: JSON.stringify(data)
		// });

		// if (!response.ok) {
		// 	return fail(500, { message: 'Error al guardar los datos' });
		// }

		return { success: true };
	}
};
