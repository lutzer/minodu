<script lang="ts">
	import { BotMessageType, type BotMessage, type Optional } from '$lib/types';
	import TextToSpeechButton from '../common/TextToSpeechButton.svelte';
	import TextToSpeechPlayer from '../common/TextToSpeechPlayer.svelte';
	import { language } from '$lib/stores';
	import { t } from '$lib/translations';

	import botAvatarImage from '$lib/assets/chatbot-avatar.png';
	import crossIcon from '$lib/assets/cross_icon_white.png';
	import AudioPlayer from '../common/AudioPlayer.svelte';
	import LoadingSpinner from '../common/LoadingSpinner.svelte';

	export let message: BotMessage;
	export let ttsPlayer: TextToSpeechPlayer;
	export let onCancelResponse: () => void;

	$: isError = message.type == BotMessageType.BOT && message.text.trimStart().startsWith('[ERROR:');
</script>

<div class="bot-message shadow {message.type == BotMessageType.USER ? 'user' : 'bot'}">
	{#if message.type == BotMessageType.USER}
		<div class="message-text">
			<h3>{t('chatbot.you', $language)}</h3>
			<p>{message.text}</p>
		</div>
		<div class="message-side">
			<TextToSpeechButton text={message.text} {ttsPlayer} />
		</div>
	{:else}
		<div class="message-side">
			<div class="chatbot-avatar">
				<img src={botAvatarImage} alt={t('alt.chatbotIcon', $language)} />
			</div>
			{#if message.final}
				<TextToSpeechButton text={message.text} {ttsPlayer} />
			{/if}
		</div>
		<div class="message-text">
			<h3>{t('chatbot.botName', $language)}</h3>
			{#if message.audio && $language}
				<div class="audio-player">
					<AudioPlayer audioSource={message.audio[$language]} />
				</div>
			{/if}
			{#if message.text.length == 0}
				<div class="spinner">
					<LoadingSpinner fullscreen={false} />
				</div>
			{:else}
				<p class={isError ? 'error' : ''}>
					{message.text}
					{#if !message.final}
						<span class="cursor">...</span>
					{/if}
				</p>
			{/if}
			{#if !message.final}
				<div class="stop-button-container">
					<button class="stop-button small shadow" onclick={onCancelResponse}>
						<img src={crossIcon} alt={t('chatbot.cancelButton', $language)}/>
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
		background-color: #ffe9b3;
		--box-shadow-color: #d9c38c;
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
		border-radius: var(--border-radius);
		white-space: normal;
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

	.audio-player {
		padding: var(--small-padding) 0;
	}

	.spinner {
		margin: calc(2 * var(--medium-padding)) 0;
	}

	/* .stop-button img {
		height: 30px;
		width: 30px;
	} */
</style>
