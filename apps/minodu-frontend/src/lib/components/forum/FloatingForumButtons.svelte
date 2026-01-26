<script lang="ts">
	import type { ForumAuthor } from "$lib/apis/forum/models/forumAuthor";
	import type { Optional } from "$lib/types";

	import createPostButton from '$lib/assets/forum-new-post-button.png';

	export let author: Optional<ForumAuthor>;

	export let onAvatarClicked: () => void;
	export let onPostClicked: () => void;
	
</script>

<div class="floating-button">
	<div class="content-width flex-layout">
		{#if author}
		<button class="big shadow author" onclick={onAvatarClicked}>
			<img src={author.avatar.file_urlpath} alt="create new forum post" />
		</button>
		{/if}
		<button class="big shadow" onclick={onPostClicked}>
			<img src={createPostButton} alt="create new forum post" />
		</button>
	</div>
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
		height: var(--big-button-size);
		justify-content: right;
		align-items: center;
		gap: var(--small-padding);
	}

	.floating-button button {
		pointer-events: auto;
	}

	.floating-button button.author {
		margin-bottom: 4px;
		height: 68px;
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

	@media screen and (min-width: 550px) {
		.floating-button {
			bottom: calc(var(--footer-height) + var(--medium-padding));
		}
	}
</style>
