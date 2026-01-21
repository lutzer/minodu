<script lang="ts">
	import { page } from '$app/stores';
  
    $: postId = $page.params.id;
</script>

<div>
	<h2>Chatbot for id {postId}</h2>
</div>