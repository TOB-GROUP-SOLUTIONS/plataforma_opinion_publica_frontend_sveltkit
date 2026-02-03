import * as api from '$lib/api';
import { redirect, type HandleServerError } from '@sveltejs/kit';

export async function handle({ event, resolve }: any) {
	// Silenciar errores de Chrome DevTools que buscan archivos de configuración
	if (event.url.pathname.startsWith('/.well-known/')) {
		return new Response(null, { status: 404 });
	}

	const token = event.cookies.get('token');
	const currentPath = event.url.pathname;

	console.log('[HOOK] - Procesando ruta:', currentPath);
	console.log('[HOOK] - Token presente:', !!token);

	// Si no hay token y no estás en la página principal, redirigir a /
	if (!token) {
		console.log('[HOOK] - No hay token, estableciendo user como undefined');
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
			console.log('[HOOK] - Ruta pública permitida, continuando');
			return await resolve(event);
		}

		console.log('[HOOK] - Ruta protegida sin token, redirigiendo a /');
		// Redirigir a / para cualquier otra ruta
		return redirect(307, '/');
	}

	console.log('[HOOK] - Token detectado, verificando usuario en endpoint auth/user-admin');

	try {
		const res = await api.get({ fetch, endpoint: 'auth/user-admin', token });

		console.log(
			'[HOOK] - Respuesta de API:',
			JSON.stringify({
				ok: res?.ok,
				dataType: typeof res?.data,
				dataKeys: res?.data ? Object.keys(res.data) : 'null'
			})
		);

		if (res?.ok) {
			console.log('[HOOK] - Respuesta OK, estableciendo locals.user');

			// Validar que res.data tenga estructura mínima de usuario
			if (res.data && (res.data.id || res.data.email)) {
				event.locals.user = res.data;
				console.log('[HOOK] - Usuario establecido correctamente:', {
					id: res.data.id,
					email: res.data.email
				});
			} else {
				console.error('[HOOK] - ERROR: res.data no tiene estructura válida de usuario:', res.data);
				event.locals.user = undefined;
				event.cookies.delete('token', { secure: false, path: '/' });
				return redirect(307, '/');
			}

			return await resolve(event);
		} else {
			console.error('[HOOK] - Token inválido, respuesta de API no fue ok:', res);
			// Token inválido, limpiar sesión y redirigir a /
			event.locals.user = undefined;
			event.cookies.delete('token', { secure: false, path: '/' });
			return redirect(307, '/');
		}
	} catch (error) {
		console.error('[HOOK] - Error al verificar usuario:', error);
		event.locals.user = undefined;
		event.cookies.delete('token', { secure: false, path: '/' });
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
