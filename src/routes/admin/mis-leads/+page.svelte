<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import DataTable from '$lib/components/dashboard/DataTable.svelte';
	import SearchInput from '$lib/components/dashboard/SearchInput.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import type { Lead } from '$lib/interfaces/lead.interface';
	import { enhance } from '$app/forms';
	import { Modal, Button, Label, Input } from 'flowbite-svelte';
	import Toast from '$lib/components/ui/Toast.svelte';
	import Select from 'svelte-select';

	export let data;
	let successMessage = '';
	let errorMessage = '';
	let showChangeStatusModal = false;
	let isSubmittingStatus = false;
	let selectedLeadIdStatus: number | null = null;
	let selectedStatus: { label: string; value: number } | null = null;
	$: statusOptions = [
		{ label: 'Potencial', value: 9 },
		{ label: 'No contestar', value: 10 },
		{ label: 'Sin respuesta', value: 11 }
	];

	let { leads, meta, searchParams } = data;

	$: ({ leads, meta, searchParams, users } = data);
	console.log('Mis leads data:', meta);

	const columns = [
		{ key: 'full_name', label: 'Nombre y Apellido' },
		{ key: 'status', label: 'Estado' },
		{ key: 'createdAt', label: 'Fecha' },
		{ key: 'producto', label: 'Producto' },
		{ key: 'source', label: 'Origen' },
		{ key: 'city', label: 'Localidad' },
		{ key: 'responsable', label: 'Responsable' }
	];

	const orderCols = ['full_name', 'createdAt', 'source'];

	function render(key: string, lead: Lead) {
		switch (key) {
			case 'full_name':
				return lead.full_name || '-';
			case 'producto':
				return 'Tutoría'; // Placeholder - ajustar según tus datos
			case 'status':
				if (lead.interest_level?.value == 'potential')
					return '<span class="bg-lime-600 rounded-full text-white px-7 py-2 ">Potencial</span>';
				if (lead.interest_level?.value == 'NO_ANSWER')
					return '<span class="bg-red-600 rounded-full text-white px-7 py-2 ">No contestar</span>';
				if (lead.interest_level?.value == 'NO_RESPONSE')
					return '<span class="bg-yellow-600 rounded-full text-white px-7 py-2 ">Sin respuesta</span>';
			case 'createdAt':
				return new Date(lead.createdAt).toLocaleDateString('es-AR');
			case 'source':
				return lead.source || 'Web';
			case 'city':
				return lead.city || 'Corrientes'; // Placeholder - ajustar según tus datos
			case 'responsable':
				return lead.assigned_to
					? `${lead.assigned_to.firstname} ${lead.assigned_to.lastname}`
					: 'Sin asignar';
			default:
				return '-';
		}
	}

	function handleEdit(e: CustomEvent) {
		const id = e.detail.id;
		goto(`/admin/nuevos-interesados/${id}/editar`);
	}

	function handleView(e: CustomEvent) {
		const id = e.detail.id;
		//goto(`/admin/nuevos-interesados/${id}`);
	}

	let showAssignModal = false;
	let isSubmittingAssign = false;
	let assignSuccessMsg = '';
	let selectedLeadId: number | null = null;
	let selectedUser: { label: string; value: number } | null = null;
	let currentResponsable: string = '';
	$: userOptions = (data?.users ?? []).map((u: any) => ({
		label: `${u.firstname} ${u.lastname}`,
		value: u.id
	}));

	function handleAssign(e: CustomEvent) {
		selectedLeadId = e.detail?.data?.id ?? e.detail?.id;

		// Buscar el lead seleccionado para obtener su responsable actual
		const lead = leads.find((l: Lead) => l.id === selectedLeadId);
		if (lead?.assigned_to) {
			currentResponsable = `${lead.assigned_to.firstname} ${lead.assigned_to.lastname}`;
		} else {
			currentResponsable = 'Sin asignar';
		}

		showAssignModal = true;
		assignSuccessMsg = '';
		selectedUser = null;
	}

	// handler para enhanced: sólo recibe y procesa la respuesta del action
	function handleAssignEnhanced() {
		isSubmittingAssign = true;

		return async ({ result, update }: any) => {
			isSubmittingAssign = false;

			if (result.type === 'success') {
				showAssignModal = false;
				successMessage = 'Responsable asignado correctamente';
				await update();
			} else {
				errorMessage = result?.error ?? 'Error al asignar responsable';
			}
		};
	}

	async function handleDelete(e: CustomEvent) {
		if (!confirm('¿Estás seguro de eliminar este lead?')) return;

		const formData = new FormData();
		formData.append('id', e.detail.id);

		await fetch('?/delete', {
			method: 'POST',
			body: formData
		});

		invalidateAll();
	}

	function handleNewLead() {
		goto('/admin/nuevos-interesados/nuevo');
	}

	function handleSearch(e: CustomEvent) {
		const search = e.detail.search;
		const params = new URLSearchParams($page.url.searchParams);
		params.set('query', search);
		params.set('page', '1');
		goto(`?${params.toString()}`);
	}

	function handleSort(e: CustomEvent) {
		const { order, direction } = e.detail;
		const params = new URLSearchParams($page.url.searchParams);
		params.set('order', order);
		params.set('direction', direction);
		params.set('page', '1');
		goto(`?${params.toString()}`);
	}

	function handlePageChange(newPage: number) {
		const params = new URLSearchParams($page.url.searchParams);
		params.set('page', newPage.toString());
		goto(`?${params.toString()}`);
	}

	let currentLeadStatus: string = '';
	let currentLeadStatusColor: string = '';
	let showBudgetModal = false;
	let isSubmittingBudget = false;
	let selectedLeadIdBudget: number | null = null;
	let selectedFile: File | null = null;
	let selectedMonth: string = 'Ene';
	let selectedYear: string = new Date().getFullYear().toString();

	const months = [
		'Ene',
		'Feb',
		'Mar',
		'Abr',
		'May',
		'Jun',
		'Jul',
		'Ago',
		'Sep',
		'Oct',
		'Nov',
		'Dic'
	];
	const years = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() + i).toString());

	function handleChangeStatus(e: CustomEvent) {
		selectedLeadIdStatus = e.detail?.data?.id ?? e.detail?.id;

		// Buscar el lead seleccionado para obtener su estado actual
		const lead = leads.find((l: Lead) => l.id === selectedLeadIdStatus);
		if (lead?.interest_level) {
			if (lead.interest_level.value === 'potential') {
				currentLeadStatus = 'Potencial';
				currentLeadStatusColor = 'bg-lime-600';
			} else if (lead.interest_level.value === 'NO_ANSWER') {
				currentLeadStatus = 'No contestar';
				currentLeadStatusColor = 'bg-red-600';
			} else if (lead.interest_level.value === 'NO_RESPONSE') {
				currentLeadStatus = 'Sin respuesta';
				currentLeadStatusColor = 'bg-yellow-600';
			}
		}

		showChangeStatusModal = true;
		selectedStatus = null;
	}

	function handleChangeStatusEnhanced() {
		isSubmittingStatus = true;

		return async ({ result, update }: any) => {
			isSubmittingStatus = false;

			if (result.type === 'success') {
				showChangeStatusModal = false;
				successMessage = 'Estado actualizado correctamente';
				await update();
			} else {
				errorMessage = result?.error ?? 'Error al actualizar estado';
			}
		};
	}

	function handleAddBudget(e: CustomEvent) {
		selectedLeadIdBudget = e.detail?.data?.id ?? e.detail?.id;
		showBudgetModal = true;
		selectedFile = null;
		selectedMonth = 'Ene';
		selectedYear = new Date().getFullYear().toString();
	}

	function handleBudgetEnhanced() {
		isSubmittingBudget = true;

		return async ({ result, update }: any) => {
			isSubmittingBudget = false;

			if (result.type === 'success') {
				showBudgetModal = false;
				successMessage = 'Presupuesto agregado correctamente';
				await update();
			} else {
				errorMessage = result?.error ?? 'Error al agregar presupuesto';
			}
		};
	}

	function handleFileSelect(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			selectedFile = input.files[0];
		}
	}
