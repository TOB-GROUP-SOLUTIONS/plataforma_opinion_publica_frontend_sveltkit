<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { enhance } from '$app/forms';
	export let data: any = {};

	const dispatch = createEventDispatcher();

	let showModal = true;
	let isEditing = false;
	let isSaving = false;
	export const users: any = {};

	// Variables locales para los selects (necesario para que bind:value funcione en Svelte)
	let parent_relation = data.parent_relation ?? '';
	let is_liceo_student = data.is_liceo_student ?? '';
	let current_level = data.current_level ?? '';
	let completed_level = data.completed_level ?? '';
	let program_type = data.program_type ?? '';
	let institution = data.institution ?? '';
	let requires_medication = data.requires_medication ?? '';
	let invoice_type = data.invoice_type ?? '';

	function closeModal() {
		dispatch('close');
		showModal = false;
	}

	function toggleEdit() {
		isEditing = !isEditing;
	}
</script>

{#if showModal}
	<!-- Fondo celeste -->
	<div class="fixed inset-0 bg-opacity-40 z-50"></div>

	<!-- Div centrado con fondo celeste -->
	<div class="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-hidden">
		<div class="bg-[#ecf3f9] rounded-lg shadow-xl max-w-5xl w-full p-6 h-[90vh] flex flex-col">
			<!-- Header -->
			<div class="relative flex justify-center items-center mb-8">
				<h2 class="text-2xl font-semibold text-[#1e3a5f]">FICHA PERSONAL</h2>
				<button
					on:click={closeModal}
					class="absolute right-0 text-[#1e3a5f] hover:text-gray-700 transition-colors"
				>
					<svg
						class="w-6 h-6 bg-[#1e3a5f] text-white rounded rounded-full"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<!-- Formulario centrado -->
			<form
				method="POST"
				action="?/savePersonalRecord"
				use:enhance={() => {
					isSaving = true;
					return async ({ result }) => {
						isSaving = false;
						if (result.type === 'success') {
							isEditing = false;
							dispatch('save');
						}
					};
				}}
				class="bg-white rounded-lg p-6 space-y-6 max-w-3xl mx-auto overflow-y-auto flex-1"
			>
				<input type="hidden" name="lead_id" value={data.id || ''} />
				<!-- Inputs hidden para selects (los disabled no se envían en el form) -->
				<input type="hidden" name="parent_relation" value={parent_relation} />
				<input type="hidden" name="is_liceo_student" value={is_liceo_student === true ? 'true' : is_liceo_student === false ? 'false' : ''} />
				<input type="hidden" name="current_level" value={current_level} />
				<input type="hidden" name="completed_level" value={completed_level === true ? 'true' : completed_level === false ? 'false' : ''} />
				<input type="hidden" name="program_type" value={program_type} />
				<input type="hidden" name="institution" value={institution} />
				<input type="hidden" name="requires_medication" value={requires_medication === true ? 'true' : requires_medication === false ? 'false' : ''} />
				<input type="hidden" name="invoice_type" value={invoice_type} />
				<!-- A. Datos del alumno -->
				<div>
					<h3 class="text-[#1e3a5f] font-semibold mb-4">A. Datos del alumno</h3>
					<div class="grid grid-cols-2 gap-4">
						<input
							type="text"
							name="full_name"
							placeholder="Nombre completo"
							value={data.full_name || ''}
							disabled={!isEditing}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
						<input
							type="text"
							name="dni"
							placeholder="DNI"
							value={data.dni || ''}
							disabled={!isEditing}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
						<input
							type="date"
							name="birth_date"
							placeholder="Fecha de nacimiento"
							value={data.birth_date ? data.birth_date.toString().slice(0, 10) : ''}
							disabled={!isEditing}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
						<input
							type="text"
							name="email"
							placeholder="Email del alumno"
							value={data.email || ''}
							disabled={!isEditing}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
					</div>
				</div>

				<!-- B. Datos del padre/madre/tutor -->
				<div>
					<h3 class="text-[#1e3a5f] font-semibold mb-4">B. Datos del padre/madre/tutor</h3>
					<div class="grid grid-cols-2 gap-4">
						<input
							type="text"
							name="parent_full_name"
							placeholder="Nombre completo"
							value={data.parent_full_name || ''}
							disabled={!isEditing}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
						<select
							name="parent_relation"
							disabled={!isEditing}
							bind:value={parent_relation}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						>
							<option value="">Relación con el alumno</option>
							<option value="Padre">Padre</option>
							<option value="Madre">Madre</option>
							<option value="Tutor">Tutor</option>
							<option value="Tutora">Tutora</option>
							<option value="Abuelo">Abuelo</option>
							<option value="Abuela">Abuela</option>
							<option value="Otro">Otro</option>
						</select>
						<input
							type="text"
							name="parent_email"
							placeholder="Email"
							value={data.parent_email || ''}
							disabled={!isEditing}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
						<input
							type="text"
							name="phone"
							placeholder="Teléfono"
							value={data.phone || ''}
							disabled={!isEditing}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
					</div>
				</div>

				<!-- C. Información académica -->
				<div>
					<h3 class="text-[#1e3a5f] font-semibold mb-4">C. Información académica</h3>
					<div class="grid grid-cols-2 gap-4">
						<select
							name="is_liceo_student"
							disabled={!isEditing}
							bind:value={is_liceo_student}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						>
							<option value="">¿Es alumno del Liceo / instituto?</option>
							<option value={true}>Sí</option>
							<option value={false}>No</option>
						</select>
						<select
							name="current_level"
							disabled={!isEditing}
							bind:value={current_level}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						>
							<option value="">Nivel actual</option>
							<option value="Primaria">Primaria</option>
							<option value="Secundaria">Secundaria</option>
							<option value="Terciario">Terciario</option>
							<option value="Universitario">Universitario</option>
							<option value="Otro">Otro</option>
						</select>
						<input
							type="text"
							name="sede"
							placeholder="Sede"
							value={data.sede || ''}
							disabled={!isEditing}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
						<input
							type="text"
							name="last_course"
							placeholder="Último curso realizado"
							value={data.last_course || ''}
							disabled={!isEditing}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
						<input
							type="number"
							name="last_course_year"
							placeholder="Año en que cursó por última vez"
							value={data.last_course_year || ''}
							disabled={!isEditing}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
						<select
							name="completed_level"
							disabled={!isEditing}
							bind:value={completed_level}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						>
							<option value="">¿Completó el nivel?</option>
							<option value={true}>Sí</option>
							<option value={false}>No</option>
						</select>
					</div>
				</div>

				<!-- D. Información del programa contratado -->
				<div>
					<h3 class="text-[#1e3a5f] font-semibold mb-4">D. Información del programa contratado</h3>
					<div class="grid grid-cols-2 gap-4">
						<select
							name="program_type"
							disabled={!isEditing}
							bind:value={program_type}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						>
							<option value="">Tipo de programa</option>
							<option value="Tutoría">Tutoría</option>
							<option value="Grupo">Grupo</option>
							<option value="Individual">Individual</option>
						</select>
						<select
							name="institution"
							disabled={!isEditing}
							bind:value={institution}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						>
							<option value="">Colegio o institución</option>
							<option value="Liceo Británico">Liceo Británico</option>
							<option value="Instituto Cambridge">Instituto Cambridge</option>
						</select>
						<input
							type="text"
							name="assigned_to"
							placeholder="Responsable asignado"
							value={data.assigned_to_user_id
								? `${data.assigned_to_user_id.firstname} ${data.assigned_to_user_id.lastname}`
								: ''}
							disabled={true}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
						<input
							type="text"
							name="associated_product"
							placeholder="Producto asociado"
							value={data.associated_product || ''}
							disabled={!isEditing}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
					</div>
				</div>

				<!-- E. Información médica -->
				<div>
					<h3 class="text-[#1e3a5f] font-semibold mb-4">E. Información médica</h3>
					<div class="grid grid-cols-2 gap-4">
						<input
							type="text"
							name="special_diet"
							placeholder="Dieta especial"
							value={data.special_diet || ''}
							disabled={!isEditing}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
						<input
							type="text"
							name="allergies"
							placeholder="Alergias"
							value={data.allergies || ''}
							disabled={!isEditing}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
						<input
							type="text"
							name="preexisting_conditions"
							placeholder="Condiciones preexistentes"
							value={data.preexisting_conditions || ''}
							disabled={!isEditing}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
						<input
							type="text"
							name="current_illnesses"
							placeholder="Enfermedades actuales"
							value={data.current_illnesses || ''}
							disabled={!isEditing}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
						<input
							type="text"
							name="medical_observations"
							placeholder="Observación para el equipo de TOGETHER"
							value={data.medical_observations || ''}
							disabled={!isEditing}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
						<select
							name="requires_medication"
							disabled={!isEditing}
							bind:value={requires_medication}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						>
							<option value="">¿Requiere medicación?</option>
							<option value={true}>Sí</option>
							<option value={false}>No</option>
						</select>
					</div>
				</div>

				<!-- F. Datos de facturación -->
				<div>
					<h3 class="text-[#1e3a5f] font-semibold mb-4">F. Datos de facturación</h3>
					<div class="grid grid-cols-2 gap-4">
						<select
							name="invoice_type"
							disabled={!isEditing}
							bind:value={invoice_type}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						>
							<option value="">Tipo de factura</option>
							<option value="A">A</option>
							<option value="B">B</option>
							<option value="C">C</option>
							<option value="E">E</option>
						</select>
						<input
							type="text"
							name="business_name"
							placeholder="Razón social"
							value={data.business_name || ''}
							disabled={!isEditing}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
						<input
							type="text"
							name="cuit_cuil"
							placeholder="CUIT / CUIL"
							value={data.cuit_cuil || ''}
							disabled={!isEditing}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
						<input
							type="text"
							name="billing_address"
							placeholder="Dirección completa"
							value={data.billing_address || ''}
							disabled={!isEditing}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
						<input
							type="number"
							name="salary"
							placeholder="Sueldo"
							value={data.salary || ''}
							disabled={!isEditing}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
					</div>
				</div>

				<!-- G. Documentación requerida -->
				<div>
					<h3 class="text-[#1e3a5f] font-semibold mb-4">G. Documentación requerida</h3>
					<div class="grid grid-cols-2 gap-4">
						<input
							type="text"
							name="dni"
							placeholder="DNI del alumno"
							readonly={!isEditing}
							value={data.dni || ''}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent {!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}"
						/>
					</div>
				</div>

				<!-- Botones de acción -->
				<div class="flex gap-4 justify-center pt-4 border-t border-gray-200">
					{#if !isEditing}
						<button
							type="button"
							on:click={toggleEdit}
							class="px-8 py-2 bg-[#4D6591] hover:bg-[#3d5275] text-white rounded-full font-medium transition-colors"
						>
							Editar
						</button>
					{:else}
						<button
							type="button"
							on:click={toggleEdit}
							class="px-8 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-full font-medium transition-colors"
						>
							Cancelar
						</button>
						<button
							type="submit"
							disabled={isSaving}
							class="px-8 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
						>
							{isSaving ? 'Guardando...' : 'Guardar'}
						</button>
					{/if}
				</div>
			</form>
		</div>
	</div>
{/if}
