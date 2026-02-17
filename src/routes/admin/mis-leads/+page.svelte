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
	import SortInput from '$lib/components/dashboard/SortInput.svelte';
	import PersonalRecord from '$lib/components/dashboard/PersonalRecord.svelte';
	import { AdjustmentsHorizontalOutline } from 'flowbite-svelte-icons';
	import { Tooltip } from 'flowbite-svelte';

	export let data;
	let successMessage = '';
	let errorMessage = '';
	let showChangeStatusModal = false;
	let isSubmittingStatus = false;
	let selectedLeadIdStatus: number | null = null;
	let selectedStatus: { label: string; value: number } | null = null;
	let selectedDate: string = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
	let showConfirmPaymentModal = false;
	let identifierToView = {} as any;
	let selectBudgetId: number | null = null;
	let showPersonalRecordModal = false;
	let showFormModal = false;
	let selectedLeadIdForm: number | null = null;
	let formModalUrl: string = '';
	let formModalFilter = false;
	let fechaDesde: string = '';
	let fechaHasta: string = '';
	let count: number = 0;
	let modalOrdering: string = '';
	let showViewProofModal = false;
	let proofUrl: string = '';
	
	// Obtener URL pública del env
	const PUBLIC_URL = import.meta.env.PUBLIC_APP_URL || 'http://localhost:5173';

	$: count = (fechaDesde ? 1 : 0) + (fechaHasta ? 1 : 0);

	let { leads, meta, searchParams } = data;

	$: ({ leads, meta, searchParams, users } = data);
	console.log('Mis leads data:', leads);

	// Sincronizar filtros con URL cuando cambia la página (pero no mientras se edita el modal)
	$: if (typeof window !== 'undefined' && $page.url.searchParams && !formModalFilter) {
		const urlFromDate = $page.url.searchParams.get('fromDate') || '';
		const urlToDate = $page.url.searchParams.get('toDate') || '';
		
		if (urlFromDate !== fechaDesde || urlToDate !== fechaHasta) {
			fechaDesde = urlFromDate;
			fechaHasta = urlToDate;
		}
	}

	const orderCols = ['created_at'];

	const columns = [
		{ key: 'full_name', label: 'Nombre y Apellido' },
		{ key: 'status', label: 'Estado' },
		{ key: 'created_at', label: 'Fecha' },
		{ key: 'producto', label: 'Producto' },
		{ key: 'source', label: 'Origen' },
		{ key: 'city', label: 'Localidad' },
		{ key: 'responsable', label: 'Responsable' }
	];

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
				return '-';
			case 'created_at':
				return new Date(lead.created_at).toLocaleDateString('es-AR');
			case 'source':
				return lead.source || 'Web';
			case 'city':
				return lead.city || 'Corrientes'; // Placeholder - ajustar según tus datos
			case 'responsable':
				return lead.assigned_to_user_id
					? `${lead.assigned_to_user_id.firstname} ${lead.assigned_to_user_id.lastname}`
					: 'Sin asignar';
			default:
				return '-';
		}
	}

	function handleEdit(e: CustomEvent) {
		const id = e.detail.id;
		goto(`/admin/nuevos-interesados/${id}/editar`);
	}

	const handleView = ({ detail }: any) => {
		console.log('Ver ficha personal:', detail.data);
		identifierToView = { ...detail.data };
		showPersonalRecordModal = true;
	};

	let showAssignModal = false;
	let isSubmittingAssign = false;
	let assignSuccessMsg = '';
	let selectedLeadId: number | null = null;
	let selectedUser: { label: string; value: number } | null = null;
	let currentResponsable: string = '';
	$: statusFilter = $page.url.searchParams.get('status');
	console.log('Status filter:', statusFilter);

	$: userOptions = (data?.users ?? []).map((u: any) => ({
		label: `${u.firstname} ${u.lastname}`,
		value: u.id
	}));

	function handleAssign(e: CustomEvent) {
		selectedLeadId = e.detail?.data?.id ?? e.detail?.id;

		// Buscar el lead seleccionado para obtener su responsable actual
		const lead = leads.find((l: Lead) => l.id === selectedLeadId);
		if (lead?.assigned_to_user_id) {
			currentResponsable = `${lead.assigned_to_user_id.firstname} ${lead.assigned_to_user_id.lastname}`;
		} else {
			currentResponsable = 'Sin asignar';
		}

		showAssignModal = true;
		assignSuccessMsg = '';
		selectedUser = null;
	}

	function handleClearFilters() {
		fechaDesde = '';
		fechaHasta = '';
		modalOrdering = '';
		const params = new URLSearchParams($page.url.searchParams);
		params.delete('order');
		params.delete('direction');
		params.delete('page');
		params.delete('fromDate');
		params.delete('toDate');
		goto(`?${params.toString()}`);
		formModalFilter = false;
	}

	function handleApplyDateFilter() {
		if (fechaHasta && fechaDesde && fechaHasta < fechaDesde) {
			fechaHasta = '';
		}
		const params = new URLSearchParams($page.url.searchParams);
		if (modalOrdering) {
			const [order, direction] = modalOrdering.split(' ');
			params.set('order', order);
			params.set('direction', direction);
		} else {
			params.delete('order');
			params.delete('direction');
		}
		if (fechaDesde) {
			params.set('fromDate', fechaDesde);
		} else {
			params.delete('fromDate');
		}
		if (fechaHasta) {
			params.set('toDate', fechaHasta);
		} else {
			params.delete('toDate');
		}
		params.set('page', '1');
		goto(`?${params.toString()}`);
		formModalFilter = false;
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
	}

	function handleConfirmPayment(e: CustomEvent) {
		console.log('Evento Confirmar Pago:', e);
		selectBudgetId = e.detail?.data.budgets[0]?.id ?? e.detail?.id;
		console.log(selectBudgetId)
		showConfirmPaymentModal = true;
		selectedFile = null;
	}

	function handleConfirmPaymentEnhanced() {
		isSubmittingBudget = true;

		return async ({ result, update }: any) => {
			isSubmittingBudget = false;

			if (result.type === 'success') {
				showConfirmPaymentModal = false;
				successMessage = 'Pago confirmado correctamente';
				await update();
			} else {
				errorMessage = result?.error ?? 'Error al confirmar pago';
			}
		};
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

	function handleViewForm(e: CustomEvent) {
		selectedLeadIdForm = e.detail?.data?.id ?? e.detail?.id;
		formModalUrl = `${PUBLIC_URL}/formulario-ver-mas/${selectedLeadIdForm}`;
		showFormModal = true;
	}

	function handleViewProof(e: CustomEvent) {
		console.log('Ver comprobante:', e);
		// Obtener la URL del comprobante desde el evento
		const proofFileUrl = e.detail?.data?.budgets?.[0]?.file?.url ?? e.detail?.data?.payment_proof_url ?? '';
		if (proofFileUrl) {
			proofUrl = proofFileUrl;
			showViewProofModal = true;
		} else {
			errorMessage = 'No se encontró el comprobante de pago';
		}
	}
</script>

<svelte:head>
	<title>Mis leads- Together</title>
</svelte:head>

<div class="min-h-screen bg-white p-6">
	<div class="mb-6 flex flex-col md:flex-row gap-4 items-stretch md:items-end justify-between">
		<div class="w-full md:flex-1">
			<SearchInput placeholder="Buscar por nombre, DNI, teléfono" />
		</div>

		<div class="flex flex-col md:flex-row gap-4 items-stretch md:items-end w-full md:w-auto">
			<div class="w-full md:w-64">
				<SortInput {orderCols} onOrderChange={() => {}} />
			</div>

			<button class="border border-gray-300 rounded-md px-3 py-2 flex items-center h-[42px] relative" on:click={() => (formModalFilter = true)}>
				Filtrar <AdjustmentsHorizontalOutline class="w-6 h-6 text-gray-500 ml-1" aria-hidden="true" />
				{#if count > 0}
				<span class="text-xs font-semibold text-blue-800 bg-blue-200 rounded-full absolute top-0 right-0 flex items-center justify-center w-4 h-4" style="transform: translate(50%, -50%);">
					{count}
				</span>
				{/if}
			</button>
		</div>
	</div>

	<div class="bg-white rounded-lg overflow-hidden">
		<DataTable
			{columns}
			{orderCols}
			data={leads}
			statusFilter={statusFilter}
			{render}
			defaultActions={['change_status', 'assign', 'view', 'add_budget']}
			{handleView}
			{handleAssign}
			{handleChangeStatus}
			{handleAddBudget}
			{handleConfirmPayment}
			{handleViewForm}
			{handleViewProof}
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
		<input type="hidden" name="due_date" value={selectedDate ?? ''} />

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
            <div class="flex items-center gap-2 justify-center">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
                <p class="text-gray-600 font-medium">Fecha de vencimiento</p>
            </div>
            <div class="flex justify-center">
                <input
                    type="date"
                    bind:value={selectedDate}
                    class="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={isSubmittingBudget}
                    min={new Date().toISOString().split('T')[0]}
                />
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


<Modal bind:open={showConfirmPaymentModal} size="md" autoclose={false}>
    <form
        method="POST"
        action="?/confirmPayment"
        use:enhance={handleConfirmPaymentEnhanced}
        class="space-y-6 p-4"
        enctype="multipart/form-data"
    >
        <h3 class="text-2xl font-semibold text-gray-600 text-center mb-4">Confirmar Pago</h3>

        <input type="hidden" name="budget_id" value={selectBudgetId ?? ''} />
		<input type="hidden" name="due_date" value={selectedDate ?? ''} />

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

		<!-- Campo de notas -->
		<div class="space-y-3">
			<div class="flex items-center gap-2 justify-center">
			<svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
				/>
			</svg>
			<p class="text-gray-600 font-medium">Notas</p>
			</div>
			<div class="flex justify-center">
			<textarea
				name="notes"
				rows="4"
				class="w-full max-w-xl border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
				placeholder="Agregar notas sobre el pago..."
				disabled={isSubmittingBudget}
			></textarea>
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

<!-- Modal de Filtros por Fechas -->
<Modal bind:open={formModalFilter} size="sm" autoclose={false} class="w-full">
	<div class="p-6">
		<div class="space-y-4">
			<!-- Ordenar por -->
			<div>
				<Label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					Ordenar por
				</Label>
				<select
					bind:value={modalOrdering}
					class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
				>
					<option value="">Sin orden</option>
					<option value="full_name asc">Nombre (A-Z)</option>
					<option value="full_name desc">Nombre (Z-A)</option>
				</select>
			</div>

			<!-- Fecha Desde -->
			<div>
				<Label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					Fecha Desde
				</Label>
				<div class="relative">
					<input
						type="date"
						bind:value={fechaDesde}
						class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 pr-10"
						style="color-scheme: light;"
					/>
					<div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
						<svg
							class="w-5 h-5 text-gray-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
					</div>
				</div>
			</div>

			<!-- Fecha Hasta -->
			<div>
				<Label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					Fecha Hasta
				</Label>
				<div class="relative">
					<input
						type="date"
						bind:value={fechaHasta}
						min={fechaDesde || undefined}
						class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5 pr-10"
						style="color-scheme: light;"
					/>
					<div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
						<svg
							class="w-5 h-5 text-gray-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
					</div>
				</div>
			</div>

			<!-- Botones -->
			<div class="flex gap-3 w-full mt-6">
				<Button
					type="button"
					on:click={handleClearFilters}
					class="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-md"
				>
					Borrar Todo
				</Button>
				<Button
					type="button"
					on:click={handleApplyDateFilter}
					class="flex-1 bg-gray-700 hover:bg-gray-800 text-white rounded-md"
				>
					Filtrar
				</Button>
			</div>
		</div>
	</div>
</Modal>

{#if showPersonalRecordModal}
	<PersonalRecord
		data={identifierToView}
		on:close={() => (showPersonalRecordModal = false)}
	/>
{/if}

<!-- Modal: Ver Formulario -->
<Modal bind:open={showFormModal} size="md" autoclose={false}>
	<div class="p-6 space-y-6">
		<h3 class="text-2xl font-semibold text-gray-600 text-center">Enlace del Formulario</h3>
		
		<hr class="border-gray-300" />

		<div class="space-y-3">
			<label class="block text-sm font-medium text-gray-700">Link del formulario</label>
			<div class="flex gap-2">
				<input 
					type="text" 
					value={formModalUrl}
					readonly
					class="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
				/>
				<button
					type="button"
					on:click={() => {
						navigator.clipboard.writeText(formModalUrl);
						successMessage = 'Link copiado al portapapeles';
					}}
					class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
				>
					Copiar
				</button>
			</div>
		</div>

		<!-- Botones -->
		<div class="flex gap-3 justify-center pt-4">
			<button
				type="button"
				on:click={() => (showFormModal = false)}
				class="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors"
			>
				Cerrar
			</button>
		</div>
	</div>
</Modal>

<!-- Modal: Ver Comprobante de Pago -->
<Modal bind:open={showViewProofModal} size="xl" autoclose={false}>
	<div class="p-6 space-y-6">
		<h3 class="text-2xl font-semibold text-gray-600 text-center">Comprobante de Pago</h3>
		
		<hr class="border-gray-300" />

		<!-- Visualizador del comprobante -->
		<div class="space-y-4">
			{#if proofUrl}
				<!-- Si es PDF, mostrar iframe -->
				{#if proofUrl.toLowerCase().endsWith('.pdf')}
					<div class="w-full h-[600px] border border-gray-300 rounded-lg overflow-hidden">
						<iframe
							src={proofUrl}
							title="Comprobante de Pago"
							class="w-full h-full"
							frameborder="0"
						/>
					</div>
				<!-- Si es imagen, mostrar img -->
				{:else if proofUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)}
					<div class="w-full flex justify-center">
						<img
							src={proofUrl}
							alt="Comprobante de Pago"
							class="max-w-full max-h-[600px] object-contain border border-gray-300 rounded-lg"
						/>
					</div>
				<!-- Para otros tipos de archivo, mostrar enlace de descarga -->
				{:else}
					<div class="text-center py-12">
						<svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
							/>
						</svg>
						<p class="text-gray-600 mb-4">No se puede previsualizar este tipo de archivo</p>
						<a
							href={proofUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
							Descargar Comprobante
						</a>
					</div>
				{/if}

				<!-- Botón de descarga siempre visible -->
				<div class="flex justify-center">
					<a
						href={proofUrl}
						download
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
						Descargar
					</a>
				</div>
			{:else}
				<div class="text-center py-12 text-gray-500">
					<p>No hay comprobante disponible</p>
				</div>
			{/if}
		</div>

		<!-- Botón de cerrar -->
		<div class="flex justify-center pt-4">
			<button
				type="button"
				on:click={() => (showViewProofModal = false)}
				class="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors"
			>
				Cerrar
			</button>
		</div>
	</div>
</Modal>

{#if successMessage.length > 0}
	<Toast type="success" dismissible={true} showToast={true} bind:successMessage />
{/if}

{#if errorMessage.length > 0}
	<Toast type="error" dismissible={true} showToast={true} bind:successMessage={errorMessage} />
{/if}
