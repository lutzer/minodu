export type Optional<T> = T | undefined;

export type Language = 'fr' | 'kb';

export type BotMessage = {
	question: string;
	response: string;
	generated: boolean;
};

export enum ForumPostType {
	TEXT,
	AUDIO,
	IMAGE
}
