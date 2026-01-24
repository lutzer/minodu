<script lang="ts">
	export let icon: string;
	export let onclick: () => void;
</script>

<div class="floating-button">
	<div class="content-width">
		<button class="big" {onclick}>
			<img src={icon} alt="create new forum post" />
		</button>
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
