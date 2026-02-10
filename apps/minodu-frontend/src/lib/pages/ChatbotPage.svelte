<script lang="ts">
	import { Config } from '$lib';
	import { AiServicesApi } from '$lib/apis/ai_services/api';
	import BotMessageElement from '$lib/components/bot/BotMessageElement.svelte';
	import AudioRecorder from '$lib/components/common/AudioRecorder.svelte';
	import TextToSpeechPlayer from '$lib/components/common/TextToSpeechPlayer.svelte';
	import { Storage } from '$lib/storage';
	import { language } from '$lib/stores';
	import { BotMessageType, type BotMessage, type Optional } from '$lib/types';
	import { afterUpdate, onMount, tick } from 'svelte';
	import { t } from '$lib/translations';
	import type { BackendPost } from '$lib/apis/backend/models/backendPost';
	import BotInputElement from '$lib/components/bot/BotInputElement.svelte';
	import { delay, waitForAnimationFrame } from '$lib/utils';

	import trashIcon from '$lib/assets/trash-icon-white.png';

	export let post: Optional<BackendPost> = undefined;
	export let saveChat: boolean

	let messages: BotMessage[] = [];
	let ttsPlayer: TextToSpeechPlayer;
	let conversation: string = '';
	let generating = false;
	let scrollContainer: HTMLDivElement;

	onMount(() => {
		if (saveChat) messages = Storage.chatMessages;
	});

	afterUpdate(() => {
		if (messages.length == 0) {
			generateWelcomeMessage();
		}
	});

	$: generating = messages.reduce((prev, val) => prev || !val.final, false);
	$: conversation = messages.reduce((acc, val) => {
		return (
			acc +
			'\n' +
			(val.type == BotMessageType.USER ? +`USER: ${val.text}` : +`BOT: ${val.text}`) +
			'\n'
		);
	}, '');

	let reader: Optional<ReadableStreamDefaultReader<Uint8Array<ArrayBuffer>>> = undefined;
	let reading = false;

	async function generateWelcomeMessage() {
		let welcome = { text: '', type: BotMessageType.BOT, final: false }
		messages = [...messages, welcome ];

		let apiResponse = await AiServicesApi.getWelcomeMessage(Config.language, post?.id);

		welcome.text = apiResponse.text;
		welcome.final = true;
		messages = messages;

		scrollContainer.scrollTo({
			top: scrollContainer.scrollHeight,
			behavior: 'smooth'
		});
	}

	async function submitMessage(message: string) {
		messages = [...messages, { text: message, type: BotMessageType.USER, final: true }];

		if (post === undefined) Storage.chatMessages = messages;

		await waitForAnimationFrame();

		scrollContainer.scrollTo({
			top: scrollContainer.scrollHeight,
			behavior: 'smooth'
		});

		await requestAnswer(message, conversation);

		scrollContainer.scrollTo({
			top: scrollContainer.scrollHeight,
			behavior: 'smooth'
		});

		if (saveChat) Storage.chatMessages = messages;
	}

	async function requestAnswer(question: string, conversation: string) {
		let response = { text: '', type: BotMessageType.BOT, final: false };
		messages = [...messages, response];

		let apiResponse = await AiServicesApi.generateRagResponse({
			language: Config.language,
			conversation: conversation,
			question: question
		});

		reader = apiResponse.body?.getReader();

		if (!reader) throw Error('Could not initialize rag response reader');

		const decoder = new TextDecoder();

		reading = true;

		while (reading) {
			const { done, value } = await reader.read();
			if (done) break;

			const text = decoder.decode(value, { stream: true });
			response.text += text;
			messages = messages;
			await tick();
			await delay(100);
		}

		response.final = true;
		messages = messages;

		reading = false;
		reader = undefined;
	}

	export function stopAnswer() {
		reader?.cancel();
		reading = false;
	}

	function clearChat() {
		messages = [];
		if (saveChat) Storage.chatMessages = undefined;
	}
</script>

<div class="chatbot-page">
	<div class="scroll-container" bind:this={scrollContainer}>
		<div class="message-container content-width">
			<ul>
				{#each messages as msg, i (i)}
					<li>
						<BotMessageElement message={msg} {ttsPlayer} onCancelResponse={stopAnswer} />
					</li>
				{/each}
				{#if messages.length > 0}
					<li>
						<div class="reset-button-container">
							<button class="reset-button long shadow" onclick={clearChat}>
								<img src={trashIcon} alt="Icon for clearing the conversation" />
								<span>Clear Chat</span>
							</button>
						</div>
					</li>
				{:else}
					<div class="no-data">
						<p>There are no messages in this conversation yet</p>
					</div>
				{/if}
			</ul>
		</div>
	</div>
	<BotInputElement onMessageSubmitted={submitMessage} enabled={!generating} />
	<TextToSpeechPlayer bind:this={ttsPlayer} />
</div>

<style>
	.message-container {
		padding: var(--page-padding);
		margin-bottom: calc(var(--page-padding) + var(--button-size));
		box-sizing: border-box;
	}

	.scroll-container {
		background-color: #c3eed9;
	}

	.reset-button-container {
		display: flex;
		justify-content: center;
		width: 100%;
	}

	.reset-button {
		background-color: #cc604b;
		--box-shadow-color: #8c4a3c;
		margin: var(--small-padding);
		padding: 0 var(--small-padding);
		display: flex;
		color: white;
		width: 160px;
		align-items: center;
		justify-content: space-between;
	}

	.reset-button img {
		width: 30px;
		height: 30px;
	}

	.reset-button span {
		flex-grow: 1;
		text-align: center;
	}
</style>
