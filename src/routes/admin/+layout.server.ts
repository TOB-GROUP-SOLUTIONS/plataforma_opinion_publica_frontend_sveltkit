import * as api from '$lib/api';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url, cookies, locals, fetch }) => {
	const token = cookies.get('token');

	let entidades = [];
	try {
		const entRes = await api.get({ fetch, endpoint: 'entidades-objetivo', token });
		if (entRes.ok) entidades = entRes.data;
	} catch (err) {
		console.error('Error fetching entidades in layout:', err);
	}

	return {
		user: locals.user,
		entidades,
		filters: {
			dias: url.searchParams.get('dias') || '7',
			redSocial: url.searchParams.get('redSocial') || '',
			entidadId: url.searchParams.get('entidadId') || ''
		}
	};
}
