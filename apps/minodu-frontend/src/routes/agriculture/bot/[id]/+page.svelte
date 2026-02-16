<script lang="ts">
	import { page } from '$app/state';
	import { BackendApi } from '$lib/apis/backend/api';
	import type { BackendPost } from '$lib/apis/backend/models/backendPost';
	import ExplainPageButton from '$lib/components/common/ExplainPageButton.svelte';
	import ChatbotPage from '$lib/pages/ChatbotPage.svelte';
	import { onMount } from 'svelte';

	const postId = Number(page.params.id);
	let post : BackendPost;
	
	onMount(async () => {
		post = await BackendApi.getPost(postId);
	});

</script>

<div>
	{#if post}
		<ChatbotPage post={post} saveChat={false}/>
	{/if}
</div>