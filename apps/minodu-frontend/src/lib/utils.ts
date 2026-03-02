import { tick } from 'svelte';
import type { Optional } from './types';

export function delay(ms: number): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

export function waitForAnimationFrame(): Promise<void> {
	return new Promise((resolve) => {
		requestAnimationFrame(() => {
			requestAnimationFrame(() => resolve());
		});
	});
}

export function mimeTypeToFileExtension(mimeType: string): string {
	const mimeToExtension: Record<string, string> = {
		// Images
		'image/png': '.png',
		'image/jpeg': '.jpg',
		'image/jpg': '.jpg',
		'image/gif': '.gif',
		'image/webp': '.webp',
		'image/svg+xml': '.svg',
		'image/bmp': '.bmp',
		'image/tiff': '.tiff',
		'image/x-icon': '.ico',
		'image/heic': '.heic',
		'image/heif': '.heif',
		'image/avif': '.avif',

		// Audio
		'audio/mpeg': '.mp3',
		'audio/wav': '.wav',
		'audio/ogg': '.ogg',
		'audio/mp4': '.m4a',
		'audio/aac': '.aac',
		'audio/flac': '.flac',
		'audio/x-ms-wma': '.wma',
		'audio/webm': '.webm',
		'audio/x-m4a': '.m4a',
		'audio/aiff': '.aiff'
	};

	if (!mimeType) return '';

	// Normalize and handle charset parameters (e.g., 'text/html; charset=utf-8')
	const normalizedMime = mimeType.toLowerCase().split(';')[0].trim();
	return mimeToExtension[normalizedMime] || '';
}

export async function* streamResponseGenerator(
	streamingResponse: any,
	signal?: AbortSignal
): AsyncGenerator<string> {
	const reader: Optional<ReadableStreamDefaultReader<Uint8Array<ArrayBuffer>>> =
		streamingResponse.body?.getReader();

	if (!reader) throw Error('Could not initialize response reader');

	const decoder = new TextDecoder();

	try {
		while (true) {
			if (signal?.aborted) break;

			const { done, value } = await reader.read();
			if (done) break;

			const text = decoder.decode(value, { stream: true });
			yield text;
			await tick();
			await delay(10);
		}
	} finally {
		reader.releaseLock();
	}
}
