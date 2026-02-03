<script lang="ts">
	import { t } from '$lib/translations';

	import submitButton from '$lib/assets/forum-submit-post.png';
	import backButton from '$lib/assets/forum-arrow-down.png';

	import { Storage } from '$lib/storage';
	import { language } from '$lib/stores';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	export let onMessageSubmitted: (text: string) => void;
	export let expanded: boolean = false;
	export let enabled: boolean = true;

	let text: string = '';

	onMount(() => {
		text = Storage.botMessageText;
	});

	async function submitMessage() {
		onMessageSubmitted(text);
		Storage.botMessageText = '';
		text = '';
		expanded = false;
	}

	function close() {
		Storage.botMessageText = text;
		expanded = false;
	}

	export function reset() {
		text = '';
	}

	function handleBackdropClick() {
		close();
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="bot-input-container {!enabled && 'disabled'}">
	{#if expanded}
		<div class="message-overlay" onclick={handleBackdropClick}></div>
	{/if}
	<div class="create-message-container content-width">
		<div class="message-input-container">
			<div class="input-element-field">
				<div class="input-textarea {!expanded && 'minimized'}">
					<textarea id="text" bind:value={text} maxlength={1000} onclick={() => (expanded = true)}
					></textarea>
				</div>
			</div>
			<div class="input-button-group">
				<button
					class="submit-button shadow"
					onclick={() => submitMessage()}
					disabled={!enabled || text.length <= 3}
				>
					<img src={submitButton} alt={t('alt.submitForumPost', $language)} />
				</button>
				{#if expanded}
					<button class="back-button shadow" onclick={() => close()}>
						<img src={backButton} alt={t('alt.backForumPost', $language)} />
					</button>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.bot-input-container.disabled {
		opacity: 0.5;
		pointer-events: none;
	}

	.message-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 1;
	}

	.create-message-container {
		position: fixed;
		background-color: #278A58;
		bottom: var(--footer-height);
		left: 0;
		right: 0;
		padding: var(--small-padding);
		border-radius: var(--border-radius) var(--border-radius) 0 0;
		box-sizing: border-box;
		z-index: 2;
	}

	.message-input-container {
		display: flex;
		flex-direction: row;
		gap: var(--small-padding);
	}

	.input-element-field {
		flex: 1;
	}

	.input-button-group {
		display: flex;
		flex-direction: column;
		flex-shrink: 0;
		text-align: center;
		justify-content: space-between;
		gap: var(--small-padding);
	}

	.submit-button {
		background-color: #37cc84;
		--box-shadow-color: #25b86e;
	}

	.back-button {
		background-color: #ffffff;
		--box-shadow-color: #cccccc;
	}

	.input-textarea.minimized {
		height: var(--button-size);
		box-sizing: border-box;
	}
</style>
