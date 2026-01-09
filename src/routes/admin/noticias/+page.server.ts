import * as api from '$lib/api';
import { error } from '@sveltejs/kit';

export const load = (async ({ cookies, url }) => {
	const token = cookies.get('token');
	const [noticiasResp] = await Promise.all([api.get({ fetch, endpoint: `noticias/paginated`, token, params: url.searchParams})]);
	try {
		return {
			noticias: noticiasResp.data.data,
			meta: noticiasResp.data.meta
		};
	} catch (err) {
		console.error('Failed to load noticias:', err);
		throw error(500, 'Failed to load noticias data');
	}
});
