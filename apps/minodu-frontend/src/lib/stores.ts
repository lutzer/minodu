import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { Storage } from './storage';
import type { Language, Optional } from './types';

function createLanguageStore() {
	const { subscribe, set } = writable<Optional<Language>>(browser ? Storage.language : undefined);

	return {
		subscribe,
		set: (value: Language) => {
			if (browser) Storage.language = value;
			set(value);
		},
		refresh: () => {
			// Force notify subscribers without changing value
			set(undefined);
			set(Storage.language);
		}
	};
}

export const language = createLanguageStore();
