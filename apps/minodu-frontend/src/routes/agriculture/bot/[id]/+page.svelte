<script lang="ts">
	import { page } from '$app/state';
	import { BackendApi } from '$lib/apis/backend/api';
	import type { BackendPost } from '$lib/apis/backend/models/backendPost';
	import ExplainPageButton from '$lib/components/common/ExplainPageButton.svelte';
	import ChatbotPage from '$lib/pages/ChatbotPage.svelte';
	import { onMount } from 'svelte';

	const postId = page.url.searchParams.get('id') || '';
	let post : BackendPost;
	
	$: async () => {
		post = await BackendApi.getPost(postId);
	}

</script>

<div class="chatbot-page">
	{#if post}
		<ChatbotPage post={post}/>
	{:else}
	<div class="no-data">
		<p>Cannot load post data.</p>
	</div>
	{/if}
	<ExplainPageButton
		audioFr="https://audio-samples.github.io/samples/mp3/blizzard_unconditional/sample-0.mp3"
		audioKb="https://audio-samples.github.io/samples/mp3/blizzard_unconditional/sample-1.mp3"
	/>
</div>

<style>
	.chatbot-page {
		position: absolute;
		top:0;
		left:0;
		right:0;
		bottom:0;
		background-color: #C3EED9;
	}
</style>