</script>

<svelte:head>
	<title>Mis leads- Together</title>
</svelte:head>

<div class="min-h-screen bg-white p-6">
	<div class="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
		<SearchInput placeholder="Buscar por nombre, DNI, teléfono" />

		<div class="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
			<select class="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700">
				<option>Del más reciente al más viejo</option>
				<option>Del más viejo al más reciente</option>
			</select>

			<button
				class="border border-gray-300 rounded-lg px-6 py-2 bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-2"
			>
				Filtrar
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
					/>
				</svg>
			</button>
		</div>
	</div>

	<div class="bg-white rounded-lg overflow-hidden">
		<DataTable
			{columns}
			{orderCols}
			data={leads}
			{render}
			defaultActions={['change_status', 'assign', 'view', 'add_budget']}
			{handleView}
			{handleAssign}
			{handleChangeStatus}
			{handleAddBudget}
		/>
	</div>

	{#if meta.total > 1}
		<div class="mt-6">
			<Pagination {...data?.meta || {}} class="mt-3" />
		</div>
	{/if}
</div>

<!-- Modal: Asignar responsable -->
<Modal bind:open={showAssignModal} size="md" autoclose={false}>
	<form
		method="POST"
		action="?/changed_user"
		use:enhance={handleAssignEnhanced}
		class="space-y-6 p-4"
	>
		<h3 class="text-2xl font-semibold text-gray-600 text-center mb-4">Cambiar responsable</h3>

		<hr class="border-gray-300 mb-6" />

		<input type="hidden" name="lead_id" value={selectedLeadId ?? ''} />
		<input type="hidden" name="user_id" value={selectedUser?.value ?? ''} />

		<!-- Responsable actual -->
		<div class="text-center mb-6">
			<span class="text-gray-600 text-lg">Responsable actual: {currentResponsable}</span>
		</div>

		<!-- Nuevo responsable -->
		<div class="flex justify-center">
			<div style="width: 400px; --border-radius: 25px;">
				<Select
					items={userOptions}
					bind:value={selectedUser}
					placeholder="Nuevo responsable"
					clearable={false}
					disabled={isSubmittingAssign}
				/>
			</div>
		</div>

		<!-- Botones de acción -->
		<div class="flex gap-4 justify-center">
			<button
				type="button"
				on:click={() => (showAssignModal = false)}
				disabled={isSubmittingAssign}
				class="rounded-full px-8 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium disabled:opacity-50"
			>
				Cancelar
			</button>
			<button
				type="submit"
				disabled={isSubmittingAssign || !selectedUser}
				class="rounded-full px-8 py-2 bg-green-600 hover:bg-green-700 text-white font-medium disabled:opacity-50"
			>
				{isSubmittingAssign ? 'Asignando...' : 'Guardar'}
			</button>
		</div>
	</form>
</Modal>

<!-- Modal: Cambiar estado -->
<Modal bind:open={showChangeStatusModal} size="md" autoclose={false}>
	<form
		method="POST"
		action="?/changeStatus"
		use:enhance={handleChangeStatusEnhanced}
		class="space-y-6 p-4"
	>
		<h3 class="text-2xl font-semibold text-gray-600 text-center mb-4">Cambiar Estado</h3>

		<hr class="border-gray-300 mb-6" />

		<input type="hidden" name="lead_id" value={selectedLeadIdStatus ?? ''} />
		<input type="hidden" name="status_id" value={selectedStatus?.value ?? ''} />

		<!-- Estado actual -->
		<div class="flex items-center gap-3 justify-center mb-6">
			<span class="text-gray-600 font-medium">Estado actual:</span>
			<span class="{currentLeadStatusColor} rounded-full text-white px-6 py-1 text-sm"
				>{currentLeadStatus}</span
			>
		</div>

		<hr class="border-gray-300 mb-6" />

		<!-- Seleccionar nuevo estado -->
		<div class="space-y-4">
			<p class="text-gray-600 text-center">Seleccionar nuevo estado</p>

			<div class="flex gap-3 justify-center flex-wrap">
				{#if currentLeadStatus !== 'Potencial'}
					<button
						type="button"
						on:click={() => (selectedStatus = { label: 'Potencial', value: 9 })}
						class="rounded-full px-6 py-2 text-white transition-all
                            {selectedStatus?.value === 9
							? 'bg-lime-700 ring-2 ring-lime-400'
							: 'bg-lime-600 hover:bg-lime-700'}"
					>
						Potencial
					</button>
				{/if}

				{#if currentLeadStatus !== 'Sin respuesta'}
					<button
						type="button"
						on:click={() => (selectedStatus = { label: 'Sin respuesta', value: 11 })}
						class="rounded-full px-6 py-2 text-white transition-all
                            {selectedStatus?.value === 11
							? 'bg-yellow-600 ring-2 ring-yellow-400'
							: 'bg-yellow-500 hover:bg-yellow-600'}"
					>
						Sin respuesta
					</button>
				{/if}

				{#if currentLeadStatus !== 'No contestar'}
					<button
						type="button"
						on:click={() => (selectedStatus = { label: 'No contestar', value: 10 })}
						class="rounded-full px-6 py-2 text-white transition-all
                            {selectedStatus?.value === 10
							? 'bg-red-600 ring-2 ring-red-400'
							: 'bg-red-500 hover:bg-red-600'}"
					>
						No contestar
					</button>
				{/if}
			</div>
		</div>

		<hr class="border-gray-300 my-6" />

		<!-- Crear nuevo formulario 
        <p class="text-gray-600 text-center font-medium mb-6">Crear nuevo formulario</p>

        <hr class="border-gray-300 mb-6">
-->
		<!-- Botones de acción -->
		<div class="flex gap-4 justify-center">
			<button
				type="button"
				on:click={() => (showChangeStatusModal = false)}
				disabled={isSubmittingStatus}
				class="rounded-full px-8 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium disabled:opacity-50"
			>
				Cancelar
			</button>
			<button
				type="submit"
				disabled={isSubmittingStatus || !selectedStatus}
				class="rounded-full px-8 py-2 bg-green-600 hover:bg-green-700 text-white font-medium disabled:opacity-50"
			>
				{isSubmittingStatus ? 'Actualizando...' : 'Guardar'}
			</button>
		</div>
	</form>
</Modal>

<!-- Modal: Agregar presupuesto -->
<Modal bind:open={showBudgetModal} size="md" autoclose={false}>
	<form
		method="POST"
		action="?/addBudget"
		use:enhance={handleBudgetEnhanced}
		class="space-y-6 p-4"
		enctype="multipart/form-data"
	>
		<h3 class="text-2xl font-semibold text-gray-600 text-center mb-4">Agregar presupuesto</h3>

		<input type="hidden" name="lead_id" value={selectedLeadIdBudget ?? ''} />

		<!-- Seleccionar archivo -->
		<div>
			<label
				for="file-input"
				class="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition"
			>
				<div class="text-gray-500">
					<svg class="mx-auto h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
						/>
					</svg>
					<p class="text-gray-600 underline">Seleccionar archivo</p>
				</div>
				<input
					id="file-input"
					type="file"
					name="file"
					hidden
					on:change={handleFileSelect}
					accept=".pdf,.doc,.docx,.xls,.xlsx"
					disabled={isSubmittingBudget}
				/>
			</label>
			{#if selectedFile}
				<p class="text-sm text-gray-600 mt-2">Archivo seleccionado: {selectedFile.name}</p>
			{/if}
		</div>

		<!-- Fecha de vencimiento -->
		<div class="space-y-3">
			<p class="text-gray-600 font-medium text-center">Fecha de vencimiento</p>
			<div class="flex gap-3 justify-center">
				<select
					bind:value={selectedMonth}
					class="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700"
					disabled={isSubmittingBudget}
				>
					{#each months as month}
						<option value={month}>{month}</option>
					{/each}
				</select>
				<select
					bind:value={selectedYear}
					class="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700"
					disabled={isSubmittingBudget}
				>
					{#each years as year}
						<option value={year}>{year}</option>
					{/each}
				</select>
				<input type="hidden" name="expiration_date" value="{selectedMonth}-{selectedYear}" />
			</div>
		</div>

		<!-- Botón de acción -->
		<div class="flex justify-center">
			<button
				type="submit"
				disabled={isSubmittingBudget || !selectedFile}
				class="rounded-full px-12 py-2 bg-green-600 hover:bg-green-700 text-white font-medium disabled:opacity-50"
			>
				{isSubmittingBudget ? 'Agregando...' : 'Aceptar'}
			</button>
		</div>
	</form>
</Modal>

{#if successMessage.length > 0}
	<Toast type="success" dismissible={true} showToast={true} bind:successMessage />
{/if}

{#if errorMessage.length > 0}
	<Toast type="error" dismissible={true} showToast={true} bind:successMessage={errorMessage} />
{/if}
