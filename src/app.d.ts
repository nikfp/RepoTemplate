/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
	interface Locals {
		user?: {
			email: string;
		};
		signOut?: boolean;
	}
	// interface Platform {}
	interface Session {
		user?: {
			email: string;
		};
		signOut?: boolean;
	}
	// interface Stuff {}
}
