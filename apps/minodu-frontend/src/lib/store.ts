import type { BotMessage, Language, Optional } from './types';

export class Store {
	static readonly FORUM_TOKEN_KEY = 'FORUM_AUTH_TOKEN';
	static readonly BOT_HISTORY_KEY = 'BOT_MESSAGE_HISTORY';
	static readonly FORUM_POST_TEXT_KEY = 'FORUM_POST_TEXT';
	static readonly LANGUAGE_KEY = 'APP_LANGUAGE';

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

	public static get forumPostText(): string {
		return localStorage.getItem(Store.FORUM_POST_TEXT_KEY) || '';
	}

	public static set forumPostText(text: string) {
		localStorage.setItem(Store.FORUM_POST_TEXT_KEY, text);
	}

	public static get language(): Language {
		return localStorage.getItem(Store.LANGUAGE_KEY) === 'kb' ? 'kb' : 'fr';
	}

	public static set language(lang: Language) {
		localStorage.setItem(Store.LANGUAGE_KEY, lang);
	}
}
