<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	export let data: any;

	// Computed dynamic data from API
	$: overview = data?.dashboard || {};
	$: kpis = overview.kpis || { 
		totalMenciones: { valor: 0, variacion: 0, esPositivo: true }, 
		impactoArticulos: { valor: 0, variacion: 0, esPositivo: true },
		sentimientoNeto: { valor: 0, variacion: 0, esPositivo: true }
	};
	$: topTemas = overview.topTemas || [];
	$: cuentasActivas = overview.cuentasActivas || [];
	$: dias = String($page.data?.filters?.dias || '7');
	$: entidadId = $page.data?.filters?.entidadId ? String($page.data.filters.entidadId) : '';
	$: redSocial = String($page.data?.filters?.redSocial || '');
	$: entidadesDropdown = $page.data?.entidades || [];

	// Action to load and render ApexCharts seamlessly in Svelte without SSR issues
	function chartAction(node: HTMLElement, options: any) {
		let chartInstance: any;
		if (browser) {
			import('apexcharts').then((module) => {
				const ApexCharts = module.default;
				chartInstance = new ApexCharts(node, options);
				chartInstance.render();
			});
		}
		return {
			update(newOptions: any) {
				if (chartInstance) {
					chartInstance.updateOptions(newOptions);
				}
			},
			destroy() {
				if (chartInstance) {
					chartInstance.destroy();
				}
			}
		};
	}

	function handleFilterChange(e: Event) {
		const target = e.target as HTMLSelectElement | null;
		if (target && target.form) {
			target.form.submit();
		}
	}

	// Chart Options definitions mapped from API dynamically
	$: volumeChartOptions = {
		chart: { type: 'area', height: 420, toolbar: { show: false }, zoom: { enabled: false }, fontFamily: 'inherit' },
		stroke: { curve: 'smooth', width: 2 },
		colors: ['#0ea5e9'],
		fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.1, opacityTo: 0, stops: [0, 100] } },
		series: overview.evolucionVolumen?.series || [],
		xaxis: { categories: overview.evolucionVolumen?.categorias || [], axisBorder: { show: false }, axisTicks: { show: false } },
		yaxis: { tickAmount: 5, labels: { formatter: (val: number) => val.toLocaleString() } },
		dataLabels: { enabled: false },
		responsive: [
			{
				breakpoint: 1024,
				options: {
					chart: { height: 360 }
				}
			},
			{
				breakpoint: 640,
				options: {
					chart: { height: 300 }
				}
			}
		]
	};

	$: sentimentDonutOptions = {
		chart: { type: 'donut', height: 320, fontFamily: 'inherit' },
		labels: overview.sentimientoGeneral?.labels || [],
		series: overview.sentimientoGeneral?.series || [],
		colors: ['#10b981', '#f59e0b', '#ef4444'],
		plotOptions: { pie: { donut: { size: '65%' }, expandOnClick: false } },
		dataLabels: { enabled: false },
		legend: { position: 'bottom', horizontalAlign: 'center', markers: { radius: 12 }, itemMargin: { horizontal: 10 } },
		responsive: [
			{
				breakpoint: 640,
				options: {
					chart: { height: 280 }
				}
			}
		]
	};

	$: sentimentBarOptions = {
		chart: { type: 'bar', height: 350, toolbar: { show: false }, fontFamily: 'inherit' },
		plotOptions: { bar: { horizontal: false, columnWidth: '30%', borderRadius: 2 } },
		dataLabels: { enabled: false },
		stroke: { show: true, width: 2, colors: ['transparent'] },
		series: overview.sentimientoMediosVsUsuarios?.series || [],
		xaxis: { categories: overview.sentimientoMediosVsUsuarios?.categorias || [] },
		yaxis: { show: false },
		colors: ['#0f172a', '#cbd5e1'],
		fill: { opacity: 1 },
		legend: { position: 'top', horizontalAlign: 'center' }
	};

	$: channelDonutOptions = {
		chart: { type: 'donut', height: 320, fontFamily: 'inherit' },
		labels: overview.distribucionCanal?.labels || [],
		series: overview.distribucionCanal?.series || [],
		colors: ['#1877f2', '#0f172a', '#e1306c', '#94a3b8'],
		plotOptions: { pie: { donut: { size: '65%' }, expandOnClick: false } },
		dataLabels: { enabled: false },
		legend: { position: 'right', verticalAlign: 'middle', markers: { radius: 12 }, itemMargin: { vertical: 5 } },
		responsive: [
			{
				breakpoint: 1024,
				options: {
					legend: { position: 'bottom', horizontalAlign: 'center' }
				}
			},
			{
				breakpoint: 640,
				options: {
					chart: { height: 280 }
				}
			}
		]
	};
</script>

<svelte:head>
	<title>Vista General - Admin</title>
</svelte:head>

<!--
  Wrapper gris que cubre el área visible completa.
  Compensa el padding del `Layout` para que no quede franja blanca alrededor.
