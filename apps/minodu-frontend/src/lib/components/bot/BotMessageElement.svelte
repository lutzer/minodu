<script lang="ts">
	import { AiServicesApi } from '$lib/apis/ai_services/api';
	import { BotMessageType, type BotMessage, type Optional } from '$lib/types';
	import { delay } from '$lib/utils';
	import { onMount, tick } from 'svelte';
	import TextToSpeechButton from '../common/TextToSpeechButton.svelte';
	import TextToSpeechPlayer from '../common/TextToSpeechPlayer.svelte';
	import { Config } from '$lib';
	import { language } from '$lib/stores';
	import { t } from '$lib/translations';

	import botAvatarImage from '$lib/assets/chatbot-avatar.png';

	export let message: BotMessage;
	export let ttsPlayer: TextToSpeechPlayer;

	// let streaming: boolean = false;
	// let error: boolean = false;

	// let reader: Optional<ReadableStreamDefaultReader<Uint8Array<ArrayBuffer>>> = undefined;

	// onMount(() => {
	// 	if (!message.generated) generateResponse(message.question, conversation);
	// });

	// $: error = message.response.trimStart().startsWith('[ERROR:');

	// export function stop() {
	// 	reader?.cancel();
	// 	streaming = false;
	// 	onResponseGenerated?.();
	// }

	// async function generateResponse(question: string, conversation: string) {
	// 	streaming = true;

	// 	let apiResponse = await AiServicesApi.generateRagResponse({
	// 		language: Config.language,
	// 		conversation: conversation,
	// 		question: question
	// 	});

	// 	reader = apiResponse.body?.getReader();

	// 	if (!reader) throw Error('Could not initialize rag response reader');

	// 	const decoder = new TextDecoder();

	// 	while (streaming) {
	// 		const { done, value } = await reader.read();
	// 		if (done) break;

	// 		const text = decoder.decode(value, { stream: true });
	// 		message.response += text;
	// 		await tick();
	// 		await delay(1);
	// 	}
	// 	message.generated = true;

	// 	streaming = false;
	// 	reader = undefined;
	// 	onResponseGenerated?.();
	// }
</script>

<div class="bot-message shadow {message.type == BotMessageType.USER ? 'user' : 'bot'}">
	{#if message.type == BotMessageType.USER}
		<div class="message-text">
			<p>{message.text}</p>
		</div>
		<div class="message-side">
			<TextToSpeechButton text={message.text} {ttsPlayer} />
		</div>
	{:else}
		<!-- <div class="chatbot-avatar"> 
		<img src={botAvatarImage}/>
	</div> -->
		<div class="message-side">
			<div class="avatar-image">
				<img src={botAvatarImage}/>
			</div>
			<TextToSpeechButton text={message.text} {ttsPlayer} />
		</div>
		<div class="message-text">
			<h3>Mindou Bot</h3>
			<p>{message.text}</p>
		</div>
	{/if}

	<!-- <h3>{t('chatbot.question', $language)}</h3>
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
	{/if} -->
</div>

<style>
	.bot-message {
		padding: var(--medium-padding);
		background-color: #d7ebe1;
		border-radius: var(--border-radius);
		margin-bottom: var(--medium-padding);
		gap: var(--small-padding);
		display: flex;
	}

	.bot-message.bot {
		background-color: #e5f6ef;
		--box-shadow-color: #b9cbc3;
		margin-right: var(--medium-padding);
	}

	.bot-message.user {
		background-color: #ffe9b3;
		--box-shadow-color: #d9c38c;
		margin-left: var(--medium-padding);
	}

	.bot-message .message-side {
		flex-grow: 0;
		text-align: center;
	}

	.bot-message .message-text {
		flex-grow: 1;
		/* align-self: center; */
	}

	.avatar-image {
		width: 50px;
		margin-bottom: var(--small-padding);
	}

	.avatar-image img {
		width: 100%;
		height: auto;
	}

	/* .cursor {
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
	} */

	/* p {
		margin: 0 0 10px 0;
	} */
</style>
