<script lang="ts">
	import { BackendApi } from '$lib/apis/backend/api';
	import type { BackendCategory } from '$lib/apis/backend/models/backendCategory';
	import type { BackendPost } from '$lib/apis/backend/models/backendPost';
	import AgriculturePostElement from '$lib/components/agriculture/AgriculturePostElement.svelte';
	import { onMount } from 'svelte';
	import chatbotButton from '$lib/assets/chatbot-button.png';
	import { goto } from '$app/navigation';
	import FloatingButton from '$lib/components/common/FloatingButton.svelte';
	import { language } from '$lib/stores';
	import { t } from '$lib/translations';

	let posts: BackendPost[] = [];
	let categories: BackendCategory[] = [];
	let selectedCategoryIds: Set<number> = new Set();

	let scrollContainer: HTMLDivElement;

	import solIcon from '$lib/assets/agriculture-cat-sol-icon.png';
	import autresIcon from '$lib/assets/agriculture-cat-autres-icon.png';
	import elevageIcon from '$lib/assets/agriculture-cat-elevage-icon.png';
	import plantesIcon from '$lib/assets/agriculture-cat-plantes-icon.png';

	const categoryIcons: Record<string, string> = {
		SOL: solIcon,
		AUTRES: autresIcon,
		ELEVAGE: elevageIcon,
		PLANTES: plantesIcon
	};

	onMount(async () => {
		posts = await BackendApi.getPosts();
		categories = await BackendApi.getCategories();
		selectedCategoryIds = new Set(categories.map((c) => c.id));
	});

	function toggleCategory(id: number) {
		if (selectedCategoryIds.has(id)) {
			selectedCategoryIds.delete(id);
		} else {
			selectedCategoryIds.add(id);
		}
		selectedCategoryIds = selectedCategoryIds;
	}

	$: filteredPosts = posts.filter((post) => selectedCategoryIds.has(post.category.id));
</script>

<div class="forum-page">
	<div class="scroll-container" bind:this={scrollContainer}>
		<div class="post-container content-width">
			{#if filteredPosts.length > 0}
				<ul>
					{#each filteredPosts as post}
						<li>
							<AgriculturePostElement {post} />
						</li>
					{/each}
				</ul>
			{:else}
				<p class="no-posts">{t('agriculture.noPosts', $language)}</p>
			{/if}
		</div>
	</div>
	<div id="categories" class="content-width">
		<ul>
			{#each categories as category}
				<li>
					<button
						class={`color ${category.name}`}
						class:selected={selectedCategoryIds.has(category.id)}
						onclick={() => toggleCategory(category.id)}
					>
						<img src={categoryIcons[category.name]} alt="category icon for {category.name}" />
						<span>{category.name}</span>
					</button>
				</li>
			{/each}
		</ul>
	</div>
	<FloatingButton icon={chatbotButton} onclick={() => goto('/agriculture/bot/')} />
</div>

<style>
	/* @media screen and (min-width: 550px) {
		.scroll-container {
			bottom: 0;
		}
	} */

	#categories {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: var(--header-height);
	}

	#categories ul {
		display: flex;
		padding: var(--small-padding);
		flex-wrap: wrap;
		justify-content: space-between;
	}

	#categories li {
		width: 23%;
	}

	#categories button {
		width: 100%;
		border-radius: var(--border-radius);
		overflow: hidden;
		text-overflow: ellipsis;
		padding: var(--small-padding);
		/* white-space: nowrap; */
		height: 48px;
		display: flex;
		align-items: center;
		gap: calc(var(--small-padding) * 0.5);
	}

	#categories button.selected {
		/* outline: 3px solid white; */
		/* outline-offset: -3px; */
		filter: none;
		opacity: 1;
	}

	#categories button {
		filter: grayscale(1);
		opacity: 0.6;
	}

	#categories button img {
		width: auto;
		height: 90%;
	}

	#categories button span {
		white-space: normal;
		word-wrap: break-word;
		overflow-wrap: break-word;
		min-width: 0;
		font-size: 90%;
		flex-grow: 1;
	}

	.post-container {
		margin-top: var(--header-height);
		padding: 0 var(--page-padding);
		margin-bottom: calc(var(--page-padding) + var(--button-size) + var(--medium-padding) * 2);
		box-sizing: border-box;
	}

	.no-posts {
		padding: var(--medium-padding);
		text-align: center;
	}

	.scroll-container {
		background-color: #ebf9f2;
	}
</style>
