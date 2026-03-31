import * as api from '$lib/api';
import { redirect } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { dev } from '$app/environment';

export function load({ locals, url, cookies }: any) {

	// Si hay un parámetro de tiempo en la URL, probablemente viene de un logout
	if (url.searchParams.has('t')) {
		// Eliminar todas las cookies relacionadas con la autenticación
		cookies.delete('token', { path: '/' });

		// Establecer una cookie expirada
		cookies.set('token', '', {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			expires: new Date(0),
			maxAge: 0
		});

		// Asegurarse de que no hay usuario en locals
		locals.user = undefined;

		// Forzar una nueva verificación
		return {
			user: null,
			forceLogout: true
		};
	}

	if (locals.user) {
		redirect(307, '/admin');
	}

}

export const actions = {
	async login({ fetch, request, cookies, url }: any) {
		const form = await request.formData();

		const body = {
			email: form.get('email'),
			password: form.get('password')
		};

		const res = await api.post({ fetch, endpoint: 'auth/login-admin', body: JSON.stringify(body) });

		if (res?.data?.statusCode === 401) {
			return fail(res?.data?.statusCode || 500, { error: 'Credenciales incorrectas' });
		}

		if (res?.data?.access_token) {
			cookies.set('token', res?.data?.access_token, {
				path: '/',
				httpOnly: true,
				secure: true,
				sameSite: 'lax',
				maxAge: 60 * 60 * 24
			});
			redirect(303, '/admin');
		}

		redirect(307, '/admin');
	}
};
