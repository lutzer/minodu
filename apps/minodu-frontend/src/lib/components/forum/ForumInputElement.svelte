<script lang="ts">
	import type { ForumAuthor } from '$lib/apis/forum/models/forumAuthor.ts';
	import type { Optional } from '$lib/types';
	import AudioRecorder from '../common/AudioRecorder.svelte';
	import ForumImagePicker from './ForumImagePicker.svelte';

	export let author: Optional<ForumAuthor>;
	export let onCreateAuthorClicked: () => void;
	export let onLogoutAuthorClicked: () => void;
	export let onSubmitPostClicked: (
		title: string,
		text: string,
		audio: Optional<Blob>,
		image: Optional<File>
	) => {};

	let audioRecorder: AudioRecorder;
	let audioBlob: Optional<Blob>;
	let audioRecording: boolean = false;

	let title: string = '';
	let text: string = '';
	let image: Optional<File>;

	let submitEnabled: boolean = false;

	$: {
		submitEnabled =
			(title.length >= 3 && text.length >= 3) || audioBlob != undefined || image != undefined;
	}

	export function reset() {
		title = '';
		text = '';
		audioBlob = undefined;
		image = undefined;
	}
</script>

<div class="forum-input-container">
	<div class="author input-block">
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
	{/if}
</div>

<style>
	.input-block {
		background-color: lightgray;
		margin: 10px;
		padding: 10px;
	}

	.input-block.text {
		min-width: 300px;
	}

	.author {
		text-align: center;
	}
</style>
