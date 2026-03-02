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
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';

	let ttsPlayer: TextToSpeechPlayer;

	let scrollContainer: HTMLDivElement;

	let posts: ForumPost[] = [];
	let hasMore = false;
	let isLoadingMore = false;

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

	let loading : boolean = true

	onMount(() => {
		initialLoad();

		let eventSource = ForumApi.getEventSource();
		eventSource.onmessage = (msg) => {
			try {
				let data = JSON.parse(msg.data);
				if (data['topic'] === 'update') {
					onSseUpdate();
				} else if (data['topic'] === 'delete') {
					onSseDelete();
				}
			} catch (e) {
				console.error('Could not parse event', e);
			}
		};
		return () => {
			eventSource.close();
		};
	});

	async function initialLoad() {
		const result = await ForumApi.getPostsPaginated();
		posts = result.posts;
		hasMore = result.has_more;

		loading = false;
		
		await login();

		await waitForAnimationFrame();

		scrollContainer.scrollTo({
			top: scrollContainer.scrollHeight,
			behavior: 'instant' as ScrollBehavior
		});
	}

	async function loadOlderPosts() {
		if (!hasMore || isLoadingMore || posts.length === 0) return;

		isLoadingMore = true;

		const oldestId = posts[0].id;
		const prevScrollHeight = scrollContainer.scrollHeight;

		try {
			const result = await ForumApi.getPostsPaginated(oldestId);
			posts = [...result.posts, ...posts];
			hasMore = result.has_more;

			await waitForAnimationFrame();

			// Preserve scroll position after prepending
			const newScrollHeight = scrollContainer.scrollHeight;
			scrollContainer.scrollTop += newScrollHeight - prevScrollHeight;
		} finally {
			isLoadingMore = false;
		}
	}

	async function onSseUpdate() {
		const result = await ForumApi.getPostsPaginated();

		const freshById = new Map(result.posts.map((p) => [p.id, p]));
		const lastKnownId = posts.length > 0 ? posts[posts.length - 1].id : 0;
		let hasNewPosts = false;

		// Update existing posts that fall within the fetched window
		posts = posts.map((p) => freshById.get(p.id) ?? p);

		// Append any new posts
		const newPosts = result.posts.filter((p) => p.id > lastKnownId);
		if (newPosts.length > 0) {
			posts = [...posts, ...newPosts];
			hasNewPosts = true;
		}

		if (hasNewPosts) {
			await waitForAnimationFrame();

			scrollContainer.scrollTo({
				top: scrollContainer.scrollHeight,
				behavior: 'smooth'
			});
		}
	}

	async function onSseDelete() {
		const result = await ForumApi.getPostsPaginated();

		// Reconcile: keep posts that still exist, maintaining older loaded posts
		const latestIds = new Set(result.posts.map((p) => p.id));
		posts = posts.filter((p) => {
			// Keep posts that are older than the paginated window
			if (result.posts.length > 0 && p.id < result.posts[0].id) return true;
			// For posts in the paginated window, keep only if still present
			return latestIds.has(p.id);
		});
	}

	function onScroll() {
		if (scrollContainer.scrollTop < 100 && hasMore && !isLoadingMore) {
			loadOlderPosts();
		}
	}

	async function onNewPost() {
		const result = await ForumApi.getPostsPaginated();
		const lastKnownId = posts.length > 0 ? posts[posts.length - 1].id : 0;
		const newPosts = result.posts.filter((p) => p.id > lastKnownId);

		if (newPosts.length > 0) {
			posts = [...posts, ...newPosts];
		}

		await waitForAnimationFrame();

		scrollContainer.scrollTo({
			top: scrollContainer.scrollHeight,
			behavior: 'smooth'
		});
	}

	async function logout() {
		Storage.forumToken = undefined;
		author = undefined;
	}

	async function login() {
		author = await ForumApi.checkToken(Storage.forumToken);
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
	<div class="scroll-container" bind:this={scrollContainer} on:scroll={onScroll}>
	{#if loading}
		<LoadingSpinner text={t('forum.loadingText',$language)}/>
	{:else}
		<div class="post-container content-width">
			{#if isLoadingMore}
				<div class="loading-more">
					<span class="spinner"></span>
				</div>
			{/if}
			{#if posts.length > 0}
				<ul>
					{#each posts as post (post.id)}
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
				<div class="no-data">
					<p>{t('forum.noPosts', $language)}</p>
				</div>
				
			{/if}
		</div>
	{/if}
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
				login();
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
				onNewPost();
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

	.scroll-container {
		background-color: #e2d0ac;
	}

	.loading-more {
		display: flex;
		justify-content: center;
		padding: var(--small-padding);
	}

	.spinner {
		width: 24px;
		height: 24px;
		border: 3px solid rgba(0, 0, 0, 0.15);
		border-top-color: rgba(0, 0, 0, 0.5);
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
