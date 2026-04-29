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
	$: municipioId = $page.data?.filters?.municipioId ? String($page.data.filters.municipioId) : ($page.url.searchParams.get('municipioId') || '');

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
			const params = new URLSearchParams();
			if (dias) params.set('dias', dias);
			if (entidadId) params.set('entidadId', entidadId);
			if (redSocial) params.set('redSocial', redSocial);
			if (municipioId) params.set('municipioId', municipioId);

			const res = await fetch(`/api/top-temas?${params.toString()}`);
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

	// Trigger reload if `dias`, `entidadId`, `redSocial` or `municipioId` change
	$: triggerTop = [dias, entidadId, redSocial, municipioId].join('|');
	$: if (browser && triggerTop) {
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

	function getTemaIdFromTop(tema: any) {
		if (typeof tema === 'string') return tema;
		return tema?.tema || tema?.nombre || '';
	}

	function getComentariosIdsFromTop(tema: any) {
		if (!tema || typeof tema === 'string') return [] as string[];

		const rawIds =
			tema?.comentarios_ids ??
			tema?.comentariosIds ??
			tema?.comentariosId ??
			tema?.comentarios_id;

		if (Array.isArray(rawIds)) {
			return rawIds.map((id: any) => String(id).trim()).filter(Boolean);
		}

		if (typeof rawIds === 'string') {
			return rawIds
				.split(',')
				.map((id) => id.trim())
				.filter(Boolean);
		}

		return [] as string[];
	}

	function getComentariosUrlForTop(tema: any) {
		const params = new URLSearchParams();
		const temaId = getTemaIdFromTop(tema);
		const comentariosIds = getComentariosIdsFromTop(tema);

		if (comentariosIds.length > 0) {
			params.append('comentarios_ids', comentariosIds.join(','));
		} else if (temaId) {
			params.append('temaId', temaId);
		}
		if (dias) params.append('dias', dias);
		if (redSocial) params.append('redSocial', redSocial);
		if (entidadId) params.append('entidadId', entidadId);

		return `/admin/comentarios?${params.toString()}`;
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

	let canalTab: 'articulos' | 'comentarios' = 'articulos';

	const channelColors = ['#1877f2', '#0f172a', '#e1306c', '#94a3b8', '#8b5cf6'];

	$: channelDonutArticulosOptions = {
		chart: { type: 'donut', height: 260, fontFamily: 'inherit' },
		labels: overview.distribucionCanal?.labels || [],
		series: overview.distribucionCanal?.seriesArticulos || [],
		colors: channelColors,
		plotOptions: { pie: { donut: { size: '65%' }, expandOnClick: false } },
		dataLabels: { enabled: false },
		legend: { position: 'bottom', horizontalAlign: 'center', markers: { radius: 12 }, itemMargin: { horizontal: 8 } },
		responsive: [
			{
				breakpoint: 640,
				options: { chart: { height: 220 } }
			}
		]
	};

	$: channelDonutComentariosOptions = {
		chart: { type: 'donut', height: 260, fontFamily: 'inherit' },
		labels: overview.distribucionCanal?.labels || [],
		series: overview.distribucionCanal?.seriesComentarios || [],
		colors: channelColors,
		plotOptions: { pie: { donut: { size: '65%' }, expandOnClick: false } },
		dataLabels: { enabled: false },
		legend: { position: 'bottom', horizontalAlign: 'center', markers: { radius: 12 }, itemMargin: { horizontal: 8 } },
		responsive: [
			{
				breakpoint: 640,
				options: { chart: { height: 220 } }
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

							<a href={getComentariosUrlForTop(tema)} class="block bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:border-blue-200 hover:bg-blue-50/40 transition-colors cursor-pointer">
								<div class="flex items-start justify-between gap-3 mb-3">
									<div class="flex items-start gap-3">
										<div class="flex items-center justify-center bg-[#1e293b] text-white font-bold rounded-full w-6 h-6 min-w-[1.5rem] text-xs mt-0.5">
											{index + 1}
										</div>
										<h3 class="font-semibold text-gray-900 text-[14px] leading-tight pt-0.5">
											{getTemaIdFromTop(tema)}
										</h3>
									</div>
									{#if tema.sentimiento}
										<div class="flex-shrink-0">
											{#if isPositivo}
												<span class="bg-[#dcfce7] text-[#166534] border border-[#bbf7d0] font-medium text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
													<span>😃</span> Positivo
												</span>
											{:else if isNegativo}
												<span class="bg-[#fee2e2] text-[#991b1b] border border-[#fecaca] font-medium text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
													<span>🥺</span> Negativo
												</span>
											{:else}
												<span class="bg-[#fef3c7] text-[#92400e] border border-[#fde68a] font-medium text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
													<span>😐</span> Neutro
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
										{#if posPct > 0}<span class="text-[#10b981]">{posPct}% positivo</span>{/if}
										{#if neuPct > 0}<span class="text-[#f59e0b]">{neuPct}% neutro</span>{/if}
										{#if negPct > 0}<span class="text-[#ef4444]">{negPct}% negativo</span>{/if}
									</div>
									<div class="flex items-center text-[11px]">
										<span class="font-bold text-gray-800">{Math.max(0, articulos)}</span>
										<span class="text-gray-500 ml-1">art.</span>
										<span class="font-bold text-gray-800 ml-2">{comentarios}</span>
										<span class="text-gray-500 ml-1">com.</span>
									</div>
								</div>
							</a>
						{/each}
					{/if}
				</div>
			</div>


			<div class="bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] flex flex-col">
				<h3 class="text-lg font-bold text-gray-900 mb-4">Sentimiento General</h3>
				{#if overview.sentimientoGeneral}
					<div class="flex-grow flex items-center justify-center w-full min-h-[260px]" use:chartAction={sentimentDonutOptions}></div>
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

				<div class="bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] flex flex-col">
					<div class="flex items-center justify-between mb-4 flex-shrink-0">
						<h3 class="text-lg font-bold text-gray-900">Distribución por Canal</h3>
						<div class="flex items-center bg-gray-100 rounded-lg p-0.5 text-xs font-semibold">
							<button
								id="canal-tab-articulos"
								class="px-3 py-1.5 rounded-md transition-all duration-200 {canalTab === 'articulos' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}"
								on:click={() => canalTab = 'articulos'}
							>📰 Artículos</button>
							<button
								id="canal-tab-comentarios"
								class="px-3 py-1.5 rounded-md transition-all duration-200 {canalTab === 'comentarios' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}"
								on:click={() => canalTab = 'comentarios'}
							>💬 Comentarios</button>
						</div>
					</div>
					{#if overview.distribucionCanal}
						{#if canalTab === 'articulos'}
							<div class="flex-grow flex items-center justify-center w-full min-h-[260px]" use:chartAction={channelDonutArticulosOptions}></div>
						{:else}
							<div class="flex-grow flex items-center justify-center w-full min-h-[260px]" use:chartAction={channelDonutComentariosOptions}></div>
						{/if}
					{/if}
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
