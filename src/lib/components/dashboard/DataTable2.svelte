<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import {
		EditSolid,
		PaperClipOutline,
		TrashBinSolid,
		CaretRightSolid
	} from 'flowbite-svelte-icons';
	import SortBtn from '../SortBtn.svelte';

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
	<!-- Content of the other element -->
</div>

<Table>
	<TableHead>
		{#each headers as col, i}
			{#if col === 'ID'}
				<TableHeadCell class="p-1 border-l border-r border-[1px] border-gray-300 bg-gray-200">
					{#if orderCols.includes(keys[i])}
						<SortBtn key={keys[i]} label={col} />
					{:else}
						{col}
					{/if}
				</TableHeadCell>
			{:else}
				<TableHeadCell
					class="min-w-44 p-1 border-l border-r border-[1px] border-gray-300 bg-gray-200"
				>
					{#if orderCols.includes(keys[i])}
						<SortBtn key={keys[i]} label={col} />
					{:else}
						{col}
					{/if}
				</TableHeadCell>
			{/if}
		{/each}
		{#if showActions}
			<TableHeadCell class="sticky right-0 bg-gray-200 border-[1px] border-gray-300"
				>Acciones</TableHeadCell
			>
		{/if}
	</TableHead>
	<TableBody>
		{#each data as obj}
			<TableBodyRow class="hover:bg-slate-300">
				{#each keys as key}
					{#if key === 'id'}
						<TableBodyCell tdClass="w-fit p-1 border-l border-r border-[1px] border-gray-300">
							{render(key, obj)}
						</TableBodyCell>
					{:else}
						<TableBodyCell tdClass="min-w-44 p-1 border-l border-r border-[1px] border-gray-300">
							{@html render(key, obj)}
						</TableBodyCell>
					{/if}
				{/each}
				{#if showActions}
					<TableBodyCell
						class="sticky right-0 bg-gray-100 z-1 hover:bg-slate-300 border-[1px] border-gray-300"
					>
						<div class="flex gap-3 justify-end">
							{#each actions as action}
								<svelte:component
									this={action.component}
									on:click={() => dispatch(action.event, { data: obj })}
									{...action.props}
								/>
							{/each}
							{#if defaultActions.includes('viewFiles')}
								<button on:click={() => dispatch('files', { data: obj })}>
									<PaperClipOutline color="blue" size="lg" />
								</button>
							{/if}
							{#if defaultActions.includes('edit') && (obj.estado?.descripcion !== 'resuelto' || user?.roles[0].descripcion === 'superadmin')}
								<button on:click={() => dispatch('edit', { data: obj })}>
									<EditSolid color="#75b625" size="lg" />
								</button>
							{/if}
							{#if defaultActions.includes('delete') && user?.roles[0].descripcion === 'superadmin' && user?.agente?.usuarioId !== obj.id}
								<button on:click={() => dispatch('delete', { data: obj })}>
									<TrashBinSolid color="red" size="lg" />
								</button>
							{/if}
							{#if defaultActions.includes('goToArea') && obj.areasHijas.length >= 0}
								<button on:click={() => dispatch('goToArea', { data: obj })}>
									<CaretRightSolid
										color={`${obj.areasHijas.length === 0 ? '#ffdf00' : 'blue'}`}
										size="lg"
									/>
								</button>
							{/if}
							{#if defaultActions.includes('ver-historial')}
								<button
									class="text-primary-900 hover:underline"
									on:click={() => dispatch('ver-historial', { data: obj })}
								>
									Ver historial
								</button>
							{/if}
						</div>
					</TableBodyCell>
				{/if}
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
{#if data.length === 0}
	<p class="p-4 text-center font-popLight uppercase">No se encontraron datos</p>
{/if}
