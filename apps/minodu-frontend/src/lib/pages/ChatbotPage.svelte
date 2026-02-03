<script lang="ts">
	import { Config } from '$lib';
	import { AiServicesApi } from '$lib/apis/ai_services/api';
	import BotMessageElement from '$lib/components/bot/BotMessageElement.svelte';
	import AudioRecorder from '$lib/components/common/AudioRecorder.svelte';
	import TextToSpeechPlayer from '$lib/components/common/TextToSpeechPlayer.svelte';
	import { Storage } from '$lib/storage';
	import { language } from '$lib/stores';
	import { BotMessageType, type BotMessage, type Optional } from '$lib/types';
	import { onMount } from 'svelte';
	import { t } from '$lib/translations';
	import type { BackendPost } from '$lib/apis/backend/models/backendPost';
	import BotInputElement from '$lib/components/bot/BotInputElement.svelte';
	import { delay, waitForAnimationFrame } from '$lib/utils';

	import trashIcon from '$lib/assets/trash-icon-white.png';

	export let post: Optional<BackendPost> = undefined;

	let messages: BotMessage[] = [];
	let ttsPlayer: TextToSpeechPlayer;
	let conversation: string = '';
	let generating = false;
	let scrollContainer: HTMLDivElement;

	onMount(() => {
		messages = Storage.chatMessages;
		if (messages.length === 0) {
			streamWelcomeMessage();
		}
	});

	async function streamWelcomeMessage() {
		const botMessage: BotMessage = { text: '', type: BotMessageType.BOT_GENERATING };
		messages = [botMessage];

		try {
			const response = await AiServicesApi.generateWelcomeMessage({
				language: Config.language,
				source_id: post?.id
			});

			const reader = response.body?.getReader();
			if (!reader) return;

			const decoder = new TextDecoder();

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				const text = decoder.decode(value, { stream: true });
				botMessage.text += text;
				messages = [...messages.slice(0, -1), { ...botMessage }];

				await waitForAnimationFrame();
				scrollContainer?.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'smooth' });
				await delay(1);
			}

			botMessage.type = BotMessageType.BOT_FINISHED;
			messages = [...messages.slice(0, -1), { ...botMessage }];
			Storage.chatMessages = messages;
		} catch {
			botMessage.type = BotMessageType.BOT_FINISHED;
			botMessage.text = botMessage.text || 'Welcome!';
			messages = [...messages.slice(0, -1), { ...botMessage }];
			Storage.chatMessages = messages;
		}
	}

	$: generating = messages.reduce(
		(prev, val) => prev || val.type == BotMessageType.BOT_GENERATING,
		false
	);
	$: conversation = messages.reduce((acc, val) => {
		return (
			acc +
			'\n' +
			(val.type == BotMessageType.USER ? +`USER: ${val.text}` : +`BOT: ${val.text}`) +
			'\n'
		);
	}, '');

	function updateGenerateState() {
		// Storage.chatMessages = messages;
		generating = isGenerating();
	}

	function isGenerating(): boolean {
		return messages.reduce((prev, val) => prev || val.type == BotMessageType.BOT_GENERATING, false);
	}

	async function submitMessage(message: string) {
		messages = [...messages, { text: message, type: BotMessageType.USER }];
		Storage.chatMessages = messages;

		await waitForAnimationFrame();

		scrollContainer.scrollTo({
			top: scrollContainer.scrollHeight,
			behavior: 'smooth'
		});

		console.log(messages);
	}

	function clearChat() {
		Storage.chatMessages = undefined;
		messages = [];
	}

	// async function transcribeAudio(blob: Blob) {
	// 	let response = await AiServicesApi.transcribeSpeech(blob, Config.language);
	// 	if (response.confidence > 0.6) inputText = response.text;
	// 	audioRecorder.reset();
	// }
</script>

<div class="chatbot-page">
	<div class="scroll-container" bind:this={scrollContainer}>
		<div class="message-container content-width">
			<ul>
				{#each messages as msg, i (i)}
					<li>
						<BotMessageElement message={msg} {ttsPlayer} />
					</li>
				{/each}
				{#if messages.length > 0}
					<li>
						<div class="reset-button-container">
							<button class="reset-button long shadow" onclick={clearChat}>
								<img src={trashIcon} />
								<span>Clear Chat</span>
							</button>
						</div>
					</li>
				{:else}
					<li>
						<p class="empty">Empty conversation</p>
					</li>
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

	.empty {
		text-align: center;
		margin: var(--page-padding);
	}
</style>
