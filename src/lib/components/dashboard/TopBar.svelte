<script lang="ts">
	import { enhance } from '$app/forms';
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

	$: firstNameChar = ((user as any)?.firstname?.charAt(0) || '').toUpperCase();
	
</script>

<header class="bg-white border-b border-gray-200 py-3 flex flex-col items-center relative shadow-sm w-full z-10 md:py-4">
	<div class="flex flex-center flex-col h-full justify-center mx-auto px-6 relative w-full">
		<div class="flex items-center pl-1 relative w-full sm:ml-0 sm:pr-2 justify-between flex-wrap gap-y-4">
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
					<span class="ml-4 flex items-center gap-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-[40vw] md:max-w-none text-[#1e293b]">
						<span class:text-lg={screenWidth < 1024} class:text-[22px]={screenWidth >= 1024} class="font-bold tracking-tight">
							{title}
						</span>
					</span>
				{/if}

			</div>

			<!-- Right Icons -->
			<div class="flex items-center justify-end gap-3 p-1 relative w-full md:w-auto ml-auto">
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

