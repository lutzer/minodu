export type Optional<T> = T | undefined;

export type Language = 'fr' | 'kb';

export type BotMessage = {
	text: string;
	type: BotMessageType;
};

export enum BotMessageType{
	USER, BOT_GENERATING, BOT_FINISHED
}

export enum ForumPostType {
	TEXT,
	AUDIO,
	IMAGE
}
