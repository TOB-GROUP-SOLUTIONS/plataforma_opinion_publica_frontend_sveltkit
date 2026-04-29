<script lang="ts">
	import { sidebarOpen } from '../store';
</script>

<div
	class={`flex flex-col items-start justify-center p-6 sticky top-0 z-10 border-b border-[#1f2937] w-full transition-all duration-200
		${$sidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}
>
	{#if $sidebarOpen}
		<h1 class="text-white text-lg font-bold tracking-wide leading-tight">
			Plataforma de monitoreo de opinion publica
		</h1>
		<p class="text-[#7D93B2] text-[10px] font-semibold tracking-wider mt-1 uppercase">
			Inteligencia Social
		</p>
	{/if}
</div>
