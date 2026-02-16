<script lang="ts">
	import { BotMessageType, type BotMessage, type Optional } from '$lib/types';
	import TextToSpeechButton from '../common/TextToSpeechButton.svelte';
	import TextToSpeechPlayer from '../common/TextToSpeechPlayer.svelte';
	import { language } from '$lib/stores';

	import botAvatarImage from '$lib/assets/chatbot-avatar.png';
	import crossIcon from '$lib/assets/cross_icon_white.png';
	import AudioPlayer from '../common/AudioPlayer.svelte';

	export let message: BotMessage;
	export let ttsPlayer: TextToSpeechPlayer;
	export let onCancelResponse: () => void;

	let isError: boolean = false;

	$: isError = message.type == BotMessageType.BOT && message.text.trimStart().startsWith('[ERROR:');
	
</script>

<div class="bot-message shadow {message.type == BotMessageType.USER ? "user" : "bot"}">
	{#if message.type == BotMessageType.USER}
	<div class="message-text">
		<h3>You</h3>
		<p>{message.text}</p>
	</div>
	<div class="message-side">
		<TextToSpeechButton text={message.text} {ttsPlayer} />
	</div>
	{:else}
	<div class="message-side">
		<div class="chatbot-avatar"> 
			<img src={botAvatarImage} alt="Icon of the chatbot"/>
		</div>
		{#if message.final}
		<TextToSpeechButton text={message.text} {ttsPlayer} />
		{/if}
	</div>
	<div class="message-text">
		<h3>Minodu Bot</h3>
		{#if message.audio && $language}
		<AudioPlayer
			audioSource={message.audio[$language]}/>
		{/if}
		<p class={isError ? 'error' : ''}>
			{message.text}
			{#if !message.final}
			<span class="cursor">...</span>
			{/if}
		</p>
		{#if !message.final}
		<div class="stop-button-container">
			<button class="stop-button small shadow" onclick={onCancelResponse}>
				<img src={crossIcon}/>
			</button>
		</div>
		{/if}
	</div>
	{/if}
</div>

<style>
	.bot-message {
		padding: var(--medium-padding);
		border-radius: var(--border-radius);
		margin-bottom: var(--medium-padding);
		display: flex;
		gap: var(--small-padding);
	}

	.bot-message.user {
		background-color: #FFE9B3;
		--box-shadow-color: #D9C38C;
		margin-left: calc(var(--medium-padding) + var(--small-padding));
	}

	.bot-message.bot {
		background-color: #ebf0ee;
		--box-shadow-color: #9c9c9c;
		margin-right: calc(var(--medium-padding) + var(--small-padding));
	}

	.bot-message .message-side {
		flex-grow: 0;
		display: flex;
		flex-direction: column;
		align-content: center;
		gap: var(--small-padding);
	}

	.bot-message .message-text {
		flex-grow: 1;
		align-self: center;
	}

	.chatbot-avatar {
		width: var(--button-size);
	}

	.chatbot-avatar img {
		width: 100%;
		height: 100%;
	}

	.cursor {
		color: gray;
	}

	p.error {
		color: white;
		background-color: red;
		padding: var(--small-padding);
		border-radius: var(--border-radius)
	}

	.stop-button-container {
		margin-top: var(--small-padding);
		width: 100%;
		display: flex;
		justify-content: end;
	}

	.stop-button {
		background-color: red;
		--box-shadow-color: #d90024;
		display: flex;
		align-items: center;
		color: white;
		gap: var(--small-padding);
		padding: var(--small-padding);
		width: auto;
	}

	/* .stop-button img {
		height: 30px;
		width: 30px;
	} */
</style>
