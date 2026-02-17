<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	export let data: any = {};

	$: leadId = $page.params.leadId;
	console.log('Data print', data)

	$: lead = data || null;

	console.log('Lead data:', lead);

	let isSaving = false;
</script>

<div class="p-8">
	<div class="rounded-lg  max-w-5xl mx-auto p-6">
		<!-- Header -->
		<div class="relative flex justify-center items-center mb-8">
			<h2 class="text-2xl font-semibold text-[#1e3a5f]">Formulario Mas informacion</h2>
		</div>

		<!-- Formulario centrado -->
		<form
			method="POST"
			action="?/saveFormulario"
			use:enhance={() => {
				isSaving = true;
				return async ({ result }) => {
					isSaving = false;
				};
			}}
			class="bg-white rounded-lg p-6 space-y-6 mx-auto overflow-y-auto"
		>
			<input type="hidden" name="lead_id" value={leadId || ''} />
			
			<!-- A. Datos del alumno -->
			<div>
				<h3 class="text-[#1e3a5f] font-semibold mb-4">A. Datos del alumno</h3>
				<div class="grid grid-cols-2 gap-4">
					<input
						type="text"
						name="full_name"
						placeholder="Nombre completo"
						value={data?.lead?.lead?.full_name || ''}
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
					/>
					<input
						type="text"
						name="dni"
						placeholder="DNI"
						value={data?.lead?.dni || ''}
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
					/>
					<input
						type="text"
						name="birthDate"
						placeholder="Fecha de nacimiento"
						value={data?.lead?.birthDate || ''}
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
					/>
					<input
						type="text"
						name="email"
						placeholder="Email del alumno"
						value={data?.lead?.email || ''}
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
					/>
				</div>
			</div>

			<!-- B. Datos del padre/madre/tutor -->
			<div>
				<h3 class="text-[#1e3a5f] font-semibold mb-4">B. Datos del padre/madre/tutor</h3>
				<div class="grid grid-cols-2 gap-4">
					<input
						type="text"
						name="parentName"
						placeholder="Nombre completo"
						value={data?.lead?.parent_full_name || ''}
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
					/>
					<select
						name="relationshipType"
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
					>
						<option value="">Relación con el alumno</option>
						<option value="Padre" selected={data?.lead?.parent_relation === 'Padre'}>Padre</option>
						<option value="Madre" selected={data?.lead?.parent_relation === 'Madre'}>Madre</option>
						<option value="Tutor" selected={data?.lead?.parent_relation === 'Tutor'}>Tutor</option>
						<option value="Tutora" selected={data?.lead?.parent_relation === 'Tutora'}>Tutora</option>
						<option value="Abuelo" selected={data?.lead?.parent_relation === 'Abuelo'}>Abuelo</option>
						<option value="Abuela" selected={data?.lead?.parent_relation === 'Abuela'}>Abuela</option>
						<option value="Otro" selected={data?.lead?.parent_relation === 'Otro'}>Otro</option>
					</select>
					<input
						type="text"
						name="parentEmail"
						placeholder="Email"
						value={data?.lead?.parentEmail || ''}
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
					/>
					<input
						type="text"
						name="phone"
						placeholder="Teléfono"
						value={data?.lead?.phone || ''}
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
					/>
				</div>
			</div>

			<!-- C. Información académica -->
			<div>
				<h3 class="text-[#1e3a5f] font-semibold mb-4">C. Información académica</h3>
				<div class="grid grid-cols-2 gap-4">
					<select
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
					>
						<option value="">¿Es alumno del Liceo / instituto?</option>
						<option value="Sí" selected={data?.lead?.is_liceo_student === true}>Sí</option>
						<option value="No" selected={data?.lead?.is_liceo_student === false}>No</option>
					</select>
					<select
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
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
						placeholder="Sede"
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
					/>
					<input
						type="text"
						placeholder="Último curso realizado"
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
					/>
					<input
						type="text"
						placeholder="Año en que cursó por última vez"
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
					/>
					<input
						type="text"
						placeholder="¿Completó el nivel?"
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
					/>
				</div>
			</div>

			<!-- D. Información del programa contratado -->
			<div>
				<h3 class="text-[#1e3a5f] font-semibold mb-4">D. Información del programa contratado</h3>
				<div class="grid grid-cols-2 gap-4">
					<select
						name="programType"
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
					>
						<option value="">Tipo de programa</option>
						<option value="Tutoría" selected={data?.lead?.program_type === 'Tutoría'}>Tutoría</option>
						<option value="Grupo" selected={data?.lead?.program_type === 'Grupo'}>Grupo</option>
						<option value="Individual" selected={data?.lead?.program_type === 'Individual'}
							>Individual</option
						>
					</select>
					<select
						name="school"
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
					>
						<option value="">Colegio o institución</option>
						<option value="colegio" selected={data?.lead?.institution === 'Liceo Británico'}>Colegio</option>
						<option value="instituto" selected={data?.lead?.institution === 'Instituto Cambridge'}>Instituto</option>
					</select>
					<input
						type="text"
						name="assigned_to"
						placeholder="Responsable asignado"
						value={data?.lead?.assigned_to
							? `${data?.lead?.assigned_to.firstname} ${data?.lead?.assigned_to.lastname}`
							: ''}
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent bg-gray-100 cursor-not-allowed"
					/>
					<input
						type="text"
						name="product"
						placeholder="Producto asociado"
						value={data?.lead?.product || ''}
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
					/>
				</div>
			</div>

			<!-- E. Información médica -->
			<div>
				<h3 class="text-[#1e3a5f] font-semibold mb-4">E. Información médica</h3>
				<div class="grid grid-cols-2 gap-4">
					<input
						type="text"
						name="blood_type"
						placeholder="Dieta especial"
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
					/>	
					<input
						type="text"
						name="allergies"
						placeholder="Alergias"
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
					/>
					<input
						type="text"
						name="preexisting_conditions"
						placeholder="Condiciones preexistentes"
						value={data?.lead?.preexisting_conditions || ''}
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
					/>
					<input
						type="text"
						name="current_illnesses"
						placeholder="Enfermedades actuales"
						value={data?.lead?.current_illnesses || ''}
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
					/>
					<input
						type="text"
						name="medical_observations"
						placeholder="Observacion para el equipo de TOGETHER"
						value={data?.lead?.medical_observations || ''}
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
					/>
					<input
						type="text"
						name="requires_medication"
						placeholder="¿Requiere Medicacion?"
						value={data?.lead?.requires_medication || ''}
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
					/>
				</div>
			</div>

			<!-- F. Datos de facturación -->
			<div>
				<h3 class="text-[#1e3a5f] font-semibold mb-4">F. Datos de facturación</h3>
				<div class="grid grid-cols-2 gap-4">
					<select
						name="invoice_type"
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
					>
						<option value="">Tipo de factura</option>
						<option value="A" selected={lead?.invoice_type === 'A'}>A</option>
						<option value="B" selected={lead?.invoice_type === 'B'}>B</option>
						<option value="C" selected={lead?.invoice_type === 'C'}>C</option>
						<option value="E" selected={lead?.invoice_type === 'E'}>E</option>
					</select>
					<input
						type="text"
						name="business_name"
						placeholder="Razón social"
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
					/>
					<input
						type="text"
						name="cuit_cuil"
						placeholder="CUIT / CUIL"
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
					/>
					<input
						type="text"
						name="billing_address"
						placeholder="Dirección completa"
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
					/>
					<input
						type="text"
						name="salary"
						placeholder="Sueldo"
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
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
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
					/>
				</div>
			</div>

			<!-- Botones de acción -->
			<div class="flex gap-4 justify-center pt-4 border-t border-gray-200">
				<button
					type="submit"
					disabled={isSaving}
					class="px-8 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
				>
					{isSaving ? 'Enviando...' : 'Enviar'}
				</button>
			</div>
		</form>
	</div>
</div>
