<script lang="ts">
	import { BackendApi } from '$lib/apis/backend/api';
	import { onMount } from 'svelte';
	import FloatingButton from '$lib/components/common/FloatingButton.svelte';
	import { language } from '$lib/stores';
	import { t } from '$lib/translations';

	import callButton from '$lib/assets/call_button.png';
	import phoneIcon from '$lib/assets/phone_icon.png';
	import contactBackground from '$lib/assets/market_contact_backgroud.png'

	let demands: BackendProductDemand[] = [];
	let contact: BackendContact;

	let scrollContainer: HTMLDivElement;
	let ttsPlayer: TextToSpeechPlayer;

	let loading : boolean = true;

	import type { BackendProductDemand } from '$lib/apis/backend/models/backendProductDemand';
	import type { BackendContact } from '$lib/apis/backend/models/backendContact';
	import { mockProductDemands } from '$lib/mocks';
	import MarketDemandElement from '$lib/components/market/MarketDemandElement.svelte';
	import TextToSpeechPlayer from '$lib/components/common/TextToSpeechPlayer.svelte';
	import { goto } from '$app/navigation';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';


	onMount(async () => {
		contact = await BackendApi.getContactPerson();
		demands = await BackendApi.getProductDemands();
		loading = false;
	});

	function onPhoneButtonClicked() {
		window.location.href = `tel:${contact?.phone}`;
	}
</script>

<div>
	<div class="scroll-container" bind:this={scrollContainer}>
	{#if loading}
		<LoadingSpinner text={t('market.loadingText',$language)}/>
	{:else}
		<div class="contact-container content-width" style="background-image: url({contactBackground}">
			<h1>Contact</h1>
			<h2>{contact?.fullname}</h2>
			<button onclick={onPhoneButtonClicked} class="button call-button shadow">
				<img src={phoneIcon} alt={t('market.phone-icon',$language)}/>
				<span>{contact?.phone}</span>
			</button>
		</div>
		<div class="post-container content-width">
			{#if demands.length > 0}
				<ul>
					{#each demands as demand}
						<li>
							<MarketDemandElement demand={demand} ttsPlayer={ttsPlayer}/>
						</li>
					{/each}
				</ul>
			{:else}
			<div class="no-data">
				<p>{t('market.noDemands', $language)}</p>
			</div>
			{/if}
		</div>
	{/if}
	</div>
	
	<TextToSpeechPlayer bind:this={ttsPlayer} />
	<FloatingButton icon={callButton} onclick={onPhoneButtonClicked} />
</div>

<style>

	.post-container {
		margin-top: var(--medium-padding);
		padding: 0 var(--page-padding);
		margin-bottom: calc(var(--page-padding) + var(--button-size) + var(--medium-padding) * 2);
		box-sizing: border-box;
	}

	.scroll-container {
		background-color: #FDF2E7;
	}

	.contact-container {
		height:200px;
		width: 100%;
		background-color: #F1B78D;
		border-radius: 0 0 var(--border-radius) var(--border-radius);
		background-size: auto 100%;
		background-repeat: no-repeat;
		background-position: 100%;
		padding: var(--page-padding);
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.contact-container h1, h2 {
		color: #ffffff;
		text-align: left;
		margin: 0;
	}

	.call-button {
		background-color: #F2A65A;
		width: fit-content;
		flex-grow: 0;
		padding: 0 var(--small-padding);
		--box-shadow-color: #E5792C;
		color: #ffffff;
		margin: var(--small-padding) 0;
		display: flex;
		align-items: center;
		gap: 3px;
	}

	.call-button img {
		margin-left: -3px;
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
</style>
