<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

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
        background: white;
		border: 1px;
    }

	:global(input[type="text"]) {
        width: 100%;
        resize: none;
        border: none;
        background: none;
    }
	:global(input[type="text"]:focus) {
        outline: none;
		box-shadow: none; 
    }

</style>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div>
	<h1>Mindou</h1>

	<div class="content">
		{@render children?.()}
	</div>
</div>

