import { error, redirect, fail } from '@sveltejs/kit';
import * as api from '$lib/api';
import type { Actions } from './$types';

/**
 * NestJS puede devolver errores con distintas estructuras:
 *  - { statusCode, message: string, error: string }
 *  - { statusCode, message: { errors: { campo: 'msg' }, statusCode }, error: string }
 *  - { statusCode, errors: { campo: 'msg' } }
 * Esta función extrae un string legible de cualquiera de esas formas.
 */
function extractErrorMessage(data: any): string {
	const msg = data?.message ?? data?.errors ?? data?.error ?? 'Error al crear el lead';

	if (typeof msg === 'string') return msg;

	if (Array.isArray(msg)) return msg.join(', ');

	if (typeof msg === 'object' && msg !== null) {
		// Puede ser { errors: { email: '...' }, statusCode: 422 }
		const nested = msg.errors ?? msg.message ?? msg;
		if (typeof nested === 'string') return nested;
		if (typeof nested === 'object' && nested !== null) {
			return Object.values(nested)
				.filter((v) => typeof v === 'string')
				.join(', ') || JSON.stringify(nested);
		}
	}

	return 'Error desconocido';
}

export const load = async ({ cookies, locals, url, fetch }: any) => {
	const token = cookies.get('token');

	if (!locals.user) redirect(303, '/');

	const page = url.searchParams.get('page') || '1';
	const search = url.searchParams.get('query') || '';
	const order = url.searchParams.get('order') || 'id';
	const direction = url.searchParams.get('direction') || 'desc';
	const fromdate = url.searchParams.get('fromDate') || '';
	const todate = url.searchParams.get('toDate') || '';

	const params = new URLSearchParams({
		page,
		search,
		order,
		direction,
		fromdate,
		todate,
		onlyUnassigned: 'true'
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

	createLead: async ({ cookies, request, fetch }) => {
		const token = cookies.get('token');
		const data = await request.formData();

		const email = (data.get('email') as string)?.trim();

		const CreateLeadDto: Record<string, any> = {
			full_name: data.get('full_name'),
			phone: data.get('phone') || undefined,
			city: data.get('city') || undefined,
			age: data.get('age') ? parseInt(data.get('age') as string) : undefined,
			program_type: data.get('program') || undefined,
			status: 1,
			source: data.get('source') || undefined,
			objective: data.get('objective') || undefined,
			notes: data.get('observations') || undefined
		};

		// El email es opcional en el formulario inicial pero el backend lo valida con @IsEmail()
		// solo lo incluimos si el usuario lo ingresó
		if (email) {
			CreateLeadDto.email = email;
		}

		try {
			const response = await api.post({
				fetch,
				endpoint: 'leads',
				body: JSON.stringify(CreateLeadDto),
				token
			});

			console.log('Create Lead Response:', response);

			if (!response.ok || response.data?.statusCode >= 400) {
				const msgStr = extractErrorMessage(response.data);
				console.error('Error del backend:', msgStr);
				return fail(422, { error: msgStr });
			}

			return { success: true };
		} catch (err: any) {
			console.error('Error en createLead:', err);
			return fail(500, {
				error: err.message || 'Error al guardar el formulario'
			});
		}
	},

	asingToUser: async ({ cookies, request }) => {
		const token = cookies.get('token');
		const data = await request.formData();

		const leadId = data.get('lead_id');
		const userId = data.get('user_id');

		console.log('Asignando lead', leadId, 'to user', userId);

		const UpdateLeadDto = {
			assigned_to_user_id: userId,
			status: 13
		};

		console.log('UpdateLeadDto:', UpdateLeadDto);

		const response = await api.patch({
			fetch,
			endpoint: `leads/${leadId}`,
			body: JSON.stringify(UpdateLeadDto),
			token
		});

		console.log('Asignar Lead Response:', response);

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

	addNote: async ({ cookies, request }) => {
		const token = cookies.get('token');
		const data = await request.formData();
		const leadId = data.get('id');
		const notes = data.get('notes');

		console.log('Updating lead with data:', leadId);	

		const updateData = {
			notes: notes
		};

		const response = await api.patch({
			fetch,
			endpoint: `leads/${leadId}`,
			body: JSON.stringify(updateData),
			token
		});

		console.log('Lead update response:', response);

		if (!response.ok) throw error(500, 'Error al agregar la nota');

		return {
			message: '¡Nota guardada!'
		};
	}
};
