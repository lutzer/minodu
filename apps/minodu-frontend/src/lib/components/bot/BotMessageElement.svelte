<script lang="ts">
	import { command } from "$app/server";
	import { AiServicesApi } from "$lib/apis/ai_services/api";
	import type { BotMessage, Optional } from "$lib/types";
	import { delay } from "$lib/utils";
	import { onMount, tick } from "svelte";
    import TextToSpeechButton from "../common/TextToSpeechButton.svelte";
    import TextToSpeechPlayer from "../common/TextToSpeechPlayer.svelte";

    export let message : BotMessage
    export let conversation : string
    export let ttsPlayer : TextToSpeechPlayer;

    export let onResponseGenerated : () => void

    let streaming: boolean = false

    let reader : Optional<ReadableStreamDefaultReader<Uint8Array<ArrayBuffer>>> = undefined

    onMount(() => {
        if (!message.generated)
            generateResponse(message.question, conversation);
    })

    export function stop() {
        reader?.cancel()
        streaming = false;
        onResponseGenerated()
    }

    async function generateResponse(question: string, conversation: string) {
        streaming = true

        console.log(conversation)

        let apiResponse = await AiServicesApi.generateRagResponse({
            language: "en",
            conversation: conversation,
            question: question
        })

        reader = apiResponse.body?.getReader();

        if (!reader)
            throw Error("Could not initialize rag response reader");

        const decoder = new TextDecoder();

        while (streaming) {

            const { done, value } = await reader.read();
            if (done) break

            const text = decoder.decode(value, { stream: true });
            message.response += text
            await tick();
            await delay(1)
        }
        message.generated = true
        
        streaming = false
        reader = undefined
        onResponseGenerated()
    }

</script>

<style>
    .cursor {
        animation: blink 1s infinite;
    }
    
    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }
</style>

<div class="bot-message">
    <p>
        {message.question}
        {#if (message.question.length > 0)}
            <TextToSpeechButton text={message.question} ttsPlayer={ttsPlayer}/>
        {/if}
    </p>
    <p>
        {message.response}
        {#if streaming}
            <span class="cursor">|</span>
        {:else if (message.response.length > 0)}
            <TextToSpeechButton text={message.response} ttsPlayer={ttsPlayer}/>
        {/if}
    </p>
    {#if (streaming)}
    <button onclick={stop}>Stop</button>
    {/if}
</div>