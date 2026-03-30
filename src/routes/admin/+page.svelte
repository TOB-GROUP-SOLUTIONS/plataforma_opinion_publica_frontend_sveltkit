<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	export let data: any;

	$: dias = String(data?.filters?.dias || '7');
	$: redSocial = String(data?.filters?.redSocial || '');
	$: entidadId = data?.filters?.entidadId ? String(data.filters.entidadId) : '';

	// Computed dynamic data from API
	$: overview = data?.dashboard || {};
	$: kpis = overview.kpis || { 
		totalMenciones: { valor: 0, variacion: 0, esPositivo: true }, 
		impactoArticulos: { valor: 0, variacion: 0, esPositivo: true },
		sentimientoNeto: { valor: 0, variacion: 0, esPositivo: true }
	};
	$: topTemas = overview.topTemas || [];
	$: cuentasActivas = overview.cuentasActivas || [];
	$: entidadesDropdown = data?.entidades || [];

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

	// Chart Options definitions mapped from API dynamically
	$: volumeChartOptions = {
		chart: { type: 'area', height: 350, toolbar: { show: false }, zoom: { enabled: false }, fontFamily: 'inherit' },
		stroke: { curve: 'smooth', width: 2 },
		colors: ['#0ea5e9'],
		fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.1, opacityTo: 0, stops: [0, 100] } },
		series: overview.evolucionVolumen?.series || [],
		xaxis: { categories: overview.evolucionVolumen?.categorias || [], axisBorder: { show: false }, axisTicks: { show: false } },
		yaxis: { tickAmount: 5, labels: { formatter: (val: number) => val.toLocaleString() } },
		dataLabels: { enabled: false }
	};

	$: sentimentDonutOptions = {
		chart: { type: 'donut', height: 350, fontFamily: 'inherit' },
		labels: overview.sentimientoGeneral?.labels || [],
		series: overview.sentimientoGeneral?.series || [],
		colors: ['#10b981', '#f59e0b', '#ef4444'],
		plotOptions: { pie: { donut: { size: '65%' }, expandOnClick: false } },
		dataLabels: { enabled: false },
		legend: { position: 'bottom', horizontalAlign: 'center', markers: { radius: 12 }, itemMargin: { horizontal: 10 } }
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
		chart: { type: 'donut', height: 350, fontFamily: 'inherit' },
		labels: overview.distribucionCanal?.labels || [],
		series: overview.distribucionCanal?.series || [],
		colors: ['#1877f2', '#0f172a', '#e1306c', '#94a3b8'],
		plotOptions: { pie: { donut: { size: '65%' }, expandOnClick: false } },
		dataLabels: { enabled: false },
		legend: { position: 'right', verticalAlign: 'middle', markers: { radius: 12 }, itemMargin: { vertical: 5 } }
	};
</script>

