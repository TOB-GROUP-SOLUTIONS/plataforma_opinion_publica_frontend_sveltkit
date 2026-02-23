import { error } from '@sveltejs/kit';
import * as api from '$lib/api';
import type { Actions } from './$types';

export const actions: Actions = {
	createLead: async ({ cookies, request, fetch }) => {
		const token = cookies.get('token');
		const data = await request.formData();

		const CreateLeadDto = {
			full_name: data.get('full_name'),
			email: data.get('email'),
			phone: data.get('phone'),
			city: data.get('city'),
			age: data.get('age') ? parseInt(data.get('age') as string) : null,
			programa: "web",
			status: 1,
			source: data.get('source'),
			objective: data.get('objective'),
			notes: data.get('observations')
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
	}
};
