<script lang="ts">
	import tileImageMobile from '$lib/assets/startscreen_background_mobile.png';
	import tileImageTablet from '$lib/assets/startscreen_background_tablet.png';
	import baobapImage from '$lib/assets/baobap-animation.webp';
	import chatImage from '$lib/assets/startscreen_chat.png';
	import cloudImage from '$lib/assets/cloud-animation.webp';
	import chickenImage from '$lib/assets/chicken-animation.webp';
	import vendorImage from '$lib/assets/vendor-animation.webp';
	import vendorHutImage from '$lib/assets/vendor-hut.png';
	import grass1Image from '$lib/assets/gras1-animation.webp';
	import grass2Image from '$lib/assets/gras2-animation.webp';
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
		overflow: hidden;
	}

	#object-overlay-container img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	#tree {
		position: absolute;
		top: 44%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 50%;
		height: 50%;
		min-width: 300px;
	}

	#cloud {
		position: absolute;
		top: 5%;
    	right: 10%;
		width: 30%;
		height: 30%;
		min-width: 130px;
	}


	#chat {
		position: absolute;
		top: 5%;
    	left: 10%;
		width: 25%;
		height: 20%;
		min-width: 130px;
	}

	#gras1 {
		position: absolute;
		bottom:38%;
		left:40%;
		width: 7%;
		height: 7%;
	}

	#gras2 {
		position: absolute;
		bottom:25%;
		left:35%;
		width: 7%;
		height: 7%;
	}

	#chicken {
		position: absolute;
		bottom: 18%;
    	left: 21%;
		width: 10%;
		height: 9%;
		min-width: 130px;
	}

	#vendor {
		position: absolute;
		bottom:15%;
		right:8%;
		width: 40%;
		height: 30%;
	}

	#vendor-hut {
		position: absolute;
		bottom:20%;
		right:-10%;
		width: 40%;
		height: 40%;
	}

	


</style>

<div class="content-width">
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
		<div id="gras1">
			<img
				src={grass1Image}
				alt="some grass"/>
		</div>
		<div id="gras2">
			<img
				src={grass2Image}
				alt="some grass"/>
		</div>
		<div id="chicken">
			<img
				src={chickenImage}
				alt="a non-white chicken"/>
		</div>
		<div id="vendor-hut">
			<img
				src={vendorHutImage}
				alt="a market stall"/>
		</div>
		<div id="vendor">
			<img
				src={vendorImage}
				alt="a woman selling vegetables"/>
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
