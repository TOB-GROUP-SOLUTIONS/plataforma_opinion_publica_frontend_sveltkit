<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { onMount, onDestroy } from 'svelte';
	import DataTable from '$lib/components/dashboard/DataTable.svelte';
	import SearchInput from '$lib/components/dashboard/SearchInput.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import type { Lead } from '$lib/interfaces/lead.interface';
    import { enhance } from '$app/forms';
    import { Modal, Button, Label, Input, Textarea } from 'flowbite-svelte';
    import Toast from '$lib/components/ui/Toast.svelte';
	import Select from 'svelte-select';
	import PersonalRecord from '$lib/components/dashboard/PersonalRecord.svelte';

	import SortInput from '$lib/components/dashboard/SortInput.svelte';

	export let data;
    let successMessage = '';
    let errorMessage = '';
    let formModalFilter = false;
    let fechaDesde: string = '';
    let fechaHasta: string = '';
    let count: number = 0;
	let identifierToView = '';
    let modalOrdering: string = '';
    let selectedProgram: string = '';
	let showPersonalRecordModal = false;


    $: count = (fechaDesde ? 1 : 0) + (fechaHasta ? 1 : 0) + (selectedProgram ? 1 : 0);

	let { leads, meta, searchParams } = data;

	$: ({ leads, meta, searchParams, users } = data);
	$: leadsArray = leads;

	// Sincronizar filtros con URL cuando cambia la página (pero no mientras se edita el modal)
	$: if (browser && $page.url.searchParams && !formModalFilter) {
		const urlFromDate = $page.url.searchParams.get('fromDate') || '';
		const urlToDate = $page.url.searchParams.get('toDate') || '';
		const urlProgram = $page.url.searchParams.get('program') || '';
		
		if (urlFromDate !== fechaDesde || urlToDate !== fechaHasta || urlProgram !== selectedProgram) {
			fechaDesde = urlFromDate;
			fechaHasta = urlToDate;
			selectedProgram = urlProgram;
		}
	}

	// Polling de leads
	let isRefreshing = false;
	let lastRefreshTime: Date = new Date();
	let pollingInterval: any = null;

	async function fetchLeads() {
		if (!browser) return;
		try {
			isRefreshing = true;
			const params = new URLSearchParams($page.url.searchParams);
			const response = await fetch(`/api/leads?${params.toString()}`);
			if (!response.ok) {
				throw new Error(`Error: ${response.status}`);
			}
			const result = await response.json();
			if (result?.data && Array.isArray(result.data)) {
				leads = result.data as Lead[];
				meta = result.meta ?? meta;
				lastRefreshTime = new Date();
			} else {
				console.error('❌ Estructura inválida de /api/leads', result);
			}
		} catch (error) {
			console.error('❌ Error en polling de leads:', error);
		} finally {
			isRefreshing = false;
		}
	}

	function startPolling() {
		if (pollingInterval) clearInterval(pollingInterval);
		// Ejecutar una vez al iniciar
		fetchLeads();
		// Luego cada 30 segundos
		pollingInterval = setInterval(() => {
			fetchLeads();
		}, 30000);
	}

	function stopPolling() {
		if (pollingInterval) {
			clearInterval(pollingInterval);
			pollingInterval = null;
		}
	}

	onMount(() => {
		if (browser) {
			// Inicializar filtros desde URL
			fechaDesde = $page.url.searchParams.get('fromDate') || '';
			fechaHasta = $page.url.searchParams.get('toDate') || '';
			selectedProgram = $page.url.searchParams.get('program') || '';
			
			startPolling();
		}
	});

	onDestroy(() => {
		stopPolling();
	});

	// Variables para manejo de archivos y estado del envío de presupuesto
	let selectedFile: File | null = null;
	let isSubmittingBudget: boolean = false;

	function handleFileSelect(e: Event) {
		const input = e.target as HTMLInputElement;
		const files = input?.files;
		selectedFile = files && files.length > 0 ? files[0] : null;
	}

	// Modal nuevo formulario
	let showNewFormModal = false;
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



	const columns = [
		{ key: 'full_name', label: 'Nombre y Apellido' },
		{ key: 'programa', label: 'Programa' },
		{ key: 'colegio', label: 'Colegio/Institución' },
		{ key: 'created_at', label: 'Fecha' },
		{ key: 'source', label: 'Origen' },
		{ key: 'city', label: 'Localidad' }
	];

	const orderCols = ['full_name', 'created_at', 'source'];

	function render(key: string, lead: Lead) {
		switch (key) {
			case 'full_name':
				return lead.full_name || '-';
			case 'programa':
				return 'Tutoría'; 
			case 'colegio':
				return lead.institution || '-';
			case 'created_at':
				return new Date(lead.created_at).toLocaleDateString('es-AR');
			case 'source':
				return lead.source || 'Web';
			case 'city':
				return lead.city || 'Corrientes'; // Placeholder - ajustar según tus datos
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
		identifierToView = { ...e.detail.data };
		showPersonalRecordModal = true;
	}

    let showAssignModal = false;
    let isSubmittingAssign = false;
    let assignSuccessMsg = '';
	let formModalNote = false;
    let selectedLeadId: number | null = null;
    let selectedUser: { label: string; value: number } | null = null;
    $: userOptions = (data?.users ?? []).map((u: any) => ({
        label: `${u.firstname} ${u.lastname} (${u.email})`,
        value: u.id
    }));

    // Modal cambiar estado
    let showChangeStatusModal = false;
    let isSubmittingStatus = false;
    let selectedLeadIdStatus: number | null = null;
    let selectedStatus: { label: string; value: number } | null = null;
    
    const statusOptions = [
        { label: 'Potencial', value: 9 },
        { label: 'No contestar', value: 10 },
        { label: 'No responde', value: 11 }
    ];

    function handleChangeStatus(e: CustomEvent) {
        selectedLeadIdStatus = e.detail?.data?.id ?? e.detail?.id;
        showChangeStatusModal = true;
        selectedStatus = null;
    }

	const handleNote = async ({ detail }: any) => {
		identifierToView = { ...detail.data };
		formModalNote = true;
	};

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

    // Handler para use:enhance — NO debe ser async para que enhanced funcione correctamente
    function createFormHandler() {
		return async ({ result, update }: any) => {
			// se resetea el flag de envío cuando llega el resultado
			isSubmittingForm = false;
			if (result.type === 'success') {
				showNewFormModal = false;
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
				await update();
				await invalidateAll();
			} else {
				errorMessage = result?.data?.error ?? 'Error al guardar el formulario';
			}
		};
    }

    function handleAssign(e: CustomEvent) {
        selectedLeadId = e.detail?.data?.id ?? e.detail?.id;
        showAssignModal = true;
        assignSuccessMsg = '';
        selectedUser = null;
    }

    function handleAssignEnhanced() {
        isSubmittingAssign = true;

        return async ({ result, update }: any) => {
            isSubmittingAssign = false;

            if (result.type === 'success') {
                showAssignModal = false;
                successMessage = 'Responsable asignado correctamente';
            } else {
                errorMessage = result?.error ?? 'Error al asignar responsable';
            }

			update();
        };
    }
	let	sending = false;

	const addNote = ({}) => {
		sending = true;
		return async ({ result, update }: any) => {
			console.log(result)
			await update();
			if (result.type === 'success') {
				successMessage = result.data.message;
				errorMessage = '';
				sending = false;
				formModalNote = false;
			} else {
				errorMessage = result.data.message;
				sending = false;
			}

			await update({ invalidateAll: false, errorMessage, successMessage });
		};
	};

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
		showNewFormModal = true;
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

	function handleClearFilters() {
		fechaDesde = '';
		fechaHasta = '';
		modalOrdering = '';
		selectedProgram = '';
		const params = new URLSearchParams($page.url.searchParams);
		params.delete('order');
		params.delete('direction');
		params.delete('page');
		params.delete('program');
		params.delete('fromDate');
		params.delete('toDate');
		goto(`?${params.toString()}`);
		formModalFilter = false;
	}

	let identifierToEdit = {} as any;

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
		if (selectedProgram) {
			params.set('program', selectedProgram);
		} else {
			params.delete('program');
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

</script>

<svelte:head>
	<title>Nuevos Interesados - Together</title>
</svelte:head>

<div class="min-h-screen bg-white p-6">

	<div class="mb-6 flex flex-row gap-4 items-center justify-between w-full flex-wrap">
		<button
			on:click={handleNewLead}
			class="bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors h-[42px]"
		>
			<span class="text-xl">+</span>
			Nuevo Formulario
		</button>

		<div class="flex gap-2 text-sm text-gray-500 whitespace-nowrap items-center">
			{#if isRefreshing}
				<span class="flex items-center">
					<svg class="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					Actualizando...
				</span>
			{:else}
				<span class="flex items-center">
					<div class="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
					Actualizado {lastRefreshTime.toLocaleTimeString()}
				</span>
			{/if}
			
			<!-- Botón para actualizar manualmente -->
			<button 
				on:click={fetchLeads}	
				disabled={isRefreshing}
				class="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
				title="Actualizar ahora"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
				</svg>
			</button>
		</div>

		<div class="flex gap-4 items-center flex-1 min-w-max justify-end">
			<div class="min-w-[300px] h-[42px] flex items-center">
				<SearchInput
					placeholder="Buscar por nombre, DNI, teléfono"
				/>
			</div>

			<div>
				<SortInput
					{orderCols}
				/>
			</div>

			<button class="border border-gray-300 rounded-md px-3 py-2 flex items-center h-[42px] relative whitespace-nowrap" on:click={() => (formModalFilter = true)}>
				Filtrar
				<svg class="w-6 h-6 text-gray-500 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
				</svg>
				{#if count > 0}
				<span class="text-xs font-semibold text-blue-800 bg-blue-200 rounded-full absolute top-0 right-0 flex items-center justify-center w-4 h-4" style="transform: translate(50%, -50%);">
					{count}
				</span>
				{/if}
			</button>
		</div>
	</div>

	<div class="bg-white rounded-lg  overflow-hidden">
		<DataTable
			{columns}
			{orderCols}
			data={leads}
			{render}
			defaultActions={['asingToUser', 'change_status', 'view']}
			{handleView}
			{handleAssign}
			{handleChangeStatus}
			{handleEdit}
			{handleDelete}
			{handleNote}
		/>
	</div>

	{#if meta.total > 1}
		<div class="mt-6">
			<Pagination
                {meta}			
            />
		</div>
	{/if}
</div>

<!-- Modal: Asignar responsable -->
<Modal bind:open={showAssignModal} size="md" autoclose={false}>
    <form
        method="POST"
        action="?/asingToUser"
        use:enhance={handleAssignEnhanced}
        class="space-y-6"
    >
        <h3 class="text-xl font-semibold text-gray-900">Asignar responsable</h3>

        <input type="hidden" name="lead_id" value={selectedLeadId ?? ''} />
        <input type="hidden" name="user_id" value={selectedUser?.value ?? ''} />

        <div>
            <Label for="user_id" class="mb-2">Responsable</Label>
            <Select
                items={userOptions}
                bind:value={selectedUser}
                placeholder="Selecciona un responsable"
                clearable={false}
                disabled={isSubmittingAssign}
            />
        </div>

        <div class="flex gap-3 justify-end">
            <Button
                type="button"
                color="alternative"
                on:click={() => (showAssignModal = false)}
                disabled={isSubmittingAssign}
            >
                Cancelar
            </Button>
            <Button type="submit" color="blue" disabled={isSubmittingAssign || !selectedUser}>
                {isSubmittingAssign ? 'Asignando...' : 'Asignar'}
            </Button>
        </div>
    </form>
</Modal>

<!-- Modal: Nuevo Formulario -->
<Modal bind:open={showNewFormModal} size="lg" autoclose={false} outsideclose={false}>
	<form enctype="multipart/form-data" method="POST" action="?/createLead" use:enhance={createFormHandler} on:submit={() => (isSubmittingForm = true)} class="space-y-6">
		<div class="flex items-center justify-center">
			<h3 class="text-xl text-gray-900">Formulario Inicial</h3>
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

		<!-- Programa de Interés y ¿Cómo nos contactaste? -->
		<div class="grid grid-cols-2 gap-6">
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

			<div>
				<Label for="contact_method" class="mb-3 block">
					<span class="text-gray-700">¿Cómo nos contactaste?</span>
				</Label>
				<Select
					id="contact_method"
					items={contactMethods}
					bind:value={formData.contactMethod}
					placeholder="Elegir"
					clearable={false}
					disabled={isSubmittingForm}
					class="w-full"
				/>
			</div>
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

	
		<div>
			<Label for="observations" class="mb-3 block">
				<span class="text-gray-700">Consulta / Comentarios</span>
			</Label>
			<Textarea
				id="observations"
				name="observations"
				bind:value={formData.consultation}
				rows={4}
				disabled={isSubmittingForm}
				class="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100"
			/>
		</div>

		<div >
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
                    accept=".pdf,.doc"
                    disabled={isSubmittingBudget}
                />
            </label>
            {#if selectedFile}
                <p class="text-sm text-gray-600 mt-2">Archivo seleccionado: {selectedFile.name}</p>
            {/if}
		</div>



		<!-- Botones -->
		<div class="flex gap-4 justify-end pt-4">
			<Button
				type="button"
				color="alternative"
				on:click={() => (showNewFormModal = false)}
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
				{isSubmittingForm ? 'Guardando...' : 'Guardar'}
			</Button>
		</div>

		<!-- Hidden inputs para los valores de select -->
		<input type="hidden" name="program" value={formData.programa?.value ?? ''} />
		<input type="hidden" name="source" value={formData.contactMethod?.value ?? ''} />
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
					<option value="created_at desc">Fecha (más reciente)</option>
					<option value="created_at asc">Fecha (más antigua)</option>
				</select>
			</div>

			<!-- Tipo de Programa -->
			<div>
				<Label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					Tipo de Programa
				</Label>
				<select
					bind:value={selectedProgram}
					class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
				>
					<option value="">Todos</option>
					<option value="tutoria">Tutoría</option>
					<option value="individuales">Individual</option>
					<option value="grupos">Grupo</option>
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


<Modal bind:open={formModalNote} size="md" autoclose={false} class="w-full">
	<div class="text-sm font-bold text-gray-500 dark:text-white space-y-4">
		<h3 class="text-lg font-bold text-gray-900 dark:text-white">
			Notas
		</h3>
	</div>
	<form class="flex flex-col space-y-4" method="POST" action={'?/addNote'} use:enhance={addNote}>
		<input type="hidden" value={identifierToView?.id} name="id" />
		<Label class="space-y-2">
			<textarea
				value={identifierToView?.notes || ''}
				name="notes"
				placeholder="Escribe una nota de observación..."
				rows="8"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#7f8c8d] focus:border-[#7f8c8d] block w-full p-2.5"
			/>
		</Label>

		<Button
			class="w-full bg-[#2A2E37] hover:bg-[#2A2E37] shadow-xl text-sm sm:text-base"
			disabled={sending}
			type="submit"
		>
			Confirmar
		</Button>

		<Button
			type="button"
			on:click={() => (formModalNote = false)}
			class="w-full bg-gray-100 hover:bg-gray-200 hover:text-gray-700 text-gray-600 mt-4"
		>
			Cerrar
		</Button>
	</form>
</Modal>

{#if showPersonalRecordModal}
	<PersonalRecord
		data={identifierToView}
		users={data.users ?? []}
		on:close={() => (showPersonalRecordModal = false)}
	/>
{/if}

{#if successMessage.length > 0}
	<Toast type="success" dismissible={true} showToast={true} bind:successMessage />
{/if}

{#if errorMessage.length > 0}
	<Toast type="error" dismissible={true} showToast={true} bind:successMessage={errorMessage} />
{/if}
