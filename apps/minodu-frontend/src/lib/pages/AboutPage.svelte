<script lang="ts">
	import { goto } from '$app/navigation';
	import TextToSpeechPlayer from '$lib/components/common/TextToSpeechPlayer.svelte';
	import { delay } from '$lib/utils';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
    
	import { language } from '$lib/stores';
	import { t } from '$lib/translations';

    import minoduLogo from '$lib/assets/minodu-logo.png';
    import crossIcon from '$lib/assets/cross_icon_white.png';
    
    import dfkiLogo from '$lib/assets/dfki-logo.png';
    import uniKaraLogo from '$lib/assets/uni-kara-logo.png';
    import bmbfLogo from '$lib/assets/bmbf-logo.png';

	let scrollContainer: HTMLDivElement;

	let showPanel: boolean = false;
    let ttsPlayer: TextToSpeechPlayer;

	const TRANSITION_TIME = 300;

	onMount(async () => {
		showPanel = true;
	});


	async function close() {
		showPanel = false;
		await delay(TRANSITION_TIME);
		goto('/');
	}
</script>

<div class="about-page">
	{#if showPanel}
		<div
			class="scroll-container"
			bind:this={scrollContainer}
			transition:fly={{ y: '100%', duration: TRANSITION_TIME }}
		>
            <button class="close-button" onclick={() => close()}>
				<img src={crossIcon} alt={t('alt.closeDialog', $language)} />
			</button>
			<div class="about-container content-width">
                <div class="logo">
                    <img src={minoduLogo}/>
                </div>
                <div class="text">
                     <p>
                        Cette application a été développée dans le cadre du projet Minodu.
                        Le code source complet est disponible en open source.
                    </p>
                    <p>
                        Le projet Minodu est financé par le ministère fédéral allemand de la Recherche, 
                        de la Technologie et de l'Espace (BMFTR) dans le cadre de la ligne de financement 
                        « Gestion durable des terres en Afrique subsaharienne : améliorer les moyens de 
                        subsistance grâce à la recherche locale » (FKZ 01LL2202A)
                    </p>
                </div>
                <div class="partners">
                    <img src={dfkiLogo}/>
                    <img src={uniKaraLogo}/>
                    <img src={bmbfLogo}/>
                </div>
            </div>
		</div>
	{/if}
	<TextToSpeechPlayer bind:this={ttsPlayer} />
</div>

<style>
	.about-page {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 10;
		backdrop-filter: blur(2px);
	}

	.scroll-container {
		bottom: 0;
		left: 0;
		right: 0;
		top: auto;
		height: 100%;
		background-color: #FFFFFF;
		border-radius: var(--border-radius);
        padding-bottom: 0;
	}

    .about-container {
		padding: 0 var(--page-padding) var(--page-padding) var(--page-padding);
		box-sizing: border-box;
		margin-top: var(--header-height);
	}

	.close-button {
		position: fixed;
		top: 0;
		display: flex;
		justify-content: center;
		padding: var(--small-padding);
		height: var(--button-size);
		width: 100%;
		background: #006A4E;
		border-radius: var(--border-radius) var(--border-radius) 0 0;
	}

    .logo {
        width:100%;
        height: 60px;
        margin: var(--medium-padding) 0;
    }

    .logo img {
        width: auto;
        height: 100%;
        object-fit: contain;
    }

    .text {
        margin: var(--medium-padding) 0;
    }

    .text p {
        padding: var(--small-padding) 0;
    }

	.close-button img {
		width: 100%;
        height: 100%;
	}


    .partners {
        display: flex;
        gap: var(--small-padding);
        flex-wrap: wrap;
        justify-content: center;
    }
    .partners img {
        width: 45%;
        min-width: 300px;
        height: auto;
        object-fit: contain;
    }
</style>
