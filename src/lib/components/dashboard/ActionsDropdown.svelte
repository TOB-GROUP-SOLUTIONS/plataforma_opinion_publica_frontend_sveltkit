<script lang="ts">
	import { createEventDispatcher, tick } from 'svelte';
	import { ChevronDownOutline, ChevronUpOutline } from 'flowbite-svelte-icons';
	
	export let actions: { label: string; event: string; icon?: any; class?: string }[] = [];
	
	let isOpen = false;
	let buttonElement: HTMLButtonElement;
	let dropdownStyle = '';
	let dropdownElement: HTMLDivElement;
	
	const dispatch = createEventDispatcher();
	
	async function toggleDropdown() {
		isOpen = !isOpen;
		if (isOpen && buttonElement) {
			await tick();
			updateDropdownPosition();
		}
	}
	
	function updateDropdownPosition() {
		if (!buttonElement || !isOpen) {
			dropdownStyle = '';
			return;
		}
		const rect = buttonElement.getBoundingClientRect();
		const margin = 8;
		// fallback al ancho del botón para evitar que el dropdown sea más amplio que la celda
		let dropdownWidth = rect.width || 200;
		let dropdownHeight = 250;
		if (dropdownElement) {
			const dRect = dropdownElement.getBoundingClientRect();
			dropdownWidth = Math.max(rect.width, dRect.width || dropdownWidth);
			dropdownHeight = dRect.height || dropdownHeight;
		}
		// decidir abrir arriba o abajo
		const spaceBelow = window.innerHeight - rect.bottom;
		const spaceAbove = rect.top;
		let top: number;
		if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
			// abrir hacia arriba
			top = rect.top - dropdownHeight - margin;
		} else {
			// abrir hacia abajo
			top = rect.bottom + margin;
		}
		// clamp top dentro del viewport
		top = Math.max(margin, Math.min(top, window.innerHeight - Math.min(dropdownHeight, window.innerHeight - margin) - margin));
		// calcular left y evitar overflow horizontal
		let left = rect.left;
		const minWidth = Math.max(rect.width, Math.min(dropdownWidth, 400));
		if (left + minWidth > window.innerWidth - margin) {
			left = window.innerWidth - minWidth - margin;
		}
		left = Math.max(margin, left);
		// usar max-width en vw para pantallas pequeñas y min-width basado en botón
		dropdownStyle = `
			position: fixed;
			top: ${top}px;
			left: ${left}px;
			min-width: ${minWidth}px;
			max-width: calc(100vw - ${margin * 2}px);
			z-index: 1000;
		`;
	}
	
	function handleAction(event: string) {
		dispatch(event);
		isOpen = false;
	}
	
	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.actions-dropdown')) {
			isOpen = false;
		}
	}
</script>

<svelte:window on:click={handleClickOutside} on:scroll={updateDropdownPosition} on:resize={updateDropdownPosition} />

<div class="actions-dropdown relative inline-block">
	<button
		bind:this={buttonElement}
		on:click|stopPropagation={toggleDropdown}
		class="px-3 py-1 sm:px-4 sm:py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-full flex items-center gap-2 text-sm transition-colors max-w-[160px] sm:max-w-none truncate whitespace-nowrap"
	>
		<span class="truncate">Seleccionar Acción</span>
		{#if isOpen}
			<ChevronUpOutline size="sm" />
		{:else}
			<ChevronDownOutline size="sm" />
		{/if}
	</button>
	
	{#if isOpen}
		<div bind:this={dropdownElement} style={dropdownStyle} class="bg-white rounded-lg shadow-xl border border-gray-200 z-[1000] overflow-auto max-h-[60vh]">

			<h1 class="p-4 font-semibold text-gray-700 text-center">Seleccionar Acción</h1>

			<hr class="bg-gray-200">

			<div class="p-4 space-y-2">
				{#each actions as action}
					<button
						on:click|stopPropagation={() => handleAction(action.event)}
						class={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors rounded-lg ${action.class || 'text-gray-700'}`}>
						{#if action.icon}
							<svelte:component this={action.icon} size="sm" />
						{/if}
						<span>{action.label}</span>
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>
