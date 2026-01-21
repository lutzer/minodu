<script lang="ts">
	import tileImageMobile from '$lib/assets/startscreen_background_mobile.png';
	import tileImageTablet from '$lib/assets/startscreen_background_tablet.png';
	import chatImage from '$lib/assets/startscreen_chat.png';
	import cloudImage from '$lib/assets/startscreen_cloud.png';
	import ExplainPageButton from '$lib/components/common/ExplainPageButton.svelte';
	import { Store } from '$lib/store';
	import { t, language } from '$lib/translations';
	import { onMount } from 'svelte';

	let { children } = $props();
</script>

<div class="content-width">
	<div id="tile-image-container" class="content-width">
		<img
			src={tileImageMobile}
			alt={t('alt.tilesShowingApps', $language)}
			class="responsive-image mobile"
		/>
		<img
			src={tileImageTablet}
			alt={t('alt.tilesShowingApps', $language)}
			class="responsive-image tablet"
		/>
	</div>
	<div id="object-overlay-container" class="content-width">
		<div id="cloud">
			<img src={cloudImage} alt={t('alt.rainyCloud', $language)} />
		</div>
		<div id="chat">
			<img src={chatImage} alt={t('alt.speechBubble', $language)} />
		</div>
	</div>
	<div class="grid-link-container">
		<a href="/forum" class="grid-link">{t('nav.forum', $language)}</a>
		<a href="/weather" class="grid-link">{t('nav.weather', $language)}</a>
		<a href="/agriculture" class="grid-link">{t('nav.agriculture', $language)}</a>
		<a href="/market" class="grid-link">{t('nav.market', $language)}</a>
	</div>
	<ExplainPageButton
		audioFr={'https://audio-samples.github.io/samples/mp3/blizzard_unconditional/sample-0.mp3'}
		audioKb={'https://audio-samples.github.io/samples/mp3/blizzard_unconditional/sample-1.mp3'}
	/>
</div>

<style>
	#tile-image-container {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	}

	#tile-image-container img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: none;
		margin: 0 auto;
	}

	@media (max-aspect-ratio: 0.6) {
		#tile-image-container .responsive-image.mobile {
			display: block;
		}
	}

	@media (min-aspect-ratio: 0.6) {
		#tile-image-container .responsive-image.tablet {
			display: block;
		}
	}

	.grid-link-container {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		display: grid;
		width: 100%;
		height: 100%;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr;
	}

	.grid-link {
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
	}

	#object-overlay-container {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		overflow: hidden;
	}

	#object-overlay-container img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	#cloud {
		position: absolute;
		top: 5%;
		right: 7%;
		width: 25%;
		height: 20%;
		min-width: 130px;
	}

	#chat {
		position: absolute;
		top: 5%;
		left: 10%;
		width: 25%;
		height: 15%;
		min-width: 130px;
	}
</style>
