import { HttpError } from '$lib/errors';
import type { Language, Optional } from '$lib/types';
import { mimeTypeToFileExtension } from '$lib/utils';

type TtsRequest = {
	text: string;
	language: Language;
	return_header: Optional<boolean>;
	format: 'mp3' | 'wav';
};

type RagRequest = {
	conversation: string;
	question: string;
	language: Language;
	source_id?: number;
};

type TtsRespone = {
	text: string;
	confidence: number;
};

type DocumentSummaryResponse = {
	source_id: number;
	summary: string | null;
};

type WelcomeResponse = {
	text: string;
};

export class AiServicesApi {
	static readonly API_PREFIX = '/api/services'; // No trailing slash

	public static async generateTextToSpeechStream(request: TtsRequest): Promise<Response> {
		const response = await fetch(`${AiServicesApi.API_PREFIX}/tts/synthesize`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(request)
		});
		if (!response.ok) {
			throw new HttpError({ code: response.status, message: await response.text() });
		}
		return response;
	}

	public static async generateRagResponse(request: RagRequest): Promise<Response> {
		const response = await fetch(`${AiServicesApi.API_PREFIX}/rag/ask`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(request)
		});

		if (!response.ok)
			throw new HttpError({ code: response.status, message: await response.text() });

		return response;
	}

	public static async transcribeSpeech(audioFile: Blob, language: Language): Promise<TtsRespone> {
		const extension = mimeTypeToFileExtension(audioFile.type);
		if (extension == '') throw Error('File type not supported: ' + audioFile.type);

		const formData = new FormData();
		formData.append('file', audioFile, 'file' + extension);
		formData.append('language', language);

		const response = await fetch(`${AiServicesApi.API_PREFIX}/stt/transcribe`, {
			method: 'POST',
			body: formData
		});
		if (!response.ok) {
			throw new HttpError({ code: response.status, message: await response.text() });
		}
		return await response.json();
	}

	public static async getDocumentSummary(
		language: Language,
		sourceId: number
	): Promise<DocumentSummaryResponse> {
		const response = await fetch(
			`${AiServicesApi.API_PREFIX}/rag/documents/${language}/${sourceId}/summary`
		);
		if (!response.ok) {
			throw new HttpError({ code: response.status, message: await response.text() });
		}
		return await response.json();
	}

	public static async getWelcomeMessage(
		language: Language,
		sourceId?: number
	): Promise<WelcomeResponse> {
		const url =
			sourceId !== undefined
				? `${AiServicesApi.API_PREFIX}/rag/welcome/${language}/${sourceId}/`
				: `${AiServicesApi.API_PREFIX}/rag/welcome/${language}/`;
		const response = await fetch(url);
		if (!response.ok) {
			throw new HttpError({ code: response.status, message: await response.text() });
		}
		return await response.json();
	}

	public static async getWelcomeMessageStream(
		language: Language,
		sourceId?: number
	): Promise<Response> {
		const url =
			sourceId !== undefined
				? `${AiServicesApi.API_PREFIX}/rag/welcome/${language}/${sourceId}/stream`
				: `${AiServicesApi.API_PREFIX}/rag/welcome/${language}/stream`;
		const response = await fetch(url);
		if (!response.ok) {
			throw new HttpError({ code: response.status, message: await response.text() });
		}
		return response;
	}
}
