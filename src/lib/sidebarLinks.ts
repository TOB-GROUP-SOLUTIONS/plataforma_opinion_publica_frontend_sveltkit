import { Title } from "chart.js";
import {UsersGroupSolid, HomeSolid, ClipboardOutline, BuildingSolid,UsersSolid, BookSolid} from "flowbite-svelte-icons"

export const data = [

	{
		title: 'Inicio',
		icon: HomeSolid,
		link: '/admin'
	},
	{
		title: 'Nuevos Intersados',
		icon: UsersSolid,
		link: '/admin/nuevos-interesados',
	},

	{
		title: 'Mis leads',
		icon: UsersGroupSolid,
		link: '/admin/mis-leads',
		sub_items: [
			{
				title: 'Sin presupuesto',
				link: '/admin/mis-leads?status=13',
				icon: ClipboardOutline

			},
			{
				title: 'Con presupuesto',
				link: '/admin/mis-leads?status=14',
				icon: ClipboardOutline
			},
			{
				title: 'Clientes',
				link: '/admin/mis-leads?status=15',
				icon: BuildingSolid,
			},
		]
	},

	{
		title: 'LCB',
		icon: BookSolid,
		link: '/admin/lcb',
	},
];
