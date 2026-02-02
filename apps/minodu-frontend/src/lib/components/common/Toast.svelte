<script lang="ts">
	import { toast } from '$lib/toastStore';
	import { fly } from 'svelte/transition';
</script>

{#if $toast}
	<div class="toast {$toast.type}" transition:fly={{ y: 50, duration: 300 }} role="alert">
		<span>{$toast.message}</span>
		<button class="dismiss" onclick={() => toast.dismiss()}>&times;</button>
	</div>
{/if}

<style>
	.toast {
		position: fixed;
		bottom: var(--page-padding);
		left: var(--page-padding);
		right: var(--page-padding);
		max-width: var(--max-page-width);
		margin: var(--medium-padding);
		padding: var(--small-padding);
		border-radius: var(--border-radius);
		color: white;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--small-padding);
		z-index: 100;
		box-sizing: border-box;
		box-shadow: 2px 2px 2px #00000055;
	}

	.toast.error {
		background-color: #fa002a;
	}

	.toast.info {
		background-color: #37cc84;
	}

	.dismiss {
		background: none;
		border: none;
		color: white;
		font-size: 1.4em;
		cursor: pointer;
		padding: 0;
		line-height: 1;
		flex-shrink: 0;
	}
</style>
