// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { LoggedUser } from '$lib/interfaces/user.interface';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: LoggedUser;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
