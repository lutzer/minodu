<script lang="ts">
	import type { Optional } from "$lib/types";

	export let icon: string;
	export let onclick: Optional<() => void> = undefined;
	export let link: Optional<string> = undefined
</script>

<div class="floating-button">
	<div class="content-width">
		{#if link}
		<a class="button big" href={link}>
			<img src={icon} alt="floating button" />
		</a>
		{:else}
		<button class="big" onclick={onclick}>
			<img src={icon} alt="floating button" />
		</button>
		{/if}
	</div>
</div>

<style>
	.floating-button {
		position: fixed;
		bottom: var(--footer-height);
		left: 0;
		right: 0;
		pointer-events: none;
		text-align: right;
	}

	.floating-button button {
		pointer-events: auto;
	}

	.floating-button a {
		pointer-events: auto;
		display: inline-block;
	}

	.floating-button .content-width {
		box-sizing: border-box;
		padding: var(--page-padding);
	}

	@media screen and (min-width: 550px) {
		.floating-button {
			bottom: calc(var(--footer-height) + var(--medium-padding));
		}
	}
</style>
