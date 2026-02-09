<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import type { ForumPost } from '$lib/apis/forum/models/forumPost';
	import AudioPlayer from '../common/AudioPlayer.svelte';
	import TextToSpeechButton from '../common/TextToSpeechButton.svelte';
	import TextToSpeechPlayer from '../common/TextToSpeechPlayer.svelte';
	import { language } from '$lib/stores';
	import { t } from '$lib/translations';
	import { format } from 'timeago.js';

	import postDeleteButton from '$lib/assets/delete-forum-post.png';
	import expandPostButton from '$lib/assets/forum-arrow-down.png';

	export let ttsPlayer: TextToSpeechPlayer;
	export let post: ForumPost;
	export let isOwn: boolean;
	export let onDeleteClicked: () => void;

	const MAX_HEIGHT = 250;
	let expanded = false;
	let overflowing = false;
	let contentHeight = 0;
	let postMainEl: HTMLDivElement;

	function checkOverflow() {
		if (postMainEl) {
			contentHeight = postMainEl.scrollHeight;
			overflowing = contentHeight > MAX_HEIGHT;
		}
	}

	onMount(() => checkOverflow());
	afterUpdate(() => checkOverflow());
</script>

<div class="post shadow">
	<div class="post-avatar">
		<div class="avatar-picture">
			<img src={post.author.avatar.file_urlpath} alt={t('alt.avatarOfUser', $language)} />
		</div>
	</div>
	<div class="post-content">
		<div class="post-header">
			<div class="title">
				<h3>{post.author.name}</h3>
				<p class="date">{format(post.created_at + 'Z')}</p>
			</div>
			<div class="post-buttons">
				{#if isOwn}
					<button class="delete-button small shadow" onclick={onDeleteClicked}>
						<img src={postDeleteButton} alt={t('alt.deleteForumPost', $language)} />
					</button>
				{/if}
				{#if post.text.length > 0}
					<div class="tts-button small">
						<TextToSpeechButton text={post.text} {ttsPlayer} />
					</div>
				{/if}
			</div>
		</div>
		<div
			class="post-main"
			class:truncated={overflowing}
			class:collapsed={overflowing && !expanded}
			bind:this={postMainEl}
			style:max-height={overflowing
				? expanded
					? contentHeight + 'px'
					: MAX_HEIGHT + 'px'
				: 'none'}
		>
			{#if post.text.length > 0}
				<div class="paragraph">
					{post.text}
				</div>
			{/if}
			<ul>
				{#each post.files as file (file.id)}
					<li class="file">
						{#if file.processing_state == 'processing'}
							<div class="processing">{t('forum.processingFile', $language)}</div>
						{:else if file.processing_state == 'error'}
							<div class="processing-error">{t('forum.errorProcessingFile', $language)}</div>
						{:else if file.content_type.startsWith('audio')}
							<AudioPlayer audioSource={file.file_urlpath}></AudioPlayer>
						{:else if file.content_type.startsWith('image')}
							<div class="image">
								<img src={file.file_urlpath} alt={t('alt.noDescription', $language)} />
							</div>
						{:else}
							{file.id} - {file.filename} : {file.file_urlpath}
						{/if}
						{#if file.text.length > 0}
							<p><b>{t('forum.transcription', $language)}:</b> <i>{file.text}</i></p>
						{/if}
					</li>
				{/each}
			</ul>
		</div>
		{#if overflowing}
			<div class="expand-button-container">
				<button class="expand-button" onclick={() => (expanded = !expanded)}>
					<img
						src={expandPostButton}
						alt={expanded ? 'collapse' : 'expand'}
						class:rotated={expanded}
					/>
				</button>
			</div>
		{/if}
	</div>
</div>

<style>
	.post {
		position: relative;
		display: flex;
		padding: var(--medium-padding);
		margin-bottom: var(--medium-padding);
		background-color: #eeeae1;
		border-radius: var(--border-radius);
		gap: var(--medium-padding);
		--box-shadow-color: #a29279;
	}

	.post-avatar {
		width: 60px;
		flex-shrink: 0;
		text-align: center;
	}

	.post-avatar img {
		width: 100%;
		height: auto;
		object-fit: contain;
		margin-bottom: var(--small-padding);
	}

	.paragraph {
		text-align: left;
	}

	.post-content {
		width: 100%;
	}

	.post-header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-bottom: var(--small-padding);
		align-content: center;
	}

	.post-header h3 {
		padding: 0;
		margin-bottom: 2px;
	}

	.post-header .date {
		padding: 0;
		margin: 0;
		color: #949296;
	}

	.post-buttons {
		display: flex;
		flex-direction: row;
		gap: var(--small-padding);
	}

	.image {
		width: 100%;
	}

	.image > img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		border-radius: var(--border-radius);
		overflow: hidden;
	}

	.processing {
		border-radius: var(--border-radius);
		background-color: #fff8e5;
		padding: var(--small-padding);
	}

	.processing-error {
		border-radius: var(--border-radius);
		background-color: #fa002a33;
		padding: var(--small-padding);
	}

	.delete-button {
		background-color: #edca82;
		--box-shadow-color: #b8995c;
	}

	.post-main.truncated {
		position: relative;
		overflow: hidden;
		transition: max-height 0.3s ease;
	}

	.post-main.truncated.collapsed::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 50px;
		background: linear-gradient(to bottom, transparent, #eeeae1);
		pointer-events: none;
	}
	.expand-button-container {
		margin-bottom: calc(var(--page-padding) * -1.5);
	}

	.expand-button {
		width: 100%;
		padding: var(--small-padding);
		height: var(--button-size);
	}

	.expand-button img {
		width: auto;
		height: 100%;
		transition: transform 0.2s ease;
	}

	.expand-button img.rotated {
		transform: rotate(180deg);
	}
</style>
