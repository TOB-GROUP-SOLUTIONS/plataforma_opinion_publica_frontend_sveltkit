import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		const formData = await request.formData();

		const data = {
			programa: formData.get('programa'),
			nombre_responsable: formData.get('nombre_responsable'),
			email_responsable: formData.get('email_responsable'),
			telefono_responsable: formData.get('telefono_responsable'),
			nombre_alumno: formData.get('nombre_alumno'),
			email_alumno: formData.get('email_alumno'),
			telefono_alumno: formData.get('telefono_alumno'),
			es_alumno: formData.get('es_alumno'),
			curso_actual: formData.get('curso_actual'),
			sede_actual: formData.get('sede_actual')
		};

		// Validación básica
		if (!data.programa || !data.nombre_responsable || !data.email_responsable || !data.telefono_responsable || !data.nombre_alumno || !data.es_alumno) {
			return fail(400, {
				error: 'Por favor, complete todos los campos obligatorios'
			});
		}

		try {
			// Aquí puedes enviar los datos a tu backend
			// const response = await fetch('http://localhost:3000/api/lcb', {
			// 	method: 'POST',
			// 	headers: {
			// 		'Content-Type': 'application/json'
			// 	},
			// 	body: JSON.stringify(data)
			// });

			// if (!response.ok) {
			// 	throw new Error('Error al enviar el formulario');
			// }

			// Por ahora, solo registramos en consola
			console.log('Datos del formulario LCB:', data);

			return {
				success: true
			};
		} catch (error) {
			console.error('Error al procesar formulario LCB:', error);
			return fail(500, {
				error: 'Error al enviar el formulario. Por favor, intente nuevamente.'
			});
		}
	}
};
