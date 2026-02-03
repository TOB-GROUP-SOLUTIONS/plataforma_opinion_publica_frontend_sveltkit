<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Button, Label, Modal, Helper, Popover, Card, Select } from 'flowbite-svelte';
	import { UserAddOutline, CirclePlusOutline } from 'flowbite-svelte-icons';
	import { Search, Input } from 'flowbite-svelte';
	import { get } from '$lib/api';
	import Toast from '$lib/components/ui/Toast.svelte';
	import { enhance } from '$app/forms';
	import DataTable from '$lib/components/dashboard/DataTable.svelte';
	
	export let data;
	/*     let user = data.user;
	 */
	let sending = false;
	let errorMessage = '';
	let successMessage = '';
	let formModal = false;
	let currentProjectId = '';
	let selectedLotId = '';
	let numeroCuotas = 1;
	let litrosPorCuota = 1;
	let lotesProyecto = [];

	// Datos para la tabla de presupuestos (si vienen desde el server)
	const columnsBudgets = [
		{ key: 'valid_until', label: 'Fecha' },
		{ key: 'budget_number', label: 'Nº de presupuesto' },
		{ key: 'name', label: 'Nombre y Apellido' },
		{ key: 'source', label: 'Origen' },
		{ key: 'city', label: 'Localidad' },
	];

	let budgets = data?.budgets ?? [];

	// resultados de búsqueda (se inicializan desde SSR si el load los devolvió)
	let results: any[] = data?.searchResults ?? [];
	let searching = false;

	console.log('Budgets:', budgets);

	// Handlers mínimos para DataTable (evitan error de props faltantes)
	function handleEdit(item: any) {
		console.log('edit', item);
	}
	function handleDelete(item: any) {
		console.log('delete', item);
	}

	// Al montar la página, asegurarse de que el query param validDate esté presente con la fecha de hoy
	onMount(() => {
	  try {
	    const params = new URLSearchParams(window.location.search);
	    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
	    if (params.get('validDate') !== today) {
	      params.set('validDate', today);
	      // usar replaceState para no agregar entrada al historial
	      goto(`?${params.toString()}`, { replaceState: true });
	    }
	  } catch (err) {
	    console.error('Error setting validDate param:', err);
	  }

	  // inicializar valor del search desde la URL
	  try {
	    const p = new URLSearchParams(window.location.search);
	    search = p.get('search') ?? '';
	  } catch (e) {
	    search = '';
	  }
	});

	// --- lógica de búsqueda: actualizar query param `search` con debounce ---
	let search = '';
	let searchTimer: any;
	function onSearchInput() {
	  clearTimeout(searchTimer);
	  searchTimer = setTimeout(() => {
	    const params = new URLSearchParams(window.location.search);
	    if (!search || search.trim() === '') {
	      params.delete('search');
	    } else {
	      params.set('search', search.trim());
	    }
	    params.set('page', '1');
	    goto(`${window.location.pathname}?${params.toString()}`, { replaceState: true });

	    // buscar en backend y mostrar resultados en mini-ventana
	    performSearch(search);
	  }, 400);
	}

	async function performSearch(q: string) {
		if (!q || q.trim() === '') {
			results = [];
			return;
		}
		searching = true;
		try {
			const sParams = new URLSearchParams();
			sParams.set('q', q);
			sParams.set('limit', '10');
			const res = await get({ fetch, endpoint: 'search', params: sParams });
			if (res.ok) {
				results = res.data?.results ?? [];
			} else {
				results = [];
			}
		} catch (err) {
			console.error('Search error', err);
			results = [];
		} finally {
			searching = false;
		}
	}

	function renderBudget(key: string, b: any) {
		switch (key) {
			case 'valid_until':
				return b?.valid_until ? new Date(b.valid_until).toLocaleDateString('es-AR') : '-';
			case 'budget_number':
				return b?.budget_number ?? '-';
			case 'name':
				return b?.lead?.full_name ?? b?.customer_name ?? '-';
			case 'source':
				return b?.lead?.source ?? '-';
			case 'city':
				return b?.lead?.city ?? b?.city_name ?? '-';
			default:
				return '-';
		}
	}
</script>

<svelte:head>
	<title>Inicio</title>
</svelte:head>
<div class="w-full max-w-screen-4xl rounded-lg mx-auto bg-transparent dark:bg-gray-800 px-6 py-8">
	<div class="w-full flex flex-col justify-center items-center mb-8">
		<h1 class="text-3xl font-semibold text-[#0C2C65] dark:text-white mb-4 text-center">
			Centro de Busqueda
		</h1>
    <div class="w-full max-w-[898px] flex justify-center relative">
			<Input id="globalSearch" placeholder="Buscar por nombre,DNI,telefono" class="h-12 max-w-[898px] bg-[#02325A26]" bind:value={search} on:input={onSearchInput} />

			<!-- Mini-ventana de resultados -->
			{#if searching}
				<div class="absolute top-full mt-2 w-full max-w-[898px] bg-white border rounded shadow z-50 p-3 text-center">Buscando...</div>
			{:else if results && results.length > 0}
				<div class="absolute top-full mt-2 w-full max-w-[898px] bg-white border rounded shadow z-50 p-2 max-h-64 overflow-auto">
					<ul>
						{#each results as r}
							<li class="p-2 hover:bg-gray-100 rounded cursor-pointer">
								<div class="font-medium">{r.title} <span class="text-sm text-gray-500">({r.type})</span></div>
								{#if r.subtitle}
									<div class="text-sm text-gray-600">{r.subtitle}</div>
								{/if}
							</li>
						{/each}
					</ul>
				</div>
			{:else if search.trim() !== ''}
				<div class="absolute top-full mt-2 w-full max-w-[898px] bg-white border rounded shadow z-50 p-3 text-center">No hay resultados</div>
			{/if}
		</div>
	</div>
	<div class="flex justify-center gap-4 p-4 sm:flex-row flex-col"></div>
</div>

<div class="w-full max-w-screen-4xl rounded-lg mx-auto bg-white px-6 py-8 mt-6">
	<div class="w-full flex flex-col justify-center items-center mb-4">
		<h2 class="text-xl font-semibold text-[#0C2C65] dark:text-white mb-2 text-center">Próximos vencimientos de Presupuestos</h2>
	</div>

	<div class="bg-white rounded-lg overflow-hidden">
		<DataTable
			columns={columnsBudgets}
			orderCols={[ 'date' ]}
			data={budgets}
			render={renderBudget}
			defaultActions={[ 'view' ]}
			handleEdit={handleEdit}
			handleDelete={handleDelete}
		/>
	</div>
</div>

{#if successMessage.length > 0}
	<Toast type="success" dismissible={true} showToast={true} bind:successMessage />
{/if}
