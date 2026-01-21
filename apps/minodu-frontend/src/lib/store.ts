import type { BotMessage, Language, Optional } from './types';

export class Store {
	static readonly FORUM_TOKEN_KEY = 'FORUM_AUTH_TOKEN';
	static readonly BOT_HISTORY_KEY = 'BOT_MESSAGE_HISTORY';
	static readonly APP_LANGUAGE_KEY = 'APP_LANGUAGE';
	static readonly FORUM_POST_TEXT_KEY = 'FORUM_POST_TEXT';

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

	public static set language(language: Language) {
		localStorage.setItem(Store.APP_LANGUAGE_KEY, language);
	}

	public static get language(): Language {
		return localStorage.getItem(Store.APP_LANGUAGE_KEY) == 'kb' ? 'kb' : 'fr';
	}

	public static get forumPostText(): string {
		return localStorage.getItem(Store.FORUM_POST_TEXT_KEY) || '';
	}

	public static set forumPostText(text: string) {
		localStorage.setItem(Store.FORUM_POST_TEXT_KEY, text);
	}
}
