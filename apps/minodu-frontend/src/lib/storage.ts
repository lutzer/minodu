import type { BotMessage, Language, Optional } from './types';

export class Storage {
	static readonly FORUM_TOKEN_KEY = 'FORUM_AUTH_TOKEN';
	static readonly BOT_HISTORY_KEY = 'BOT_MESSAGE_HISTORY';
	static readonly FORUM_POST_TEXT_KEY = 'FORUM_POST_TEXT';
	static readonly LANGUAGE_KEY = 'APP_LANGUAGE';

	public static set forumToken(token: Optional<string>) {
		if (token) localStorage.setItem(Storage.FORUM_TOKEN_KEY, token);
		else localStorage.removeItem(Storage.FORUM_TOKEN_KEY);
	}

	public static get forumToken(): string {
		return localStorage.getItem(Storage.FORUM_TOKEN_KEY) || '';
	}

	public static set chatMessages(messages: Optional<BotMessage[]>) {
		if (messages) localStorage.setItem(Storage.BOT_HISTORY_KEY, JSON.stringify(messages));
		else localStorage.removeItem(Storage.BOT_HISTORY_KEY);
	}

	public static get chatMessages(): BotMessage[] {
		return JSON.parse(localStorage.getItem(Storage.BOT_HISTORY_KEY) || '[]');
	}

	public static get forumPostText(): string {
		return localStorage.getItem(Storage.FORUM_POST_TEXT_KEY) || '';
	}

	public static set forumPostText(text: string) {
		localStorage.setItem(Storage.FORUM_POST_TEXT_KEY, text);
	}

	public static get language(): Language {
		return localStorage.getItem(Storage.LANGUAGE_KEY) === 'kb' ? 'kb' : 'fr';
	}

	public static set language(lang: Language) {
		localStorage.setItem(Storage.LANGUAGE_KEY, lang);
	}
}
