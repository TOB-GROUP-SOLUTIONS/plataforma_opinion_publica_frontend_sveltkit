<script lang="ts">
	import 'tailwindcss/tailwind.css';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { derived } from 'svelte/store';

	import TopBar from './TopBar.svelte';
	import Overlay from './Overlay.svelte';
	import Sidebar from './sidebar/Sidebar.svelte';
	import { closeSidebar, sidebarOpen } from './store';

	$: user = $page.data.user;

    const style = {
        container: `bg-white h-screen overflow-hidden relative`,
        main: `bg-white h-full overflow-y-auto pb-36 pt-4 px-2 md:pb-8 lg:px-4`,
        mainContainer: `flex flex-col h-screen pl-0 w-full lg:pl-24`
    };


		// Diccionario de rutas a títulos
	const routeTitles: Record<string, string> = {
		'/admin': 'Inicio',
		'/admin/lcb': 'LCB',
		'/admin/todos': 'Todos',
		'/admin/mis-leads': 'Mis Leads',
		'/admin/nuevos-interesados': 'Nuevos Interesados',
		// Agrega aquí más rutas y títulos según sea necesario
	};

	// Deriva el título según la ruta actual
	const title = derived(page, $page => {
		const path = $page.url.pathname;
		if (path.includes('/perfil/cambiar-contrasena')) return 'Cambiar Contraseña';
		if (path.includes('/cuotas')) return 'Cuotas';
		if (path.includes('/personas-autorizadas')) return 'Personas Autorizadas';
		if (path.startsWith('/admin/propietarios') && path.includes('/parcelas')) return 'Lotes Del Cliente';
		if (path.startsWith('/admin/lotes-customers') && path.includes('/expenses')) return 'Expensas del Lote';
		// Mostrar "Lote: [id]" si la ruta es /admin/lotes-customers/[id] y no tiene más segmentos
		const match = path.match(/^\/admin\/lotes-customers\/(\d+)$/);
		if (match) return `Lote ${match[1]}`;
		if (path.startsWith('/admin/lotes-customers')) return 'Mis Lotes: ';
		if (path.startsWith('/admin/expensas/lotes')) return 'Lotes - Expensas';
		if (path.startsWith('/admin/expensas')) return 'Expensas';
		if (path.startsWith('/admin/gastos')) return 'Gastos';
		if (path.startsWith('/admin/gastos-admin')) return 'Gastos Administrativos';
		if (path.startsWith('/admin/propietarios')) return 'Clientes';
		if (path.startsWith('/admin/unidades')) return 'Unidades';
		if (path.startsWith('/admin/lotes')) return 'Lotes';
		if (path.startsWith('/admin/perfil')) return 'Perfil';
		if (path.startsWith('/admin/usuarios')) return 'Usuarios';
		if (path.startsWith('/admin/configuracion-expensas')) return 'Configuración';

		// Agrega más lógica para rutas dinámicas si es necesario
		return routeTitles[path] || '';
	});


	if (browser) {
		page.subscribe(() => {
			// close Sidebar on route changes when sidebar is open
			if ($sidebarOpen) {
				closeSidebar();
			}
		});
	}
</script>

<div class={style.container}>
	<div class="flex items-start">
		<Overlay />
		<Sidebar mobileOrientation="end" />
		<div class={style.mainContainer}>
			<TopBar 
			{user}
			title={$title}
 
			/>
			<main
				class={style.main}
			>
				<slot />
			</main>
		</div>
	</div>
</div>
