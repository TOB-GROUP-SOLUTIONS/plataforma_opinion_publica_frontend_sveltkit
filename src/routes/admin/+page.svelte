<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
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
		if (!browser) return;
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

	onMount(() => {
		generarTopTemas();
	});

	// Trigger reload if `dias` changes
	$: if (browser && dias) {
		generarTopTemas();
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
			<div class="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2">
			
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
			<div class="bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] h-[500px] flex flex-col">
				<h3 class="text-lg font-bold text-gray-900 mb-4 flex-shrink-0">Cuentas más Activas</h3>
				<div class="overflow-y-auto flex-grow pr-2 no-scrollbar scrollbar-hide">
					<table class="w-full text-sm text-left text-gray-600">
						<thead class="text-xs text-gray-400 capitalize bg-white sticky top-0 z-10">
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

			<div class="bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] h-[500px] flex flex-col">
				<div class="flex justify-between items-center mb-4 flex-shrink-0">
					<h3 class="text-lg font-bold text-gray-900">Top Temas del Momento <span class="bg-blue-100 text-blue-800 text-xs font-semibold ml-2 px-2.5 py-0.5 rounded">AI</span></h3>
				</div>
				<div class="space-y-4 overflow-y-auto flex-grow pr-2 no-scrollbar scrollbar-hide">
					{#if isLoadingTopTemas}
						<div class="flex flex-col items-center justify-center py-10">
							<svg class="animate-spin h-8 w-8 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							<p class="text-gray-500 font-medium text-sm text-center">Analizando e identificando tendencias...</p>
						</div>
					{:else if errorTopTemas}
						<div class="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm text-center">
							{errorTopTemas}
						</div>
					{:else if generatedTopTemas.length > 0}
						{#each generatedTopTemas.slice(0, 10) as tema, index}
							{@const isPositivo = tema.sentimiento?.toLowerCase() === 'positivo'}
							{@const isNegativo = tema.sentimiento?.toLowerCase() === 'negativo'}
							{@const pos = tema.positivos || 0}
							{@const neu = tema.neutros || 0}
							{@const neg = tema.negativos || 0}
							{@const total = pos + neu + neg}
							{@const posPct = total > 0 ? Math.round((pos / total) * 100) : (isPositivo ? 100 : 0)}
							{@const negPct = total > 0 ? Math.round((neg / total) * 100) : (isNegativo ? 100 : 0)}
							{@const neuPct = total > 0 ? Math.round((neu / total) * 100) : ((!isPositivo && !isNegativo) ? 100 : 0)}
							{@const articulos = tema.articulos !== undefined ? tema.articulos : (tema.cantidad || 0)}
							{@const comentarios = tema.comentarios !== undefined ? tema.comentarios : (tema.total_comentarios || 0)}

							<div class="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
								<div class="flex items-start justify-between gap-3 mb-3">
									<div class="flex items-start gap-3">
										<div class="flex items-center justify-center bg-[#1e293b] text-white font-bold rounded-full w-6 h-6 min-w-[1.5rem] text-xs mt-0.5">
											{index + 1}
										</div>
										<h3 class="font-semibold text-gray-900 text-[14px] leading-tight pt-0.5">
											{typeof tema === 'string' ? tema : tema.tema || tema.nombre || ''}
										</h3>
									</div>
									{#if tema.sentimiento}
										<div class="flex-shrink-0">
											{#if isPositivo}
												<span class="bg-[#dcfce7] text-[#166534] border border-[#bbf7d0] font-medium text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
													<span>😃</span> Pos
												</span>
											{:else if isNegativo}
												<span class="bg-[#fee2e2] text-[#991b1b] border border-[#fecaca] font-medium text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
													<span>🥺</span> Neg
												</span>
											{:else}
												<span class="bg-[#fef3c7] text-[#92400e] border border-[#fde68a] font-medium text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
													<span>😐</span> Neu
												</span>
											{/if}
										</div>
									{/if}
								</div>

								<!-- Barra de progreso -->
								<div class="flex h-1.5 w-full rounded-full overflow-hidden border border-gray-50 gap-0.5 mb-2 bg-gray-100">
									{#if posPct > 0}<div class="bg-[#34d399] h-full" style="width: {posPct}%"></div>{/if}
									{#if neuPct > 0}<div class="bg-[#fcd34d] h-full" style="width: {neuPct}%"></div>{/if}
									{#if negPct > 0}<div class="bg-[#f87171] h-full" style="width: {negPct}%"></div>{/if}
								</div>

								<!-- Stats -->
								<div class="flex items-center justify-between mt-2">
									<div class="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
										{#if posPct > 0}<span class="text-[#10b981]">{posPct}% pos</span>{/if}
										{#if neuPct > 0}<span class="text-[#f59e0b]">{neuPct}% neu</span>{/if}
										{#if negPct > 0}<span class="text-[#ef4444]">{negPct}% neg</span>{/if}
									</div>
									<div class="flex items-center text-[11px]">
										<span class="font-bold text-gray-800">{Math.max(0, articulos)}</span>
										<span class="text-gray-500 ml-1">art.</span>
										<span class="font-bold text-gray-800 ml-2">{comentarios}</span>
										<span class="text-gray-500 ml-1">com.</span>
									</div>
								</div>
							</div>
						{/each}
					{/if}
				</div>
			</div>
		</div>

		<!-- Gráfico principal al final -->
<!-- 		<div class="bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)]">
			<div class="flex justify-between items-center mb-2">
				<h3 class="text-lg font-bold text-gray-900">Evolución del Volumen de menciones de entidades</h3>
				<button class="text-gray-400 hover:text-gray-600 font-bold px-2">···</button>
			</div>
			{#if overview.evolucionVolumen}
				<div class="w-full" use:chartAction={volumeChartOptions}></div>
			{/if}
		</div> -->
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
					<div class="flex flex-col gap-4 mb-4">
						{#each generatedTopTemas as tema, index}
							{@const isPositivo = tema.sentimiento?.toLowerCase() === 'positivo'}
							{@const isNegativo = tema.sentimiento?.toLowerCase() === 'negativo'}
							{@const pos = tema.positivos || 0}
							{@const neu = tema.neutros || 0}
							{@const neg = tema.negativos || 0}
							{@const total = pos + neu + neg}
							{@const posPct = total > 0 ? Math.round((pos / total) * 100) : (isPositivo ? 100 : 0)}
							{@const negPct = total > 0 ? Math.round((neg / total) * 100) : (isNegativo ? 100 : 0)}
							{@const neuPct = total > 0 ? Math.round((neu / total) * 100) : ((!isPositivo && !isNegativo) ? 100 : 0)}
							{@const articulos = tema.articulos !== undefined ? tema.articulos : (tema.cantidad || 0)}
							{@const comentarios = tema.comentarios !== undefined ? tema.comentarios : (tema.total_comentarios || 0)}

							<div class="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
								<div class="flex items-start justify-between gap-4 mb-5">
									<div class="flex items-start gap-4">
										<div class="flex items-center justify-center bg-[#1e293b] text-white font-bold rounded-full w-8 h-8 min-w-[2rem] text-sm mt-0.5">
											{index + 1}
										</div>
										<h3 class="font-semibold text-gray-900 text-[17px] leading-tight pt-1">
											{typeof tema === 'string' ? tema : tema.tema || tema.nombre || ''}
										</h3>
									</div>
									{#if tema.sentimiento}
										<div class="flex-shrink-0">
											{#if isPositivo}
												<span class="bg-[#dcfce7] text-[#166534] border border-[#bbf7d0] font-medium text-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
													<span class="text-base">😃</span> Positivo
												</span>
											{:else if isNegativo}
												<span class="bg-[#fee2e2] text-[#991b1b] border border-[#fecaca] font-medium text-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
													<span class="text-base">🥺</span> Negativo
												</span>
											{:else}
												<span class="bg-[#fef3c7] text-[#92400e] border border-[#fde68a] font-medium text-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
													<span class="text-base">😐</span> Neutro
												</span>
											{/if}
										</div>
									{/if}
								</div>

								<!-- Barra de progreso -->
								<div class="flex h-2.5 w-full rounded-full overflow-hidden border border-gray-50 gap-0.5 mb-3 bg-gray-100">
									{#if posPct > 0}<div class="bg-[#34d399] h-full" style="width: {posPct}%"></div>{/if}
									{#if neuPct > 0}<div class="bg-[#fcd34d] h-full" style="width: {neuPct}%"></div>{/if}
									{#if negPct > 0}<div class="bg-[#f87171] h-full" style="width: {negPct}%"></div>{/if}
								</div>

								<!-- Porcentajes con puntos -->
								<div class="flex items-center gap-4 text-[13px] text-gray-500 font-medium mb-4">
									<div class="flex items-center gap-1.5">
										<span class="w-2.5 h-2.5 rounded-full bg-[#34d399]"></span> {posPct}% pos
									</div>
									<div class="flex items-center gap-1.5">
										<span class="w-2.5 h-2.5 rounded-full bg-[#fcd34d]"></span> {neuPct}% neu
									</div>
									<div class="flex items-center gap-1.5">
										<span class="w-2.5 h-2.5 rounded-full bg-[#f87171]"></span> {negPct}% neg
									</div>
								</div>

								<!-- Footer (Artículos y Comentarios) -->
								<div class="flex items-center text-[14px]">
									<span class="font-bold text-gray-800">{Math.max(0, articulos)}</span>
									<span class="text-gray-500 ml-1.5">artículos</span>
									<span class="font-bold text-gray-800 ml-4">{comentarios}</span>
									<span class="text-gray-500 ml-1.5">comentarios</span>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
