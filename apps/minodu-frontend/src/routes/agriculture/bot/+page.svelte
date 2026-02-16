<script lang="ts">
	import ExplainPageButton from '$lib/components/common/ExplainPageButton.svelte';
	import ChatbotPage from '$lib/pages/ChatbotPage.svelte';
</script>

<div class="chatbot-page">
	<ChatbotPage saveChat={true}/>
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
		z-index: 10;
	}
</style>
