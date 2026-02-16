<script lang="ts">
	import { t } from '$lib/translations';

	import submitButton from '$lib/assets/forum-submit-post.png';
	import backButton from '$lib/assets/forum-arrow-down.png';
	import micButton from '$lib/assets/forum-post-audio.png';

	import { Storage } from '$lib/storage';
	import { language } from '$lib/stores';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { AiServicesApi } from '$lib/apis/ai_services/api';

	export let onMessageSubmitted: (text: string) => void;
	export let expanded : boolean = false;
	export let enabled : boolean = true;

	let fileInput: HTMLInputElement;
	let text: string = '';
	let transcribing = false

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
		expanded = false
	}

	export function reset() {
		text = '';
	}

	function handleBackdropClick() {
		close();
	}

	function handleCapture(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file && file.type.startsWith('audio/')) {
			transcribe(file)
		}
	}

	async function transcribe(audio: Blob) {
		transcribing = true
		let response = await AiServicesApi.transcribeSpeech(audio, 'fr');
		text += response.text;
		transcribing = false
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="bot-input-container {!enabled && "disabled"}">
	{#if expanded}
	<div class="message-overlay" onclick={handleBackdropClick}>
	</div>
	{/if}
	<div class="create-message-container content-width">
		<div class="message-input-container">
				<div class="input-element-field">
					<div class="input-textarea {!expanded && "minimized"}">
						<textarea id="text" bind:value={text} maxlength={1000} onclick={() => expanded = true}></textarea>
						<div class="record-button">
							<input
								bind:this={fileInput}
								type="file"
								accept="audio/*"
								capture="environment"
								onchange={(e) => handleCapture(e)}
								style="display: none;"
							/>
							<button class="button shadow" onclick={() => fileInput.click()} disabled={transcribing}>
								<img src={micButton}/>
							</button>
						</div>
					</div>
					
				</div>
				<div class="input-button-group">
					<button
						class="submit-button shadow"
						onclick={() => submitMessage()}
						disabled={!enabled || text.length <= 2}
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
		background-color: #6c9e85;
		bottom: 0;
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
		height: 100%;
		box-sizing: border-box;
	}

	.input-textarea {
		display: flex;
		gap: var(--small-padding);
	}

	.record-button button {
		background: #278A58;
	}

</style>
