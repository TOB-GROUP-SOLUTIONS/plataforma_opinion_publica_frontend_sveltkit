import * as api from '$lib/api';
import { redirect } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { dev } from '$app/environment';

export function load({ locals, url, cookies }: any) {
	console.log('[+page.server.ts] - Load function - locals.user:', locals.user);
	console.log('[+page.server.ts] - URL params:', url.searchParams.toString());

	// Si hay un parámetro de tiempo en la URL, probablemente viene de un logout
	if (url.searchParams.has('t')) {
		console.log("[+page.server.ts] - Parámetro 't' detectado, procesando logout");
		// Eliminar todas las cookies relacionadas con la autenticación
		cookies.delete('token', { path: '/' });

		// Establecer una cookie expirada
		cookies.set('token', '', {
			path: '/',
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
		console.log('[+page.server.ts] - Usuario autenticado, redirigiendo a /admin');
		redirect(307, '/admin');
	}

	console.log('[+page.server.ts] - No hay usuario autenticado, mostrando login');
}

export const actions = {
	async login({ fetch, request, cookies, url }: any) {
		console.log('[+page.server.ts] - Iniciando acción de login');
		const form = await request.formData();

		const body = {
			email: form.get('email'),
			password: form.get('password')
		};

		console.log('[+page.server.ts] - Enviando credenciales a auth/login-admin');
		const res = await api.post({ fetch, endpoint: 'auth/login-admin', body: JSON.stringify(body) });

		console.log('[+page.server.ts] - Respuesta del endpoint login-admin:', {
			ok: res?.ok,
			dataType: typeof res?.data,
			hasStatusCode: !!res?.data?.statusCode,
			hasAccessToken: !!res?.data?.access_token
		});

		if (res?.data?.statusCode === 401) {
			console.log('[+page.server.ts] - Error 401: Credenciales incorrectas');
			return fail(res?.data?.statusCode || 500, { error: 'Credenciales incorrectas' });
		}

		if (res?.data?.access_token) {
			console.log('[+page.server.ts] - Access token recibido, guardando en cookie');
			cookies.set('token', res?.data?.access_token, {
				secure: !dev, // Dinámico: false en dev (HTTP), true en prod (HTTPS)
				httpOnly: true, // Protección contra XSS
				sameSite: 'lax', // Protección contra CSRF
				path: '/',
				maxAge: 60 * 60 * 24 * 7 // 7 días
			});
			console.log('[+page.server.ts] - Redirigiendo a /admin con token guardado');
			redirect(303, '/admin');
		}

		console.error('[+page.server.ts] - ERROR: Respuesta inesperada del endpoint login:', res);
		redirect(307, '/admin');
	}
};
