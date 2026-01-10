<script lang="ts">
	import tileImageMobile from '$lib/assets/startscreen_background_mobile.png';
	import tileImageTablet from '$lib/assets/startscreen_background_tablet.png';
	import baobapImage from '$lib/assets/baobap.png';
	import chatImage from '$lib/assets/startscreen_chat.png';
	import cloudImage from '$lib/assets/startscreen_cloud.png';
	import ExplainPageButton from '$lib/components/common/ExplainPageButton.svelte';

	let { children } = $props();
</script>

<style>
	#tile-image-container {
		position: absolute;
		top:0;
		bottom:0;
		left:0;
		right:0;
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
		top:0;
		bottom:0;
		left:0;
		right:0;
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
		top:0;
		bottom:0;
		left:0;
		right:0;
	}

	#tree {
		position: absolute;
		top: 44%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	#tree img {
		width: 50vw;
		height: 30vh;
		min-width: 300px;
		object-fit: contain;
	}

	#cloud {
		position: absolute;
		top: 0%;
    	left: 50%;
		bottom:50%;
		right: 0%;
	}

	#cloud img {
		position: absolute;
		top: 15%;
		right:20%;
		width: 50%;
		height: 40%;
		min-width: 130px;
		object-fit: contain;
	}

	#chat {
		position: absolute;
		top: 0%;
    	left: 0%;
		bottom:50%;
		right: 50%;
	}

	#chat img {
		position: absolute;
		top: 15%;
		left:20%;
		width: 50%;
		height: 40%;
		min-width: 130px;
		object-fit: contain;
	}

</style>

<div>
	<div id="tile-image-container" class="content-width">
		<img 
			src={tileImageMobile} 
			alt="4 minodu tiles showing different apps"
			class="responsive-image mobile"/>
		<img 
			src={tileImageTablet} 
			alt="4 minodu tiles showing different apps"
			class="responsive-image tablet"/>
	</div>
	<div id="object-overlay-container" class="content-width">
		<div id="cloud">
			<img
				src={cloudImage}
				alt="a rainy cloud in the sky"/>
		</div>
		<div id="chat">
			<img
				src={chatImage}
				alt="two people and a speech bubble in the sky"/>
		</div>
		<div id="tree">
			<img
				src={baobapImage}
				alt="a baobap tree"/>
		</div>
	</div>
	<div class="grid-link-container">
		<a href="/forum" class="grid-link">Forum</a>
		<a href="/weather" class="grid-link">Weather</a>
		<a href="/agriculture" class="grid-link">Agriculture</a>
		<a href="/market" class="grid-link">Market</a>
	</div>
	<ExplainPageButton 
		audioFr={"https://audio-samples.github.io/samples/mp3/blizzard_unconditional/sample-0.mp3"}
		audioKb={"https://audio-samples.github.io/samples/mp3/blizzard_unconditional/sample-1.mp3"}/>
</div>
