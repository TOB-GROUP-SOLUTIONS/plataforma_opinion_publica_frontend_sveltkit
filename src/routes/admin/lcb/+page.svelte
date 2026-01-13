<script lang="ts">
    import DataTable from '$lib/components/dashboard/DataTable.svelte';
    import { Modal, Button, Label, Input } from 'flowbite-svelte';
    import { enhance } from '$app/forms';
    import type { Reference } from '$lib/interfaces/references.interface';
    import SearchInput from '$lib/components/dashboard/SearchInput.svelte';
    import Toast from '$lib/components/ui/Toast.svelte';


    export let data: any;
    export let form: any;

    let references: Reference[] = [];
    let totalPages = 1;
    let currentPage = 1;
	let successMessage = '';
	let errorMessage = '';
    
    // Modal state
    let showModal = false;
    let isSubmitting = false;

    $: if (data?.referrers) {
        references = data.referrers || [];
        totalPages = data.meta?.totalPages || 1;
        currentPage = data.meta?.currentPage || 1;
    }

    // Manejar respuesta del action
    $: if (form?.success) {
        showModal = false;
        // Opcional: mostrar mensaje de éxito
    }

    const columns = [
        { key: 'name', label: 'Nombre' },
        { key: 'contact_email', label: 'Email' },
    ];

    function render(key: string, obj: Reference): any {
        return obj[key as keyof Reference] || '-';
    }

    function handleNewLead() {
        showModal = true;
    }

    function handleEdit(obj: Reference) {
        console.log('Edit:', obj);
    }

    function handleDelete(obj: Reference) {
        console.log('Delete:', obj);
    }
	
	function handleCreateReference(){
        return async ({ result, update }: any) => {
			if (result.type === 'success') {
				//Cerramos el modal y lanzamos el mensaje de éxito
				showModal = false;
				successMessage = 'LCB creado correctamente';

				//Actualizamos los datos
				await update();
			} else {
				errorMessage = result.error || 'Error al derivar la conversación';
			}
		}
	}

</script>

<div class="min-h-screen bg-white p-6">
    <div class="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <button
            on:click={handleNewLead}
            class="bg-[#DD9905] text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-[#c58804] transition-colors"
        >
            <span class="text-xl">+</span>
            Nuevo LCB
        </button>

        <div class="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
            <SearchInput placeholder="Buscar por nombre, DNI, teléfono" />

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

    <DataTable
        {columns}
        data={references}
        {render}
		defaultActions={[ "generate_form",'edit', 'delete' ]}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        orderCols={['name', 'contact_email']}
    />

    {#if totalPages > 1}
        <div class="flex justify-center gap-2 mt-6">
            {#each Array(totalPages) as _, i}
                <button
                    class={`px-3 py-1 rounded ${
                        currentPage === i + 1
                            ? 'bg-[#0C2C65] text-white'
                            : 'bg-gray-200 text-gray-700'
                    }`}
                    on:click={() => (currentPage = i + 1)}
                >
                    {i + 1}
                </button>
            {/each}
        </div>
    {/if}
</div>

<!-- Modal para crear LCB -->
<Modal bind:open={showModal} size="md" autoclose={false}>
    <form 
        method="POST" 
        action="?/createReference"
        use:enhance={handleCreateReference}
        class="space-y-6"
    >
        <h3 class="text-xl font-semibold text-gray-900">
            Nuevo LCB
        </h3>
        
        <div>
            <Label for="name" class="mb-2">Nombre y Apellido</Label>
            <Input
                id="name"
                name="name"
                type="text"
                placeholder="Ingresa el nombre completo"
                required
                disabled={isSubmitting}
            />
        </div>

        <div>
            <Label for="email" class="mb-2">Email</Label>
            <Input
                id="email"
                name="contact_email"
                type="email"
                placeholder="correo@ejemplo.com"
                required
                disabled={isSubmitting}
            />
        </div>

        <input type="hidden" name="type" value="LCB" />

        <div class="flex gap-3 justify-end">
            <Button 
                type="button"
                color="alternative" 
                on:click={() => showModal = false} 
                disabled={isSubmitting}
            >
                Cancelar
            </Button>
            <Button type="submit" color="blue" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : 'Guardar'}
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