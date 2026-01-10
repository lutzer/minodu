<script lang="ts">
    import explainPageButton from '$lib/assets/explain-page-button.png';
    import languageKbButton from '$lib/assets/language-kb-button.png';
    import languageFrButton from '$lib/assets/language-fr-button.png';
	import type { Language } from '$lib/types';
	import { onMount } from 'svelte';
	import { Store } from '$lib/store';

    export let audioKb : string;
    export let audioFr : string;

    let language : Language;

    let audio : HTMLAudioElement;

    onMount(() => {
        language = Store.language;
    });

	function languageButtonClicked() {
		language = language == 'kb' ? 'fr' : 'kb';
        Store.language = language;
        audio?.pause();
	}

    function explainPageButtonClicked() {
        if (audio && audio.paused) {
            audio.currentTime = 0;
            audio.play();
        } else {
            audio.pause()
        }
    }

</script>

<style>
    .explain-page-button-group {
        position: absolute;
        bottom: var(--footer-height);
        left:0;
        margin: var(--medium-padding);
    }

    button {
        background: none;
        border: none;
        width: var(--button-size);
        height: var(--button-size);
        padding: 0;
    }

    button img {
        position: relative;
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    .shadow {
        position: absolute;
        border-radius: 10px;
        background-color: #cccccc;
        top:0;
        left:0;
        bottom:-1px;
        right:-4px;
        opacity: 0.8;
    }

    audio {
        display: none;
    }
</style>

<div class="explain-page-button-group">
    <div class="shadow">
    </div>
    <button class="button" onclick={explainPageButtonClicked}>
        <img src={explainPageButton} alt="Button to speak out page info"/>
    </button>
    <button class="button" onclick={languageButtonClicked}>
        <img src={language == 'kb' ? languageKbButton : languageFrButton} alt="Button to switch language"/>
    </button>
    <audio bind:this={audio} src={language == 'kb' ? audioKb : audioFr}>
    </audio>
</div>