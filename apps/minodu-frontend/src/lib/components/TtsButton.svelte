<script lang="ts">
	import { AiServicesApi } from "$lib/apis/ai_services/api";

    export let text : string

    let audioElement : HTMLAudioElement;
    let mediaSource : MediaSource;
    let mediaSourceBuffer : SourceBuffer;

    function initializeMediaSourceBuffer() : Promise<void> {
        mediaSource = new MediaSource();
        audioElement.src = URL.createObjectURL(mediaSource);

        return new Promise((resolve, reject) => {
            mediaSource.addEventListener('sourceopen', () => {
                mediaSourceBuffer = mediaSource.addSourceBuffer('audio/webm; codecs="opus"');

                mediaSourceBuffer.addEventListener('error', (e) => {
                    console.error('SourceBuffer error:', e);
                });

                resolve();
            });
        })
    }

    async function onListenClicked() {
        let response = await AiServicesApi.generateTextToSpeechStream({
            text: text,
            language: "en",
            return_header: true
        })

        const reader = response.body?.getReader();

        if (!reader)
            throw Error("Cant getReader from response.")

        
        await initializeMediaSourceBuffer()

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                console.log("finished");
                break;
            }
            
            // value is a Uint8Array chunk
            console.log("streaming")
            mediaSourceBuffer.appendBuffer(value.buffer)
        }
    }
</script>

<style>
    /* .tts-player {
        display: none;
    } */
</style>

<div>
    <button onclick={() => onListenClicked()}>Listen</button>
    <audio class="tts-player" bind:this={audioElement}></audio>
</div>