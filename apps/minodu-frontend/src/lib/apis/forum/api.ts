import type { ForumPost } from "./models/forumPost";
import { HttpError } from "$lib/errors";
import type { ForumAvatar } from "./models/fromAvatar";
import type { ForumAuthor } from "./models/forumAuthor";
import type { Optional } from "$lib/types";

type CreateAuthorRequest = {
    name: string,
    avatar: number | undefined
}

type CreatePostRequest = {
    title: string
    text: string
}

export class ForumApi {
    static readonly API_PREFIX = "/api/forum"  // No trailing slash
    static readonly LOCAL_STORAGE_TOKEN_KEY = "FORUM_AUTH_TOKEN"

    public static async getPosts(): Promise<ForumPost[]> {
        const response = await fetch(`${ForumApi.API_PREFIX}/posts/`);
        if (!response.ok) {
            throw new HttpError({ code: response.status, message: await response.text()});
        }
        return response.json();
    }

    public static async createAuthor(request: CreateAuthorRequest) : Promise<{id: number, token: string}> {
        const response = await fetch(`${ForumApi.API_PREFIX}/authors/create`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request)
        })
        if (!response.ok) {
            throw new HttpError({ code: response.status, message: await response.text()});
        }
        return response.json();
    }

    public static async createPost(request: CreatePostRequest) {
        const response = await fetch(`${ForumApi.API_PREFIX}/posts/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ForumApi.getToken()}`
            },
            body: JSON.stringify(request)
        })
        if (!response.ok) {
            throw new HttpError({ code: response.status, message: await response.text()});
        }
    }

    public static async deletePost(id: number) {
        const response = await fetch(`${ForumApi.API_PREFIX}/posts/${id}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ForumApi.getToken()}`
            }
        })
        if (!response.ok) {
            throw new HttpError({ code: response.status, message: await response.text()});
        }
    }

    public static async getAvatars() : Promise<ForumAvatar[]> {
        const response = await fetch(`${ForumApi.API_PREFIX}/avatars/`)
        if (!response.ok) {
            throw new HttpError({ code: response.status, message: await response.text()});
        }
        return response.json();
        
    }

    public static deleteToken() {
        localStorage.removeItem(ForumApi.LOCAL_STORAGE_TOKEN_KEY)
    }

    public static saveToken(token: string) {
        localStorage.setItem(ForumApi.LOCAL_STORAGE_TOKEN_KEY, token);
    }

    public static getToken() : string {
        return localStorage.getItem(ForumApi.LOCAL_STORAGE_TOKEN_KEY) || "";
    }

    public static async checkToken(token: string = ForumApi.getToken()) : Promise<Optional<ForumAuthor>> {
        if (!token) {
            return undefined
        } else {
            const response = await fetch(`${ForumApi.API_PREFIX}/login/`, {
                headers: new Headers({ "Authorization": `Bearer ${token}` }), 
            })
            return response.ok ? response.json() : undefined
        }
    }
}