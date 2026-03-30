<script lang="ts">
	import Pagination from '$lib/components/Pagination.svelte';
	import { Modal, Button } from 'flowbite-svelte';

	export let data;

	$: ({ comentarios, meta } = data);

    let selectedComentario: any = null;
    let showModal = false;

    function openModal(comentario: any) {
        selectedComentario = comentario;
        showModal = true;
    }

    function formatFecha(dateString: string) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        
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
						<th class="px-6 py-5 font-semibold">Autor</th>
						<th class="px-6 py-5 font-semibold text-center">Sentimiento</th>
						<th class="px-6 py-5 font-semibold">Comentario</th>
						<th class="px-6 py-5 font-semibold text-center hidden md:table-cell">Likes</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-100">
					{#each comentarios as comentario}
					<tr class="hover:bg-[#F8FAFC] transition-colors group cursor-pointer" on:click={() => openModal(comentario)}>
						<td class="px-6 py-4 whitespace-nowrap text-gray-500 text-[13px]">{formatFecha(comentario.fecha)}</td>
						<td class="px-6 py-4 text-[#334155] text-[13px]">
                            <div class="flex items-center gap-2">
                                <div class="w-6 h-6 rounded bg-gray-100 text-[9px] font-bold flex items-center justify-center text-gray-500 uppercase border border-gray-200">
                                    {comentario.articulo?.red_social?.substring(0, 2) || 'XX'}
                                </div>
                                <span>{comentario.articulo?.red_social || 'Desconocida'}</span>
                            </div>
                        </td>
						<td class="px-6 py-4">
                            <span class="text-gray-900 font-medium">
                                {comentario.autor || 'Anónimo'}
                            </span>
                        </td>
						<td class="px-6 py-4">
                            <div class="flex justify-center">
                                <span class={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getSentimentColor(comentario.sentimiento)}`}>
                                    <div class={`w-1.5 h-1.5 rounded-full ${getSentimentDotColor(comentario.sentimiento)}`}></div>
                                    {comentario.sentimiento || 'Neutral'}
                                </span>
                            </div>
                        </td>
						<td class="px-6 py-4 text-gray-500 text-[13px] max-w-[300px] truncate" title={comentario.texto_limpio}>
                            {comentario.texto_limpio || comentario.contenido || '-'}
                        </td>
						<td class="px-6 py-4 text-center text-[13px] font-medium text-gray-500 hidden md:table-cell">
                            {comentario.likes || 0}
                        </td>
					</tr>
					{:else}
                    <tr>
                        <td colspan="6" class="px-6 py-12 text-center text-gray-500 bg-gray-50">No hay comentarios que coincidan con los filtros actuales.</td>
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

	<!-- Modal Detalles del Comentario -->
	<Modal bind:open={showModal} size="xl" outsideclose autoclose={false} class="w-full">
		{#if selectedComentario}
		<div class="px-2 py-1">
			<div class="flex items-center justify-between mb-4">
				<h3 class="text-xl font-bold text-gray-900 border-b pb-2 flex-grow">
					Detalle del Comentario
				</h3>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
				<div>
					<p class="text-sm font-semibold text-gray-500 mb-1">Autor</p>
					<p class="text-gray-900 font-medium">{selectedComentario.autor || 'Anónimo'}</p>
				</div>
                <div>
					<p class="text-sm font-semibold text-gray-500 mb-1">Fuente (Artículo padre)</p>
					<p class="text-gray-900 font-medium">{selectedComentario.articulo?.red_social || '-'} ({selectedComentario.articulo?.cuenta || '-'})</p>
				</div>
                <div>
					<p class="text-sm font-semibold text-gray-500 mb-1">Fecha</p>
					<p class="text-gray-900">{formatFecha(selectedComentario.fecha)}</p>
				</div>
				<div>
					<p class="text-sm font-semibold text-gray-500 mb-1">Sentimiento</p>
					<span class={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getSentimentColor(selectedComentario.sentimiento)}`}>
                        <div class={`w-1.5 h-1.5 rounded-full ${getSentimentDotColor(selectedComentario.sentimiento)}`}></div>
                        {selectedComentario.sentimiento || 'Neutral'}
                    </span>
				</div>
				<div>
					<p class="text-sm font-semibold text-gray-500 mb-1">Tema Detectado</p>
					<span class="bg-[#F1F5F9] text-gray-600 px-3 py-1 rounded text-sm font-medium">
                        {selectedComentario.tema_categoria || 'Sin clasificar'}
                    </span>
				</div>
                <div>
					<p class="text-sm font-semibold text-gray-500 mb-1">Likes / Interacciones</p>
					<p class="text-gray-900">{selectedComentario.likes ?? 0}</p>
				</div>
			</div>

			<div class="mb-4">
				<p class="text-sm font-semibold text-gray-500 mb-2">Comentario Original</p>
				<div class="bg-gray-50 border border-gray-100 p-4 rounded-lg text-gray-700 text-sm whitespace-pre-wrap leading-relaxed max-h-[250px] overflow-y-auto">
					{selectedComentario.contenido || 'Sin contenido'}
				</div>
			</div>

            <!-- Optionally show snippet of the related article -->
            {#if selectedComentario.articulo && selectedComentario.articulo.contenido}
                <div class="mt-4 border-t pt-4">
                    <p class="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">Contexto del Artículo Original</p>
                    <div class="bg-blue-50/50 border border-blue-100 p-3 rounded text-gray-600 text-[13px] italic truncate">
                        "{selectedComentario.articulo.contenido}"
                    </div>
                </div>
            {/if}

			<div class="flex justify-end gap-3 mt-6 border-t pt-4">
				<Button color="alternative" on:click={() => (showModal = false)}>Cerrar</Button>
			</div>
		</div>
		{/if}
	</Modal>
</div>
</div>
