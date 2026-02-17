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

	const sedeOptions = [
		{ name: 'Barrio Norte', value: 'barrio_norte' },
		{ name: 'Adrogué', value: 'adrogue' },
		{ name: 'Martínez', value: 'martinez' },
		{ name: 'Sede Virtual', value: 'sede_virtual' }
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
		<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Formulario para LCB</h2>
		<p class="mt-2 text-center text-sm text-gray-600">
			Invitado por <span class="font-medium text-blue-600">{referrer?.name}</span>
		</p>
	</div>

	<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-3xl">
		<div class="bg-white py-2 px-6 shadow sm:rounded-lg sm:px-10">
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

					<div class="border border-[#0C2C65] rounded-lg p-6 bg-gray-50">
						<h3 class="text-lg font-semibold text-[#0C2C65] mb-4 pb-2 border-b border-[#0C2C65]/20">
							Datos de Identificación y Origen
						</h3>

						<div class="space-y-4">
							<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
									<Label for="dni" class="block text-sm font-medium text-gray-700">DNI</Label>
									<div class="mt-1">
										<Input
											id="dni"
											name="dni"
											type="text"
											class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
										/>
									</div>
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

							<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div>
									<Label for="birth_date" class="block text-sm font-medium text-gray-700">
										Fecha de Nacimiento
									</Label>
									<div class="mt-1">
										<Input
											id="birth_date"
											name="birth_date"
											type="date"
											class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
										/>
									</div>
								</div>
								<div>
									<Label for="nationality" class="block text-sm font-medium text-gray-700">
										Nacionalidad
									</Label>
									<div class="mt-1">
										<Input
											id="nationality"
											name="nationality"
											type="text"
											placeholder="Ej: Argentina"
											class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
										/>
									</div>
								</div>
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
							</div>

							<div>
								<Label for="source" class="block text-sm font-medium text-gray-700">
									¿Cómo conociste a Together?
								</Label>
								<div class="mt-1">
									<Input
										id="source"
										name="source"
										type="text"
										placeholder="Web, Redes, Mail, etc."
										class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
									/>
								</div>
							</div>
						</div>
					</div>

					<div class="border border-[#0C2C65] rounded-lg p-6 bg-gray-50">
						<h3 class="text-lg font-semibold text-[#0C2C65] mb-4 pb-2 border-b border-[#0C2C65]/20">
							Información del Alumno - Datos del Cursado
						</h3>

						<div class="space-y-4">
							<div class="flex items-center">
								<input
									id="is_liceo_student"
									name="is_liceo_student"
									type="checkbox"
									value="true"
									class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
								/>
								<Label for="is_liceo_student" class="ml-2 block text-sm text-gray-700">
									¿Actualmente es alumno del Liceo Cultural Británico (LCB)?
								</Label>
							</div>

							<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<Label for="sede" class="block text-sm font-medium text-gray-700">
										¿En qué sede estudia?
									</Label>
									<div class="mt-1">
										<select
											id="sede"
											name="sede"
											class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
										>
											<option value="" disabled selected>Selecciona una sede</option>
											{#each sedeOptions as option}
												<option value={option.value}>{option.name}</option>
											{/each}
										</select>
									</div>
								</div>

								<div>
									<Label for="current_level" class="block text-sm font-medium text-gray-700">
										¿En qué curso está actualmente?
									</Label>
									<div class="mt-1">
										<Input
											id="current_level"
											name="current_level"
											type="text"
											placeholder="Ej: Advanced 1, Level 7"
											class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
										/>
									</div>
								</div>
							</div>

							<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<Label for="last_course_year" class="block text-sm font-medium text-gray-700">
										¿En qué año cursó por última vez en el Liceo?
									</Label>
									<div class="mt-1">
										<Input
											id="last_course_year"
											name="last_course_year"
											type="number"
											placeholder="2024"
											class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
										/>
									</div>
								</div>

								<div>
									<Label for="last_course" class="block text-sm font-medium text-gray-700">
										¿Cuál fue el último nivel que cursó?
									</Label>
									<div class="mt-1">
										<Input
											id="last_course"
											name="last_course"
											type="text"
											placeholder="Ej: Beginners 2"
											class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
										/>
									</div>
								</div>
							</div>

							<div class="flex items-center">
								<input
									id="completed_level"
									name="completed_level"
									type="checkbox"
									value="true"
									class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
								/>
								<Label for="completed_level" class="ml-2 block text-sm text-gray-700">
									¿Completó el nivel?
								</Label>
							</div>

							<div>
								<Label for="program" class="block text-sm font-medium text-gray-700">
									Programa de Interés
								</Label>
								<div class="mt-1">
									<select
										id="program"
										name="program"
										class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
