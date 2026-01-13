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
	import { Config } from '$lib';
	import { fly, fade } from 'svelte/transition';

	import createPostButton from '$lib/assets/forum-new-post-button.png';
	import type { HtmlTagDescriptor } from 'vite';

	let createAuthorDialog: AuthorCreateDialog;
	let ttsPlayer: TextToSpeechPlayer;

	let scrollContainer : HTMLDivElement;
	

	let posts: ForumPost[] = [];
	let author: Optional<ForumAuthor> = undefined;

	let showCreatePostDialog : boolean = false;

	onMount(() => {
		update(false)

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

	async function update(smoothScroll : boolean = true) {
		posts = await ForumApi.getPosts();
		author = await ForumApi.checkToken();

		scrollContainer.scrollTo({
			top: scrollContainer.scrollHeight,
			behavior: smoothScroll ? "smooth" : undefined
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
								ttsPlayer={ttsPlayer}
							/>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="no-posts">No posts yet.</p>
			{/if}
		</div>
	</div>
	
	{#if showCreatePostDialog}
	<div class="create-post-container content-width" transition:fly={{ y: 200, duration: 300 }}>
		<ForumInputElement
			postType={ForumPostType.TEXT}
			onPostSubmitted={() => { showCreatePostDialog = false; }}
			onPostCancelled={() => { showCreatePostDialog = false; }}
		/>
	</div>
	{:else}
	<div class="create-post-button content-width" transition:fly={{ y: 200, duration: 300 }}>
		<button class="big" onclick={createPost}>
			<img src={createPostButton} alt="create new forum post"/>
		</button>
	</div>
	{/if}
	<TextToSpeechPlayer bind:this={ttsPlayer} />
</div>

<style>
	.scroll-container {
		position: fixed;
		top:0;
		left:0;
		height: 100vh;
		width: 100vw;
		background-color: #EDCA82;
		overflow: scroll;
	}

	.create-post-container {
		position: fixed;
		background-color: #ffffff;
		bottom: 0;
		left:0;
		right:0;
		z-index: 1;
		padding: var(--small-padding);
		border-top: 1px solid #ccc;
		border-radius: var(--border-radius) var(--border-radius) 0 0;
        box-sizing: border-box;
	}

	.post-container {
		padding: var(--page-padding);
		margin-bottom: calc(var(--footer-height) + var(--page-padding) + 60px);
		box-sizing: border-box;
	}

	.create-post-button {
		display: flex;
		position: fixed;
		bottom: var(--footer-height);
		justify-content: end;
        box-sizing: border-box;
        padding: var(--page-padding);
	}

	.no-posts {
		text-align: center;
		font-weight: 800;
	}
</style>
