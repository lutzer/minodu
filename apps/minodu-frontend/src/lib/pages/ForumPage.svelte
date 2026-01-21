<script lang="ts">
	import { onMount } from 'svelte';
	import { ForumApi } from '$lib/apis/forum/api';
	import type { ForumPost } from '$lib/apis/forum/models/forumPost';
	import AuthorCreateDialog from '$lib/components/forum/AuthorCreateDialog.svelte';
	import type { ForumAuthor } from '$lib/apis/forum/models/forumAuthor';
	import { ForumPostType, type Optional } from '$lib/types';
	import ForumPostElement from '$lib/components/forum/ForumPostElement.svelte';
	import ForumInputElement from '$lib/components/forum/ForumInputElement.svelte';
	import TextToSpeechPlayer from '$lib/components/common/TextToSpeechPlayer.svelte';
	import { Store } from '$lib/store';
	import { language } from '$lib/translations';
	import { Config } from '$lib';
	import { fly, fade } from 'svelte/transition';
	import { t } from '$lib/translations';

	import createPostButton from '$lib/assets/forum-new-post-button.png';
	import { waitForAnimationFrame } from '$lib/utils';
	import FloatingButton from '$lib/components/common/FloatingButton.svelte';

	// let createAuthorDialog: AuthorCreateDialog;
	let ttsPlayer: TextToSpeechPlayer;

	let scrollContainer: HTMLDivElement;

	let posts: ForumPost[] = [];
	let visiblePosts: ForumPost[] = [];

	let author: Optional<ForumAuthor> = undefined;

	let showCreatePostDialog: boolean = false;

	let showNumberOfPosts: number = 3;
	let loadingMorePosts: boolean = false;

	onMount(() => {
		update(false);

		let eventSource = ForumApi.getEventSource();
		eventSource.onmessage = (msg) => {
			try {
				let data = JSON.parse(msg.data);
				if (data['topic'] === 'update') update();
			} catch (e) {
				console.error('Could not parse event', e);
			}
		};
		return () => {
			eventSource.close();
		};
	});

	async function update(smoothScroll: boolean = true) {
		posts = await ForumApi.getPosts();
		author = await ForumApi.checkToken();

		await waitForAnimationFrame();

		scrollContainer.scrollTo({
			top: scrollContainer.scrollHeight,
			behavior: smoothScroll ? 'smooth' : undefined
		});
	}

	async function createPost() {
		showCreatePostDialog = true;
	}

	async function deletePost(id: number) {
		await ForumApi.deletePost(id);
	}

	async function logout() {
		Store.forumToken = undefined;
		author = undefined;
	}
</script>

<div class="forum-page">
	<div class="scroll-container" bind:this={scrollContainer}>
		<div class="post-container content-width">
			{#if posts.length > 0}
				<ul>
					{#each posts as post}
						<li>
							<ForumPostElement
								{post}
								isOwn={author?.id == post.author.id}
								onDeleteClicked={() => deletePost(post.id)}
								{ttsPlayer}
							/>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="no-posts">{t('forum.noPosts', $language)}</p>
			{/if}
		</div>
	</div>

	{#if showCreatePostDialog}
		<div class="create-post-container content-width" transition:fly={{ y: 200, duration: 300 }}>
			<ForumInputElement
				postType={ForumPostType.TEXT}
				onPostSubmitted={() => {
					showCreatePostDialog = false;
				}}
				onPostCancelled={() => {
					showCreatePostDialog = false;
				}}
			/>
		</div>
	{:else}
		<FloatingButton
			icon={createPostButton}
			onclick={() => createPost()}/>
	{/if}
	<TextToSpeechPlayer bind:this={ttsPlayer} />
</div>

<style>
	.create-post-container {
		position: fixed;
		background-color: #ffffff;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 1;
		padding: var(--small-padding);
		border-top: 1px solid #ccc;
		border-radius: var(--border-radius) var(--border-radius) 0 0;
		box-sizing: border-box;
	}

	.post-container {
		padding: var(--page-padding);
		margin-bottom: calc(var(--page-padding) + var(--button-size));
		box-sizing: border-box;
	}

	.no-posts {
		padding: var(--medium-padding);
		text-align: center;
	}

	.scroll-container {
		background-color: #edca82;
	}
</style>
