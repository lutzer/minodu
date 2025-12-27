<script lang="ts">
	import { onMount } from 'svelte';
	import { ForumApi } from '$lib/apis/forum/api';
	import type { ForumPost } from '$lib/apis/forum/models/forumPost';
	import AuthorCreateDialog from '$lib/components/forum/AuthorCreateDialog.svelte';
	import type { ForumAuthor } from '$lib/apis/forum/models/forumAuthor';
	import type { Optional } from '$lib/types';
	import ForumPostElement from '$lib/components/forum/ForumPostElement.svelte';
	import ForumInputElement from '$lib/components/forum/ForumInputElement.svelte';
	import TextToSpeechPlayer from '$lib/components/common/TextToSpeechPlayer.svelte';
	import { Store } from '$lib/store';
	import { Config } from '$lib';

	let createAuthorDialog: AuthorCreateDialog;
	let ttsPlayer: TextToSpeechPlayer;
	let forumInputElement: ForumInputElement;

	let posts: ForumPost[] = [];
	let author: Optional<ForumAuthor> = undefined;

	onMount(() => {
		update();

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

	async function update() {
		posts = await ForumApi.getPosts();
		author = await ForumApi.checkToken();
	}

	function onAuthorCreated() {
		update();
	}

	async function createPost(
		title: string,
		text: string,
		audio: Optional<Blob>,
		image: Optional<File>
	) {
		let post = await ForumApi.createPost({ title: title, text: text });
		if (audio) {
			await ForumApi.attachFile(post.id, audio, Config.language);
		}
		if (image) {
			let imageBlob = new Blob([image], { type: image.type });
			await ForumApi.attachFile(post.id, imageBlob, Config.language);
		}
		forumInputElement?.reset();
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
	<div class="post-container">
		<h3>Posts</h3>
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
			<p>No posts yet.</p>
		{/if}
	</div>

	<div class="post-create">
		<h3>New Post</h3>
		<ForumInputElement
			bind:this={forumInputElement}
			{author}
			onCreateAuthorClicked={async () => createAuthorDialog.open()}
			onSubmitPostClicked={async (title, text, audio, image) =>
				createPost(title, text, audio, image)}
			onLogoutAuthorClicked={async () => logout()}
		/>

		<AuthorCreateDialog bind:this={createAuthorDialog} onCreated={onAuthorCreated} />

		<TextToSpeechPlayer bind:this={ttsPlayer} />
	</div>
</div>

<style>
	.post-create {
		background-color: lightblue;
		padding: 10px;
	}

	.post-container {
		background-color: lightcyan;
		padding: 10px;
	}
</style>
