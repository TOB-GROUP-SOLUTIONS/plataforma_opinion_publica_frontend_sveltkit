<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { ChevronDownOutline, ChevronUpOutline } from 'flowbite-svelte-icons';
	
	export let actions: { label: string; event: string; icon?: any; class?: string }[] = [];
	
	let isOpen = false;
	let buttonElement: HTMLButtonElement;
	let dropdownStyle = '';
	
	const dispatch = createEventDispatcher();
	
	function toggleDropdown() {
		isOpen = !isOpen;
		if (isOpen && buttonElement) {
			updateDropdownPosition();
		}
	}
	
	function updateDropdownPosition() {
		const rect = buttonElement.getBoundingClientRect();
		dropdownStyle = `
			position: fixed;
			top: ${rect.bottom + 8}px;
			right: ${window.innerWidth - rect.right}px;
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
		class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-full flex items-center gap-2 text-sm transition-colors"
	>
		Seleccionar Acción
		{#if isOpen}
			<ChevronUpOutline size="sm" />
		{:else}
			<ChevronDownOutline size="sm" />
		{/if}
	</button>
	
	{#if isOpen}
		<div style={dropdownStyle} class="w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-[99999] overflow-hidden">

            <h1 class="p-4 font-semibold text-gray-700 text-center">Seleccionar Acción</h1>

            <hr class="bg-gray-200">

			<div class="p-4 space-y-2">
				{#each actions as action}
					<button
						on:click|stopPropagation={() => handleAction(action.event)}
						class={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors rounded-lg ${action.class || 'text-gray-700'}`}
					>
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
