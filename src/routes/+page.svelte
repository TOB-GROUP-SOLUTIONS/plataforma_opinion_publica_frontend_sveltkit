<script lang="ts">
	import { enhance } from '$app/forms';
	import Toast from '$lib/components/ui/Toast.svelte';
	import { Label, Input, Card, Helper, Button } from 'flowbite-svelte';
	import { Circle2 } from 'svelte-loading-spinners';
	export let mainClass = 'bg-white-200 dark:bg-white-900 w-full min-h-screen flex flex-col';
	import { EyeOutline, EyeSlashOutline } from 'flowbite-svelte-icons';
	export let mainDivClass =
		'flex flex-col items-center justify-center px-6 pt-8 mx-auto  w-full pt:mt-0 dark:bg-white-900';

	let sending = false;
	let successMessage = '';
	let showPassword = false;

	let errorMessage = '';
	const handleSubmit = ({}) => {
		sending = true;

		return async ({ result, update }: any) => {
			if (result.type === 'redirect') {
				successMessage = 'Inicio de sesión exitoso';
				sending = false;
				errorMessage = '';
			} else {
				sending = false;
				errorMessage = result?.data?.error;
				console.log('error', errorMessage);
			}
			await update({});
		};
	};
</script>

<title>Together</title>

<main class="w-full min-h-screen flex flex-col items-center justify-center relative">
	<img
		src="/images/bg.svg"
		alt="Background"
		class="absolute inset-0 w-full h-full object-cover z-0"
	/>

	<div class="flex flex-col items-center justify-center px-6 pt-8 mx-auto w-full pt:mt-0 z-10">
		<div class="w-full rounded-xl p-8 shadow-none text-black max-w-[589px] mx-auto relative">
			<div class="flex justify-center items-center mb-4">
				<img src="/images/logo.svg" alt="Together" width="374px" />
			</div>
			<form use:enhance={handleSubmit} method="post" action="?/login" class="mt-8 space-y-6">
				<div>
					<Label for="email" class="mb-2 text-[#081C3F]">Ingresar email</Label>
					<Input
						type="email"
						name="email"
						id="email"
						placeholder="Ingrese su usuario"
						required
						class="border outline-none dark:border-white-600 dark:bg-white-700"
					/>
				</div>
				<div>
					<Label for="password" class="mb-2 text-[#081C3F]">Contraseña</Label>
					<div class="relative">
						<Input
							type={showPassword ? 'text' : 'password'}
							name="password"
							id="password"
							placeholder="Ingrese contraseña"
							required
							class="border outline-none dark:border-white-600 dark:bg-white-700"
						/>

						<button
							type="button"
							on:click={() => (showPassword = !showPassword)}
							class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 hover:text-gray-800 focus:outline-none"
							aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
						>
							{#if showPassword}
								<EyeSlashOutline class="shrink-0 h-6 w-6" />
							{:else}
								<EyeOutline class="shrink-0 h-6 w-6" />
							{/if}
						</button>
					</div>
				</div>

				<Helper helperClass={'h-2 font-semibold mb-0 text-center'} color="red">
					{errorMessage?.length > 0 ? errorMessage : ''}
				</Helper>

				<Button
					type="submit"
					class="text-white border border-primary-500 hover:bg-primary-500 hover:text-white w-full"
					style="background: #0C2C65;"
					disabled={sending}
				>
					{#if sending}
						<Circle2 size="24" colorOuter="#ffffff" colorCenter="#ffffff" colorInner="#0C2C65" />
					{:else}
						Ingresar
					{/if}
				</Button>
			</form>
		</div>
	</div>
</main>

{#if successMessage.length > 0}
	<Toast type="success" dismissible={true} showToast={true} bind:successMessage />
{/if}
