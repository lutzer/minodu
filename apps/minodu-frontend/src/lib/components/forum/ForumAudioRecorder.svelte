<script lang="ts">
	import type { Optional } from '$lib/types';
	import AudioPlayer from '../common/AudioPlayer.svelte';

	import micIcon from '$lib/assets/microphone-icon-dark.png';
	import { language } from '$lib/stores';
	import { t } from '$lib/translations';

	export let blob: Optional<Blob>;

	let fileInput: HTMLInputElement;
	let audioPlayer: AudioPlayer;
	let audioUrl: Optional<string>;

	$: if (!blob) {
		reset();
	}

	export async function startRecording() {
		fileInput.click();
	}

	export function reset() {
		blob = undefined;
		audioUrl = undefined;
	}

	function handleCapture(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file && file.type.startsWith('audio/')) {
			audioUrl = URL.createObjectURL(file);
			blob = file;
		}
	}
</script>

<div class="audio-recorder-container">
	{#if audioUrl}
		<div class="audio-preview">
			<div class="audio-player">
				<AudioPlayer audioSource={audioUrl} bind:this={audioPlayer} />
			</div>
		</div>
	{:else}
		<input
			bind:this={fileInput}
			type="file"
			accept="audio/*"
			capture="environment"
			onchange={(e) => handleCapture(e)}
			style="display: none;"
		/>
		<div class="select-button">
			<button onclick={() => fileInput.click()}>
				<img src={micIcon} alt={t('forum.recordAudio', $language)}/>
				<span>{t('forum.recordAudio', $language)}</span>
			</button>
		</div>
	{/if}
</div>

<style>
	.audio-recorder-container {
		height: 120px;
		display: flex;
		gap: var(--small-padding);
		justify-content: center;
		align-items: center;
	}

	.select-button {
		width: 100%;
		height: 100%;
		flex-grow: 1;
	}

	.select-button button {
		width: 100%;
		height: 100%;
		background-color: #eeeeee;
		text-align: center;
		--box-shadow-color: #cccccc;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: var(--small-padding);
	}

	.select-button img {
		width:40px;
		height: 40px;
		object-fit: contain;
	}

	.audio-preview {
		width: 100%;
		background-color: #ffffff88;
		height: 100%;
		border-radius: var(--small-padding);
		padding: var(--small-padding);
		box-sizing: border-box;
		display: flex;
		align-items: center;
	}

	.audio-player {
		width: 100%;
	}
</style>
