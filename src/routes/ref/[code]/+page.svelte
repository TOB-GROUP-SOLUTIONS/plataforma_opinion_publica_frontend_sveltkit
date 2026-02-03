<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Label, Input, Textarea } from 'flowbite-svelte';
	import Toast from '$lib/components/ui/Toast.svelte';

	export let data: any;
	export let form: any;

	$: referrer = data?.referrer;
	$: referralCode = data?.referralCode;

	let isSubmitting = false;
	let successMessage = '';
	let errorMessage = '';

	$: if (form?.success) {
		successMessage = '¡Formulario enviado con éxito!';
		isSubmitting = false;
	}
	$: if (form?.error) {
		errorMessage = form.error;
		isSubmitting = false;
	}

	const programOptions = [
		{ name: 'Tutoría', value: 'tutoria' },
		{ name: 'Individuales', value: 'individuales' },
		{ name: 'Grupos', value: 'grupos' }
	];

	function handleSubmit() {
		isSubmitting = true;
		return async ({ update }: any) => {
			isSubmitting = false;
			await update();
		};
	}
</script>

<svelte:head>
	<title>Referido por {referrer?.name || 'Together'} - Together</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Formulario de Referido</h2>
		<p class="mt-2 text-center text-sm text-gray-600">
			Invitado por <span class="font-medium text-blue-600">{referrer?.name}</span>
		</p>
	</div>

	<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
		<div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
			{#if successMessage}
				<div class="rounded-md bg-green-50 p-4 mb-4">
					<div class="flex">
						<div class="flex-shrink-0">
							<svg
								class="h-5 w-5 text-green-400"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
							>
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
						<div class="ml-3">
							<p class="text-sm font-medium text-green-800">
								{successMessage}
							</p>
						</div>
					</div>
				</div>
			{:else}
				<form class="space-y-6" method="POST" use:enhance={handleSubmit}>
					<input type="hidden" name="referral_code" value={referralCode} />

					<div>
						<Label for="full_name" class="block text-sm font-medium text-gray-700">
							Nombre y Apellido <span class="text-red-500">*</span>
						</Label>
						<div class="mt-1">
							<Input
								id="full_name"
								name="full_name"
								type="text"
								required
								class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
							/>
						</div>
					</div>

					<div>
						<Label for="email" class="block text-sm font-medium text-gray-700">Email</Label>
						<div class="mt-1">
							<Input
								id="email"
								name="email"
								type="email"
								class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
							/>
						</div>
					</div>

					<div>
						<Label for="phone" class="block text-sm font-medium text-gray-700">
							Teléfono / WhatsApp
						</Label>
						<div class="mt-1">
							<Input
								id="phone"
								name="phone"
								type="tel"
								class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
							/>
						</div>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div>
							<Label for="city" class="block text-sm font-medium text-gray-700">Ciudad</Label>
							<div class="mt-1">
								<Input
									id="city"
									name="city"
									type="text"
									class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
								/>
							</div>
						</div>
						<div>
							<Label for="age" class="block text-sm font-medium text-gray-700">Edad</Label>
							<div class="mt-1">
								<Input
									id="age"
									name="age"
									type="number"
									class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
								/>
							</div>
						</div>
					</div>

					<div>
						<Label for="program" class="block text-sm font-medium text-gray-700">
							Programa de Interés
						</Label>
						<div class="mt-1">
							<select
								id="program"
								name="program"
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
							>
								<option value="" disabled selected>Selecciona una opción</option>
								{#each programOptions as option}
									<option value={option.value}>{option.name}</option>
								{/each}
							</select>
						</div>
					</div>

					<div>
						<Label for="objective" class="block text-sm font-medium text-gray-700">
							¿Cuál es el objetivo del viaje de estudio?
						</Label>
						<div class="mt-1">
							<Input
								id="objective"
								name="objective"
								type="text"
								class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
							/>
						</div>
					</div>

					<div>
						<Label for="consultation" class="block text-sm font-medium text-gray-700">
							Consulta / Comentarios
						</Label>
						<div class="mt-1">
							<Textarea
								id="consultation"
								name="consultation"
								rows={4}
								class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
							/>
						</div>
					</div>

					<div>
						<Button
							type="submit"
							disabled={isSubmitting}
							class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0C2C65] hover:bg-[#081d45] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						>
							{isSubmitting ? 'Enviando...' : 'Enviar Consulta'}
						</Button>
					</div>
				</form>
			{/if}

			{#if errorMessage}
				<div class="mt-4">
					<Toast type="error" showToast={true} successMessage={errorMessage} />
				</div>
			{/if}
		</div>
	</div>
</div>
