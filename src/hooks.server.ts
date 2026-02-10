import * as api from '$lib/api';
import { redirect, type HandleServerError } from '@sveltejs/kit';

export async function handle({ event, resolve }: any) {
	// Silenciar errores de Chrome DevTools que buscan archivos de configuración
	if (event.url.pathname.startsWith('/.well-known/')) {
		return new Response(null, { status: 404 });
	}

	const token = event.cookies.get('token');
	const currentPath = event.url.pathname;


	// Si no hay token y no estás en la página principal, redirigir a /
	if (!token) {
		event.locals.user = undefined;

		// Permitir acceso a la página principal y rutas públicas
		if (
			currentPath === '/' ||
			currentPath === '/login' ||
			currentPath.startsWith('/api/') ||
			currentPath.startsWith('/new-password') ||
			currentPath.startsWith('/reset-password') ||
			currentPath.startsWith('/formulario-lcb') ||
			currentPath.startsWith('/ref/')
		) {
			return await resolve(event);
		}

		// Redirigir a / para cualquier otra ruta
		return redirect(307, '/');
	}


	try {
		const res = await api.get({ fetch, endpoint: 'auth/user-admin', token });

		console.log(
			JSON.stringify({
				ok: res?.ok,
				dataType: typeof res?.data,
				dataKeys: res?.data ? Object.keys(res.data) : 'null'
			})
		);

		if (res?.ok) {

			// Validar que res.data tenga estructura mínima de usuario
			if (res.data && (res.data.id || res.data.email)) {
				event.locals.user = res.data;
			} else {
				event.locals.user = undefined;
				event.cookies.delete('token', { path: '/' });
				return redirect(307, '/');
			}

			return await resolve(event);
		} else {
			// Token inválido, limpiar sesión y redirigir a /
			event.locals.user = undefined;
			event.cookies.delete('token', { path: '/' });
			return redirect(307, '/');
		}
	} catch (error) {
		event.locals.user = undefined;
		event.cookies.delete('token', { path: '/' });
		return redirect(307, '/');
	}
}

export const handleError: HandleServerError = async ({ error, event, status, message }) => {
	// Ignorar errores de Chrome DevTools
	if (event?.url?.pathname?.startsWith('/.well-known/')) {
		return { message: 'Not Found' };
	}

	console.error('handleError: ', error, event, status, message);
	return { message };
};
