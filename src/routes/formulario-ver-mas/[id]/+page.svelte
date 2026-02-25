<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	export let data: any = {};

	$: leadId = data?.lead?.id || $page.params.id;
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
						value={data?.lead?.full_name || ''}
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
						type="date"
						name="birth_date"
						value={data?.lead?.birth_date ? data.lead.birth_date.toString().slice(0, 10) : ''}
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
						name="parent_full_name"
						placeholder="Nombre completo"
						value={data?.lead?.parent_full_name || ''}
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
					/>
					<select
						name="parent_relation"
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
						name="parent_email"
						placeholder="Email"
						value={data?.lead?.parent_email || ''}
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
						name="is_liceo_student"
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
					>
						<option value="">¿Es alumno del Liceo / instituto?</option>
						<option value="true" selected={data?.lead?.is_liceo_student === true}>Sí</option>
						<option value="false" selected={data?.lead?.is_liceo_student === false}>No</option>
					</select>
					<select
						name="current_level"
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
					>
						<option value="">Nivel actual</option>
						<option value="Primaria" selected={data?.lead?.current_level === 'Primaria'}>Primaria</option>
						<option value="Secundaria" selected={data?.lead?.current_level === 'Secundaria'}>Secundaria</option>
						<option value="Terciario" selected={data?.lead?.current_level === 'Terciario'}>Terciario</option>
						<option value="Universitario" selected={data?.lead?.current_level === 'Universitario'}>Universitario</option>
						<option value="Otro" selected={data?.lead?.current_level === 'Otro'}>Otro</option>
					</select>
					<input
						type="text"
						name="sede"
						placeholder="Sede"
						value={data?.lead?.sede || ''}
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
					/>
					<input
						type="text"
						name="last_course"
						placeholder="Último curso realizado"
						value={data?.lead?.last_course || ''}
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
					/>
					<input
						type="number"
						name="last_course_year"
						placeholder="Año en que cursó por última vez"
						value={data?.lead?.last_course_year || ''}
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
					/>
					<select
						name="completed_level"
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
					>
						<option value="">¿Completó el nivel?</option>
						<option value="true" selected={data?.lead?.completed_level === true}>Sí</option>
						<option value="false" selected={data?.lead?.completed_level === false}>No</option>
					</select>
				</div>
			</div>

			<!-- D. Información del programa contratado -->
			<div>
				<h3 class="text-[#1e3a5f] font-semibold mb-4">D. Información del programa contratado</h3>
				<div class="grid grid-cols-2 gap-4">
					<select
						name="program_type"
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
						name="institution"
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
					>
						<option value="">Colegio o institución</option>
						<option value="Liceo Británico" selected={data?.lead?.institution === 'Liceo Británico'}>Liceo Británico</option>
						<option value="Instituto Cambridge" selected={data?.lead?.institution === 'Instituto Cambridge'}>Instituto Cambridge</option>
					</select>
					<input
						type="text"
						name="assigned_to"
						placeholder="Responsable asignado"
						value={data?.lead?.assigned_to_user_id
							? `${data?.lead?.assigned_to_user_id.firstname} ${data?.lead?.assigned_to_user_id.lastname}`
							: ''}
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent bg-gray-100 cursor-not-allowed"
					/>
					<input
						type="text"
						name="associated_product"
						disabled
						placeholder="Producto asociado"
						value={data?.lead?.product || ''}
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent bg-gray-100 cursor-not-allowed"
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
						value={data?.lead?.special_diet || ''}
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
					/>
					<input
						type="text"
						name="allergies"
						placeholder="Alergias"
						value={data?.lead?.allergies || ''}
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
						placeholder="Observación para el equipo de TOGETHER"
						value={data?.lead?.medical_observations || ''}
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
					/>
					<select
						name="requires_medication"
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
					>
						<option value="">¿Requiere medicación?</option>
						<option value="true" selected={data?.lead?.requires_medication === true}>Sí</option>
						<option value="false" selected={data?.lead?.requires_medication === false}>No</option>
					</select>
				</div>
			</div>

			<!-- F. Datos de facturación -->
			<div>
				<h3 class="text-[#1e3a5f] font-semibold mb-4">F. Datos de facturación</h3>
				<div class="grid grid-cols-2 gap-4">
					<select
						name="invoice_type"
						value={data?.lead?.invoice_type || ''}
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
						value={data?.lead?.business_name || ''}	
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
					/>
					<input
						type="text"
						name="cuit_cuil"
						value={data?.lead?.cuit_cuil || ''}
						placeholder="CUIT / CUIL"
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
					/>
					<input
						type="text"
						name="billing_address"
						value={data?.lead?.billing_address || ''}
						placeholder="Dirección completa"	
						class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
					/>
					<input
						type="text"
						name="salary"
						value={data?.lead?.salary || ''}
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
						value={data?.lead?.dni || ''}
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
