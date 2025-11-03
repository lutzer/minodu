import type { BotMessage } from "./types";

export class Store {

    static readonly FORUM_TOKEN_KEY = "FORUM_AUTH_TOKEN"
    static readonly BOT_HISTORY_KEY = "BOT_MESSAGE_HISTORY"

    public static deleteForumToken() {
        localStorage.removeItem(Store.FORUM_TOKEN_KEY)
    }

    public static saveForumToken(token: string) {
        localStorage.setItem(Store.FORUM_TOKEN_KEY, token);
    }

    public static getForumToken() : string {
        return localStorage.getItem(Store.FORUM_TOKEN_KEY) || "";
    }

    public static saveChatMessages(messages: BotMessage[]) {
        localStorage.setItem(Store.BOT_HISTORY_KEY, JSON.stringify(messages))
    }

    public static getChatMessages() : BotMessage[] {
        return JSON.parse(localStorage.getItem(Store.BOT_HISTORY_KEY) || "[]")
    }

    public static clearChatMessages() {
        localStorage.removeItem(Store.BOT_HISTORY_KEY)
    }
}

