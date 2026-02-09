<script lang="ts">
	import AudioPlayer from '../common/AudioPlayer.svelte';
	import type { BackendPost } from '$lib/apis/backend/models/backendPost';
	import chatbotButtonSmall from '$lib/assets/chatbot-button-small.png';
	import { goto } from '$app/navigation';

	import solBackground from '$lib/assets/agriculture-cat-sol.png';
	import autresBackground from '$lib/assets/agriculture-cat-autres.png';
	import elevageBackground from '$lib/assets/agriculture-cat-elevage.png';
	import plantesBackground from '$lib/assets/agriculture-cat-plantes.png';

	import { language } from '$lib/stores';
	import { t } from '$lib/translations';

	export let post: BackendPost;

	const backgroundImages = {
		SOL: solBackground,
		AUTRES: autresBackground,
		ELEVAGE: elevageBackground,
		PLANTES: plantesBackground
	};

	$: backgroundImage = backgroundImages[post.category.name as keyof typeof backgroundImages];
</script>

<div
	class="post shadow color {post.category.name}"
	style="background-image: url({backgroundImage})"
>
	<div class="vertical-layout">
		<div class="horizontal-layout">
			<div class="post-image">
				<img src={post.image} alt="{t('alt.imageFor', $language)} {post.title}" />
			</div>
			<div class="post-content">
				<div class="title">
					<h3>{post.title}</h3>
					<h4>{post.author}</h4>
				</div>
			</div>
		</div>
		<div class="horizontal-layout-center">
			<div class="audioplayer">
				<AudioPlayer audioSource={$language === 'kb' ? post.attachment_kb : post.attachment} />
			</div>
			<div class="chat-button">
				<button class="small" onclick={() => goto(`/agriculture/bot/${post.id}`)}>
					<img src={chatbotButtonSmall} alt={t('alt.chatbotIcon', $language)} />
				</button>
			</div>
		</div>
	</div>
</div>

<style>
	.post {
		position: relative;
		padding: var(--small-padding);
		margin-bottom: var(--medium-padding);
		border-radius: var(--border-radius);
	}

	.vertical-layout {
		width: 100%;
	}

	.horizontal-layout {
		gap: var(--small-padding);
		display: flex;
	}

	.horizontal-layout-center {
		gap: var(--small-padding);
		display: flex;
		align-items: center;
	}

	.post-image {
		width: 120px;
		height: 120px;
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
		flex-shrink: 0;
		margin-bottom: -4px;
	}

	.title {
		min-height: 70px;
	}

	.audioplayer {
		flex-grow: 1;
	}

	.post.color {
		background-position: 100% 120%;
		background-size: 40%;
		background-repeat: no-repeat;
	}
</style>
