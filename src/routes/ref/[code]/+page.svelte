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
	let passportFileId: number | null = null;
	let isUploadingFile = false;
	let uploadError = '';
	// se ejecuta cuando el formulario fue enviado con exito
	$: if (form?.success) {
		successMessage = '¡Formulario enviado con éxito! Ya puedes cerrar esta ventana.';
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

	const monthOptions = [
		{ name: 'Enero', value: 'Enero' },
		{ name: 'Febrero', value: 'Febrero' },
		{ name: 'Marzo', value: 'Marzo' },
		{ name: 'Abril', value: 'Abril' },
		{ name: 'Mayo', value: 'Mayo' },
		{ name: 'Junio', value: 'Junio' },
		{ name: 'Julio', value: 'Julio' },
		{ name: 'Agosto', value: 'Agosto' },
		{ name: 'Septiembre', value: 'Septiembre' },
		{ name: 'Octubre', value: 'Octubre' },
		{ name: 'Noviembre', value: 'Noviembre' },
		{ name: 'Diciembre', value: 'Diciembre' }
	];

	const yearOptions = [
		{ name: '2025', value: 2025 },
		{ name: '2026', value: 2026 },
		{ name: '2027', value: 2027 },
		{ name: '2028', value: 2028 }
	];

	function handleSubmit() {
		isSubmitting = true;
		return async ({ update }: any) => {
			isSubmitting = false;
			await update();
		};
	}

	function fillTestData() {
		const fields = {
			'full_name': 'Juan Pérez García',
			'dni': '35456123',
			'email': 'juan.perez@email.com',
			'phone': '+54 11 4567-8901',
			'birth_date': '2005-03-15',
			'nationality': 'Argentina',
			'city': 'Buenos Aires',
			'source': 'Redes Sociales',
			'current_level': 'Advanced 1',
			'last_course_year': '2024',
			'last_course': 'Level 7',
			'objective': 'Mejorar mi inglés para estudios universitarios en el exterior',
			'passport_number': 'AA123456',
			'passport_validity': '2030-06-15',
			'parent_full_name': 'María García',
			'parent_relation': 'Madre',
			'parent_email': 'maria.garcia@email.com',
			'parent_phone': '+54 11 9876-5432',
			'special_diet': '',
			'preexisting_conditions': 'Alergia a maní - reacción leve',
			'medical_observations': ''
		};

		Object.entries(fields).forEach(([id, value]) => {
			const element = document.getElementById(id) as HTMLInputElement;
			if (element) element.value = value;
		});

		const isLiceoStudent = document.getElementById('is_liceo_student') as HTMLInputElement;
		if (isLiceoStudent) isLiceoStudent.checked = true;

		const completedLevel = document.getElementById('completed_level') as HTMLInputElement;
		if (completedLevel) completedLevel.checked = true;

		const sede = document.getElementById('sede') as HTMLSelectElement;
		if (sede) sede.value = 'barrio_norte';

		const program = document.getElementById('program') as HTMLSelectElement;
		if (program) program.value = 'tutoria';

		const estimatedTravelMonth = document.getElementById(
			'estimated_travel_month'
		) as HTMLSelectElement;
		if (estimatedTravelMonth) estimatedTravelMonth.value = 'Julio';

		const estimatedTravelYear = document.getElementById(
			'estimated_travel_year'
		) as HTMLSelectElement;
		if (estimatedTravelYear) estimatedTravelYear.value = '2026';

		const requiresMedication = document.getElementById('requires_medication') as HTMLInputElement;
		if (requiresMedication) requiresMedication.checked = false;

		const isSmoker = document.getElementById('is_smoker') as HTMLInputElement;
		if (isSmoker) isSmoker.checked = false;
	}

	async function handlePassportFileUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (!file) {
			passportFileId = null;
			return;
		}

		// Validar tamaño (máximo 5MB)
		const maxSize = 5 * 1024 * 1024; // 5MB
		if (file.size > maxSize) {
			uploadError = 'El archivo no debe superar los 5MB';
			input.value = '';
			return;
		}

		// Validar tipo de archivo
		const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
		if (!allowedTypes.includes(file.type)) {
			uploadError = 'Formato no válido. Use JPG, PNG o PDF';
			input.value = '';
			return;
		}

		isUploadingFile = true;
		uploadError = '';

		try {
			const formData = new FormData();
			formData.append('file', file);

			const response = await fetch('/api/files/upload', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error('Error al subir el archivo');
			}

			const result = await response.json();
			passportFileId = result.id;
		} catch (error) {
			uploadError = 'Error al subir la foto del pasaporte. Intente nuevamente.';
			passportFileId = null;
			input.value = '';
		} finally {
			isUploadingFile = false;
		}
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
				<form
					class="space-y-6"
					method="POST"
					use:enhance={handleSubmit}
					enctype="multipart/form-data"
				>
					<input type="hidden" name="referral_code" value={referralCode} />
					<input type="hidden" name="passport_file_id" value={passportFileId || ''} />

					<div class="flex justify-end">
						<button
							type="button"
							on:click={fillTestData}
							class="text-xs text-gray-500 hover:text-blue-600 underline"
						>
							Llenar datos de prueba
						</button>
					</div>

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
						</div>
					</div>

					<div class="border border-[#0C2C65] rounded-lg p-6 bg-gray-50">
						<h3 class="text-lg font-semibold text-[#0C2C65] mb-4 pb-2 border-b border-[#0C2C65]/20">
							Planificación del Viaje
						</h3>

						<div class="space-y-4">
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

							<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<Label class="block text-sm font-medium text-gray-700">
										Mes y año estimado del viaje
									</Label>
									<div class="mt-1 grid grid-cols-2 gap-2">
										<select
											id="estimated_travel_month"
											name="estimated_travel_month"
											class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
										>
											<option value="" disabled selected>Mes</option>
											{#each monthOptions as option}
												<option value={option.value}>{option.name}</option>
											{/each}
										</select>
										<select
											id="estimated_travel_year"
											name="estimated_travel_year"
											class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
										>
											<option value="" disabled selected>Año</option>
											{#each yearOptions as option}
												<option value={option.value}>{option.name}</option>
											{/each}
										</select>
									</div>
								</div>

								<div>
									<Label for="passport_number" class="block text-sm font-medium text-gray-700">
										Número de pasaporte
									</Label>
									<div class="mt-1">
										<Input
											id="passport_number"
											name="passport_number"
											type="text"
											placeholder="AA123456"
											class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
										/>
									</div>
								</div>
							</div>

							<div>
								<Label for="passport_validity" class="block text-sm font-medium text-gray-700">
									Validez del pasaporte
								</Label>
								<div class="mt-1">
									<Input
										id="passport_validity"
										name="passport_validity"
										type="date"
										class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
									/>
								</div>
							</div>

							<div>
								<Label for="passport_file" class="block text-sm font-medium text-gray-700">
									Foto del pasaporte
								</Label>
								<div class="mt-1">
									<input
										id="passport_file"
										name="passport_file"
										type="file"
										accept="image/jpeg,image/png,image/jpg,application/pdf"
										on:change={handlePassportFileUpload}
										disabled={isUploadingFile}
										class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#0C2C65] hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
									/>
								</div>
								{#if isUploadingFile}
									<p class="mt-1 text-xs text-blue-600 flex items-center">
										<svg
											class="animate-spin -ml-1 mr-2 h-3 w-3 text-blue-600"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												class="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												stroke-width="4"
											></circle>
											<path
												class="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											></path>
										</svg>
										Subiendo archivo...
									</p>
								{/if}
								{#if uploadError}
									<p class="mt-1 text-xs text-red-600">{uploadError}</p>
								{/if}
								{#if passportFileId}
									<p class="mt-1 text-xs text-green-600">✓ Archivo subido correctamente</p>
								{/if}
								<p class="mt-1 text-xs text-gray-400">Formatos: JPG, PNG, PDF (máx. 5MB)</p>
							</div>
						</div>
					</div>

				<div class="border border-[#0C2C65] rounded-lg p-6 bg-gray-50">
					<h3 class="text-lg font-semibold text-[#0C2C65] mb-4 pb-2 border-b border-[#0C2C65]/20">
						Datos del Tutor o Responsable
					</h3>

					<div class="space-y-4">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<Label for="parent_full_name" class="block text-sm font-medium text-gray-700">
									Apellido y nombre del padre, madre o tutor
								</Label>
								<div class="mt-1">
									<Input
										id="parent_full_name"
										name="parent_full_name"
										type="text"
										class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
									/>
								</div>
							</div>

							<div>
								<Label for="parent_relation" class="block text-sm font-medium text-gray-700">
									Parentesco con el menor de edad
								</Label>
								<div class="mt-1">
									<Input
										id="parent_relation"
										name="parent_relation"
										type="text"
										placeholder="Ej: Padre, Madre, Tutor legal"
										class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
									/>
								</div>
							</div>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<Label for="parent_email" class="block text-sm font-medium text-gray-700">
									Correo electrónico del tutor
								</Label>
								<div class="mt-1">
									<Input
										id="parent_email"
										name="parent_email"
										type="email"
										class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
									/>
								</div>
							</div>

							<div>
								<Label for="parent_phone" class="block text-sm font-medium text-gray-700">
									Teléfono del tutor
								</Label>
								<div class="mt-1">
									<Input
										id="parent_phone"
										name="parent_phone"
										type="tel"
										class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="border border-[#0C2C65] rounded-lg p-6 bg-gray-50">
					<h3 class="text-lg font-semibold text-[#0C2C65] mb-4 pb-2 border-b border-[#0C2C65]/20">
						Información Médica
					</h3>

					<div class="space-y-4">
						<div>
							<Label for="special_diet" class="block text-sm font-medium text-gray-700">
								Dietas especiales o vegetarianas
							</Label>
							<div class="mt-1">
								<Input
									id="special_diet"
									name="special_diet"
									type="text"
									placeholder="Ej: Vegetariano, Sin gluten, etc."
									class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
								/>
							</div>
						</div>

						<div>
							<Label for="preexisting_conditions" class="block text-sm font-medium text-gray-700">
								Patologías, Alergias y condiciones médicas preexistentes
							</Label>
							<div class="mt-1">
								<Textarea
									id="preexisting_conditions"
									name="preexisting_conditions"
									rows={3}
									placeholder="Describa cualquier condición médica relevante..."
									class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
								/>
							</div>
						</div>

						<div class="flex items-center">
							<input
								id="requires_medication"
								name="requires_medication"
								type="checkbox"
								value="true"
								class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
							/>
							<Label for="requires_medication" class="ml-2 block text-sm text-gray-700">
								¿Requiere medicación?
							</Label>
						</div>

						<div>
							<Label for="medical_observations" class="block text-sm font-medium text-gray-700">
								Especificar nombre y dosis de la medicación
							</Label>
							<div class="mt-1">
								<Textarea
									id="medical_observations"
									name="medical_observations"
									rows={2}
									placeholder="Nombre del medicamento, dosis, frecuencia..."
									class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
								/>
							</div>
						</div>

						<div class="flex items-center">
							<input
								id="is_smoker"
								name="is_smoker"
								type="checkbox"
								value="true"
								class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
							/>
							<Label for="is_smoker" class="ml-2 block text-sm text-gray-700">
								¿Fuma?
							</Label>
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
				<div class="mt-8">
					<Toast type="error" showToast={true} successMessage={errorMessage} />
				</div>
			{/if}
		</div>
	</div>
</div>
