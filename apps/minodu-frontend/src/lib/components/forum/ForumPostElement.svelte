<script lang="ts">
	import type { ForumPost } from '$lib/apis/forum/models/forumPost';
	import AudioPlayer from '../common/AudioPlayer.svelte';
	import TextToSpeechButton from '../common/TextToSpeechButton.svelte';
	import TextToSpeechPlayer from '../common/TextToSpeechPlayer.svelte';

	import postDeleteButton from '$lib/assets/delete-forum-post.png'

	export let ttsPlayer: TextToSpeechPlayer;
	export let post: ForumPost;
	export let isOwn: boolean;
	export let onDeleteClicked: () => void;
</script>

<div class="post shadow">
	<div class="post-avatar">
		<div class="avatar-picture">
			<img src="/api/forum/static/avatars/avatar1.jpeg" alt="avatar of the user"/>
		</div>
		{#if post.text.length > 0}
		<div class="tts-button">
			<TextToSpeechButton text={post.text} ttsPlayer={ttsPlayer} />
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
		<!-- {#if post.text.length > 0}
			<div class="paragraph">
				<h3>Text</h3>
				{post.text}
				<TextToSpeechButton text={post.text} {ttsPlayer} />
			</div>
		{/if} -->

		<ul>
			{#each post.files as file}
				<li class="file">
					{#if file.processing_state == "processing" }
						<div>Processing File</div>
					{:else if file.processing_state == "error" }
						<div>Error Processing File</div>
					{:else if file.content_type.startsWith('audio')}
						<AudioPlayer audioSource={file.file_urlpath}></AudioPlayer>
					{:else if file.content_type.startsWith('image')}
						<div class="image">
							<img src={file.file_urlpath} alt="no description"/>
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
		<button class="delete-button" onclick={onDeleteClicked}>
			<img src={postDeleteButton} alt="Delete forum post">
		</button>
		{/if}
	</div>
</div>

<style>
	.post {
		position:relative;
		display: flex;
		padding: var(--medium-padding);
		margin-bottom: var(--medium-padding);
		background-color: #f6eddb;
		border-radius: var(--border-radius);
		gap: var(--small-padding);
		--box-shadow-color: #67625a;
	}

	.post-avatar {
		width: 60px;
  		flex-shrink: 0; 
		text-align: center;
	}

	.post-avatar img {
		width:100%;
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

	.delete-button {
		height: 32px;
		width: 32px;
	}

	.post-delete-container {
		position: absolute;
		right:8px;
		top:8px;
	}
</style>
