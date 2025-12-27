<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div>
	<h1>Mindou</h1>

	<div class="content">
		{@render children?.()}
	</div>
</div>

<style>
	:global(.input-textarea) {
		background: white;
		border: 1px;
	}

	:global(textarea) {
		width: 100%;
		resize: none;
		border: none;
		background: none;
	}

	:global(textarea:focus) {
		outline: none;
		box-shadow: none;
	}

	:global(.input-text) {
		background: none;
		border: 1px;
	}

	:global(input[type='text']) {
		width: 100%;
		resize: none;
		border: none;
		background: none;
	}

	:global(input[type='text']:focus) {
		outline: none;
		box-shadow: none;
	}

	:global(h3) {
		margin: 0;
		font-size: 110%;
	}

	:global(.paragraph:not(:first-of-type)) {
		margin-top: 10px;
	}
</style>
