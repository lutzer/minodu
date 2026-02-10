<script lang="ts">
	import ExplainPageButton from '$lib/components/common/ExplainPageButton.svelte';
	import ChatbotPage from '$lib/pages/ChatbotPage.svelte';
</script>

<div>
	<ChatbotPage />
	<ExplainPageButton
		audioFr="https://audio-samples.github.io/samples/mp3/blizzard_unconditional/sample-0.mp3"
		audioKb="https://audio-samples.github.io/samples/mp3/blizzard_unconditional/sample-1.mp3"
	/>
</div>
