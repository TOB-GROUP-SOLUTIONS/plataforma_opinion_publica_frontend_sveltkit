import { Title } from "chart.js";
import {UsersGroupSolid, HomeSolid, ClipboardOutline, BuildingSolid,UsersSolid, BookSolid} from "flowbite-svelte-icons"
import MisLeds from "./components/ui/misLeds.svelte";
import LCB from "./components/ui/LCB.svelte";
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
		title: 'Todos',
		icon: UsersGroupSolid,
		link: '/admin/todos',
		sub_items: [
			{
				title: 'Todos',
				link: '/admin/todos',
				icon: ClipboardOutline
			},
			{
				title: 'Sin presupuesto',
				link: '/admin/todos?status=13',
				icon: ClipboardOutline

			},
			{
				title: 'Con presupuesto',
				link: '/admin/todos?status=14',
				icon: ClipboardOutline
			},
			{
				title: 'Clientes',
				link: '/admin/todos?status=15',
				icon: BuildingSolid,
			},
		]
	},


	{
		title: 'Mis leads',
		icon: MisLeds,
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
		icon: LCB,
		link: '/admin/lcb',
	},
];
