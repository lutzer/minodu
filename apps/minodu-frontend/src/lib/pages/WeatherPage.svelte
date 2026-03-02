<script lang="ts">
	import { language } from '$lib/stores';
	import { t } from '$lib/translations';

	import compassBackground from '$lib/assets/wind_compass.png';
	import compassNeedle from '$lib/assets/compass_needle.png';
</script>

<div>
	<div class="scroll-container">
		<div class="weather-container content-width">
			<div class="compass" style="background-image: url({compassBackground}">
				<img class="needle" src={compassNeedle} alt={t('weather.compass_needle', $language)} />
			</div>
		</div>
	</div>
</div>

<style>
	.scroll-container {
		background-color: #e9f6fb;
	}

	.compass {
		width: 200px;
		height: 200px;
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.compass .needle {
		width: 18%;
		height: 18%;
		object-fit: contain;
		rotate: 60deg;
	}
</style>
