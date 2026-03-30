<script lang="ts">
	import Pagination from '$lib/components/Pagination.svelte';
	import { Modal, Button, Label, Input, Textarea } from 'flowbite-svelte';
    import { enhance } from '$app/forms';
    import { invalidateAll, goto } from '$app/navigation';
    import { page } from '$app/stores';

	export let data;

	$: ({ entidades, meta } = data);

    let isSubmitting = false;
    let showModal = false;
    let isEditing = false;
    
    let formData = {
        id: '',
        entidad: '',
        tipo: '',
        contexto: ''
    };

    let searchQuery = $page.url.searchParams.get('query') || '';
    let searchTimeout: any;

    function handleSearch() {
        if (searchTimeout) clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const params = new URLSearchParams($page.url.searchParams);
            if (searchQuery) params.set('query', searchQuery);
            else params.delete('query');
            params.set('page', '1');
            goto(`?${params.toString()}`);
        }, 500);
    }

    function openNewModal() {
        isEditing = false;
        formData = { id: '', entidad: '', tipo: '', contexto: '' };
        showModal = true;
    }

    function openEditModal(entidad: any) {
        isEditing = true;
        formData = { ...entidad, id: entidad.id.toString() };
        showModal = true;
    }

    function handleFormEnhanced() {
        isSubmitting = true;
        return async ({ result, update }: any) => {
            isSubmitting = false;
            if (result.type === 'success') {
                showModal = false;
                await invalidateAll();
            }
            await update();
        };
    }

    async function deleteEntity(id: string) {
        if (!confirm('¿Seguro que deseas eliminar esta entidad?')) return;
        const form = new FormData();
        form.append('id', id);
        
        await fetch('?/delete', {
            method: 'POST',
            body: form
        });
        await invalidateAll();
    }
</script>

<!-- Wrapper para que el fondo cubra todo el área visible del `main` -->
<div class="h-full w-full bg-[#F8FAFC] -mx-2 lg:-mx-4 -mt-4 -mb-36 md:-mb-8">
	<div class="p-6">
	<!-- Header area -->
	<div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
		
		<div class="flex flex-1 justify-end gap-3">
            <!-- Search field -->
            <div class="relative w-full md:max-w-md">
                <input 
                    type="text" 
                    bind:value={searchQuery}
                    on:input={handleSearch}
                    placeholder="Buscar entidades..." 
                    class="w-full bg-white border border-gray-200 text-gray-500 text-sm rounded-lg pl-10 pr-4 py-2.5 outline-none focus:border-blue-500 shadow-sm transition-colors"
                />
                <svg class="w-4 h-4 text-gray-400 absolute left-4 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
            </div>
            
            <Button color="blue" on:click={openNewModal} class="whitespace-nowrap flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                Nueva Entidad
            </Button>
		</div>
	</div>

	<!-- Table -->
	<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
		<div class="overflow-x-auto">
			<table class="w-full text-sm text-left text-gray-600">
				<thead class="text-xs text-[#64748b] bg-white border-b border-gray-100 uppercase">
					<tr>
						<th class="px-6 py-5 font-semibold">ID</th>
						<th class="px-6 py-5 font-semibold">Nombre de Entidad</th>
						<th class="px-6 py-5 font-semibold">Tipo</th>
						<th class="px-6 py-5 font-semibold w-1/3">Contexto / Palabras Clave</th>
						<th class="px-6 py-5 font-semibold text-right">Acciones</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-100">
					{#each entidades as entidad}
					<tr class="hover:bg-[#F8FAFC] transition-colors group">
						<td class="px-6 py-4 whitespace-nowrap text-gray-400 font-mono text-[13px]">
                            #{entidad.id}
                        </td>
						<td class="px-6 py-4 text-[#334155] font-semibold text-[14px]">
                            {entidad.entidad}
                        </td>
						<td class="px-6 py-4">
                            <span class="bg-[#F1F5F9] text-gray-600 px-3 py-1.5 rounded text-[13px] font-medium border border-gray-100">
                                {entidad.tipo || 'Sin definir'}
                            </span>
                        </td>
						<td class="px-6 py-4 text-gray-500 text-[13px] max-w-sm truncate" title={entidad.contexto}>
                            {entidad.contexto || '-'}
                        </td>
						<td class="px-6 py-4 text-right">
                            <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button type="button" on:click={() => openEditModal(entidad)} class="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors" title="Editar">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                </button>
                                <button type="button" on:click={() => deleteEntity(entidad.id.toString())} class="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors" title="Eliminar">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </div>
                        </td>
					</tr>
					{:else}
                    <tr>
                        <td colspan="5" class="px-6 py-12 text-center text-gray-500 bg-gray-50">No hay entidades registradas que coincidan con los filtros.</td>
                    </tr>
                    {/each}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Pagination Component Integration -->
	<div class="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-b-xl border border-t-0 border-gray-200 -mt-7 mb-6">
        <div class="text-sm text-gray-500">
            Mostrando {((meta?.currentPage || 1) - 1) * (meta?.perPage || 10) + 1} a {Math.min((meta?.currentPage || 1) * (meta?.perPage || 10), meta?.total || 0)} de {meta?.total || 0}
        </div>
        
        {#if meta && meta.total > 0}
            <Pagination {meta} class="mt-4 sm:mt-0" />
        {/if}
	</div>

	<!-- Modal Formulario -->
	<Modal bind:open={showModal} size="md" outsideclose autoclose={false} class="w-full">
		<form method="POST" action={isEditing ? '?/update' : '?/create'} use:enhance={handleFormEnhanced}>
            {#if isEditing}
                <input type="hidden" name="id" value={formData.id} />
            {/if}

            <h3 class="mb-4 text-xl font-bold text-gray-900 border-b pb-3">
                {isEditing ? 'Editar Entidad' : 'Nueva Entidad'}
            </h3>

            <div class="space-y-4">
                <div>
                    <Label for="entidad" class="mb-2">Nombre de Entidad</Label>
                    <Input id="entidad" name="entidad" bind:value={formData.entidad} required placeholder="Ej: Juan Perez, Hospital Central..." />
                </div>
                
                <div>
                    <Label for="tipo" class="mb-2">Tipo de Entidad</Label>
                    <Input id="tipo" name="tipo" bind:value={formData.tipo} required placeholder="Ej: FIGURA PÚBLICA, INSTITUCIÓN..." />
                </div>

                <div>
                    <Label for="contexto" class="mb-2">Palabras Claves / Contexto</Label>
                    <Textarea id="contexto" name="contexto" bind:value={formData.contexto} required rows={3} placeholder="Mismas palabras para coincidir con scraper" />
                    <p class="text-xs text-gray-500 mt-1">Usa texto clave que define el espectro de búsqueda de esta entidad.</p>
                </div>
            </div>

            <div class="flex justify-end gap-3 mt-6 border-t pt-4">
                <Button color="alternative" on:click={() => (showModal = false)}>Cancelar</Button>
                <Button type="submit" color="blue" disabled={isSubmitting}>
                    {isSubmitting ? 'Guardando...' : 'Guardar Entidad'}
                </Button>
            </div>
        </form>
	</Modal>
</div>
</div>
