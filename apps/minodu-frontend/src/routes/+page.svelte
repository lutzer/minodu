<script lang="ts">
	import tileImageMobile from '$lib/assets/startscreen_background_mobile.png';
	import tileImageTablet from '$lib/assets/startscreen_background_tablet.png';

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
		max-width: 1000px;
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

</style>

<div>
	<div id="tile-image-container">
		<img 
			src={tileImageMobile} 
			alt="4 minodu tiles showing different apps"
			class="responsive-image mobile"/>
		<img 
			src={tileImageTablet} 
			alt="4 minodu tiles showing different apps"
			class="responsive-image tablet"/>
	</div>
	<div class="grid-link-container">
		<a href="/forum" class="grid-link">Forum</a>
		<a href="/weather" class="grid-link">Weather</a>
		<a href="/agriculture" class="grid-link">Agriculture</a>
		<a href="/market" class="grid-link">Market</a>
	</div>
</div>
