<script lang="ts">
	import { onMount } from 'svelte';
	import TextToSpeechPlayer from './TextToSpeechPlayer.svelte';
	import ttsButton from '$lib/assets/forum-tts-button.png';

	export let ttsPlayer: TextToSpeechPlayer;
	export let text: string;

	let playing = false;

	onMount(() => {
		ttsPlayer.playbackReset.subscribe(() => {
			playing = false;
		});
	});

	async function handleClick() {
		if (!playing) {
			ttsPlayer.speak(text);
			playing = true;
		} else {
			ttsPlayer.stop();
		}
	}
</script>

<div>
	<button class="small" onclick={handleClick}>
		<img src={ttsButton} alt="transcribe selected text" />
	</button>
</div>
