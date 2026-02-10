import { HttpError } from '$lib/errors';
import type { BackendCategory } from './models/backendCategory';
import type { BackendPost } from './models/backendPost';

export class BackendApi {
	
	
	static readonly API_PREFIX = '/api/backend/v1'; // No trailing slash

	public static async getCategories(): Promise<BackendCategory[]> {
		const response = await fetch(`${BackendApi.API_PREFIX}/post-categories/`);
		if (!response.ok) {
			throw new HttpError({ code: response.status, message: await response.text() });
		}

		return response.json();
	}

	public static async getPosts(): Promise<BackendPost[]> {
		const response = await fetch(`${BackendApi.API_PREFIX}/posts/`);
		if (!response.ok) {
			throw new HttpError({ code: response.status, message: await response.text() });
		}
		return response.json();
	}

	public static async getPost(postId: number): Promise<BackendPost> {
		const response = await fetch(`${BackendApi.API_PREFIX}/posts/${postId}`);
		if (!response.ok) {
			throw new HttpError({ code: response.status, message: await response.text() });
		}
		return response.json();
	}
}
