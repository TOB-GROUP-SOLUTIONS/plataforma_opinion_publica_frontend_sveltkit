import { error, fail, redirect } from '@sveltejs/kit';
import * as api from '$lib/api';
import type { Actions } from './$types';

export const load = async ({ cookies, locals, url, fetch }: any) => {
  const token = cookies.get('token');

  if (!locals.user) redirect(303, '/');

  try {
    const params = new URLSearchParams(url.searchParams as any);
    // page/perPage defaults if not present
    if (!params.get('page')) params.set('page', '1');
    if (!params.get('perPage')) params.set('perPage', '10');

    // Llamar al endpoint paginado de budgets
    const res = await api.get({ fetch, endpoint: 'budgets/paginated', params, token });

    // Si existe un parámetro de búsqueda, llamar al endpoint /search y pasar q=search
    const searchQuery = params.get('search');
    let searchResults: any[] = [];
    if (searchQuery && searchQuery.trim() !== '') {
      try {
        const sParams = new URLSearchParams();
        sParams.set('q', searchQuery);
        // opcional: usar perPage como limit para resultados de búsqueda
        sParams.set('limit', params.get('perPage') || '50');
        const sRes = await api.get({ fetch, endpoint: 'search', params: sParams, token });
        if (sRes.ok) {
          searchResults = sRes.data?.results ?? [];
        }
      } catch (err) {
        console.error('Error fetching search results:', err);
        searchResults = [];
      }
    }

    if (res.ok) {
      return {
        budgets: res.data.data ?? [],
        budgetsMeta: res.data.meta ?? null,
        user: locals.user,
        searchResults,
      };
    } else {
      return { budgets: [], budgetsMeta: null, user: locals.user, searchResults };
    }
  } catch (err) {
    console.error('Error fetching budgets:', err);
    return { budgets: [], budgetsMeta: null, user: locals.user, searchResults: [] };
  }
};
