import { HttpError } from "$lib/errors";
import type { Optional } from "$lib/types";

type TtsRequest = {
    text: string,
    language: string
    return_header: boolean
}

type CreatePostRequest = {
    title: string
    text: string
}

export class AiServicesApi {
    static readonly API_PREFIX = "/api/services"  // No trailing slash

    public static async generateTextToSpeechStream(request : TtsRequest): Promise<Response> {
        const response = await fetch(`${AiServicesApi.API_PREFIX}/tts/synthesize`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request)
        });
        if (!response.ok) {
            throw new HttpError({ code: response.status, message: await response.text()});
        }
        return response
    }

}