import { paths } from '$lib/access';
import * as api from '$lib/api';
import { redirect, type HandleServerError } from '@sveltejs/kit';

export async function handle({ event, resolve }: any) {
  // Comprobar si es una solicitud de logout o viene de logout
  if (event.url.pathname === '/logout' || event.url.pathname === '/api/auth/logout' || event.url.searchParams.has('t')) {
    // Limpiar la sesión y continuar
    event.locals.user = undefined;
    event.cookies.delete('token', { path: '/' });
    
    // Para la API de logout, resolver inmediatamente
    if (event.url.pathname === '/api/auth/logout') {
      return await resolve(event);
    }
  }

  const token = event.cookies.get('token');
  console.log('TOKEN:', token);
  const currentPath = event.url.pathname;

  //Si no hay token, no hay usuario
  if (!token) {
    event.locals.user = undefined;
    return await resolve(event);
  }

  try {
    const res = await api.get({ fetch, endpoint: 'auth/user-admin', token });
    console.log('RESPUESTA API:', res);
    if (res?.ok) {
      event.locals.user = res.data;

      const userRoles = event?.locals?.user?.roles?.map((r: any) => r.nombre) || [];

      // Buscar la ruta actual en la lista de paths definidos
      const pathConfig = paths?.find((p) => p.root === currentPath);

      // Si la ruta está definida en paths y el usuario no tiene los roles necesarios, redirigir
      if (pathConfig && !pathConfig?.roles?.some((role) => userRoles.includes(role))) {
        return redirect(307, '/admin');
      }

      return await resolve(event);
    } else {
      // Token inválido, limpiar sesión
      event.locals.user = undefined;
      event.cookies.delete('token', { path: '/' });
      return await resolve(event);
    }
  } catch (error) {
    // Error en la verificación del token, limpiar sesión
    console.error('Error verificando el token:', error);
    event.locals.user = undefined;
    event.cookies.delete('token', { path: '/' });
    return await resolve(event);
  }
}
