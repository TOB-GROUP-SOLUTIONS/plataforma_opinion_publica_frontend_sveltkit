<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;

	let isSubmitting = false;
	let successMessage = '';
	let errorMessage = '';

	$: if (form?.success) {
		successMessage = 'Formulario enviado correctamente';
		errorMessage = '';
		// Reset form after success
		setTimeout(() => {
			window.location.reload();
		}, 2000);
	} else if (form?.error) {
		errorMessage = form.error;
		successMessage = '';
	}
</script>

<svelte:head>
	<title>Formulario LCB</title>
</svelte:head>

<div class="min-h-screen bg-gray-100 py-8 px-4">
	<div class="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 relative">
		<!-- Close Button -->
		<button
			type="button"
			class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
			on:click={() => window.history.back()}
		>
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		</button>

		<h1 class="text-2xl font-semibold text-center mb-6 text-gray-700">FORMULARIO LCB</h1>

		{#if successMessage}
			<div class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
				{successMessage}
			</div>
		{/if}

		{#if errorMessage}
			<div class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
				{errorMessage}
			</div>
		{/if}

		<form
			method="POST"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ update }) => {
					await update();
					isSubmitting = false;
				};
			}}
		>
			<!-- Tipo de Programa -->
			<div class="mb-4">
				<label for="programa" class="block text-sm font-medium text-gray-700 mb-2">
					¿Qué tipo de programa te interesa?
				</label>
				<select
					id="programa"
					name="programa"
					required
					class="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="">Elegir programa</option>
					<option value="tutoria">Tutoria</option>
					<option value="individual">Individual</option>
					<option value="grupo">Grupos</option>
				</select>
			</div>

			<!-- DATOS DEL ADULTO RESPONSABLE -->
			<h2 class="text-sm font-bold text-gray-700 mb-3 uppercase">Datos del adulto responsable</h2>

			<div class="mb-4">
				<label for="nombre_responsable" class="block text-sm text-gray-700 mb-1">
					Nombre y apellido del padre / madre / tutor
				</label>
				<input
					type="text"
					id="nombre_responsable"
					name="nombre_responsable"
					required
					class="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<div class="mb-4">
				<label for="email_responsable" class="block text-sm text-gray-700 mb-1">
					Email del padre / madre / tutor
				</label>
				<input
					type="email"
					id="email_responsable"
					name="email_responsable"
					required
					class="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<div class="mb-6">
				<label for="telefono_responsable" class="block text-sm text-gray-700 mb-1">
					Teléfono padre / madre / tutor
				</label>
				<input
					type="tel"
					id="telefono_responsable"
					name="telefono_responsable"
					required
					class="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<!-- DATOS DEL ALUMNO -->
			<h2 class="text-sm font-bold text-gray-700 mb-3 uppercase">Datos del alumno</h2>

			<div class="mb-4">
				<label for="nombre_alumno" class="block text-sm text-gray-700 mb-1">
					Nombre y apellido
				</label>
				<input
					type="text"
					id="nombre_alumno"
					name="nombre_alumno"
					required
					class="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<div class="mb-4">
				<label for="email_alumno" class="block text-sm text-gray-700 mb-1"> Email </label>
				<input
					type="email"
					id="email_alumno"
					name="email_alumno"
					class="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<div class="mb-4">
				<label for="telefono_alumno" class="block text-sm text-gray-700 mb-1"> Teléfono </label>
				<input
					type="tel"
					id="telefono_alumno"
					name="telefono_alumno"
					class="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<div class="mb-4">
				<label for="es_alumno" class="block text-sm text-gray-700 mb-2">
					¿Actualmente es alumno del liceo?
				</label>
				<select
					id="es_alumno"
					name="es_alumno"
					required
					class="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="">Elegir respuesta</option>
					<option value="si">Sí</option>
					<option value="no">No</option>
				</select>
			</div>

			<div class="mb-4">
				<label for="curso_actual" class="block text-sm text-gray-700 mb-1"> Curso actual </label>
				<input
					type="text"
					id="curso_actual"
					name="curso_actual"
					class="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<div class="mb-6">
				<label for="sede_actual" class="block text-sm text-gray-700 mb-1"> Sede actual </label>
				<input
					type="text"
					id="sede_actual"
					name="sede_actual"
					class="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<!-- Submit Button -->
			<div class="flex justify-center">
				<button
					type="submit"
					disabled={isSubmitting}
					class="px-8 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full shadow disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isSubmitting ? 'Enviando...' : 'Guardar'}
				</button>
			</div>
		</form>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}
</style>
