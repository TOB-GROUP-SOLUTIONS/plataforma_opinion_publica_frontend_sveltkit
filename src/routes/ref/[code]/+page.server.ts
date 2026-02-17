import { error } from '@sveltejs/kit';
import * as api from '$lib/api';
import type { Actions } from './$types';

export const load = async ({ params, fetch }: any) => {
    const { code } = params;

    console.log('Validating code:', code);

    const response = await api.get({
        fetch,
        endpoint: `referrers/validate/${code}`
    });

    if (!response.ok) {
        console.error('Validation failed:', response);
        throw error(404, 'Enlace no válido o expirado');
    }

    return {
        referrer: response.data,
        referralCode: code
    };
};

export const actions: Actions = {
    default: async ({ request, fetch }) => {
        const data = await request.formData();

        const CreateLeadDto = {
            full_name: data.get('full_name'),
            email: data.get('email'),
            phone: data.get('phone'),
            city: data.get('city'),
            dni: data.get('dni'),
            birth_date: data.get('birth_date') ? new Date(data.get('birth_date') as string) : null,
            nationality: data.get('nationality'),
            source: data.get('source') || 'Referido',
            programa: data.get('program'),
            referralCode: data.get('referral_code'),
            status: 1,
            objective: data.get('objective'),
            notes: data.get('consultation')
        };

        console.log('Creating lead from public referral:', CreateLeadDto);

        try {
            const response = await api.post({
                fetch,
                endpoint: 'leads',
                body: JSON.stringify(CreateLeadDto)
            });

            if (!response.ok) {
                console.error('Lead creation failed:', response);
                throw error(500, 'Error al enviar el formulario');
            }

            return { success: true };
        } catch (err: any) {
            console.error('Error submitting form:', err);
            return {
                error: err.message || 'Error al enviar el formulario'
            };
        }
    }
};
