<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import TextToSpeechPlayer from './TextToSpeechPlayer.svelte';
	import ttsButton from '$lib/assets/forum-tts-button.png';
	import ttsButtonActive from '$lib/assets/forum-tts-button-active.png';

	export let ttsPlayer: TextToSpeechPlayer;
	export let text: string;

	let playing = false;

	onMount(() => {
		ttsPlayer.playbackReset.subscribe(onMediaEnded);
	});

	async function handleClick() {
		if (!playing) {
			ttsPlayer.speak(text);
			playing = true;
		} else {
			ttsPlayer.stop();
		}
	}

	function onMediaEnded() {
		playing = false;
	}
</script>

<div>
	<button class="tts-button small {playing ? 'shadow-active' : 'shadow'}" onclick={handleClick}>
		<img src={playing ? ttsButtonActive : ttsButton} alt="transcribe selected text" />
	</button>
</div>

<style>
	.tts-button {
		background-color: #edca82;
		--box-shadow-color: #b8995c;
	}
</style>
