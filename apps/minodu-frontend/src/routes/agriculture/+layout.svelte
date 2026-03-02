<script>
	import AgriculturePage from '$lib/pages/AgriculturePage.svelte';

	let { children } = $props();
</script>

<div>
	<AgriculturePage />
	{@render children?.()}
</div>
