<script lang="ts">
  import { page } from '$app/stores'; // Para obtener los parámetros de la URL
  import { goto } from '$app/navigation';
  import DownloadCsv from "$lib/components/DownloadCSV.svelte";
  import SearchInput from "$lib/components/dashboard/SearchInput.svelte";
  import { Button } from 'flowbite-svelte';
  import DataTable from '$lib/components/dashboard/DataTable.svelte';

  export let data;
  let dataTable: DataTable;

  
  // Asegurarnos de que data.escuelas existe, si no, usar un array vacío
  $: escuelas = data?.escuelas || [];
  $: meta = data?.meta || {};
 
  const handleBackButtonClick = () => {
    goto(`/dashboard/licencias`);
  };


  // Obtener la URL actual
  const currentUrl = $page.url.pathname;
  const searchParams = $page.url.searchParams;

  // Comprobar si hay parámetros adicionales en la URL
  const hasParams = searchParams.toString().length > 0;
</script>

<div class="w-full max-w-screen-4xl rounded-lg shadow mx-auto bg-white dark:bg-gray-800 px-6 py-8">
  <!-- Header responsive para licencias -->
  <div class="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
    
    <!-- Grupo 1: Flecha + Búsqueda (siempre juntos) -->
    <div class="flex items-center gap-4 flex-1 min-w-0">
      <button 
        on:click={handleBackButtonClick}  
        class="flex items-center justify-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex-shrink-0"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m7 7l-7-7 7-7" />
        </svg>
      </button>
      
      <div class="flex-1 max-w-30px">
        <SearchInput placeholder="Buscar..." />
      </div>
    </div>
    
    <!-- Grupo 2: Botón descarga -->
    <div class="w-full lg:w-auto lg:flex-shrink-0">
      <DownloadCsv />
    </div>

    <div class="w-full lg:w-auto lg:flex-shrink-0">
      <Button>Agregar Noticia</Button>
    </div>
    
  </div>
  
  	<DataTable
					user={data.user}
					{orderCols}
					bind:this={dataTable}
					{columns}
					data={data?.lotes || []}
					render={renderColumn}
					defaultActions={['paid', 'edit', 'delete', 'restart']}
					{handleDelete}
					{handleRestart}
					{handleEdit}
					{handleAdd}
					{handlePaid}
			/>

  <!-- <LicenciasTable escuelas={escuelas} {meta} /> -->
</div>

