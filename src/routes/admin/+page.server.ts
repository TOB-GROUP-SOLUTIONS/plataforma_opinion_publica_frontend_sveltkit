import {error, fail, redirect} from '@sveltejs/kit';
import * as api from '$lib/api';
import type { Actions } from './$types';

export const load = async ({ cookies, locals, url, fetch }: any) => {
    const token = cookies.get('token');

    if (!locals.user) redirect(303, '/');

}
