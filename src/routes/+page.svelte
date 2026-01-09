<script lang="ts">
	import { enhance } from '$app/forms';
	import Toast from '$lib/components/ui/Toast.svelte';
	import { Label, Input, Card, Helper, Spinner, Button } from 'flowbite-svelte';
	export let mainClass = 'bg-white-200 dark:bg-white-900 w-full min-h-screen flex flex-col';
	export let mainDivClass =
		'flex flex-col items-center justify-center px-6 pt-8 mx-auto  w-full pt:mt-0 dark:bg-white-900';

	let sending = false;
	let successMessage = '';
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

<title>Carnaval VIP</title>

<main class={mainClass}>
	<img src="/images/topbar-inicio.svg" alt="Topbar" class="max-w-full" />

	<div
		class={mainDivClass}
	>
		<div class="w-full bg-white rounded-xl p-8 shadow-none text-black max-w-[640px] max-h-[58px] mx-auto">
			<div class="flex justify-center items-center mb-4">
				<img src="/images/logo.svg" alt="Paso de los libres" width="374px" />
			</div>
			<form use:enhance={handleSubmit} method="post" action="?/login" class="mt-8 space-y-6">
				<div>
					<Label for="email" class="mb-2 text-black">Ingresar email</Label>
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
					<Label for="password" class="mb-2 text-black">Contraseña</Label>
					<Input
						type="password"
						name="password"
						id="password"
						placeholder="Ingrese contraseña"
						required
						class="border outline-none dark:border-white-600 dark:bg-white-700"
					/>
				</div>

				<Helper helperClass={'h-2 font-semibold mb-0 text-center'} color="red">
					{errorMessage?.length > 0 ? errorMessage : ''}
				</Helper>

				<Button
					type="submit"
					class="text-white border border-primary-500 hover:bg-primary-500 hover:text-white w-full"
					style="background: #068B3E;"
					disabled={sending}
				>
					{#if sending}
						<Spinner class="w-6 h-6 text-white" />
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
