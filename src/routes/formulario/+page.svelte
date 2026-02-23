<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Label, Input, Textarea } from 'flowbite-svelte';
	import Toast from '$lib/components/ui/Toast.svelte';
	import Select from 'svelte-select';

	let successMessage = '';
	let errorMessage = '';
	let selectedFile: File | null = null;
	let isSubmittingForm = false;

	let formData: {
		full_name: string;
		email: string;
		phone: string;
		city: string;
		age: string;
		programa: { label: string; value: string } | null;
		contactMethod: { label: string; value: string } | null;
		objective: string;
		consultation: string;
	} = {
		full_name: '',
		email: '',
		phone: '',
		city: '',
		age: '',
		programa: null,
		contactMethod: null,
		objective: '',
		consultation: ''
	};

	const programOptions = [
		{ label: 'Tutoría', value: 'tutoria' },
		{ label: 'Individuales', value: 'individuales' },
		{ label: 'Grupos', value: 'grupos' }
	];

	const contactMethods = [
		{ label: 'Instagram', value: 'instagram' },
		{ label: 'Facebook', value: 'facebook' },
		{ label: 'Google', value: 'google' },
		{ label: 'Referido', value: 'referido' },
		{ label: 'Otro', value: 'otro' }
	];

	function handleFileSelect(e: Event) {
		const input = e.target as HTMLInputElement;
		const files = input?.files;
		selectedFile = files && files.length > 0 ? files[0] : null;
	}

	async function createFormHandler() {
		return async ({ result, update }: any) => {
			isSubmittingForm = false;

			if (result.type === 'success') {
				successMessage = 'Formulario guardado correctamente';
				// Resetear formulario
				formData = {
					full_name: '',
					email: '',
					phone: '',
					city: '',
					age: '',
					programa: null,
					contactMethod: null,
					objective: '',
					consultation: ''
				};
				selectedFile = null;
				await update();
			} else {
				errorMessage = result?.data?.error ?? 'Error al guardar el formulario';
			}
		};
	}
</script>

<svelte:head>
	<title>Formulario - Together</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
	<div class="max-w-2xl mx-auto">
		<div class="bg-white rounded-lg shadow-lg p-8">
			<form
				enctype="multipart/form-data"
				method="POST"
				action="?/createLead"
				use:enhance={createFormHandler}
				on:submit={() => (isSubmittingForm = true)}
				class="space-y-6"
			>
				<div class="flex items-center justify-center">
					<h3 class="text-2xl font-bold text-gray-900">Formulario Inicial</h3>
				</div>

				<hr class="text-gray-300" />

				<!-- Nombre y Apellido -->
				<div>
					<Label for="full_name" class="mb-3 block">
						<span class="text-gray-700">Nombre y apellido</span>
						<span class="text-red-600">*</span>
					</Label>
					<Input
						id="full_name"
						name="full_name"
						type="text"
						bind:value={formData.full_name}
						required
						disabled={isSubmittingForm}
						class="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100"
					/>
				</div>

				<!-- Email -->
				<div>
					<Label for="email" class="mb-3 block">
						<span class="text-gray-700">Email</span>
					</Label>
					<Input
						id="email"
						name="email"
						type="email"
						bind:value={formData.email}
						disabled={isSubmittingForm}
						class="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100"
					/>
				</div>

				<!-- Teléfono / WhatsApp -->
				<div>
					<Label for="phone" class="mb-3 block">
						<span class="text-gray-700">Teléfono / WhatsApp</span>
					</Label>
					<Input
						id="phone"
						name="phone"
						type="tel"
						bind:value={formData.phone}
						disabled={isSubmittingForm}
						class="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100"
					/>
				</div>

				<!-- Ciudad / Localidad -->
				<div>
					<Label for="city" class="mb-3 block">
						<span class="text-gray-700">Ciudad / Localidad</span>
					</Label>
					<Input
						id="city"
						name="city"
						type="text"
						bind:value={formData.city}
						disabled={isSubmittingForm}
						class="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100"
					/>
				</div>

				<!-- Edad -->
				<div>
					<Label for="age" class="mb-3 block">
						<span class="text-gray-700">Edad</span>
					</Label>
					<Input
						id="age"
						name="age"
						type="number"
						bind:value={formData.age}
						disabled={isSubmittingForm}
						class="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100"
					/>
				</div>
				<div>
						<Label for="programa" class="mb-3 block">
							<span class="text-gray-700">Programa de interés</span>
						</Label>
						<Select
							id="programa"
							items={programOptions}
							bind:value={formData.programa}
							placeholder="Elegir"
							clearable={false}
							disabled={isSubmittingForm}
							class="w-full"
						/>
				</div>
				<!-- Objetivo del viaje de estudio -->
				<div>
					<Label for="objective" class="mb-3 block">
						<span class="text-gray-700">¿Cuál es el objetivo del viaje de estudio?</span>
					</Label>
					<Input
						id="objective"
						name="objective"
						type="text"
						bind:value={formData.objective}
						disabled={isSubmittingForm}
						class="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100"
					/>
				</div>

				<!-- Consulta / Comentarios -->
				<div>
					<Label for="consultation" class="mb-3 block">
						<span class="text-gray-700">Consulta / Comentarios</span>
					</Label>
					<Textarea
						id="consultation"
						name="consultation"
						bind:value={formData.consultation}
						rows={4}
						disabled={isSubmittingForm}
						class="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100"
					/>
				</div>

				<!-- Botones -->
				<div class="flex gap-4 justify-end pt-4">
					<Button
						type="button"
						color="alternative"
						disabled={isSubmittingForm}
						class="px-6"
					>
						Cancelar
					</Button>
					<Button
						type="submit"
						color="green"
						disabled={isSubmittingForm || !formData.full_name}
						class="px-6"
					>
						{isSubmittingForm ? 'Enviando...' : 'Enviar'}
					</Button>
				</div>

				<!-- Hidden inputs para los valores de select -->
				<input type="hidden" name="program" value={formData.programa?.value ?? ''} />
				<input type="hidden" name="source" value={formData.contactMethod?.value ?? ''} />
			</form>
		</div>
	</div>
</div>

{#if successMessage.length > 0}
	<Toast type="success" dismissible={true} showToast={true} bind:successMessage />
{/if}

{#if errorMessage.length > 0}
	<Toast type="error" dismissible={true} showToast={true} bind:successMessage={errorMessage} />
{/if}
