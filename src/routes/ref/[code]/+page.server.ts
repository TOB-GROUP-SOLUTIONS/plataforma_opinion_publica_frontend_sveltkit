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
            program_type: data.get('program'),
            referralCode: data.get('referral_code'),
            status: 1,
            objective: data.get('objective'),
            is_liceo_student: data.get('is_liceo_student') === 'true',
            sede: data.get('sede'),
            current_level: data.get('current_level'),
            last_course_year: data.get('last_course_year') ? parseInt(data.get('last_course_year') as string) : null,
            last_course: data.get('last_course'),
            completed_level: data.get('completed_level') === 'true',
            estimated_travel_month: data.get('estimated_travel_month'),
            estimated_travel_year: data.get('estimated_travel_year') ? parseInt(data.get('estimated_travel_year') as string) : null,
            passport_number: data.get('passport_number'),
            passport_validity: data.get('passport_validity') ? new Date(data.get('passport_validity') as string) : null,
            passport_file_id: data.get('passport_file_id') ? parseInt(data.get('passport_file_id') as string) : null
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
