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
	import SearchIcon from '$lib/components/ui/searchIcon.svelte';
	import CalendarIcon from '$lib/components/ui/calendarIcon.svelte';

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
		{ key: 'city', label: 'Localidad' }
	];

	$: budgets = data?.budgets ?? [];

	$: results = data?.searchResults ?? [];
	let searching = false;

	function handleView(item: any) {
		const fileUrl = item.file?.url || item.file_id;
		window.open(fileUrl, '_blank');
	}
	async function handleDownload(item: any) {
		const fileUrl = item.file?.url || item.file_id;
		if (!fileUrl) return;

		const response = await fetch(fileUrl);
		const blob = await response.blob();

		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');

		a.href = url;
		a.download = item.file?.name || 'archivo';
		document.body.appendChild(a);
		a.click();

		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);
	}
	function handleGoToLead(item: any) {
		goto('/admin/mis-leads');
	}

	// Handlers requeridos por DataTable (stubs mínimos)
	function handleEdit(item: any) {
		console.log('edit', item);
	}

	function handleDelete(item: any) {
		console.log('delete', item);
	}

	onMount(() => {
		try {
			const params = new URLSearchParams(window.location.search);
			const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
			if (params.get('validDate') !== today) {
				params.set('validDate', today);
				goto(`?${params.toString()}`, { replaceState: true });
			}
		} catch (err) {
			console.error('Error setting validDate param:', err);
		}
	});

	let search =
		typeof window !== 'undefined'
			? (new URLSearchParams(window.location.search).get('search') ?? '')
			: '';
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
			goto(`?${params.toString()}`, { keepFocus: true, noScroll: true });
		}, 400);
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

	const typeRouteMap: Record<string, (r: any) => string> = {
		LEAD: (r) => `/admin/todos?query=${encodeURIComponent(r.title ?? '')}`,
		PRESUPUESTO: (r) => `/admin?search=${encodeURIComponent(r.title ?? '')}`,
		'LCB-PROFESORES': (r) => `/admin/lcb`
	};

	const typeLabelMap: Record<string, string> = {
		LEAD: '👤 Lead',
		PRESUPUESTO: '📄 Presupuesto',
		'LCB-PROFESORES': '🏫 LCB / Profesor'
	};

	function handleResultClick(r: any) {
		search = '';
		const buildUrl = typeRouteMap[r.type];
		if (buildUrl) {
			goto(buildUrl(r));
		} else {
			console.warn('Tipo de resultado desconocido:', r.type);
		}
	}

	console.log('Initial search results:', results);
</script>

<svelte:head>
	<title>Inicio</title>
</svelte:head>
<div class="w-full max-w-screen-4xl rounded-lg mx-auto bg-transparent dark:bg-gray-800 px-6 py-8 ">
	<div class="w-full flex flex-col justify-center mb-8 shadow-md">
		<div class="w-full max-w-[1700px] mx-auto">
			<div
				class="bg-white rounded-lg p-4 flex items-center gap-4 shadow-sm border-t-2 border-[#0C2C65]/70"
			>
				<div
					class="w-12 h-12 rounded-md bg-gradient-to-br from-[#0C2C65]/40 to-[#0C2C65] flex items-center justify-center shadow-sm"
				>
					<SearchIcon />
				</div>
				<div>
					<h1 class="text-2xl font-semibold text-[#0C2C65]">Centro de Búsqueda</h1>
					<p class="text-sm text-gray-500 mt-1">Encuentra presupuestos, clientes y contactos</p>
				</div>
			</div>

			<div class="mt-4 relative bg-white rounded-lg p-4">
				<Input
					id="globalSearch"
					placeholder="Buscar por nombre, DNI, teléfono"
					class="h-12 w-full bg-[#F3F4F6] pl-12 rounded-lg"
					bind:value={search}
					on:input={onSearchInput}
				/>
				{#if searching}
					<div
						class="absolute top-full mt-2 w-full bg-white border rounded shadow z-50 p-3 text-center"
					>
						Buscando...
					</div>
				{:else if results && results.length > 0}
					<div
						class="absolute top-full mt-2 w-full bg-white border rounded shadow z-50 p-2 max-h-64 overflow-auto"
					>
						<ul>
							{#each results as r}
								<li
									class="p-2 hover:bg-gray-100 rounded cursor-pointer"
									on:click={() => handleResultClick(r)}
								>
									<div class="font-medium">
										{r.title} <span class="text-sm text-gray-500">({r.type})</span>
									</div>
									{#if r.subtitle}
										<div class="text-sm text-gray-600">{r.subtitle}</div>
									{/if}
								</li>
							{/each}
						</ul>
					</div>
				{:else if search.trim() !== ''}
					<div
						class="absolute top-full mt-2 w-full bg-white border rounded shadow z-50 p-3 text-center"
					>
						No hay resultados
					</div>
				{/if}
			</div>
		</div>
	</div>
	<div class="flex justify-center gap-4 p-4 sm:flex-row flex-col"></div>
</div>

<div class="w-full max-w-screen-4xl mx-auto px-6 pt-2 pb-8 mt-2">
	<div class="w-full max-w-[1700px] mx-auto space-y-4">
		<!-- Header -->
		<div
			class="bg-white rounded-lg p-4 flex items-center gap-4 shadow-md border-t-2 border-[#0C2C65]/20"
		>
			<div
				class="w-12 h-12 rounded-md bg-gradient-to-br from-[#0C2C65]/40 to-[#0C2C65] flex items-center justify-center"
			>
				<CalendarIcon />
			</div>
			<div class="flex-1 text-left">
				<h2 class="text-xl font-semibold text-red-600 dark:text-white">
					Próximos vencimientos de Presupuestos
				</h2>
			</div>
		</div>

		<!-- Tabla -->
		<div class="bg-white rounded-lg overflow-hidden">
			<DataTable
				columns={columnsBudgets}
				orderCols={['date']}
				data={budgets}
				render={renderBudget}
				defaultActions={['view', 'change_status', 'download']}
				handleView={(e) => handleView(e.detail.data)}
				handleDownload={(e) => handleDownload(e.detail.data)}
				handleGoToLead={(e) => handleGoToLead(e.detail.data)}
				handleEdit={(e) => handleEdit(e.detail.data)}
				handleDelete={(e) => handleDelete(e.detail.data)}
			/>
		</div>
	</div>
</div>

{#if successMessage.length > 0}
	<Toast type="success" dismissible={true} showToast={true} bind:successMessage />
{/if}
