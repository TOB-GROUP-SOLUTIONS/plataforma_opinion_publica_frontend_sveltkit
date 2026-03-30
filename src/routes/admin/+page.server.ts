import { redirect } from '@sveltejs/kit';
import * as api from '$lib/api';

export const load = async ({ url, cookies, locals, fetch }: any) => {
	const token = cookies.get('token');

	if (!locals.user) redirect(303, '/');

	try {
		const params = new URLSearchParams();
		if (url.searchParams.get('dias')) params.append('dias', url.searchParams.get('dias'));
		if (url.searchParams.get('redSocial')) params.append('redSocial', url.searchParams.get('redSocial'));
		if (url.searchParams.get('entidadId')) params.append('entidadId', url.searchParams.get('entidadId'));
		const queryString = params.toString() ? `?${params.toString()}` : '';

		const res = await api.get({ fetch, endpoint: `dashboard/overview${queryString}`, token });
		const entRes = await api.get({ fetch, endpoint: 'entidades-objetivo', token });

		return {
			dashboard: res.ok ? res.data : null,
			entidades: entRes.ok ? entRes.data : [],
			filters: {
				dias: url.searchParams.get('dias') || '7',
				redSocial: url.searchParams.get('redSocial') || '',
				entidadId: url.searchParams.get('entidadId') || ''
			},
			user: locals.user,
		};
	} catch (err) {
		console.error('Error fetching dashboard data:', err);
		return { dashboard: null, user: locals.user };
	}
};
