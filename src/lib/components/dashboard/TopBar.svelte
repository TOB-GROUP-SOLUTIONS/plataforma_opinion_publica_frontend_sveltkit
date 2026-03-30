<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { Dropdown, DropdownItem } from 'flowbite-svelte';
	import { openSidebar } from './store';
	import { onMount } from 'svelte';
	import { ArrowLeftToBracketOutline } from 'flowbite-svelte-icons';
	import type { User } from '$lib/interfaces/user.interface';

	export let user: User | undefined;
	export let title: string = '';

	let form: HTMLFormElement;

	let screenWidth: number;

	onMount(() => {
		screenWidth = window.innerWidth;
		window.addEventListener('resize', () => (screenWidth = window.innerWidth));
	});

    function logout() {
        fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        }).finally(() => {
            window.location.replace('/?t=' + Date.now());
        });
    }

	function handleFilterChange(e: Event) {
		const target = e.target as HTMLSelectElement | null;
		if (target && target.form) {
			target.form.submit();
		}
	}

	$: dias = String($page.data?.filters?.dias || '7');
	$: redSocial = String($page.data?.filters?.redSocial || '');
	$: entidadId = $page.data?.filters?.entidadId ? String($page.data.filters.entidadId) : '';
	$: entidadesDropdown = $page.data?.entidades || [];
	$: firstNameChar = ((user as any)?.firstname?.charAt(0) || '').toUpperCase();
	
</script>

<header class="bg-white border-b border-gray-200 h-16 items-center relative shadow-sm w-full z-10 md:h-20">
	<div class="flex flex-center flex-col h-full justify-center mx-auto px-6 relative">
		<div class="flex items-center pl-1 relative w-full sm:ml-0 sm:pr-2 justify-between">
			<div class="flex items-center left-0 relative">
				<div class="flex group h-full items-center justify-center relative w-10">
					<button
						type="button"
						aria-expanded="false"
						aria-label="Toggle sidenav"
						on:click={openSidebar}
						class="text-[32px] font-light text-[#1e293b] focus:outline-none flex items-center hover:bg-gray-100 rounded-lg px-2 pb-1 transition-colors leading-none"
					>
						&#8801;
					</button>
				</div>

				<!-- Título de la sección -->
				{#if title}
					<span class="ml-4 flex items-center gap-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-[70vw] md:max-w-none text-[#1e293b]">
						<span class:text-lg={screenWidth < 1024} class:text-[22px]={screenWidth >= 1024} class="font-bold tracking-tight">
							{title}
						</span>
					</span>
				{/if}

                <button type="button" class="ml-5 bg-white border border-gray-200 text-[#475569] text-[13px] rounded-md px-3.5 py-1.5 hover:bg-gray-50 transition flex items-center gap-2 shadow-sm font-medium">
                    <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    Exportar
                </button>
			</div>

			<!-- Filters and Right Icons -->
			<div class="flex items-center justify-end gap-4 p-1 relative w-full sm:mr-0 sm:right-auto">
				<!-- Global Filters -->
				<form method="GET" class="hidden xl:flex flex-wrap gap-2 items-center mr-2" action={$page.url.pathname}>
					<select name="dias" value={dias} on:change={handleFilterChange} class="bg-white border border-gray-200 text-[#475569] font-medium text-[13px] rounded-lg py-1.5 px-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm cursor-pointer hover:bg-gray-50 h-[36px]">
						<option value="7">Últimos 7 días</option>
						<option value="30">Últimos 30 días</option>
						<option value="3000">Desde siempre</option>
					</select>
					<select name="redSocial" value={redSocial} on:change={handleFilterChange} class="bg-white border border-gray-200 text-[#475569] font-medium text-[13px] rounded-lg py-1.5 px-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm cursor-pointer hover:bg-gray-50 h-[36px]">
						<option value="">Todas las fuentes</option>
						<option value="Facebook">Facebook</option>
						<option value="X">X</option>
						<option value="Instagram">Instagram</option>
					</select>
					<select name="entidadId" value={entidadId} on:change={handleFilterChange} class="bg-white border border-gray-200 text-[#475569] font-medium text-[13px] rounded-lg py-1.5 px-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm cursor-pointer hover:bg-gray-50 h-[36px]">
						<option value="">Todas las entidades</option>
						{#each entidadesDropdown as entidad}
							<option value={String(entidad.id)}>{entidad.entidad} ({entidad.tipo})</option>
						{/each}
					</select>
				</form>

				<div class="rounded-full p-1 border border-gray-300">
					<div class="w-12 h-12 acs cursor-pointer bg-white rounded-full flex items-center justify-center">
						<span class="text-3xl font-bold text-[#DD052B]">{firstNameChar}</span>
					</div>
					<Dropdown triggeredBy=".acs" class="mt-2">
						<DropdownItem class="text-center flex justify-center text-gray-600" slot="footer" on:click={() => form.requestSubmit()}><ArrowLeftToBracketOutline/> Cerrar sesión</DropdownItem>
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

