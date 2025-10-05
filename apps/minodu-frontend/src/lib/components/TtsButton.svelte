<script lang="ts">
	import { AiServicesApi } from "$lib/apis/ai_services/api";
    export let text : string

    let audioElement : HTMLAudioElement;
    let mediaSource : MediaSource;
    let mediaSourceBuffer : SourceBuffer;
    let mediaSourceBufferUpdating : boolean = false
    let audioQueue: ArrayBuffer[] = [];

    function initializeMediaSourceBuffer() : Promise<void> {
        mediaSource = new MediaSource();
        audioElement.src = URL.createObjectURL(mediaSource);

        mediaSource.addEventListener('error', (e) => {
            console.error('MediaSource error:', e);
        });

        return new Promise((resolve, reject) => {
            mediaSource.addEventListener('sourceopen', function () {
                mediaSourceBuffer = this.addSourceBuffer('audio/mpeg');

                mediaSourceBuffer.addEventListener('updateend', () => {
                    mediaSourceBufferUpdating = false;
                    processQueue();
                });

                mediaSourceBuffer.addEventListener('error', (e) => {
                    console.error('SourceBuffer error:', e);
                });

                resolve();
            });
        })
    }

    function processQueue() {

        if (mediaSourceBufferUpdating || !mediaSourceBuffer)
            return;

        if (audioQueue.length > 0) {
            mediaSourceBufferUpdating = true;

            // Use shift() to process chunks in correct order
            const chunk = audioQueue.shift()!;
            mediaSourceBuffer.appendBuffer(chunk);
        }
    }

    async function onListenClicked() {






        try {
            // Clear any existing queue
            audioQueue = [];
            
            let response = await AiServicesApi.generateTextToSpeechStream({
                text: text,
                language: "en",
                format: "mp3",
                return_header: false
            })

        const reader = response.body?.getReader();



            if (!reader)
                throw Error("Cant getReader from response.")


            await initializeMediaSourceBuffer();






            let streamFinished = false;
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    streamFinished = true;
                    break;
                }
                audioQueue.push(value.buffer);
                processQueue();
            }


            
            // Wait for all pending audio chunks to be processed before ending stream
            await waitForQueueEmpty();
            
            // Wait a bit longer to ensure all audio is properly buffered
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Now it's safe to end the stream
            if (mediaSource && mediaSource.readyState === 'open') {
                mediaSource.endOfStream();
            }
        } catch (error) {
            console.error('Error in TTS playback:', error);
        }
    }
    
    // Helper function to wait for the audio queue to be empty
    function waitForQueueEmpty(): Promise<void> {
        return new Promise((resolve) => {
            const checkQueue = () => {
                if (audioQueue.length === 0 && !mediaSourceBufferUpdating) {
                    resolve();
                } else {
                    setTimeout(checkQueue, 10);
                }
            };
            checkQueue();
        });
    }
</script>

<style>
    .tts-player {
        display: none;
    }
</style>

<div>
    <button onclick={() => onListenClicked()}>Listen</button>
    <audio class="tts-player" bind:this={audioElement} autoplay controls></audio>
</div>