<svelte:head>
	<title>Vista General - Admin</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
	<!-- Top Bar -->
	<div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 px-2">
		<h1 class="text-2xl font-bold text-gray-900">Vista General</h1>
		<form method="GET" class="flex flex-wrap gap-3 items-center">
			<select name="dias" value={dias} on:change={(e) => e.currentTarget.form.submit()} class="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg py-2 px-3 outline-none focus:border-blue-500 shadow-sm cursor-pointer hover:bg-gray-50">
				<option value="7">Últimos 7 días</option>
				<option value="30">Últimos 30 días</option>
				<option value="3000">Desde siempre</option>
			</select>
			<select name="redSocial" value={redSocial} on:change={(e) => e.currentTarget.form.submit()} class="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg py-2 px-3 outline-none focus:border-blue-500 shadow-sm cursor-pointer hover:bg-gray-50">
				<option value="">Todas las fuentes</option>
				<option value="Facebook">Facebook</option>
				<option value="X">X</option>
				<option value="Instagram">Instagram</option>
			</select>
			<select name="entidadId" value={entidadId} on:change={(e) => e.currentTarget.form.submit()} class="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg py-2 px-3 outline-none focus:border-blue-500 shadow-sm cursor-pointer hover:bg-gray-50">
				<option value="">Todas las entidades</option>
				{#each entidadesDropdown as entidad}
					<option value={String(entidad.id)}>{entidad.entidad} ({entidad.tipo})</option>
				{/each}
			</select>
			<button type="button" class="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg px-4 py-2 hover:bg-gray-100 transition flex items-center gap-2 shadow-sm font-medium">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
				Exportar
			</button>
		</form>
	</div>

	<!-- KPI Cards -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
		<div class="bg-white p-6 rounded-xl border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow">
			<h3 class="text-gray-500 text-sm font-medium">Menciones Totales</h3>
			<div class="mt-2 flex items-baseline gap-2">
				<span class="text-3xl font-bold text-gray-900">{kpis.totalMenciones.valor.toLocaleString()}</span>
				<span class="text-sm {kpis.totalMenciones.esPositivo ? 'text-green-500' : 'text-red-500'} font-medium flex items-center">
					{kpis.totalMenciones.esPositivo ? '↑' : '↓'} {Math.abs(kpis.totalMenciones.variacion)}% 
					<span class="text-gray-400 ml-1 text-xs font-normal">vs ant.</span>
				</span>
			</div>
		</div>
		<div class="bg-white p-6 rounded-xl border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow">
			<h3 class="text-gray-500 text-sm font-medium">Impacto (Artículos)</h3>
			<div class="mt-2 flex items-baseline gap-2">
				<span class="text-3xl font-bold text-gray-900">{kpis.impactoArticulos.valor.toLocaleString()}</span>
				<span class="text-sm {kpis.impactoArticulos.esPositivo ? 'text-green-500' : 'text-red-500'} font-medium flex items-center">
					{kpis.impactoArticulos.esPositivo ? '↑' : '↓'} {Math.abs(kpis.impactoArticulos.variacion)}% 
					<span class="text-gray-400 ml-1 text-xs font-normal">vs ant.</span>
				</span>
			</div>
		</div>
		<div class="bg-white p-6 rounded-xl border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow">
			<h3 class="text-gray-500 text-sm font-medium">Sentimiento Neto</h3>
			<div class="mt-2 flex items-baseline gap-2">
				<span class="text-3xl font-bold text-gray-900">{kpis.sentimientoNeto.valor}%</span>
				<span class="text-sm {kpis.sentimientoNeto.esPositivo ? 'text-green-500' : 'text-red-500'} font-medium flex items-center">
					{kpis.sentimientoNeto.esPositivo ? '↑' : '↓'} {Math.abs(kpis.sentimientoNeto.variacion)}% 
					<span class="text-gray-400 ml-1 text-xs font-normal">vs ant.</span>
				</span>
			</div>
		</div>
	</div>

	<!-- Charts Row 1 -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
		<!-- Volumes Chart -->
		<div class="bg-white p-6 rounded-xl border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] lg:col-span-2">
			<div class="flex justify-between items-center mb-2">
				<h3 class="text-lg font-bold text-gray-900">Evolución del Volumen</h3>
				<button class="text-gray-400 hover:text-gray-600 font-bold px-2">···</button>
			</div>
			{#if overview.evolucionVolumen}
				<div class="w-full" use:chartAction={volumeChartOptions}></div>
			{/if}
		</div>
		
		<!-- Sentiment Donut -->
		<div class="bg-white p-6 rounded-xl border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] flex flex-col">
			<div class="flex justify-between items-center mb-2">
				<h3 class="text-lg font-bold text-gray-900">Sentimiento General</h3>
				<button class="text-gray-400 hover:text-gray-600 font-bold px-2">···</button>
			</div>
			{#if overview.sentimientoGeneral}
				<div class="flex-grow flex items-center justify-center w-full min-h-[300px]" use:chartAction={sentimentDonutOptions}></div>
			{/if}
		</div>
	</div>

	<!-- Charts Row 2 -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
		<div class="bg-white p-6 rounded-xl border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] flex flex-col">
			<div class="flex justify-between items-center mb-4">
				<h3 class="text-lg font-bold text-gray-900">Sentimiento: Medios vs. Usuarios</h3>
			</div>
			{#if overview.sentimientoMediosVsUsuarios}
				<div class="w-full flex-grow flex items-center justify-center" use:chartAction={sentimentBarOptions}></div>
			{/if}
		</div>
		<div class="bg-white p-6 rounded-xl border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] flex flex-col">
			<div class="flex justify-between items-center mb-4">
				<h3 class="text-lg font-bold text-gray-900">Distribución por Canal</h3>
			</div>
			{#if overview.distribucionCanal}
				<div class="flex-grow flex items-center justify-center w-full min-h-[300px]" use:chartAction={channelDonutOptions}></div>
			{/if}
		</div>
	</div>

	<!-- Bottom Row -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- Top Temas -->
		<div class="bg-white p-6 rounded-xl border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)]">
			<h3 class="text-lg font-bold text-gray-900 mb-6">Top Temas del Momento</h3>
			<div class="space-y-6">
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

		<!-- Cuentas más Activas -->
		<div class="bg-white p-6 rounded-xl border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)]">
			<h3 class="text-lg font-bold text-gray-900 mb-6">Cuentas más Activas</h3>
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
	</div>
</div>
