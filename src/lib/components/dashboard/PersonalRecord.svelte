<script lang="ts">
    import { createEventDispatcher } from "svelte";
	export let data: any = {};

    const dispatch = createEventDispatcher();

	let showModal = true;
	let isEditing = false;

	function closeModal() {
        dispatch('close');
		showModal = false;
	}

	function toggleEdit() {
		isEditing = !isEditing;
	}

	function handleSave() {
		// Aquí puedes agregar la lógica para guardar los datos
		isEditing = false;
		// dispatch('save', { data });
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
					<svg class="w-6 h-6 bg-[#1e3a5f] text-white rounded rounded-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<!-- Formulario centrado -->
			<div class="bg-white rounded-lg p-6 space-y-6 max-w-3xl mx-auto overflow-y-auto flex-1">
				<!-- A. Datos del alumno -->
				<div>
					<h3 class="text-[#1e3a5f] font-semibold mb-4">A. Datos del alumno</h3>
					<div class="grid grid-cols-2 gap-4">
						<input
							type="text"
							placeholder="Nombre completo"
							value={data.full_name || ''}
							disabled={!isEditing}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
						<input
							type="text"
							placeholder="DNI"
							value={data.dni || ''}
							disabled={!isEditing}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
						<input
							type="text"
							placeholder="Fecha de nacimiento"
							value={data.birthDate || ''}
							disabled={!isEditing}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
						<input
							type="text"
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
							placeholder="Nombre completo"
							value={data.parentName || ''}
							disabled={!isEditing}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
						<select disabled={!isEditing} class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed">
							<option value={data.relationshipType || ''}>
								{data.relationshipType || 'Relación con el alumno'}
							</option>
						</select>
						<input
							type="text"
							placeholder="Email"
							value={data.parentEmail || ''}
							disabled={!isEditing}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
						<input
							type="text"
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
						<select disabled={!isEditing} class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed">
							<option>¿Es alumno del Liceo / instituto?</option>
						</select>
						<select disabled={!isEditing} class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed">
							<option>Nivel actual</option>
						</select>
						<input
							type="text"
							placeholder="Sede"
							disabled={!isEditing}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
						<input
							type="text"
							placeholder="Último curso realizado"
							disabled={!isEditing}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
						<input
							type="text"
							placeholder="Año en que cursó por última vez"
							disabled={!isEditing}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
						<input
							type="text"
							placeholder="¿Completó el nivel?"
							disabled={!isEditing}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
					</div>
				</div>

				<!-- D. Información del programa contratado -->
				<div>
					<h3 class="text-[#1e3a5f] font-semibold mb-4">D. Información del programa contratado</h3>
					<div class="grid grid-cols-2 gap-4">
						<select disabled={!isEditing} class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed">
							<option value={data.programType || ''}>
								{data.programType || 'Tipo de programa'}
							</option>
						</select>
						<select disabled={!isEditing} class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed">
							<option value={data.school || ''}>
								{data.school || 'Colegio o institución'}
							</option>
						</select>
						<input
							type="text"
							placeholder="Responsable asignado"
							value={data.assigned_to ? `${data.assigned_to.firstname} ${data.assigned_to.lastname}` : ''}
							disabled={!isEditing}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
						<input
							type="text"
							placeholder="Producto asociado"
							value={data.product || ''}
							disabled={!isEditing}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
					</div>
				</div>

				<!-- E. Información médica -->
				<div>
					<h3 class="text-[#1e3a5f] font-semibold mb-4">E. Información médica</h3>
					<div class="grid grid-cols-2 gap-4">
						<select disabled={!isEditing} class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed">
							<option>Dieta especial</option>
						</select>
						<input
							type="text"
							placeholder="Alergias"
							disabled={!isEditing}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
						<input
							type="text"
							placeholder="Condiciones preexistentes"
							disabled={!isEditing}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
						<input
							type="text"
							placeholder="Enfermedades actuales"
							disabled={!isEditing}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
						<input
							type="text"
							placeholder="Observacion para el equipo de TOGETHER"
							disabled={!isEditing}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
                        <input
							type="text"
							placeholder="¿Requiere Medicacion?"
							disabled={!isEditing}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
					</div>
				</div>

				<!-- F. Datos de facturación -->
				<div>
					<h3 class="text-[#1e3a5f] font-semibold mb-4">F. Datos de facturación</h3>
					<div class="grid grid-cols-2 gap-4">
						<select disabled={!isEditing} class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed">
							<option>Tipo de factura</option>
						</select>
						<input
							type="text"
							placeholder="Razón social"
							disabled={!isEditing}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
						<input
							type="text"
							placeholder="CUIT / CUIL"
							disabled={!isEditing}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
						<input
							type="text"
							placeholder="Dirección completa"
							disabled={!isEditing}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
						<input
							type="text"
							placeholder="Sueldo"
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
							placeholder="DNI del alumno"
							disabled={!isEditing}
							class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
						/>
					</div>
				</div>

				<!-- Botones de acción -->
				<div class="flex gap-4 justify-center pt-4 border-t border-gray-200">
					{#if !isEditing}
						<button
							on:click={toggleEdit}
							class="px-8 py-2 bg-[#4D6591] hover:bg-[#3d5275] text-white rounded-full font-medium transition-colors"
						>
							Editar
						</button>
					{:else}
						<button
							on:click={toggleEdit}
							class="px-8 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-full font-medium transition-colors"
						>
							Cancelar
						</button>
						<button
							on:click={handleSave}
							class="px-8 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition-colors"
						>
							Guardar
						</button>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}
