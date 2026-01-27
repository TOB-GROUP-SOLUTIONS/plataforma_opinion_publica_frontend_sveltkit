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
      currentPath.startsWith('/formulario-lcb')
    ) {
      return await resolve(event);
    }
    
    // Redirigir a / para cualquier otra ruta
    return redirect(307, '/');
  }

  const res = await api.get({ fetch, endpoint: 'auth/user-admin', token });

  if (res?.ok) {
    event.locals.user = res.data;
    return await resolve(event);
  } else {
    // Token inválido, limpiar sesión y redirigir a /
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
