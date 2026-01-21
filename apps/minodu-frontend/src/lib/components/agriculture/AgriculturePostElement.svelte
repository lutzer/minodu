<script lang="ts">
	import AudioPlayer from '../common/AudioPlayer.svelte';
	import type { BackendPost } from '$lib/apis/backend/models/backendPost';
	import chatbotButtonSmall from '$lib/assets/chatbot-button-small.png';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	import solBackground from '$lib/assets/agriculture-cat-sol.png';
	import autresBackground from '$lib/assets/agriculture-cat-autres.png';
	import elevageBackground from '$lib/assets/agriculture-cat-elevage.png';
	import plantesBackground from '$lib/assets/agriculture-cat-plantes.png';

	export let post: BackendPost;

	const backgroundImages = {
		'SOL': solBackground,
		'AUTRES': autresBackground,
		'ELEVAGE': elevageBackground,
		'PLANTES': plantesBackground
	};

	$: backgroundImage = backgroundImages[post.category.name as keyof typeof backgroundImages];
</script>

<div class="post shadow cat {post.category.name}" style="background-image: url({backgroundImage})">
	<div class="vertical-layout">
		<div class="horizontal-layout">
			<div class="post-image">
				<img src={post.image} alt="image for {post.title}" />
			</div>
			<div class="post-content">
				<div class="title">
					<h3>{post.title}</h3>
					<h4>{post.author}</h4>
				</div>
				<div class="chat-button">
					<button class="small" onclick={() => goto(`/bot/${post.id}`)}>
						<img src={chatbotButtonSmall} alt="chatbot icon"/>
					</button>		
				</div>
			</div>
		</div>
		<div class="audioplayer">
			<AudioPlayer audioSource={post.attachment} />
		</div>
	</div>
</div>

<style>
	.post {
		position: relative;
		padding: var(--small-padding);
		margin-bottom: var(--medium-padding);
		background-color: #f6eddb;
		border-radius: var(--border-radius);
		--box-shadow-color: #67625a;
	}

	.vertical-layout {
		width: 100%;
	}

	.horizontal-layout {
		gap: var(--small-padding);
		display: flex;
	}

	.post-image {
		width: 100px;
		height: 100px;
		flex-shrink: 0;
	}

	.post-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: var(--border-radius);
	}

	.post-content {
		overflow: hidden;
		text-overflow: ellipsis;
		flex-grow: 1;
	}

	.chat-button {
		position: absolute;
		top: var(--small-padding);
		right: var(--small-padding);
	}

	.title {
		margin-right: 70px;
		min-height: 70px;
	}

	.cat {
		background-position: 130% 100%;
    	background-size: contain;
    	background-repeat: no-repeat;
	}

	:global(.cat.SOL)
	{
		background-color: #EFD6C3;
		--box-shadow-color: #D5AE90;
	}

	:global(.cat.PLANTES)
	{
		background-color: #C2EFDA;
		--box-shadow-color: #9CC9B4;
	}

	:global(.cat.AUTRES)
	{
		background-color: #FFE9B3;
		--box-shadow-color: #D9C38C;
	}

	:global(.cat.ELEVAGE)
	{
		background-color: #F9D9B8;
		--box-shadow-color: #D9B38C;
	}
</style>
