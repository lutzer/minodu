<script lang="ts">
	import { BackendApi } from '$lib/apis/backend/api';
	import { onMount } from 'svelte';
	import FloatingButton from '$lib/components/common/FloatingButton.svelte';
	import { language } from '$lib/stores';
	import { t } from '$lib/translations';
	import callButton from '$lib/assets/call_button.png';

	let demands: BackendProductDemand[] = [];
	let contact: BackendContact;

	let scrollContainer: HTMLDivElement;

	import type { BackendProductDemand } from '$lib/apis/backend/models/backendProductDemand';
	import type { BackendContact } from '$lib/apis/backend/models/backendContact';


	onMount(async () => {
		contact = await BackendApi.getContactPerson();
		demands = await BackendApi.getProductDemands();

		console.log(contact)
	});
</script>

<div>
	<div class="scroll-container" bind:this={scrollContainer}>
		<div class="contact-container">
			<h2>{contact?.fullname}</h2>
			<p>{contact?.phone}</p>
		</div>
		<div class="post-container content-width">
			{#if demands.length > 0}
				<ul>
					{#each demands as demand}
						<li>
							<p>{JSON.stringify(demand)}
						</li>
					{/each}
				</ul>
			{:else}
			<div class="no-data">
				<p>{t('market.noDemands', $language)}</p>
			</div>
			{/if}
		</div>
	</div>
	
	<FloatingButton icon={callButton} onclick={() => {}} />
</div>

<style>

	.post-container {
		margin-top: var(--header-height);
		padding: 0 var(--page-padding);
		margin-bottom: calc(var(--page-padding) + var(--button-size) + var(--medium-padding) * 2);
		box-sizing: border-box;
	}

	.scroll-container {
		background-color: #FDF2E7;
	}
</style>
