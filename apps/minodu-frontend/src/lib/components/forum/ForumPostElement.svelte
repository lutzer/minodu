<script lang="ts">
	import type { ForumPost } from '$lib/apis/forum/models/forumPost';
	import AudioPlayer from '../common/AudioPlayer.svelte';
	import TextToSpeechButton from '../common/TextToSpeechButton.svelte';
	import TextToSpeechPlayer from '../common/TextToSpeechPlayer.svelte';
	import { language } from '$lib/stores';
	import { t } from '$lib/translations';

	import postDeleteButton from '$lib/assets/delete-forum-post.png';

	export let ttsPlayer: TextToSpeechPlayer;
	export let post: ForumPost;
	export let isOwn: boolean;
	export let onDeleteClicked: () => void;
</script>

<div class="post shadow">
	<div class="post-avatar">
		<div class="avatar-picture">
			<img src={post.author.avatar.file_urlpath} alt={t('alt.avatarOfUser', $language)} />
		</div>
		{#if post.text.length > 0}
			<div class="tts-button">
				<TextToSpeechButton text={post.text} {ttsPlayer} />
			</div>
		{/if}
	</div>
	<div class="post-content">
		<h3>{post.author.name}</h3>
		{#if post.text.length > 0}
			<div class="paragraph">
				{post.text}
			</div>
		{/if}
		<ul>
			{#each post.files as file}
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
					<p><i>{file.text}</i></p>
				</li>
			{/each}
		</ul>
	</div>
	<div class="post-delete-container">
		{#if isOwn}
			<button class="delete-button small" onclick={onDeleteClicked}>
				<img src={postDeleteButton} alt={t('alt.deleteForumPost', $language)} />
			</button>
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
		gap: var(--small-padding);
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
		flex: 1;
	}

	.image {
		height: 500px;
		width: 100%;
	}

	.image > img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.post-delete-container {
		position: absolute;
		right: 8px;
		top: 8px;
	}

	.processing {
		border-radius: var(--border-radius);
		background-color: #fff8e5;
		padding: var(--small-padding);
	}
</style>
