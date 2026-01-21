<script lang="ts">
	import { Config } from '$lib';
	import { ForumApi } from '$lib/apis/forum/api';
	import type { ForumAuthor } from '$lib/apis/forum/models/forumAuthor.ts';
	import type { Optional } from '$lib/types';
	import { ForumPostType } from '$lib/types';
	import AudioRecorder from '../common/AudioRecorder.svelte';

	import submitButton from '$lib/assets/forum-submit-post.png';
	import cancelButton from '$lib/assets/delete-forum-post.png';
	import { Store } from '$lib/store';
	import { onMount } from 'svelte';

	export let postType: ForumPostType;

	export let onPostSubmitted: () => void;
	export let onPostCancelled: () => void;

	let audioRecorder: AudioRecorder;
	let audioBlob: Optional<Blob>;
	let audioRecording: boolean = false;

	let text: string = '';
	let image: Optional<File>;

	let submitEnabled: boolean = false;

	$: {
		submitEnabled = text.length >= 3 || audioBlob != undefined || image != undefined;
	}

	onMount(() => {
		text = Store.forumPostText;
	});

	async function createPost(text: Optional<string>, audio: Optional<Blob>, image: Optional<File>) {
		let post = await ForumApi.createPost({ title: '', text: text != undefined ? text : '' });
		if (audio) {
			await ForumApi.attachFile(post.id, audio, Config.language);
		}
		if (image) {
			let imageBlob = new Blob([image], { type: image.type });
			await ForumApi.attachFile(post.id, imageBlob, Config.language);
		}
		onPostSubmitted();
		Store.forumPostText = '';
	}

	function close() {
		onPostCancelled();
		Store.forumPostText = text;
	}

	export function reset() {
		text = '';
		audioBlob = undefined;
		image = undefined;
	}
</script>

<div class="forum-input-container">
	{#if postType == ForumPostType.TEXT}
		<div class="input-text-field">
			<div class="input-textarea">
				<textarea id="text" bind:value={text}></textarea>
			</div>
		</div>
		<div class="input-button-group">
			<button onclick={() => createPost(text, undefined, undefined)} disabled={!submitEnabled}>
				<img src={submitButton} alt="Submit forum post" />
			</button>
			<button onclick={close}>
				<img src={cancelButton} alt="Submit forum post" />
			</button>
		</div>
	{/if}
	<!-- <div class="author input-block">
		{#if author != undefined}
			<h4>{author.name}</h4>
			<p>{author.avatar}</p>
			<button onclick={onLogoutAuthorClicked}>logout</button>
		{:else}
			<button onclick={onCreateAuthorClicked}>Create Author</button>
		{/if}
	</div>
	{#if author !== undefined}
		<div class="input-block text">
			<div class="input">
				<label for="title">Title</label>
				<div class="input-text">
					<input id="title" type="text" bind:value={title} />
				</div>
			</div>
			<div class="input">
				<label for="text">Text</label>
				<div class="input-textarea">
					<textarea id="text" bind:value={text}></textarea>
				</div>
			</div>
		</div>
		<div class="input-block audio">
			<AudioRecorder bind:this={audioRecorder} bind:recording={audioRecording} bind:blob={audioBlob}
			></AudioRecorder>
			{#if !audioBlob && !audioRecording}
				<button onclick={audioRecorder.startRecording}>Record</button>
			{:else if !audioBlob && audioRecording}
				<button onclick={audioRecorder.stopRecording}>Stop</button>
			{:else}
				<button onclick={audioRecorder.reset}>Reset</button>
			{/if}
		</div>
		<div class="input-block">
			<ForumImagePicker bind:image />
		</div>
		<div class="submit input-block">
			<button
				onclick={() => onSubmitPostClicked(title, text, audioBlob, image)}
				disabled={!submitEnabled}>Submit</button
			>
		</div>
	{:else}
		<div><p>Please login</p></div>
	{/if} -->
</div>

<style>
	.forum-input-container {
		display: flex;
		flex-direction: row;
		gap: 5px;
	}

	.input-text-field {
		flex: 1;
	}

	.input-button-group {
		flex-shrink: 0;
		width: 60px;
		text-align: center;
	}
</style>
