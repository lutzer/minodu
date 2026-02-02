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
	import { Storage } from '$lib/storage';
	import { language } from '$lib/stores';
	import { t } from '$lib/translations';

	import { waitForAnimationFrame } from '$lib/utils';
	import AuthorDeleteDialog from '$lib/components/forum/AuthorDeleteDialog.svelte';
	import FloatingForumButtons from '$lib/components/forum/FloatingForumButtons.svelte';
	import DeletePostDialog from '$lib/components/forum/DeletePostDialog.svelte';

	let ttsPlayer: TextToSpeechPlayer;

	let scrollContainer: HTMLDivElement;

	let posts: ForumPost[] = [];

	let author: Optional<ForumAuthor> = undefined;

	type DialogType = 'createAuthor' | 'logoutAuthor' | 'createPost' | 'deletePost';

	let visibleDialogs: Record<DialogType, boolean> = {
		createAuthor: false,
		logoutAuthor: false,
		createPost: false,
		deletePost: false
	};

	$: showFloatingButtons = !Object.values(visibleDialogs).some((v) => v);

	let createPostType: ForumPostType = ForumPostType.TEXT;
	let deletePostId: Optional<number>;

	onMount(() => {
		update(false);

		let eventSource = ForumApi.getEventSource();
		eventSource.onmessage = (msg) => {
			try {
				let data = JSON.parse(msg.data);
				if (data['topic'] === 'update') {
					update();
				} else if (data['topic'] === 'delete') {
					noScrollUpdate();
				}
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

	async function noScrollUpdate() {
		posts = await ForumApi.getPosts();
		author = await ForumApi.checkToken();
	}

	async function logout() {
		Storage.forumToken = undefined;
		author = undefined;
	}

	async function createPost(type: ForumPostType) {
		createPostType = type;
		showDialog('createPost');
	}

	async function deletePost(id: Optional<number>) {
		if (id == undefined) return;
		await ForumApi.deletePost(id);
	}

	function showDialog(type: DialogType) {
		visibleDialogs[type] = true;
	}

	function closeDialog(type: DialogType) {
		visibleDialogs[type] = false;
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
								onDeleteClicked={() => {
									showDialog('deletePost');
									deletePostId = post.id;
								}}
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
	{#if showFloatingButtons}
		<FloatingForumButtons
			{author}
			onAvatarClicked={() => showDialog('logoutAuthor')}
			onAuthorSelect={() => showDialog('createAuthor')}
			onPostTypeSelected={(type) => createPost(type)}
		/>
	{/if}
	<TextToSpeechPlayer bind:this={ttsPlayer} />
	{#if visibleDialogs.createAuthor}
		<AuthorCreateDialog
			onCreated={() => {
				closeDialog('createAuthor');
				update();
			}}
			onBack={() => {
				closeDialog('createAuthor');
			}}
		/>
	{/if}
	{#if visibleDialogs.logoutAuthor}
		<AuthorDeleteDialog
			{author}
			onDeleted={() => {
				closeDialog('logoutAuthor');
				logout();
			}}
			onBack={() => {
				closeDialog('logoutAuthor');
			}}
		/>
	{/if}
	{#if visibleDialogs.createPost}
		<ForumInputElement
			postType={createPostType}
			onPostSubmitted={() => {
				closeDialog('createPost');
				update();
			}}
			onPostCancelled={() => {
				closeDialog('createPost');
			}}
		/>
	{/if}
	{#if visibleDialogs.deletePost}
		<DeletePostDialog
			onBack={() => closeDialog('deletePost')}
			onDelete={() => {
				closeDialog('deletePost');
				deletePost(deletePostId);
			}}
		/>
	{/if}
</div>

<style>
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
		background-color: #e2d0ac;
	}
</style>
