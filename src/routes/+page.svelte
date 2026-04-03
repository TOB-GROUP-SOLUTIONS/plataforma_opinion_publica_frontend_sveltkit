<script lang="ts">
	import { enhance } from '$app/forms';
	import Toast from '$lib/components/ui/Toast.svelte';
	import { Label, Input, Card, Helper, Spinner, Button } from 'flowbite-svelte';
	import { goto } from '$app/navigation';

	let sending = false;
	let successMessage = '';
	let errorMessage = '';

	const handleSubmit = ({}) => {
		sending = true;

		return async ({ result, update }: any) => {
			if (result.type === 'redirect') {
				successMessage = 'Inicio de sesión exitoso';
				sending = false;
				errorMessage = '';
			} else {
				sending = false;
				errorMessage = result?.data?.error;
				console.log('error', errorMessage);
			}
			await update({});
		};
	};
</script>

<svelte:head>
	<title>Iniciar Sesión - Plataforma de Opinion Publica</title>
	<meta name="description" content="Acceso administrativo a Plataforma de Opinion Publica" />
</svelte:head>

<!-- Fondo principal azul -->
<div class="min-h-screen w-full bg-blue-800 flex items-center justify-center p-4 relative overflow-hidden">
	<!-- Modal blanco -->
	<div class="bg-white w-full max-w-md rounded-2xl shadow-2xl px-8 py-10 relative z-10">
		

		<div class="text-center mb-8">
			<h1 class="text-2xl font-bold text-gray-900 mb-2">
				Opinión Pública
			</h1>
			<p class="text-gray-500 text-sm">
				Iniciar Sesión
			</p>
		</div>

		<!-- Formulario de login -->
		<form use:enhance={handleSubmit} method="post" action="?/login" class="space-y-6">
			<div class="space-y-1">
				<Label for="email" class="text-gray-700 font-semibold mb-1 block">Email</Label>
				<Input
					type="email"
					name="email"
					id="email"
					placeholder="Ingresa tu email"
					required
					class="w-full bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg px-4 py-2.5"
				/>
			</div>
			
			<div class="space-y-1">
				<Label for="password" class="text-gray-700 font-semibold mb-1 block">Contraseña</Label>
				<Input
					type="password"
					name="password"
					id="password"
					placeholder="Ingresa tu contraseña"
					required
					class="w-full bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg px-4 py-2.5"
				/>
			</div>

			<!-- Mensaje de error -->
			{#if errorMessage?.length > 0}
				<div class="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
					<p class="text-red-600 text-sm text-center">{errorMessage}</p>
				</div>
			{/if}

			<!-- Botón de login -->
			<button
				type="submit"
				disabled={sending}
				class="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow hover:shadow-lg flex items-center justify-center space-x-2"
			>
				{#if sending}
					<Spinner class="w-5 h-5 text-white" />
					<span>Ingresando...</span>
				{:else}
					<span>Ingresar al Sistema</span>
				{/if}
			</button>
		</form>
	</div>
</div>

{#if successMessage.length > 0}
	<Toast type="success" dismissible={true} showToast={true} bind:successMessage />
{/if}
