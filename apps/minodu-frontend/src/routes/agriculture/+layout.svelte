<script>
	import AgriculturePage from '$lib/pages/AgriculturePage.svelte';

    let { children } = $props();
</script>

<div class="agriculture-page-container">
	<AgriculturePage />
    {@render children?.()}
</div>
