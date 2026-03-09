<script lang="ts">
	import type { BackendProductDemand } from '$lib/apis/backend/models/backendProductDemand';
	import { text } from '@sveltejs/kit';
	import TextToSpeechButton from '../common/TextToSpeechButton.svelte';
	import TextToSpeechPlayer from '../common/TextToSpeechPlayer.svelte';
	import { format } from 'timeago.js';
	import { t } from '$lib/translations';
	import { language } from '$lib/stores';

	import handProductIcon from '$lib/assets/market_hand_product.png';
	import handMoneyIcon from '$lib/assets/market_hand_money.png';

	export let demand: BackendProductDemand;
	export let ttsPlayer: TextToSpeechPlayer;

	let demandText : string = "";

	$ : demandText = demand ? `Nous avons ${demand.quantity} ${demand.product?.sales_unit || ''} 
		de ${demand.product?.name}, en provenance de ${demand.partner?.name || ''}, 
		disponible au prix de ${demand.product.price} CFA le ${demand.product?.sales_unit || 'unité'}.` : '';


</script>

<div class="product-demand shadow">
	<div class="header">
		<div class="title">
			<h2>{demand.product.name}</h2>
			{#if demand.partner}
				<h4>{demand.partner.name}</h4>
			{/if}
			<span class="date">{format(demand.updatedAt)}</span>
		</div>
		<div>
			<TextToSpeechButton {ttsPlayer} text={demandText} />
			<p>{demandText}</p>
		</div>
	</div>
	<div class="product">
		<div class="image">
			<img src={demand.product.image} alt={t('product.demand-image', $language)} />
		</div>
		<div class="offer">
			<div class="offer-product">
				<p>{demand.quantity} {demand.product.sales_unit}</p>
				<img src={handProductIcon} alt={t('product.demand-hand-product', $language)} />
			</div>
			<div class="offer-payment">
				<p>{demand.product.price} CFA / {demand.product.sales_unit}</p>
				<img src={handMoneyIcon} alt={t('product.demand-hand-money', $language)} />
			</div>
		</div>
	</div>
</div>

<style>
	.product-demand {
		padding: var(--medium-padding);
		border-radius: var(--border-radius);
		margin-bottom: var(--medium-padding);
		--box-shadow-color: #cccccc;
		background-color: #fffbf8;
	}

	.header {
		display: flex;
		width: 100%;
		justify-content: space-between;
		align-content: start;
		gap: var(--small-padding);
		margin-bottom: var(--small-padding);
	}

	.title h2 {
		text-align: left;
		margin-bottom: calc(var(--small-padding) / 2);
	}

	.title h4 {
		display: inline;
		color: #f2a65a;
		font-weight: bold;
		margin-right: var(--small-padding);
	}

	.date {
		color: #ccc9cf;
		font-size: 14px;
	}

	.product {
		width: 100%;
		display: flex;
		flex-direction: row;
		gap: var(--small-padding);
	}

	.product .image {
		width: 100px;
		height: 100px;
		border-radius: var(--border-radius);
		overflow: hidden;
		flex-shrink: 0;
		background-color: grey;
	}

	.product .image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.offer {
		display: flex;
		justify-content: space-evenly;
		flex-grow: 1;
		gap: var(--small-padding);
	}

	.offer div {
		text-align: center;
	}

	.offer img {
		width: 80px;
	}

	.offer p {
		background-color: #404040;
		border-radius: var(--border-radius);
		padding: var(--small-padding);
		color: #ffffff;
		text-align: center;
	}
</style>
