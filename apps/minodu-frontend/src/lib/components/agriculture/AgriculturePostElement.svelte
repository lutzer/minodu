<script lang="ts">
	import AudioPlayer from '../common/AudioPlayer.svelte';
	import type { BackendPost } from '$lib/apis/backend/models/backendPost';

	export let post: BackendPost;
</script>

<div class="post shadow">
	<div class="post-image">
		<img src={post.image} alt="image for {post.title}" />
	</div>
	<div class="post-content">
		<h3>{post.title}</h3>
		<h4>{post.author}</h4>
		<div class="audioplayer">
			<AudioPlayer audioSource={post.attachment} />
		</div>
	</div>
</div>

<style>
	.post {
		position: relative;
		display: flex;
		padding: var(--small-padding);
		margin-bottom: var(--medium-padding);
		background-color: #f6eddb;
		border-radius: var(--border-radius);
		gap: var(--small-padding);
		--box-shadow-color: #67625a;
	}

	.post-image {
		width: 125px;
		height: 125px;
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
</style>
