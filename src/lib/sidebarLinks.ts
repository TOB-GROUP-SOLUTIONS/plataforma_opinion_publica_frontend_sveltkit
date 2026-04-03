import { HomeSolid, DatabaseSolid
	, MessagesSolid, BuildingSolid } from "flowbite-svelte-icons"

export const data = [
	{
		title: 'Inicio',
		icon: HomeSolid,
		link: '/admin'
	},
	{
		title: 'Base De datos',
		icon: DatabaseSolid,
		link: '/admin/articulos',
	},
	{
		title: 'Comentarios',
		icon: MessagesSolid,
		link: '/admin/comentarios',
	},
	{
		title: 'Personas / Temas',
		icon: BuildingSolid,
		link: '/admin/entidades',
	}
];
