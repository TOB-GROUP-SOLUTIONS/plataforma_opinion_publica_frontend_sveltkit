<script lang="ts">
	import { enhance } from '$app/forms';
	import { Dropdown, DropdownItem } from 'flowbite-svelte';
	import { openSidebar } from './store';
	import { onMount } from 'svelte';
	import { ArrowLeftToBracketOutline } from 'flowbite-svelte-icons';
	import type { User } from '$lib/interfaces/user.interface';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	export let user: User | undefined;
	export let title: string = '';

	let form: HTMLFormElement;

	let screenWidth: number;

	onMount(() => {
		screenWidth = window.innerWidth;
		window.addEventListener('resize', () => (screenWidth = window.innerWidth));
	});

	// Reactive values for filters from the page data/URL
	$: dias = $page.url.searchParams.get('dias') || '7';
	$: entidadId = $page.url.searchParams.get('entidadId') || '';
	$: municipioId = $page.url.searchParams.get('municipioId') || '';
	$: redSocial = $page.url.searchParams.get('redSocial') || '';
	$: temaId = $page.url.searchParams.get('temaId') || '';
	$: entidadesDropdown = $page.data?.entidades || [];
	$: municipiosDropdown = $page.data?.municipios || [];
	

	function handleFilterChange(e: Event) {
		const target = e.target as HTMLSelectElement | null;
		if (target) {
			const name = target.name;
			const value = target.value;
			const url = new URL($page.url);
			
			if (value === "") {
				url.searchParams.delete(name);
			} else {
				url.searchParams.set(name, value);
			}
			
			// Reiniciar página al filtrar
			url.searchParams.delete('page');
			
			goto(url.toString(), { keepFocus: true, noScroll: true });
		}
	}

	$: firstNameChar = ((user as any)?.firstname?.charAt(0) || '').toUpperCase();
	
</script>

