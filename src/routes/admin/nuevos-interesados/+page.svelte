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

	let { leads, meta, searchParams } = data;

	$: ({ leads, meta, searchParams, users } = data);
	$: leadsArray = leads;

	const columns = [
		{ key: 'full_name', label: 'Nombre y Apellido' },
		{ key: 'programa', label: 'Programa' },
		{ key: 'colegio', label: 'Colegio/Institución' },
		{ key: 'createdAt', label: 'Fecha' },
		{ key: 'source', label: 'Origen' },
		{ key: 'city', label: 'Localidad' }
	];

	const orderCols = ['full_name', 'createdAt', 'source'];

	function render(key: string, lead: Lead) {
		switch (key) {
			case 'full_name':
				return lead.full_name || '-';
			case 'programa':
				return 'Tutoría'; // Placeholder - ajustar según tus datos
			case 'colegio':
				return 'Colegio Mecenas'; // Placeholder - ajustar según tus datos
			case 'createdAt':
				return new Date(lead.createdAt).toLocaleDateString('es-AR');
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
        //goto(`/admin/nuevos-interesados/${id}`);
    }

    let showAssignModal = false;
    let isSubmittingAssign = false;
    let assignSuccessMsg = '';
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

</script>

<svelte:head>
	<title>Nuevos Interesados - Together</title>
</svelte:head>

<div class="min-h-screen bg-white p-6">

	<div class="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
		<button
			on:click={handleNewLead}
			class="bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
		>
			<span class="text-xl">+</span>
			Nuevo Formulario
		</button>

		<div class="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
			<SearchInput
				placeholder="Buscar por nombre, DNI, teléfono"
			/>

			<select class="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700">
				<option>Del más reciente al más viejo</option>
				<option>Del más viejo al más reciente</option>
			</select>

			<button class="border border-gray-300 rounded-lg px-6 py-2 bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-2">
				Filtrar
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
				</svg>
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



{#if successMessage.length > 0}
	<Toast type="success" dismissible={true} showToast={true} bind:successMessage />
{/if}

{#if errorMessage.length > 0}
	<Toast type="error" dismissible={true} showToast={true} bind:successMessage={errorMessage} />
{/if}
