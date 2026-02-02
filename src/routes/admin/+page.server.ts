import {error, fail, redirect} from '@sveltejs/kit';
import * as api from '$lib/api';
import type { Actions } from './$types';

export const load = async ({ cookies, locals, url, fetch }: any) => {
    const token = cookies.get('token');

    if (!locals.user) redirect(303, '/');

    // Obtener budgets desde la API
    try {
        const params = new URLSearchParams(url.searchParams as any);
        // page/perPage defaults if not present
        if (!params.get('page')) params.set('page', '1');
        if (!params.get('perPage')) params.set('perPage', '10');

        // Llamar al endpoint paginado (asegúrate que coincida con tu controller)
        const res = await api.get({ fetch, endpoint: 'budgets/paginated', params, token });
        if (res.ok) {
            return { budgets: res.data.data ?? [], budgetsMeta: res.data.meta ?? null, user: locals.user };
        } else {
            return { budgets: [], budgetsMeta: null, user: locals.user };
        }
    } catch (err) {
        console.error('Error fetching budgets:', err);
        return { budgets: [], budgetsMeta: null, user: locals.user };
    }

}