<header class="bg-white border-b border-gray-200 py-3 md:py-4 w-full z-10 sticky top-0 px-4 md:px-6 shadow-sm">
	<div class="mx-auto w-full max-w-[1600px]">
		
		<!-- Contenedor Principal: Columna en Móvil, Fila en Desktop -->
		<div class="flex flex-col md:flex-row md:items-center justify-between gap-4 relative">
			
			<!-- Fila 1: Toggle, Título y Avatar (Móvil) / Lado Izquierdo (Desktop) -->
			<div class="flex items-center justify-between w-full md:w-auto z-10">
				<div class="flex items-center gap-2 md:gap-4">
					<button
						type="button"
						on:click={openSidebar}
						class="text-[32px] font-light text-[#1e293b] hover:bg-gray-100 rounded-lg px-2 pb-1 transition-colors leading-none focus:outline-none"
					>
						&#8801;
					</button>

					{#if title}
						<span class="text-lg md:text-xl font-bold text-[#1e293b] whitespace-nowrap overflow-hidden text-ellipsis max-w-[50vw]">
							{title}
						</span>
					{/if}
				</div>

				<!-- Usuario Móvil (Oculto en Desktop) -->
				<div class="md:hidden flex items-center">
					<div class="rounded-full p-0.5 border border-gray-300">
						<div class="w-9 h-9 acs-mobile cursor-pointer bg-white rounded-full flex items-center justify-center">
							<span class="text-xl font-bold text-[#DD052B]">{firstNameChar}</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Fila 2: Filtros (Móvil) / Centro absoluto (Desktop) -->
			<div class="flex items-center justify-center w-full md:absolute md:left-1/2 md:-translate-x-1/2 md:w-auto overflow-x-auto no-scrollbar scrollbar-hide py-1 md:py-0 z-0">
				<div class="flex items-center bg-gray-50/80 p-1 px-2 rounded-xl border border-gray-100 space-x-1 whitespace-nowrap">
					
					<!-- Period -->
					<div class="flex items-center border-r border-gray-200 px-2 md:px-4">
						<span class="text-[10px] font-bold text-gray-400 uppercase hidden lg:inline mr-2">Rango de fechas</span>
						<select
							name="dias"
							value={dias}
							on:change={handleFilterChange}
							class="bg-transparent border-none text-[13px] font-semibold text-gray-700 focus:ring-0 cursor-pointer py-1 pr-8"
						>
							<option value="1">1 dia</option>
							<option value="7">7 días</option>
						</select>
					</div>

					<!-- Entity -->
					<div class="flex items-center border-r border-gray-200 px-2 md:px-4">
						<span class="text-[10px] font-bold text-gray-400 uppercase hidden lg:inline mr-2">Entidad</span>
						<select
							name="entidadId"
							value={entidadId}
							on:change={handleFilterChange}
							class="bg-transparent border-none text-[13px] font-semibold text-gray-700 focus:ring-0 cursor-pointer py-1 pr-8 max-w-[130px] md:max-w-[200px] truncate"
						>
							<option value="">Todas</option>
							{#each entidadesDropdown as entidad}
								<option value={String(entidad.id)}>{entidad.entidad}</option>
							{/each}
						</select>
					</div> 

					<div class="flex items-center border-r border-gray-200 px-2 md:px-4">
						<span class="text-[10px] font-bold text-gray-400 uppercase hidden lg:inline mr-2">Municipios</span>
						<select
							name="municipioId"
							value={municipioId}
							on:change={handleFilterChange}
							class="bg-transparent border-none text-[13px] font-semibold text-gray-700 focus:ring-0 cursor-pointer py-1 pr-8 max-w-[130px] md:max-w-[200px] truncate"
						>
							<option value="">Todas</option>
							{#each municipiosDropdown as municipio}
								<option value={String(municipio.id)}>{municipio.municipio}</option>
							{/each}
						</select>
					</div> 

					<!-- Source -->
					<div class="flex items-center px-2 md:px-4">
						<span class="text-[10px] font-bold text-gray-400 uppercase hidden lg:inline mr-2">Fuente</span>
						<select
							name="redSocial"
							value={redSocial}
							on:change={handleFilterChange}
							class="bg-transparent border-none text-[13px] font-semibold text-gray-700 focus:ring-0 cursor-pointer py-1 pr-8"
						>
							<option value="">Todas</option>
							<option value="Facebook">Facebook</option>
							<option value="X">X (Twitter)</option>
							<option value="Instagram">Instagram</option>
						</select>
					</div>

<!-- 					<div class="flex items-center border-r border-gray-200 px-2 md:px-4">
						<span class="text-[10px] font-bold text-gray-400 uppercase hidden lg:inline mr-2">Tema / Categoria </span>
						<select
							name="temaId"
							value={temaId}
							on:change={handleFilterChange}
							class="bg-transparent border-none text-[13px] font-semibold text-gray-700 focus:ring-0 cursor-pointer py-1 pr-8 max-w-[130px] md:max-w-[200px] truncate"
						>
							<option value="">Todas</option>
							<option value="economía">Economía</option>
							<option value="política">Política</option>
							<option value="gestión pública">Gestión pública</option>
							<option value="salarios">Salarios</option>
							<option value="impuestos">Impuestos</option>
							<option value="corrupción">Corrupción</option>
							<option value="otros">Otros</option>
						</select>
					</div> -->
				</div>
			</div>

			<!-- Lado Derecho: Usuario (Desktop) -->
			<div class="hidden md:flex items-center justify-end flex-shrink-0 z-10 w-[60px]">
				<div class="rounded-full p-1 border border-gray-300">
					<div class="w-11 h-11 lg:w-12 lg:h-12 acs cursor-pointer bg-white rounded-full flex items-center justify-center">
						<span class="text-2xl font-bold text-[#DD052B]">{firstNameChar}</span>
					</div>
					<Dropdown triggeredBy=".acs" class="mt-2 text-left">
						<DropdownItem class="text-center flex justify-center text-gray-600" slot="footer" on:click={() => form.requestSubmit()}>
							<ArrowLeftToBracketOutline class="mr-2"/> Cerrar sesión
						</DropdownItem>
					</Dropdown>
					<form
						method="POST"
						bind:this={form}
						class="hidden"
						action="/logout"
						use:enhance
					></form>
				</div>
			</div>

		</div>
	</div>
</header>

