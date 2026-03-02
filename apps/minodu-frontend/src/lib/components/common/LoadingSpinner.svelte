<script lang="ts">
	import type { Optional } from '$lib/types';

	export let text: Optional<string> = undefined;
	export let fullscreen: boolean = true;
</script>

<div class="spinner {fullscreen ? 'center' : ''}">
	<div class="pulsing-dots {fullscreen ? '' : 'small'}">
		<span></span><span></span><span></span>
	</div>
	{#if text}
		<p>{text}</p>
	{/if}
</div>

<style>
	.spinner.center {
		position: absolute;
		top: 45%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	.pulsing-dots {
		display: flex;
		gap: var(--small-padding);
		align-items: center;
		justify-content: center;
	}

	.pulsing-dots span {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: #4a9068;
		animation: dotPulse 1.3s ease-in-out infinite;
	}
	.pulsing-dots span:nth-child(2) {
		animation-delay: 0.25s;
	}
	.pulsing-dots span:nth-child(3) {
		animation-delay: 0.5s;
	}

	.pulsing-dots.small span {
		width: 8px;
		height: 8px;
	}

	p {
		margin: var(--medium-padding) 0;
		display: block;
		text-align: center;
	}

	@keyframes dotPulse {
		0%,
		100% {
			transform: scale(0.5);
			opacity: 0.25;
		}
		50% {
			transform: scale(1.1);
			opacity: 1;
		}
	}
</style>
