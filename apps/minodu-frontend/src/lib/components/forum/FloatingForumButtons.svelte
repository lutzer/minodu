<script lang="ts">
	import type { ForumAuthor } from "$lib/apis/forum/models/forumAuthor";
	import { ForumPostType, type Optional } from "$lib/types";

	import createPostButton from '$lib/assets/forum-new-post-button.png';
	import postTextIcon from '$lib/assets/forum-post-text.png';
	import postImageIcon from '$lib/assets/forum-post-image.png';
	import postAudioIcon from '$lib/assets/forum-post-audio.png';
	import { fly } from "svelte/transition";

	export let author: Optional<ForumAuthor>;

	export let onAvatarClicked: () => void;
	export let onAuthorSelect: () => void;
	export let onPostTypeSelected: (type: ForumPostType) => void;

	let typeDialog : HTMLDialogElement;
	let showTypeDialog : boolean = false

	function handlePostButtonClick(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement; }) {
		if (author) {
			showTypeDialog = true
			typeDialog.showModal()
			// typeDialog.shio
		} else {
			onAuthorSelect();
		}
	}

	function handleTypeButtonClick(type: ForumPostType) {
		onPostTypeSelected(type);
		showTypeDialog = true
		typeDialog.close()
	}


	function handleDialogClicked(event: MouseEvent & { currentTarget: EventTarget & HTMLDialogElement; }) {
		if (event.target === typeDialog) {
			showTypeDialog = true
			typeDialog.close()
		}
	}
</script>

<div>
	<div class="floating-button">
		<div class="content-width flex-layout">
			{#if author}
			<button class="big shadow author" onclick={onAvatarClicked}>
				<img src={author.avatar.file_urlpath} alt="create new forum post" />
			</button>
			{/if}
			<button class="big shadow" onclick={handlePostButtonClick}>
				<img src={createPostButton} alt="create new forum post" />
			</button>
		</div>
	</div>
	<dialog bind:this={typeDialog} class="post-type-dialog" onclick={handleDialogClicked}>
		{#if showTypeDialog}
		<div class="post-type-menu" transition:fly={{ y:10, opacity: 0.0, duration: 300 }}>
			<ul>
				<li><button class="post-type shadow" onclick={() => handleTypeButtonClick(ForumPostType.AUDIO)}><img src={postAudioIcon} alt="Icon for audio posts"/></button></li>
				<li><button class="post-type shadow" onclick={() => handleTypeButtonClick(ForumPostType.IMAGE)}><img src={postImageIcon} alt="Icon for photo posts"/></button></li>
				<li><button class="post-type shadow" onclick={() => handleTypeButtonClick(ForumPostType.TEXT)}><img src={postTextIcon} alt="Icon for text posts"/></button></li>
			</ul>
		</div>
		{/if}
	</dialog>
</div>

<style>
	.floating-button {
		position: fixed;
		bottom: var(--footer-height);
		left: 0;
		right: 0;
		pointer-events: none;
		text-align: right;
	}

	.flex-layout {
		display: flex;
		justify-content: right;
		gap: var(--small-padding);
	}

	.floating-button button {
		pointer-events: auto;
	}

	.floating-button button.author {
		margin-bottom: 4px;
		height: 68px;
		width: 68px;
		pointer-events: auto;
        background-color: #ffffff;
        border-radius: var(--border-radius);
        --box-shadow-color: #888888;
		padding: 3px;
	}

	.floating-button .content-width {
		box-sizing: border-box;
		padding: var(--page-padding);
	}

	.post-type-dialog {
		position: fixed;
		bottom: calc(var(--footer-height) + var(--button-big-size) + var(--small-padding));
		right: 0;
		top: auto;
		left: auto;
		background: none;
		border: none;
		padding: 0;
		margin: var(--small-padding);
		overflow: hidden;
	}

	.post-type-dialog::backdrop {
		background-color: rgba(0, 0, 0, 0.3);
	}

	.post-type-dialog ul {
		padding: var(--page-padding);
		text-align: right;
	}

	button.post-type {
		height: var(--button-big-size);
		width: 150px;
		background-color: #CC604B;
		border-radius: var(--border-radius);
		--box-shadow-color: #8C4A3C;
		margin-top: var(--small-padding);
	}

	@media screen and (min-width: 550px) {
		.floating-button {
			bottom: calc(var(--footer-height) + var(--medium-padding));
		}
	}
</style>
