import type { BotMessage, Optional } from './types';

export class Store {
	static readonly FORUM_TOKEN_KEY = 'FORUM_AUTH_TOKEN';
	static readonly BOT_HISTORY_KEY = 'BOT_MESSAGE_HISTORY';

	public static set forumToken(token: Optional<string>) {
		if (token) localStorage.setItem(Store.FORUM_TOKEN_KEY, token);
		else localStorage.removeItem(Store.FORUM_TOKEN_KEY);
	}

	public static get forumToken(): string {
		return localStorage.getItem(Store.FORUM_TOKEN_KEY) || '';
	}

	public static set chatMessages(messages: Optional<BotMessage[]>) {
		if (messages) localStorage.setItem(Store.BOT_HISTORY_KEY, JSON.stringify(messages));
		else localStorage.removeItem(Store.BOT_HISTORY_KEY);
	}

	public static get chatMessages(): BotMessage[] {
		return JSON.parse(localStorage.getItem(Store.BOT_HISTORY_KEY) || '[]');
	}
}
