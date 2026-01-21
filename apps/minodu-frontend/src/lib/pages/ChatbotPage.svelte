<script lang="ts">
	import { Config } from '$lib';
	import { AiServicesApi } from '$lib/apis/ai_services/api';
	import BotMessageElement from '$lib/components/bot/BotMessageElement.svelte';
	import AudioRecorder from '$lib/components/common/AudioRecorder.svelte';
	import TextToSpeechPlayer from '$lib/components/common/TextToSpeechPlayer.svelte';
	import { Store } from '$lib/store';
	import type { BotMessage } from '$lib/types';
	import { onMount } from 'svelte';

	let inputText: string = '';
	let messages: BotMessage[] = [];
	let ttsPlayer: TextToSpeechPlayer;
	let conversation: string = '';
	let generating = false;

	let audioRecorder: AudioRecorder;
	let audioBlob: Blob;
	let audioRecording: boolean;

	onMount(() => {
		messages = Store.chatMessages;
	});

	$: {
		messages;
		generating = isGenerating();
		conversation = messages.reduce((acc, val) => {
			return acc + '\n' + `Question: ${val.question}` + '\n' + `Answer: ${val.response}` + '\n';
		}, '');
	}

	function updateGenerateState() {
		Store.chatMessages = messages;
		generating = isGenerating();
	}

	function isGenerating(): boolean {
		return messages.reduce((prev, val) => prev || !val.generated, false);
	}

	function submitMessage() {
		messages = [...messages, { question: inputText, response: '', generated: false }];
		inputText = '';
	}

	function clearChat() {
		Store.chatMessages = undefined;
		messages = [];
	}

	async function transcribeAudio(blob: Blob) {
		let response = await AiServicesApi.transcribeSpeech(blob, Config.language);
		if (response.confidence > 0.6) inputText = response.text;
		audioRecorder.reset();
	}
</script>

<div class="scroll-container">
	<div class="chat-messages">
		<ul>
			{#each messages as msg}
				<li>
					<BotMessageElement
						message={msg}
						{conversation}
						{ttsPlayer}
						onResponseGenerated={updateGenerateState}
					/>
				</li>
			{/each}
		</ul>
	</div>
	<div class="chat-input">
		<div class="input-block">
			<div class="input-textarea">
				<textarea class="input-text" bind:value={inputText}></textarea>
			</div>
		</div>
		<div class="input-block">
			<AudioRecorder
				bind:this={audioRecorder}
				bind:blob={audioBlob}
				bind:recording={audioRecording}
			/>
			{#if !audioBlob && !audioRecording}
				<button onclick={audioRecorder.startRecording}>Record</button>
			{:else if !audioBlob && audioRecording}
				<button onclick={audioRecorder.stopRecording}>Stop</button>
			{:else}
				<button onclick={audioRecorder.reset}>Cancel</button>
				<button onclick={() => transcribeAudio(audioBlob)}>Send</button>
			{/if}
		</div>
		<div class="input-block">
			<button onclick={submitMessage} disabled={generating || inputText.length <= 3}>Submit</button>
			<button onclick={clearChat}>Clear Chat</button>
		</div>
	</div>
	<TextToSpeechPlayer bind:this={ttsPlayer} />
</div>

<style>
	.chat-input {
		background-color: lightblue;
		padding: 10px;
	}

	.chat-messages {
		background-color: lightcyan;
		padding: 10px;
	}

	.input-block {
		background-color: lightgray;
		margin: 10px;
		padding: 10px;
	}
</style>
