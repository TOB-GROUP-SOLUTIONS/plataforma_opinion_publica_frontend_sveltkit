<script lang="ts">
	import { enhance } from '$app/forms';
	import { Dropdown, DropdownItem, Avatar } from 'flowbite-svelte';
	import { openSidebar } from './store';
	import { onMount } from 'svelte';
	import { ArrowLeftToBracketOutline } from 'flowbite-svelte-icons';
	import type { User } from '$lib/interfaces/user.interface';
	import { redirect } from '@sveltejs/kit';

	export let user: User | undefined;
	export let title: string = '';

	let form: HTMLFormElement;

	let screenWidth: number;

	onMount(() => {
		screenWidth = window.innerWidth;
		window.addEventListener('resize', () => (screenWidth = window.innerWidth));
	});

    function logout() {
        // Enviar directamente un POST para eliminar la cookie en el servidor
        fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        }).finally(() => {
            // Recargar completamente la página, ignorando la caché
            window.location.replace('/?t=' + Date.now());
        });
    }
	
</script>

<header class="bg-[#0C2C6557] h-16 items-center relative shadow w-full z-10 md:h-20">
	<div class="flex flex-center flex-col h-full justify-center mx-auto px-3 relative">
		<div class="flex items-center pl-1 relative w-full sm:ml-0 sm:pr-2 lg:max-w-68">
			<div class="flex left-0 relative w-3/4">
				<div class="flex group h-full items-center relative w-12">
					<button
						type="button"
						aria-expanded="false"
						aria-label="Toggle sidenav"
						on:click={openSidebar}
						class="text-4xl  ${screenWidth < 1024 ? 'text-[#0C2C65]' : 'text-black'} text-black focus:outline-none flex items-center gap-2"
					>
						&#8801;
					</button>
				</div>

				<!-- Título de la sección -->
				{#if title}
					<span
						class="ml-4 flex items-center gap-2 uppercase whitespace-nowrap overflow-hidden text-ellipsis max-w-[70vw] md:max-w-none"
						class:text-white={screenWidth < 1024}
						class:text-[#393D48]={screenWidth >= 1024}
					>
						<span class:text-sm={screenWidth < 1024} class:text-2xl={screenWidth >= 1024}>
							{title}
						</span>
					</span>
				{/if}
			</div>
			<!-- iconos right -->
			<div class="flex items-center justify-end gap-3 p-1 relative w-full sm:mr-0 sm:right-auto ">
				<div class="rounded-full p-1 border border-gray-300">
					<div class="w-12 h-12 acs cursor-pointer bg-white rounded-full flex items-center justify-center">
						<span class="text-4xl text-[#DD052B]">{user?.firstname?.charAt(0).toUpperCase() ?? ''}</span>
					</div>
					<Dropdown triggeredBy=".acs" class="mt-2">
						<a class="block text-xs text-gray-700" href="/admin/perfil"><DropdownItem class="text-center">Perfil</DropdownItem></a>
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
