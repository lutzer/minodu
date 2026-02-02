<script lang="ts">
	import type { Optional } from '$lib/types';
	import { onMount } from 'svelte';

	export let blob: Optional<Blob>;
	export let recording: boolean = false;

	let mediaDeviveAvailable: boolean = true;
	let fileInput: HTMLInputElement;

	let mediaChunks: Blob[] = [];
	let mediaRecorder: Optional<MediaRecorder>;
	let audioElement: HTMLAudioElement;

	onMount(async () => {
		// mediaDeviveAvailable = navigator.mediaDevices?.getUserMedia !== undefined;
		mediaDeviveAvailable = false;
	});

	$: if (!blob) {
		reset();
	}

	async function prepareRecorder() {
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
		mediaRecorder.ondataavailable = (e) => mediaChunks.push(e.data);

		mediaRecorder.onstop = () => {
			recording = false;

			// create playable audio
			blob = new Blob(mediaChunks, { type: mediaRecorder?.mimeType });
			audioElement.src = URL.createObjectURL(blob);
			mediaChunks = [];

			// cleanup tracks
			stream.getAudioTracks().forEach((t) => {
				t.stop();
				stream.removeTrack(t);
			});
			mediaRecorder = undefined;
		};

		mediaRecorder.onerror = (err) => {
			console.error(err);
		};

		mediaRecorder.onstart = () => {
			recording = true;
		};
	}

	export async function startRecording() {
		reset();
		if (mediaDeviveAvailable) {
			if (!mediaRecorder) {
				await prepareRecorder();
			}
			mediaRecorder?.start();
		} else {
			fileInput.click();
		}
	}

	export function stopRecording() {
		mediaRecorder?.stop();
	}

	export function reset() {
		mediaRecorder?.stop();
		blob = undefined;
		mediaChunks = [];
		if (audioElement) {
			audioElement.src = '';
		}
	}

	export function startPlayback() {
		audioElement?.play();
	}

	export function pausePlayback() {
		audioElement?.pause();
	}

	export function resetPlayback() {
		if (audioElement) {
			audioElement.currentTime = 0;
			audioElement.pause();
		}
	}

	export function isPlaying(): boolean {
		return !audioElement?.paused || false;
	}

	function handleCapture(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file && file.type.startsWith('audio/')) {
			audioElement.src = URL.createObjectURL(file);
			blob = file;
		}
	}
</script>

<div class="audio-recorder">
	<audio bind:this={audioElement} controls class={blob !== undefined ? '' : 'hidden'}></audio>
	{#if !mediaDeviveAvailable}
		<input
			bind:this={fileInput}
			type="file"
			accept="audio/*"
			capture="environment"
			onchange={(e) => handleCapture(e)}
			style="display: none;"
		/>
	{/if}
</div>

<style>
	.audio-recorder {
		text-align: center;
	}
	audio {
		display: block;
		padding-bottom: 10px;
	}

	.hidden {
		display: none;
	}
</style>
