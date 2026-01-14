<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import {
		Table,
		Button,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Tooltip
	} from 'flowbite-svelte';
	import {
		EditSolid,
		PaperClipOutline,
		TrashBinSolid,
		CaretRightSolid,
		CheckCircleSolid,
		QrCodeOutline,
		PenOutline,
		FileLinesSolid,
		AnnotationSolid,
		EyeOutline,
		TrashBinOutline,
		ExclamationCircleSolid,
		UserSolid,
		ReceiptSolid,
		CogSolid

	} from 'flowbite-svelte-icons';
	import SortBtn from '../SortBtn.svelte';
	import ActionsDropdown from './ActionsDropdown.svelte';
	import { page } from '$app/stores';

	export let user: any;
	export let columns: Record<string, string>[] = [];
	export let data: any;

	export let render: (key: string, obj: any) => any;
	export let actions: any = [];
	export let defaultActions: string[] = ['edit'];

	const dispatch = createEventDispatcher();

	export let orderCols: string[] = [];

	function syncScroll() {
		const tableContainer = document.querySelector('.overflow-x-auto.relative')!;
		const scrollContainer = document.getElementById('scrollContainer')!;
		tableContainer.scroll({ left: scrollContainer.scrollLeft });
	}

	function syncScroll2() {
		const tableContainer = document.querySelector('.overflow-x-auto.relative')!;
		const scrollContainer = document.getElementById('scrollContainer')!;
		scrollContainer.scroll({ left: tableContainer.scrollLeft });
	}

	onMount(() => {
		const mytable = document.querySelector('table')!;
		const tableContainer = document.querySelector('.overflow-x-auto.relative')!;
		const scroll = document.getElementById('scroll')!;
		const scrollContainer = document.getElementById('scrollContainer')!;
		scroll.style.width = mytable.clientWidth + 'px';
		scrollContainer.addEventListener('scroll', syncScroll);
		tableContainer.addEventListener('scroll', syncScroll2);
	});
	$: headers = columns?.map((col: any) => col.label);
	$: keys = columns?.map((col: any) => col.key);
	$: showActions = defaultActions?.length + actions?.length > 0;
</script>

<div id="scrollContainer" class="overflow-x-auto mt-4">
    <div id="scroll" class="h-1"></div>
</div>

<div class="overflow-visible">
    <Table class="bg-white w-full table-fixed">
        <TableHead>
            {#each headers as col, i}
                <TableHeadCell class="px-6 py-4 bg-white text-[#0C2C65] text-sm font-semibold uppercase border-b border-gray-200">
                    {#if orderCols.includes(keys[i])}
                        <SortBtn key={keys[i]} label={col} />
                    {:else}
                        {col}
                    {/if}
                </TableHeadCell>
            {/each}
            {#if showActions}
                <TableHeadCell class="px-6 py-4 bg-white text-[#0C2C65] text-sm font-semibold uppercase border-b border-gray-200 text-center">
                    Acciones
                </TableHeadCell>
            {/if}
        </TableHead>
        <TableBody>
            {#each data as obj}
                <TableBodyRow class="bg-white border-b border-gray-200">
                    {#each keys as key}
                        <TableBodyCell tdClass="px-6 py-4 text-[#6F6C6C] align-middle">
                            {@html render(key, obj)}
                        </TableBodyCell>
                    {/each}
                    
                    {#if showActions}
                        <TableBodyCell class="px-6 py-4 bg-white overflow-visible align-middle">
                            <div class="flex gap-2 justify-center items-center relative">
                                {#each actions as action}
                                    <svelte:component
                                        this={action.component}
                                        on:click={() => dispatch(action.event, { data: obj })}
                                        {...action.props}
                                    />
                                {/each}
            
                                {#if $page.url.pathname === '/admin/nuevos-interesados'}
                                    <ActionsDropdown
                                        actions={[
                                            { label: 'Ver ficha', event: 'view', icon: EyeOutline, class: 'bg-[#4D6591] text-white rounded-full' },
                                            { label: 'Asignar responsable', event: 'asingToUser', icon: UserSolid, class: 'bg-[#7597D5] text-white rounded-full' }
                                        ]}
                                        on:view={() => dispatch('view', { data: obj })}
                                        on:asingToUser={() => dispatch('asingToUser', { data: obj })}
                                    />
                                {/if}
            
                                {#if $page.url.pathname === '/admin/lcb'}
                                    {#if defaultActions.includes('generate_form')}
                                        <Button 
                                            on:click={() => dispatch('generate_form', { data: obj })} 
                                            class="bg-[#7597D5] hover:bg-[#6486c4] text-white text-sm px-4 py-3"
                                        >
                                            Generar Formulario
                                        </Button>
                                    {/if}
                                    {#if defaultActions.includes('edit')}
                                        <Button 
                                            on:click={() => dispatch('edit', { data: obj })} 
                                            class="bg-[#00437B] hover:bg-[#003561] px-4 py-3"
                                        >
                                            Editar
                                        </Button>
                                    {/if}
                                    {#if defaultActions.includes('delete')}
                                        <Button 
                                            on:click={() => dispatch('delete', { data: obj })} 
                                            class="bg-[#6F6C6C] hover:bg-[#5a5858] px-4 py-3"
                                        >
                                            <TrashBinOutline class="text-white w-5 h-5" />
                                        </Button>
                                    {/if}
                                {/if}

                                {#if $page.url.pathname === '/admin/mis-leads'}
                                    <ActionsDropdown
                                        actions={[
                                            { label: 'Ver ficha', event: 'view', icon: EyeOutline, class: 'bg-[#4D6591] text-white rounded-full text-sm' },
											{ label: 'Agregar presupuesto', event: 'add_budget', icon: ReceiptSolid, class: 'text-sm bg-[#666666] text-white rounded-full' },
                                            { label: 'Cambiar responsable', event: 'asingToUser', icon: UserSolid, class: ' text-sm bg-[#7597D5] text-white rounded-full' },
											{label: 'Cambiar estado', event: 'change_status', icon: CogSolid, class: ' text-sm  bg-green-600 text-white rounded-full' }
                                        ]}
                                        on:view={() => dispatch('view', { data: obj })}
                                        on:asingToUser={() => dispatch('asingToUser', { data: obj })}
                                        on:change_status={() => dispatch('change_status', { data: obj })}
										on:add_budget={() => dispatch('add_budget', { data: obj })}
                                    />
                                {/if}


                            </div>
                        </TableBodyCell>
                    {/if}
                </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
</div>

{#if data.length === 0}
    <p class="p-4 text-center font-popLight uppercase">No se encontraron datos</p>
{/if}
