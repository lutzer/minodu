<script lang="ts">
	export let audioSource: string;
	let audioElement: HTMLAudioElement;

	export function startPlayback() {
		audioElement?.play();
	}

	export function pausePlayback() {
		audioElement?.pause();
	}
</script>

<div class="audio-player">
	<audio bind:this={audioElement} src={audioSource} controls></audio>
</div>
