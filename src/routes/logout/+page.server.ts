import { redirect } from '@sveltejs/kit';

export async function load() {
	redirect(307, '/');
}

export const actions = {
	async default({ cookies }) {
		cookies.delete('token', { path: '/' });
		redirect(303, '/');
	}
};