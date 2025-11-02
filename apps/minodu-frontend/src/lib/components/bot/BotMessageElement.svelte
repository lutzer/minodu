<script lang="ts">
	import { AiServicesApi } from "$lib/apis/ai_services/api";
	import type { Optional } from "$lib/types";
	import { onMount } from "svelte";

    export let message : BotMessage

    export let onResponseGenerated : () => void

    let reader : Optional<ReadableStreamDefaultReader<Uint8Array<ArrayBuffer>>> = undefined

    onMount(() => {
        if (!message.generated)
            generateResponse(message.question);
    })

    export function stop() {
        reader?.cancel()
        reader = undefined
        message.generated = true
        onResponseGenerated()
    }

    async function generateResponse(question: string) {
        let apiResponse = await AiServicesApi.generateRagResponse({
            language: "en",
            conversation: "",
            question: question
        })

        reader = apiResponse.body?.getReader();

        if (!reader)
            throw Error("Could not initialize rag response reader");

        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break

            const text = decoder.decode(value, { stream: true });
            message.response += text;
        }
        reader = undefined
        message.generated = true
        onResponseGenerated()
    }

</script>

<div class="bot-message">
    <p>
        {message.question}
    </p>
    <p>
        {message.response}
    </p>

</div>