<script lang="ts">
	import playButtonImage from '$lib/assets/audioplayer-play.png';
	import pauseButtonImage from '$lib/assets/audioplayer-pause.png';
	import { onMount, onDestroy } from 'svelte';

	export let audioSource: string;

	let audioElement: HTMLAudioElement;
	let isPlaying: boolean = false;
	let currentTime: number = 0;
	let duration: number = 0;
	let progressBar: HTMLDivElement;

	const playerId = Math.random().toString(36).substring(2);

	$: progress = duration > 0 ? (currentTime / duration) * 100 : 0;
	$: remainingTime = duration > 0 ? duration - currentTime : 0;

	function formatTime(seconds: number): string {
		if (isNaN(seconds) || seconds === 0) return '0:00';
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	function handleOtherPlayerStarted(event: CustomEvent<string>) {
		if (event.detail !== playerId && isPlaying) {
			pausePlayback();
		}
	}

	onMount(() => {
		window.addEventListener('audioplayer:started', handleOtherPlayerStarted as EventListener);
	});

	onDestroy(() => {
		window.removeEventListener('audioplayer:started', handleOtherPlayerStarted as EventListener);
	});

	export function startPlayback() {
		window.dispatchEvent(new CustomEvent('audioplayer:started', { detail: playerId }));
		audioElement?.play();
		isPlaying = true;
	}

	export function pausePlayback() {
		audioElement?.pause();
		isPlaying = false;
	}

	function onTimeUpdate() {
		currentTime = audioElement.currentTime;
	}

	function onLoadedMetadata() {
		duration = audioElement.duration;
	}

	function onEnded() {
		isPlaying = false;
		currentTime = 0;
	}

	function seek(event: MouseEvent) {
		if (!progressBar || duration === 0) return;
		const rect = progressBar.getBoundingClientRect();
		const clickX = event.clientX - rect.left;
		const percentage = clickX / rect.width;
		audioElement.currentTime = percentage * duration;
	}
</script>

<div class="audio-player">
	<audio
		bind:this={audioElement}
		src={audioSource}
		ontimeupdate={onTimeUpdate}
		onloadedmetadata={onLoadedMetadata}
		onended={onEnded}
	></audio>
	<div class="button">
		<button class="play-button" onclick={() => (isPlaying ? pausePlayback() : startPlayback())}>
			<img src={isPlaying ? pauseButtonImage : playButtonImage} alt="button to start/pause audio" />
		</button>
	</div>
	<div class="slider">
		<div class="progress-background" bind:this={progressBar} onclick={seek}>
			<div class="progress" style="width: {progress}%"></div>
		</div>
	</div>
	<div class="time">
		{formatTime(remainingTime)}
	</div>
</div>

<style>
	.audio-player {
		height: 40px;
		border-radius: 30px;
		background-color: #fff8e5;
		display: flex;
		align-items: center;
		margin: var(--small-padding) 0;
	}

	.play-button {
		width: 40px;
		height: 40px;
		padding: var(--small-padding);
	}

	.play-button img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.button {
		flex-shrink: 0;
	}

	.slider {
		flex-grow: 1;
	}

	.time {
		flex-shrink: 0;
		padding: 0 var(--small-padding);
	}

	.progress-background {
		background-color: #c8c8c8;
		width: 100%;
		height: 4px;
		border-radius: 2px;
		cursor: pointer;
		position: relative;
	}

	.progress {
		height: 100%;
		background-color: black;
		border-radius: 2px;
		transition: width 0.1s linear;
		pointer-events: none;
	}
</style>
