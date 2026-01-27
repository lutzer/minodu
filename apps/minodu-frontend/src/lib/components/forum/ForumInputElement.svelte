<script lang="ts">
	import { Config } from '$lib';
	import { ForumApi } from '$lib/apis/forum/api';
	import type { Optional } from '$lib/types';
	import { ForumPostType } from '$lib/types';
	import { t } from '$lib/translations';

	import submitButton from '$lib/assets/forum-submit-post.png';
	import deleteButton from '$lib/assets/forum-delete.png';
	import backButton from '$lib/assets/forum-arrow-down.png';
	import { Storage } from '$lib/storage';
	import { language } from '$lib/stores';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import ForumImagePicker from './ForumImagePicker.svelte';
	import ForumAudioRecorder from './ForumAudioRecorder.svelte';

	export let postType: ForumPostType;

	export let onPostSubmitted: () => void;
	export let onPostCancelled: () => void;

	let audioRecorder: ForumAudioRecorder;
	let audioBlob: Optional<Blob>;

	let text: string = '';

	let imagePicker: ForumImagePicker;
	let image: Optional<File>;

	let submitEnabled: boolean = false;

	$: {
		switch (postType) {
			case ForumPostType.TEXT:
				submitEnabled = text.length >= 3;
				break;
			case ForumPostType.AUDIO:
				submitEnabled = audioBlob != undefined;
				break;
			case ForumPostType.IMAGE:
				submitEnabled = image != undefined;
				break;
		}
	}

	onMount(() => {
		text = Storage.forumPostText;
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
		Storage.forumPostText = '';
	}

	function close() {
		onPostCancelled();
		Storage.forumPostText = text;
	}

	export function reset() {
		text = '';
		audioBlob = undefined;
		image = undefined;
	}

	function handleBackdropClick(
		event: MouseEvent & { currentTarget: EventTarget & HTMLDivElement }
	) {
		close();
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="post-overlay" onclick={handleBackdropClick}>
	<div
		class="create-post-container"
		transition:fly={{ y: 200, duration: 300 }}
		onclick={(e) => e.stopPropagation()}
	>
		<div class="forum-input-container">
			{#if postType == ForumPostType.TEXT}
				<div class="input-element-field">
					<div class="input-textarea">
						<textarea id="text" bind:value={text}></textarea>
					</div>
				</div>
				<div class="input-button-group">
					<button
						class="submit-button shadow"
						onclick={() => createPost(text, undefined, undefined)}
						disabled={!submitEnabled}
					>
						<img src={submitButton} alt={t('alt.submitForumPost', $language)} />
					</button>
					<button class="back-button shadow" onclick={() => close()}>
						<img src={backButton} alt={t('alt.backForumPost', $language)} />
					</button>
				</div>
			{:else if postType == ForumPostType.IMAGE}
				<div class="input-element-field">
					<ForumImagePicker bind:this={imagePicker} bind:image />
				</div>
				<div class="input-button-group">
					<button
						class="submit-button shadow"
						onclick={() => createPost(undefined, undefined, image)}
						disabled={!submitEnabled}
					>
						<img src={submitButton} alt={t('alt.submitForumPost', $language)} />
					</button>
					{#if image}
						<button class="delete-button shadow" onclick={() => imagePicker.clearImage()}>
							<img src={deleteButton} alt={t('alt.backForumPost', $language)} />
						</button>
					{:else}
						<button class="back-button shadow" onclick={() => close()}>
							<img src={backButton} alt={t('alt.backForumPost', $language)} />
						</button>
					{/if}
				</div>
			{:else if postType == ForumPostType.AUDIO}
				<div class="input-element-field">
					<ForumAudioRecorder
						bind:this={audioRecorder}
						bind:blob={audioBlob}
					/>
				</div>
				<div class="input-button-group">
					<button
						class="submit-button shadow"
						onclick={() => createPost(undefined, audioBlob, undefined)}
						disabled={!submitEnabled}
					>
						<img src={submitButton} alt={t('alt.submitForumPost', $language)} />
					</button>
					{#if audioBlob}
						<button class="delete-button shadow" onclick={() => audioRecorder.reset()}>
							<img src={deleteButton} alt={t('alt.backForumPost', $language)} />
						</button>
					{:else}
						<button class="back-button shadow" onclick={() => close()}>
							<img src={backButton} alt={t('alt.backForumPost', $language)} />
						</button>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.post-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 1;
	}

	.create-post-container {
		position: fixed;
		background-color: #edca82;
		bottom: 0;
		left: 0;
		right: 0;
		padding: var(--small-padding);
		border-radius: var(--border-radius) var(--border-radius) 0 0;
		box-sizing: border-box;
	}

	.forum-input-container {
		display: flex;
		flex-direction: row;
		gap: var(--small-padding);
	}

	.input-element-field {
		flex: 1;
	}

	.input-button-group {
		display: flex;
		flex-direction: column;
		flex-shrink: 0;
		text-align: center;
		justify-content: space-between;
		gap: var(--small-padding);
	}

	.submit-button {
		background-color: #37cc84;
		--box-shadow-color: #25b86e;
	}

	.back-button {
		background-color: #ffffff;
		--box-shadow-color: #cccccc;
	}

	.delete-button {
		background-color: #fa002a;
		--box-shadow-color: #d90024;
	}
</style>
