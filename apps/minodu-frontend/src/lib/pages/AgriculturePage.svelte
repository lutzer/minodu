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
	let selectedCategoryId: number | null = null;

	let scrollContainer: HTMLDivElement;

	onMount(async () => {
		posts = await BackendApi.getPosts();
		categories = await BackendApi.getCategories();
	});

	function selectCategory(id: number) {
		selectedCategoryId = selectedCategoryId === id ? null : id;
	}

	$: filteredPosts = selectedCategoryId
		? posts.filter((post) => post.category.id === selectedCategoryId)
		: posts;
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
						class:selected={selectedCategoryId === category.id}
						onclick={() => selectCategory(category.id)}>{category.name}</button
					>
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
		gap: var(--small-padding);
		padding: var(--small-padding);
		flex-wrap: wrap;
		justify-content: space-between;
	}

	#categories li {
		width: 22%;
		flex-grow: 0;
		flex-shrink: 0;
	}

	#categories button {
		width: 100%;
		border-radius: var(--border-radius);
		overflow: hidden;
		text-overflow: ellipsis;
		padding: var(--small-padding);
		white-space: nowrap;
		height: 48px;
	}

	#categories button.selected {
		outline: 3px solid white;
		/* outline-offset: -3px; */
		box-shadow: none;
	}

	.post-container {
		margin-top: var(--header-height);
		padding: var(--page-padding);
		margin-bottom: calc(var(--page-padding) + var(--button-size));
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
