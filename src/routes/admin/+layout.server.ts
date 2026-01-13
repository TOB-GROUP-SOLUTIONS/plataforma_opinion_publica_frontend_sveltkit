import * as api from '$lib/api';
import type { LayoutServerLoad } from './$types';


export const load: LayoutServerLoad = async ({ cookies, locals, fetch }) => {
	const token = cookies.get('token');

	return {
		user: locals.user
	};
}