-->
<div class="h-full w-full bg-gray-50 -mx-2 lg:-mx-4 -mt-4 -mb-36 md:-mb-8">
	<div class="p-4 md:p-6 font-sans text-gray-800 space-y-6">
		<!-- Se eliminaron los filtros locales porque ahora están en el TopBar -->

		<!-- Top row: temas + KPI -->
		<div class="w-full">
			<div class="grid w-full grid-cols-1 md:grid-cols-3 gap-4">
				<div class="bg-white p-4 md:p-5 rounded-xl border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)]">
					<h3 class="text-gray-500 text-sm font-medium">Menciones Totales</h3>
					<div class="mt-2 flex items-baseline gap-2 flex-wrap">
						<span class="text-2xl md:text-3xl font-bold text-gray-900">{kpis.totalMenciones.valor.toLocaleString()}</span>
						<span class="text-sm {kpis.totalMenciones.esPositivo ? 'text-green-500' : 'text-red-500'} font-medium flex items-center">
							{kpis.totalMenciones.esPositivo ? '↑' : '↓'} {Math.abs(kpis.totalMenciones.variacion)}%
						</span>
					</div>
				</div>
				<div class="bg-white p-4 md:p-5 rounded-xl border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)]">
					<h3 class="text-gray-500 text-sm font-medium">Alcance Global</h3>
					<div class="mt-2 flex items-baseline gap-2 flex-wrap">
						<span class="text-2xl md:text-3xl font-bold text-gray-900">{kpis.impactoArticulos.valor.toLocaleString()}</span>
						<span class="text-sm {kpis.impactoArticulos.esPositivo ? 'text-green-500' : 'text-red-500'} font-medium flex items-center">
							{kpis.impactoArticulos.esPositivo ? '↑' : '↓'} {Math.abs(kpis.impactoArticulos.variacion)}%
						</span>
					</div>
				</div>
				<div class="bg-white p-4 md:p-5 rounded-xl border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)]">
					<h3 class="text-gray-500 text-sm font-medium">Sentimiento Neto</h3>
					<div class="mt-2 flex items-baseline gap-2 flex-wrap">
						<span class="text-2xl md:text-3xl font-bold text-gray-900">{kpis.sentimientoNeto.valor}%</span>
						<span class="text-sm {kpis.sentimientoNeto.esPositivo ? 'text-green-500' : 'text-red-500'} font-medium flex items-center">
							{kpis.sentimientoNeto.esPositivo ? '↑' : '↓'} {Math.abs(kpis.sentimientoNeto.variacion)}%
						</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Donuts -->
		<div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
			<div class="bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] flex flex-col">
				<h3 class="text-lg font-bold text-gray-900 mb-4">Sentimiento General</h3>
				{#if overview.sentimientoGeneral}
					<div class="flex-grow flex items-center justify-center w-full min-h-[260px]" use:chartAction={sentimentDonutOptions}></div>
				{/if}
			</div>
			<div class="bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] flex flex-col">
				<h3 class="text-lg font-bold text-gray-900 mb-4">Distribución por Canal</h3>
				{#if overview.distribucionCanal}
					<div class="flex-grow flex items-center justify-center w-full min-h-[260px]" use:chartAction={channelDonutOptions}></div>
				{/if}
			</div>
		</div>

		<!-- Row: cuentas y top temas -->
		<div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
			<div class="bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)]">
				<h3 class="text-lg font-bold text-gray-900 mb-4">Cuentas más Activas</h3>
				<div class="overflow-x-auto">
					<table class="w-full text-sm text-left text-gray-600">
						<thead class="text-xs text-gray-400 capitalize bg-white">
							<tr>
								<th class="px-2 py-3 font-semibold w-1/2 line-clamp-1 border-b border-gray-100">Cuenta</th>
								<th class="px-2 py-3 font-semibold border-b border-gray-100">Red</th>
								<th class="px-2 py-3 font-semibold text-right border-b border-gray-100">Menciones</th>
							</tr>
						</thead>
						<tbody>
							{#each cuentasActivas as cuenta}
								<tr class="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
									<td class="px-2 py-3.5 font-semibold text-gray-800">{cuenta.cuenta}</td>
									<td class="px-2 py-3.5 font-semibold text-xs flex items-center gap-2 {cuenta.color} mt-0.5">
										{#if cuenta.red === 'Facebook'}
											<div class="w-2 h-2 rounded-full bg-blue-600"></div>
										{:else if cuenta.red === 'Web/Medios'}
											<div class="w-2 h-2 rounded-full bg-gray-400"></div>
										{:else if cuenta.red === 'X'}
											<div class="w-2 h-2 rounded-full bg-black"></div>
										{:else if cuenta.red === 'Instagram'}
											<div class="w-2 h-2 rounded-full bg-pink-600"></div>
										{/if}
										{cuenta.red}
									</td>
									<td class="px-2 py-3.5 text-right font-medium text-gray-900">{cuenta.menciones}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>

			<div class="bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)]">
				<h3 class="text-lg font-bold text-gray-900 mb-4">Top Temas del Momento</h3>
				<div class="space-y-5">
					{#each topTemas as tema}
						<div>
							<div class="flex justify-between mb-2 text-sm">
								<span class="font-medium text-gray-800">{tema.nombre}</span>
								<span class="text-gray-500 font-medium">{tema.valor.toLocaleString()}
									{#if tema.porcentaje > 50}
										<span class="text-red-500 font-bold ml-1">▲</span>
									{:else}
										<span class="text-green-500 font-bold ml-1">▼</span>
									{/if}
								</span>
							</div>
							<div class="w-full bg-gray-100 rounded-full h-2.5">
								<div class="bg-slate-800 h-2.5 rounded-full" style="width: {tema.porcentaje}%"></div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Gráfico principal al final -->
		<div class="bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)]">
			<div class="flex justify-between items-center mb-2">
				<h3 class="text-lg font-bold text-gray-900">Evolución del Volumen</h3>
				<button class="text-gray-400 hover:text-gray-600 font-bold px-2">···</button>
			</div>
			{#if overview.evolucionVolumen}
				<div class="w-full" use:chartAction={volumeChartOptions}></div>
			{/if}
		</div>
	</div>
</div>
