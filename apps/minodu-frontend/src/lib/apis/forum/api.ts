import type { ForumPost } from "./models/forumPost";
import { HttpError } from "$lib/errors";

export class ForumApi {
    static readonly FORUM_API_PREFIX = "/api/forum"  // No trailing slash

    public static async getPosts(): Promise<ForumPost[]> {
        const response = await fetch(`${ForumApi.FORUM_API_PREFIX}/posts/`);
        if (!response.ok) {
            throw new HttpError({ code: response.status, message: await response.text()});
        }
        return response.json();
    }
}