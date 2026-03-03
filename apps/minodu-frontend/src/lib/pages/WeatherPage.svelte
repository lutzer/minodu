<script lang="ts">
	import { language } from '$lib/stores';
	import { t } from '$lib/translations';

	import type { BackendWeather } from '$lib/apis/backend/models/backendWeather';
	import { onMount } from 'svelte';
	import { BackendApi } from '$lib/apis/backend/api';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';


	import compassBackground from '$lib/assets/wind_compass.png';
	import compassNeedle from '$lib/assets/compass_needle.png';

	import cloudRain from '$lib/assets/cloud_rain.webp';
	import cloudSun from '$lib/assets/cloud_sun.webp';
	import cloudCovered from '$lib/assets/cloud_covered.webp';
	import cloudSunny from '$lib/assets/cloud_sunny.webp';

	import treeWind0 from '$lib/assets/tree_wind0.webp';
	import treeWind1 from '$lib/assets/tree_wind1.webp';
	import treeWind2 from '$lib/assets/tree_wind2.webp';
	import treeWind3 from '$lib/assets/tree_wind3.webp';

	import weatherBird from '$lib/assets/weather_bird.webp';

    let weather : BackendWeather;

    onMount(async () => {
		const data = await BackendApi.getWeatherCurrent()
		if (data.length > 0) weather = data[0]
    })

	$: loading = weather === undefined
	$: cloud = cloudSunny;
	$: wind = treeWind3;

</script>

<div>
	<div class="scroll-container">
	{#if loading}
		<LoadingSpinner text={t('weather.loadingText', $language)} />
	{:else}
        {#if !weather}
            <LoadingSpinner text={t("weather.loadingText", $language)}/>
        {:else}
		<div class="weather-container content-width">
			{#if cloud}
			<div class="cloud">
				<img src={cloud} alt={t('weather.cloud', $language)}/>
			</div>
			{/if}
			{#if weather.wind_direction}
			<div class="compass" style="background-image: url({compassBackground}">
				<img class="needle" src={compassNeedle} alt={t('weather.compassNeedle', $language)} 
                    style="--wind-angle: {weather.wind_direction}deg"/>
			</div>
			{/if}
			
			{#if wind}
			<div class="wind">
				<img src={wind} alt={t('weather.windTree', $language)}/>
			</div>
			{/if}
			<div class="bird">
				<img src={weatherBird} alt={t('weather.bird', $language)}/>
			</div>
		</div>
        {/if}
	{/if}
	</div>
</div>

<style>
	.scroll-container {
		background-color: #e9f6fb;
	}

    .weather-container {
		position: absolute;
		top:0;
		left:0;
		right:0;
		bottom:0;
    }

	.compass {
        position: absolute;
        top:10%;
        left:10%;
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
        animation: jitter 1s infinite alternate;
	}

    @keyframes jitter {
        0%, 100% { transform: rotate(var(--wind-angle)); }
        20%       { transform: rotate(calc(var(--wind-angle) - 4deg)); }
        40%       { transform: rotate(calc(var(--wind-angle) + 2deg)); }
        60%       { transform: rotate(calc(var(--wind-angle) - 3deg)); }
        80%       { transform: rotate(calc(var(--wind-angle) + 5deg)); }
    }

	img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.cloud {
		position: absolute;
		width: 250px;
		height: 250px;
		right:5%;
		top:18%
	}

	.wind {
		position: absolute;
		bottom: 15%;
		left:5%;
		height: 40%;
		width: 90%;
	}

	.bird {
		position: absolute;
		width: 50px;
		height: 50px;
		right: 20%;
		bottom: 40%;
	}
</style>
