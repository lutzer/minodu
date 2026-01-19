<script lang="ts">
	import playButtonImage from '$lib/assets/audioplayer-play.png';
	import pauseButtonImage from '$lib/assets/audioplayer-pause.png';

	export let audioSource: string;

	let audioElement: HTMLAudioElement;
	let isPlaying: boolean = false;

	export function startPlayback() {
		audioElement?.play();
		isPlaying = true
	}

	export function pausePlayback() {
		audioElement?.pause();
		isPlaying = false
	}
</script>

<style>
	.audio-player {
		border-radius: var(--border-radius);
		background-color: #FFF8E5;
		display: flex;
		align-items: center;
	}

	.play-button {
		width: 40px;
		height: 40px;
		padding: var(--small-padding);
	}

	.button {
		width:40px;
		flex-shrink: 0;
	}

	.slider {
		flex-grow: 1;
	}

	.time {
		width:40px;
		flex-shrink: 0;
		padding-left: var(--small-padding);
	}

	.progress-background {
		background-color: #c8c8c8;
		width: 100%;
		height: 4px;
		border-radius: 2px;
	}

	.progress {
		width:30%;
		height: 100%;
		background-color: black;
		border-radius: 2px;
	}
</style>

<div class="audio-player">
	<audio bind:this={audioElement} src={audioSource}></audio>
	<div class="button">
		<button class="play-button" onclick={() => isPlaying ? pausePlayback() : startPlayback()}><img src={isPlaying ? pauseButtonImage : playButtonImage} alt="button to start/pause audio"/></button>
	</div>
	<div class="slider">
		<div class="progress-background">
			<div class="progress">

			</div>
		</div>
	</div>
	<div class="time">
		0:00
	</div>
</div>
