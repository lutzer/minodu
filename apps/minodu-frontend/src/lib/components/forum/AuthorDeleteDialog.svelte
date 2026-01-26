<script lang="ts">
	import { language } from '$lib/stores';
	import type { Optional } from '$lib/types';
	import { t } from '$lib/translations';
	import forumBackImage from '$lib/assets/forum-back.png';
	import forumDeleteImage from '$lib/assets/forum-delete.png';
	import type { ForumAuthor } from '$lib/apis/forum/models/forumAuthor';
	import { onMount } from 'svelte';

	export let onDeleted: () => void;
    export let onBack: () => void;

	let dialog: HTMLDialogElement;

    onMount(() => {
		dialog?.showModal();
	})

    export let author: Optional<ForumAuthor>
	
</script>

<dialog bind:this={dialog} class="shadow overlay">
	<h2>{t('forum.deleteAuthor', $language)}</h2>
    {#if author}
	<div class="author-image">
        <img src={author.avatar.file_urlpath} alt={t('alt.avatarImage', $language)}/>
    </div>
    <div class="author-name">
        <h3>{author.name}</h3>
    </div>
    {/if}
    <div class="button-group">
		<button class="back long shadow" onclick={() => onBack()}>
			<img src={forumBackImage} alt={t('action.cancel', $language)}/>
		</button>
		<button class="delete long shadow" onclick={() => onDeleted()}>
			<img src={forumDeleteImage} alt={t('action.delete', $language)}/>
		</button>
	</div>
</dialog>

<style>
    .author-image {
        width: 50%;
        margin: 0 auto;
        text-align: center;
    }

    .author-image img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    .author-name {
        padding: var(--small-padding);
        text-align: center;
    }

	button.delete {
		background-color: #FA002A;
		border-radius: var(--border-radius);
		--box-shadow-color: #D90024;
	}

	button.back {
		background-color: #ffffff;
		border-radius: var(--border-radius);
		--box-shadow-color: #CCCCCC;
	}

	.button-group {
		display: flex;
		padding: var(--medium-padding) 0;
		justify-content: space-between;
		gap: var(--medium-padding);
	}
</style>
