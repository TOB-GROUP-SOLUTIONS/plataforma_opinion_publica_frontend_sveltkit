import { HomeSolid, BookSolid, MessagesSolid, BuildingSolid } from "flowbite-svelte-icons"

export const data = [
	{
		title: 'Inicio',
		icon: HomeSolid,
		link: '/admin'
	},
	{
		title: 'Artículos',
		icon: BookSolid,
		link: '/admin/articulos',
	},
	{
		title: 'Comentarios',
		icon: MessagesSolid,
		link: '/admin/comentarios',
	},
	{
		title: 'Entidades',
		icon: BuildingSolid,
		link: '/admin/entidades',
	}
];
