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

	// Modal state
	let showTopTemasModal = false;
	let isLoadingTopTemas = false;
	let errorTopTemas = '';
	let generatedTopTemas: any[] = [];

	async function generarTopTemas() {
		isLoadingTopTemas = true;
		errorTopTemas = '';
		try {
			const res = await fetch(`/api/top-temas?dias=${dias}`);
			if (!res.ok) throw new Error('Error al generar tendencias');
			const json = await res.json();
			generatedTopTemas = json.topTemas || [];
		} catch (error: any) {
			errorTopTemas = error.message;
		} finally {
			isLoadingTopTemas = false;
		}
	}

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
			<div class="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
				<div class="bg-white p-4 md:p-5 rounded-xl border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)]">
					<h3 class="text-gray-500 text-sm font-medium">Menciones Totales de entidades</h3>
					<div class="mt-2 flex items-baseline gap-2 flex-wrap">
						<span class="text-2xl md:text-3xl font-bold text-gray-900">{kpis.totalMenciones.valor.toLocaleString()}</span>
						<span class="text-sm {kpis.totalMenciones.esPositivo ? 'text-green-500' : 'text-red-500'} font-medium flex items-center">
							{kpis.totalMenciones.esPositivo ? '↑' : '↓'} {Math.abs(kpis.totalMenciones.variacion)}%
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

				<div class="bg-white p-4 md:p-5 rounded-xl border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)]">
					<h3 class="text-gray-500 text-sm font-medium">Total Articulos</h3>
					<div class="mt-2 flex items-baseline gap-2 flex-wrap">
						<span class="text-2xl md:text-3xl font-bold text-gray-900">{kpis.totalArticulos.valor.toLocaleString()}</span>
						<span class="text-sm {kpis.totalArticulos.esPositivo ? 'text-green-500' : 'text-red-500'} font-medium flex items-center">
							{kpis.totalArticulos.esPositivo ? '↑' : '↓'} {Math.abs(kpis.totalArticulos.variacion)}%
						</span>
					</div>
				</div>

				<div class="bg-white p-4 md:p-5 rounded-xl border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)]">
					<h3 class="text-gray-500 text-sm font-medium">Total Comentarios</h3>
					<div class="mt-2 flex items-baseline gap-2 flex-wrap">
						<span class="text-2xl md:text-3xl font-bold text-gray-900">{kpis.totalComentarios.valor.toLocaleString()}</span>
						<span class="text-sm {kpis.totalComentarios.esPositivo ? 'text-green-500' : 'text-red-500'} font-medium flex items-center">
							{kpis.totalComentarios.esPositivo ? '↑' : '↓'} {Math.abs(kpis.totalComentarios.variacion)}%
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
				<div class="flex justify-between items-center mb-4">
					<h3 class="text-lg font-bold text-gray-900">Top Temas del Momento</h3>
					<button 
						class="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold px-3 py-1.5 rounded-lg border border-blue-200 transition-colors flex items-center gap-1"
						on:click={() => { showTopTemasModal = true; if(generatedTopTemas.length === 0) generarTopTemas(); }}
					>
						<span>✨</span> AI Top 10
					</button>
				</div>
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
				<h3 class="text-lg font-bold text-gray-900">Evolución del Volumen de menciones de entidades</h3>
				<button class="text-gray-400 hover:text-gray-600 font-bold px-2">···</button>
			</div>
			{#if overview.evolucionVolumen}
				<div class="w-full" use:chartAction={volumeChartOptions}></div>
			{/if}
		</div>
	</div>
</div>

<!-- Modal Top 10 Temas IA -->
{#if showTopTemasModal}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" on:click={() => showTopTemasModal = false}>
		<div class="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] flex flex-col" on:click|stopPropagation>
			
			<div class="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
				<div class="flex items-center gap-2">
					<span class="text-2xl">✨</span>
					<h2 class="text-xl font-bold text-gray-900">Tendencias Generadas por IA</h2>
				</div>
				<button class="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors" on:click={() => showTopTemasModal = false}>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<div class="overflow-y-auto pr-2 flex-grow">
				<div class="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-6">
					<p class="text-sm text-slate-600">
						Esta herramienta agrupa todos los <strong>temas libres</strong> recolectados en el período usando inteligencia artificial para descubrir cuáles son las conversaciones reales más relevantes del momento, más allá de las categorías estáticas.
					</p>
				</div>
				
				{#if isLoadingTopTemas}
					<div class="flex flex-col items-center justify-center py-16">
						<svg class="animate-spin h-10 w-10 text-blue-600 mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						<h3 class="text-xl font-bold text-gray-800 mb-2">Analizando conversaciones</h3>
						<p class="text-gray-500 font-medium text-center px-4 max-w-sm">La inteligencia artificial está leyendo y agrupando los temas más mencionados, esto puede tardar unos segundos...</p>
					</div>
				{:else if errorTopTemas}
					<div class="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mt-2 text-sm font-medium">
						{errorTopTemas}
					</div>
					<div class="flex justify-center mt-4">
						<button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg" on:click={generarTopTemas}>Reintentar</button>
					</div>
				{:else if generatedTopTemas.length > 0}
				<div class="mb-4">
					<div class="flex justify-end mb-3">
						<button class="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg font-bold transition-colors border border-blue-100" on:click={generarTopTemas}>
							🔄 Recalcular
						</button>
					</div>
					<div class="space-y-3">
						{#each generatedTopTemas as tema, index}
							{@const total = (tema.distribucion?.positivo ?? 0) + (tema.distribucion?.neutro ?? 0) + (tema.distribucion?.negativo ?? 0)}
							{@const pctPos = total > 0 ? Math.round((tema.distribucion?.positivo ?? 0) / total * 100) : 0}
							{@const pctNeu = total > 0 ? Math.round((tema.distribucion?.neutro ?? 0) / total * 100) : 0}
							{@const pctNeg = total > 0 ? 100 - pctPos - pctNeu : 0}
							{@const etiqueta = tema.etiqueta_dominante ?? null}
							<div class="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
								<!-- Header: número + nombre + badge sentimiento -->
								<div class="flex items-start justify-between gap-3 mb-3">
									<div class="flex items-center gap-3 min-w-0">
										<span class="flex-shrink-0 flex items-center justify-center bg-slate-800 text-white font-bold rounded-full w-7 h-7 text-xs">{index + 1}</span>
										<span class="font-semibold text-gray-900 text-sm leading-snug">{tema.tema || tema.nombre || ''}</span>
									</div>
									{#if etiqueta === 'positivo'}
										<span class="flex-shrink-0 text-xs font-bold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">😊 Positivo</span>
									{:else if etiqueta === 'negativo'}
										<span class="flex-shrink-0 text-xs font-bold px-2 py-1 rounded-full bg-red-100 text-red-700 border border-red-200">😟 Negativo</span>
									{:else if etiqueta === 'neutro'}
										<span class="flex-shrink-0 text-xs font-bold px-2 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200">😐 Neutro</span>
									{/if}
								</div>

								<!-- Barra distribución sentimiento -->
								{#if total > 0}
									<div class="mb-2">
										<div class="flex rounded-full h-2 overflow-hidden gap-px bg-gray-100">
											{#if pctPos > 0}<div class="bg-emerald-400 h-full transition-all" style="width:{pctPos}%"></div>{/if}
											{#if pctNeu > 0}<div class="bg-amber-300 h-full transition-all" style="width:{pctNeu}%"></div>{/if}
											{#if pctNeg > 0}<div class="bg-red-400 h-full transition-all" style="width:{pctNeg}%"></div>{/if}
										</div>
										<div class="flex gap-3 mt-1.5 text-xs text-gray-500">
											<span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>{pctPos}% pos</span>
											<span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-amber-300 inline-block"></span>{pctNeu}% neu</span>
											<span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-red-400 inline-block"></span>{pctNeg}% neg</span>
										</div>
									</div>
								{/if}

								<!-- Stats: artículos y comentarios -->
								<div class="flex flex-wrap gap-3 mt-2 pt-2 border-t border-gray-50">
									<span class="text-xs text-gray-500"><span class="font-bold text-gray-800">{tema.cantidad ?? 0}</span> artículos</span>
									<span class="text-xs text-gray-500"><span class="font-bold text-gray-800">{tema.total_comentarios ?? 0}</span> comentarios</span>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}
			</div>
		</div>
	</div>
{/if}
