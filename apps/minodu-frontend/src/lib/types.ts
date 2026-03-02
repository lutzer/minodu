export type Optional<T> = T | undefined;

export type Language = 'fr' | 'kb';

export type BotMessage = {
	text: string;
	type: BotMessageType;
	final: boolean;
	audio?: MultiLanguageString;
};

export type MultiLanguageString = {
	fr: string;
	kb: string;
};

export enum BotMessageType {
	USER,
	BOT
}

export enum ForumPostType {
	TEXT,
	AUDIO,
	IMAGE
}
