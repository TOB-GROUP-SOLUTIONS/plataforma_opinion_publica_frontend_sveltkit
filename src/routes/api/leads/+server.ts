import type { RequestHandler } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import * as api from '$lib/api';

export const GET: RequestHandler = async ({ cookies, url, fetch }) => {
    const token = cookies.get('token');


    const page = url.searchParams.get('page') || '1';
    const search = url.searchParams.get('query') || '';
    const order = url.searchParams.get('order') || 'id';
    const direction = url.searchParams.get('direction') || 'desc';

    const params = new URLSearchParams({
        page,
        search,
        order,
        direction,
        onlyUnassigned: 'true'
    });

    const [leadsresponse, usersResponse] = await Promise.all([
        api.get({
            fetch,
            endpoint: 'leads/paginated',
            params,
            token
        }),
        api.get({
            fetch,
            endpoint: 'users',
            token
        })
    ]);

    if (!leadsresponse.ok) throw error(500, 'Error al cargar los leads');

    console.log('Response Data:', leadsresponse.data);
  return new Response(JSON.stringify({
    data: leadsresponse?.data?.data || [],
    meta: leadsresponse?.data?.meta || {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10,
      prev: null,
      next: null,
      lastPage: 1,
      total: 0,
      perPage: 10
    }
  }));
};