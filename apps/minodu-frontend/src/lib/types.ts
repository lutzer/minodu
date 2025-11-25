export type Optional<T> = T | undefined;

export type Language = 'fr' | 'en';

export type BotMessage = {
	question: string;
	response: string;
	generated: boolean;
};
