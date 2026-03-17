<script lang="ts">
	import { Config } from '$lib';
	import { AiServicesApi } from '$lib/apis/ai_services/api';
	import { onDestroy } from 'svelte';
	import { writable } from 'svelte/store';

	let { speaking = $bindable(false) }: { speaking?: boolean } = $props();

	export const playbackReset = writable<{ timestamp: number } | null>(null);

	onDestroy(() => {
		stop();
	});

	let cleanupQueue: { cleanup: () => void }[] = [];

	export async function stop() {
		speaking = false;
		playbackReset.set({ timestamp: Date.now() });

		cleanupQueue.forEach((element) => {
			element.cleanup();
		});
	}

	export async function speak(text: string) {
		stop();
		speaking = true;

		let response = await AiServicesApi.generateTextToSpeechStream({
			text: text,
			language: Config.language,
			format: 'mp3',
			return_header: false
		});

		const reader = response.body?.getReader();

		if (!reader) throw Error('Could not initialize audio response reader');

		let player = new Audio();

		player.addEventListener('ended', onMediaEnded);

		const useMediaSource =
			typeof MediaSource !== 'undefined' && MediaSource.isTypeSupported('audio/mpeg');

		if (useMediaSource) {
			let mediaSource = new MediaSource();
			let mediaSourceBuffer: SourceBuffer;
			let audioQueue: ArrayBuffer[] = [];

			player.src = URL.createObjectURL(mediaSource);
			player.play();

			mediaSource.addEventListener('error', (e) => {
				console.error('MediaSource error:', e);
			});

			mediaSource.addEventListener('sourceopen', handleSourceOpened);

			function handleSourceOpened() {
				if (player.paused) return;
				mediaSourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');

				mediaSourceBuffer.addEventListener('updateend', () => {
					processQueue();
				});

				mediaSourceBuffer.addEventListener('error', (e) => {
					console.error('SourceBuffer error:', e);
				});

				processQueue();
			}

			function processQueue() {
				if (!mediaSourceBuffer || mediaSourceBuffer.updating) return;

				if (audioQueue.length > 0) {
					mediaSourceBuffer.appendBuffer(audioQueue.shift()!);
				}
			}

			function cleanup() {
				reader?.cancel();

				player.removeEventListener('ended', onMediaEnded);
				player.pause();

				mediaSource.removeEventListener('sourceopen', handleSourceOpened);

				if (mediaSource.readyState === 'open') {
					mediaSourceBuffer?.abort();
					if (mediaSourceBuffer) {
						mediaSource.removeSourceBuffer(mediaSourceBuffer);
					}
					mediaSource.endOfStream();
				}

				player.removeAttribute('src');
				URL.revokeObjectURL(player.src);
			}

			cleanupQueue.push({ cleanup: cleanup });

			while (true) {
				const { done, value } = await reader.read();
				if (done) {
					if (mediaSource.readyState === 'open') mediaSource.endOfStream();
					break;
				}
				audioQueue.push(value.buffer);
				processQueue();
			}
		} else {
			// Blob fallback for Firefox / Safari (no audio/mpeg MSE support)
			const chunks: ArrayBuffer[] = [];
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				chunks.push(value.buffer);
			}
			if (!speaking) return;
			const blob = new Blob(chunks, { type: 'audio/mpeg' });
			const blobUrl = URL.createObjectURL(blob);
			player.src = blobUrl;
			player.play();

			cleanupQueue.push({
				cleanup: () => {
					reader?.cancel();
					player.removeEventListener('ended', onMediaEnded);
					player.pause();
					URL.revokeObjectURL(blobUrl);
					player.removeAttribute('src');
				}
			});
		}
	}

	function onMediaEnded() {
		speaking = false;
		playbackReset.set({ timestamp: Date.now() });
	}
</script>
