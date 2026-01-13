<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button, Label, Modal, Helper, Popover, Card, Select } from 'flowbite-svelte';
	import { UserAddOutline, CirclePlusOutline } from 'flowbite-svelte-icons';
	import { Search } from 'flowbite-svelte';
	import Toast from '$lib/components/ui/Toast.svelte';
	import { enhance } from '$app/forms';
	export let data;
	/*     let user = data.user;
	 */
	let sending = false;
	let errorMessage = '';
	let successMessage = '';
	let formModal = false;
	let currentProjectId = '';
	let selectedLotId = '';
	let numeroCuotas = 1;
	let litrosPorCuota = 1;
	let lotesProyecto = [];
</script>

<svelte:head>
	<title>Inicio</title>
</svelte:head>
<div class="w-full max-w-screen-4xl rounded-lg mx-auto bg-transparent dark:bg-gray-800 px-6 py-8">
	<div class="w-full flex flex-col justify-center items-center mb-8">
		<h1 class="text-3xl font-semibold text-[#0C2C65] dark:text-white mb-4 text-center">
			Centro de Busqueda
		</h1>
    <div class="w-full max-w-[898px] flex justify-center">
			<Search placeholder="Buscar por nombre,DNI,telefono" class="h-20 max-w-[898px] bg-[#02325A26]" />
		</div>
	</div>
	<div class="flex justify-center gap-4 p-4 sm:flex-row flex-col"></div>
</div>

{#if successMessage.length > 0}
	<Toast type="success" dismissible={true} showToast={true} bind:successMessage />
{/if}
