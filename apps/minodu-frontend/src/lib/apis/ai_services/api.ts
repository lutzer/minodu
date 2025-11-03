import { HttpError } from "$lib/errors";
import type { Language, Optional } from "$lib/types";

type TtsRequest = {
    text: string,
    language: Language
    return_header: Optional<boolean>
    format: "mp3" | "wav"
}

type CreatePostRequest = {
    title: string
    text: string
}

type RagRequest = {
    conversation: string
    question: string
    language: Language
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

    public static async generateRagResponse(request: RagRequest) : Promise<Response> {
        const response = await fetch(`${AiServicesApi.API_PREFIX}/rag/ask`, {
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