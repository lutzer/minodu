import { writable } from 'svelte/store';

type Toast = {
	message: string;
	type: 'error' | 'info';
};

const TOAST_DURATION = 4000;

let timeout: ReturnType<typeof setTimeout> | undefined;

function createToastStore() {
	const { subscribe, set } = writable<Toast | undefined>(undefined);

	function show(message: string, type: 'error' | 'info' = 'error') {
		if (timeout) clearTimeout(timeout);
		set({ message, type });
		timeout = setTimeout(() => {
			set(undefined);
			timeout = undefined;
		}, TOAST_DURATION);
	}

	function dismiss() {
		if (timeout) clearTimeout(timeout);
		timeout = undefined;
		set(undefined);
	}

	return { subscribe, show, dismiss };
}

export const toast = createToastStore();
