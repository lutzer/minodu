<script lang="ts">
	import explainPageButton from '$lib/assets/explain-page-button.png';
	import explainPageButtonActive from '$lib/assets/explain-page-button-active.png';
	import languageKbButton from '$lib/assets/language-kb-button.png';
	import languageFrButton from '$lib/assets/language-fr-button.png';
	import type { Language } from '$lib/types';
	import { onMount } from 'svelte';
	import { Store } from '$lib/store';

	export let audioKb: string;
	export let audioFr: string;

	let language: Language;

	let audio: HTMLAudioElement;
	let isPlaying: boolean = false;

	onMount(() => {
		language = Store.language;
	});

	function languageButtonClicked() {
		language = language == 'kb' ? 'fr' : 'kb';
		Store.language = language;
		audio?.pause();
		isPlaying = false;
	}

	function explainPageButtonClicked() {
		if (!isPlaying) {
			audio.currentTime = 0;
			audio.play();
			isPlaying = true;
		} else {
			audio.pause();
			isPlaying = false;
		}
	}

	function handleAudioEnded() {
		isPlaying = false;
	}
</script>

<div class="explain-page-button-group">
	<div class="content-width">
		<button class="button" onclick={explainPageButtonClicked}>
			<img
				src={isPlaying ? explainPageButtonActive : explainPageButton}
				alt="Button to speak out page info"
			/>
		</button>
		<button class="button" onclick={languageButtonClicked}>
			<img
				src={language == 'kb' ? languageKbButton : languageFrButton}
				alt="Button to switch language"
			/>
		</button>
		<audio bind:this={audio} src={language == 'kb' ? audioKb : audioFr} onended={handleAudioEnded}>
		</audio>
	</div>
</div>

<style>
	.explain-page-button-group {
		position: fixed;
		bottom: var(--footer-height);
        left:0;
        right:0;
		pointer-events: none;

	}

	.explain-page-button-group .content-width {
		padding: var(--page-padding);
		box-sizing: border-box;
	}

	@media screen and (min-width: 550px) {
		.explain-page-button-group {
			bottom: calc(var(--footer-height) + var(--medium-padding));
		}
	}

	.explain-page-button-group button {
		pointer-events: auto;
	}

	audio {
		display: none;
	}
</style>
