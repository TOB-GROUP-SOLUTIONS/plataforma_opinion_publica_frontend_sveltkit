<script lang="ts">
	import Pagination from '$lib/components/Pagination.svelte';
	import { Modal, Button } from 'flowbite-svelte';

	import { page } from '$app/stores';

	export let data;

	$: ({ articulos, meta } = data);

    let selectedArticulo: any = null;
    let showArticleModal = false;

    function openArticleModal(articulo: any) {
        selectedArticulo = articulo;
        showArticleModal = true;
    }

    function getComentariosUrl(articuloId: number) {
        const params = new URLSearchParams($page.url.searchParams);
        params.set('articulo_id', articuloId.toString());
        params.delete('page'); // Reiniciamos a la página 1 al cambiar de vista
        return `/admin/comentarios?${params.toString()}`;
    }

    function formatFecha(dateString: string) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        
        // Simular lógica de "Hoy" o "Ayer"
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
        const isYesterday = date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth() && date.getFullYear() === yesterday.getFullYear();

        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const timeStr = `${hours}:${minutes}`;

        if (isToday) return `Hoy, ${timeStr}`;
        if (isYesterday) return `Ayer, ${timeStr}`;

        return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }) + `, ${timeStr}`;
    }

    function getSentimentColor(sentimiento: string) {
        if (!sentimiento) return 'bg-yellow-100/80 text-yellow-700';
        switch (sentimiento.toLowerCase()) {
            case 'positivo': return 'bg-[#E8F5E9] text-[#2E7D32]';
            case 'negativo': return 'bg-[#FFEBEE] text-[#C62828]';
            case 'neutral': return 'bg-[#FFF8E1] text-[#F57F17]';
            default: return 'bg-gray-100 text-gray-800';
        }
    }

    function getSentimentDotColor(sentimiento: string) {
        if (!sentimiento) return 'bg-yellow-500';
        switch (sentimiento.toLowerCase()) {
            case 'positivo': return 'bg-[#4CAF50]';
            case 'negativo': return 'bg-[#EF5350]';
            case 'neutral': return 'bg-[#FFB300]';
            default: return 'bg-gray-400';
        }
    }
</script>

