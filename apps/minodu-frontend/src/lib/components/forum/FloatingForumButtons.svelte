<script lang="ts">
	import type { ForumAuthor } from '$lib/apis/forum/models/forumAuthor';
	import { ForumPostType, type Optional } from '$lib/types';
	import { t } from '$lib/translations';
	import { language } from '$lib/stores';

	import createPostButton from '$lib/assets/forum-new-post-button.png';
	import postTextIcon from '$lib/assets/forum-post-text.png';
	import postImageIcon from '$lib/assets/forum-post-image.png';
	import postAudioIcon from '$lib/assets/forum-post-audio.png';
	import { fly } from 'svelte/transition';

	export let author: Optional<ForumAuthor>;

	export let onAvatarClicked: () => void;
	export let onAuthorSelect: () => void;
	export let onPostTypeSelected: (type: ForumPostType) => void;

	let typeDialog: HTMLDialogElement;
	let showTypeDialog: boolean = false;
	let postButton: HTMLButtonElement;

	function handlePostButtonClick() {
		if (author) {
			showTypeDialog = true;

			typeDialog.showModal();
			let buttonBB = postButton.getBoundingClientRect();
			let dialogBB = typeDialog.getBoundingClientRect();
			console.log(buttonBB, dialogBB)
			typeDialog.style.right = `${window.innerWidth - buttonBB.right}px`;
			typeDialog.style.bottom = `${window.innerHeight - buttonBB.top}px`;
		} else {
			onAuthorSelect();
		}
	}

	function handleTypeButtonClick(type: ForumPostType) {
		onPostTypeSelected(type);
		showTypeDialog = true;
		typeDialog.close();
	}

	function handleDialogClicked(
		event: MouseEvent & { currentTarget: EventTarget & HTMLDialogElement }
	) {
		if (event.target === typeDialog) {
			showTypeDialog = false;
			typeDialog.close();
		}
	}
</script>

<div>
	<div class="floating-button">
		<div class="content-width flex-layout">
			{#if author}
				<button class="big shadow author" onclick={onAvatarClicked}>
					<img src={author.avatar.file_urlpath} alt={t('alt.avatarOfUser', $language)} />
				</button>
			{/if}
			<button class="big shadow" bind:this={postButton} onclick={handlePostButtonClick}>
				<img src={createPostButton} alt={t('alt.createForumPost', $language)} />
			</button>
		</div>
	</div>
	<dialog bind:this={typeDialog} class="post-type-dialog" onclick={handleDialogClicked}>
		{#if showTypeDialog}
			<div class="post-type-menu" transition:fly={{ y: 10, opacity: 0.0, duration: 300 }}>
				<ul>
					<li>
						<button
							class="post-type shadow"
							onclick={() => handleTypeButtonClick(ForumPostType.AUDIO)}
							><img src={postAudioIcon} alt={t('alt.iconAudioPost', $language)} /></button
						>
					</li>
					<li>
						<button
							class="post-type shadow"
							onclick={() => handleTypeButtonClick(ForumPostType.IMAGE)}
							><img src={postImageIcon} alt={t('alt.iconImagePost', $language)} /></button
						>
					</li>
					<li>
						<button
							class="post-type shadow"
							onclick={() => handleTypeButtonClick(ForumPostType.TEXT)}
							><img src={postTextIcon} alt={t('alt.iconTextPost', $language)} /></button
						>
					</li>
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
		margin-bottom: 6px;
		height: 65px;
		width: 65px;
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
		bottom: auto;
		right: auto;
		top: auto;
		left: auto;
		background: none;
		border: none;
		padding: 0;
		margin: 0;
		overflow: hidden;
	}

	.post-type-dialog::backdrop {
		background-color: rgba(0, 0, 0, 0.3);
	}

	.post-type-dialog ul {
		padding: var(--medium-padding) 0;
		text-align: right;
	}

	button.post-type {
		height: var(--button-size);
		width: 140px;
		background-color: #cc604b;
		border-radius: var(--border-radius);
		--box-shadow-color: #8c4a3c;
		margin-top: var(--small-padding);
	}

	@media screen and (min-width: 550px) {
		.floating-button {
			bottom: calc(var(--footer-height) + var(--medium-padding));
		}
	}
</style>
