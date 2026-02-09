<script lang="ts">
	import { AiServicesApi } from '$lib/apis/ai_services/api';
	import type { BotMessage, Optional } from '$lib/types';
	import { delay } from '$lib/utils';
	import { onMount, tick } from 'svelte';
	import TextToSpeechButton from '../common/TextToSpeechButton.svelte';
	import TextToSpeechPlayer from '../common/TextToSpeechPlayer.svelte';
	import { Config } from '$lib';
	import { language } from '$lib/stores';
	import { t } from '$lib/translations';

	export let message: BotMessage;
	export let conversation: string;
	export let ttsPlayer: TextToSpeechPlayer;
	export let onResponseGenerated: Optional<() => void> = undefined;

	let streaming: boolean = false;
	let error: boolean = false;

	let reader: Optional<ReadableStreamDefaultReader<Uint8Array<ArrayBuffer>>> = undefined;

	onMount(() => {
		if (!message.generated) generateResponse(message.question, conversation);
	});

	$: error = message.response.trimStart().startsWith('[ERROR:');

	export function stop() {
		reader?.cancel();
		streaming = false;
		onResponseGenerated?.();
	}

	async function generateResponse(question: string, conversation: string) {
		streaming = true;

		let apiResponse = await AiServicesApi.generateRagResponse({
			language: Config.language,
			conversation: conversation,
			question: question
		});

		reader = apiResponse.body?.getReader();

		if (!reader) throw Error('Could not initialize rag response reader');

		const decoder = new TextDecoder();

		while (streaming) {
			const { done, value } = await reader.read();
			if (done) break;

			const text = decoder.decode(value, { stream: true });
			message.response += text;
			await tick();
			await delay(1);
		}
		message.generated = true;

		streaming = false;
		reader = undefined;
		onResponseGenerated?.();
	}
</script>

<div class="bot-message">
	<h3>{t('chatbot.question', $language)}</h3>
	<p>
		{message.question}
		{#if message.question.length > 0}
			<TextToSpeechButton text={message.question} {ttsPlayer} />
		{/if}
	</p>
	<h3>{t('chatbot.answer', $language)}</h3>
	<p class={error ? 'error' : ''}>
		{message.response}
		{#if streaming}
			<span class="cursor">|</span>
		{:else if message.response.length > 0 && !error}
			<TextToSpeechButton text={message.response} {ttsPlayer} />
		{/if}
	</p>
	{#if streaming}
		<button onclick={stop}>{t('action.stop', $language)}</button>
	{/if}
</div>

<style>
	.bot-message {
		padding: 10px;
		margin: 10px;
		background-color: lightgray;
	}

	.cursor {
		animation: blink 1s infinite;
	}

	@keyframes blink {
		0%,
		50% {
			opacity: 1;
		}
		51%,
		100% {
			opacity: 0;
		}
	}

	p.error {
		color: white;
		background-color: red;
		padding: 5px;
	}

	p {
		margin: 0 0 10px 0;
	}
</style>