<!-- Wrapper para que el fondo cubra todo el área visible del `main` -->
<div class="h-full w-full bg-[#F8FAFC] -mx-2 lg:-mx-4 -mt-4 -mb-36 md:-mb-8">
	<div class="p-6">
	<!-- Header area -->
	<div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
		<div class="flex flex-1 justify-end">
            <!-- Search placeholder -->
            <div class="relative w-full md:max-w-md">
                <input 
                    type="text" 
                    placeholder="Buscar palabras clave..." 
                    class="w-full bg-white border border-gray-200 text-gray-500 text-sm rounded-lg pl-10 pr-4 py-2.5 outline-none focus:border-blue-500 shadow-sm transition-colors"
                />
                <svg class="w-4 h-4 text-gray-400 absolute left-4 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
            </div>
		</div>
	</div>

	<!-- Table -->
	<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
		<div class="overflow-x-auto">
			<table class="w-full text-sm text-left text-gray-600">
				<thead class="text-xs text-[#64748b] bg-white border-b border-gray-100">
					<tr>
						<th class="px-6 py-5 font-semibold">Fecha/Hora</th>
						<th class="px-6 py-5 font-semibold">Fuente</th>
						<th class="px-6 py-5 font-semibold">Tema</th>
						<th class="px-6 py-5 font-semibold text-center">Sentimiento</th>
						<th class="px-6 py-5 font-semibold">Extracto</th>
						<th class="px-6 py-5 font-semibold text-center hidden md:table-cell">Impacto</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-100">
					{#each articulos as articulo}
					<tr class="hover:bg-[#F8FAFC] transition-colors group cursor-pointer" on:click={() => openArticleModal(articulo)}>
						<td class="px-6 py-4 whitespace-nowrap text-gray-500 text-[13px]">{formatFecha(articulo.fecha)}</td>
						<td class="px-6 py-4 text-[#334155] text-[13px]">
                            <div class="flex items-center gap-2">
                                <div class="w-6 h-6 rounded bg-gray-100 text-[9px] font-bold flex items-center justify-center text-gray-500 uppercase border border-gray-200">
                                    {articulo.red_social?.substring(0, 2) || 'XX'}
                                </div>
                                <span>{articulo.red_social || 'Desconocida'}</span>
                            </div>
                        </td>
						<td class="px-6 py-4">
                            <span class="bg-[#F1F5F9] text-gray-600 px-3 py-1 rounded text-xs font-medium">
                                {articulo.tema_categoria || 'Sin clasificar'}
                            </span>
                        </td>
						<td class="px-6 py-4">
                            <div class="flex justify-center">
                                <span class={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getSentimentColor(articulo.sentimiento)}`}>
                                    <div class={`w-1.5 h-1.5 rounded-full ${getSentimentDotColor(articulo.sentimiento)}`}></div>
                                    {articulo.sentimiento || 'Neutral'}
                                </span>
                            </div>
                        </td>
						<td class="px-6 py-4 text-gray-500 text-[13px] max-w-[300px] truncate" title={articulo.texto_limpio}>
                            {articulo.texto_limpio || articulo.contenido || '-'}
                        </td>
						<td class="px-6 py-4 text-center text-[13px] font-medium text-[#0284c7] hidden md:table-cell">
                            Alto
                        </td>
					</tr>
					{:else}
                    <tr>
                        <td colspan="6" class="px-6 py-12 text-center text-gray-500 bg-gray-50">No hay artículos que coincidan con los filtros actuales.</td>
                    </tr>
                    {/each}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Pagination Component Integration -->
	<div class="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-b-xl border border-t-0 border-gray-200 -mt-7 mb-6">
        <div class="text-sm text-gray-500">
            Mostrando {((meta?.currentPage || 1) - 1) * (meta?.perPage || 10) + 1} a {Math.min((meta?.currentPage || 1) * (meta?.perPage || 10), meta?.total || 0)} de {meta?.total || 0}
        </div>
        
        {#if meta && meta.total > 0}
            <Pagination {meta} class="mt-4 sm:mt-0" />
        {/if}
	</div>

	<!-- Modal Detalles de Artículo -->
	<Modal bind:open={showArticleModal} size="xl" outsideclose autoclose={false} class="w-full">
		{#if selectedArticulo}
		<div class="px-2 py-1">
			<div class="flex items-center justify-between mb-4">
				<h3 class="text-xl font-bold text-gray-900 border-b pb-2 flex-grow">
					Detalle del Artículo
				</h3>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
				<div>
					<p class="text-sm font-semibold text-gray-500 mb-1">Fuente</p>
					<p class="text-gray-900 font-medium">{selectedArticulo.red_social || '-'} ({selectedArticulo.cuenta || '-'})</p>
				</div>
                <div>
					<p class="text-sm font-semibold text-gray-500 mb-1">Fecha de Publicación</p>
					<p class="text-gray-900">{formatFecha(selectedArticulo.fecha)}</p>
				</div>
				<div>
					<p class="text-sm font-semibold text-gray-500 mb-1">Sentimiento</p>
					<span class={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getSentimentColor(selectedArticulo.sentimiento)}`}>
                        <div class={`w-1.5 h-1.5 rounded-full ${getSentimentDotColor(selectedArticulo.sentimiento)}`}></div>
                        {selectedArticulo.sentimiento || 'Neutral'}
                    </span>
				</div>
				<div>
					<p class="text-sm font-semibold text-gray-500 mb-1">Tema Detectado</p>
					<span class="bg-[#F1F5F9] text-gray-600 px-3 py-1 rounded text-sm font-medium">
                        {selectedArticulo.tema_categoria || 'Sin clasificar'}
                    </span>
				</div>
                {#if selectedArticulo.entidades_objetivo_match}
				<div>
					<p class="text-sm font-semibold text-gray-500 mb-1">Entidad Match (ID)</p>
					<p class="text-gray-900">{selectedArticulo.entidades_objetivo_match}</p>
				</div>
                {/if}
                <div>
					<p class="text-sm font-semibold text-gray-500 mb-1">Interacciones (Likes)</p>
					<p class="text-gray-900">{selectedArticulo.likes ?? '-'}</p>
				</div>
			</div>

			<div class="mb-6">
				<p class="text-sm font-semibold text-gray-500 mb-2">Contenido Original</p>
				<div class="bg-gray-50 border border-gray-100 p-4 rounded-lg text-gray-700 text-sm whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto">
					{selectedArticulo.contenido || 'Sin contenido original disponible'}
				</div>
			</div>

			<div class="flex justify-end gap-3 mt-6 border-t pt-4">
				<Button color="alternative" on:click={() => (showArticleModal = false)}>Cerrar</Button>
				<Button 
                    color="blue" 
                    href={getComentariosUrl(selectedArticulo.id)}
                >
                    Ver Comentarios ({selectedArticulo.comentarios?.length || 0})
                </Button>
			</div>
		</div>
		{/if}
	</Modal>
</div>
</div>
