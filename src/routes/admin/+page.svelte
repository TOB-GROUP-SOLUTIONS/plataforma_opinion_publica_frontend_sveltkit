<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Button, Label, Modal, Helper, Popover, Card, Select } from 'flowbite-svelte';
	import { UserAddOutline, CirclePlusOutline } from 'flowbite-svelte-icons';
	import { Search } from 'flowbite-svelte';
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

	console.log('Budgets:', budgets);

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
	});

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
    <div class="w-full max-w-[898px] flex justify-center">
			<Search placeholder="Buscar por nombre,DNI,telefono" class="h-20 max-w-[898px] bg-[#02325A26]" />
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
		/>
	</div>
</div>

{#if successMessage.length > 0}
	<Toast type="success" dismissible={true} showToast={true} bind:successMessage />
{/if}
