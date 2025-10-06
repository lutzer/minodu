<script lang="ts">
	import { AiServicesApi } from "$lib/apis/ai_services/api";
	import type { Optional } from "$lib/types";
    import { writable } from 'svelte/store';

    export const playbackReset = writable<{ timestamp: number } | null>(null);

    let audioElement : HTMLAudioElement;
    let mediaSource : Optional<MediaSource>;
    let mediaSourceBuffer : Optional<SourceBuffer>;
    let audioQueue: ArrayBuffer[] = [];
    
    export async function speak(text: string) {

        cleanup()

        let response = await AiServicesApi.generateTextToSpeechStream({
                text: text,
                language: "en",
                format: "mp3",
                return_header: false
        })

        const reader = response.body?.getReader();

        if (!reader)
            throw Error("Could not initialize audio response reader");

        mediaSource = new MediaSource();
        audioElement.src = URL.createObjectURL(mediaSource);


        mediaSource.addEventListener('error', (e) => {
            console.error('MediaSource error:', e);
        });

        mediaSource.addEventListener('sourceopen', function () {
            mediaSourceBuffer = this.addSourceBuffer('audio/mpeg');


            mediaSourceBuffer.addEventListener('updateend', () => {
                processQueue()
            });

            mediaSourceBuffer.addEventListener('error', (e) => {
                console.error('SourceBuffer error:', e);
            });

            processQueue()
        })

        function processQueue() {
            if (!mediaSourceBuffer || mediaSourceBuffer.updating)
                return;

            if (audioQueue.length > 0) {
                mediaSourceBuffer.appendBuffer(audioQueue.shift()!);
            }
        }

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                mediaSource.endOfStream();
                break;
            }
            audioQueue.push(value.buffer);
            processQueue();
        }
    }

    function cleanup() {
        if (audioElement) {
            audioElement.pause();
            URL.revokeObjectURL(audioElement.src)
            audioElement.src = "";
        }
        
        if (mediaSource && mediaSource.readyState !== 'closed') {
            try {
                mediaSource.endOfStream();
            } catch (e) {
                console.warn('Error ending MediaSource stream:', e);
            }
            mediaSource = undefined;
        }

        mediaSourceBuffer = undefined;

        playbackReset.set({ timestamp: Date.now() });
    }
</script>

<style>
    .tts-player {
        display: none;
    }
</style>

<div>
    <audio 
        class="tts-player" 
        bind:this={audioElement} 
        onended={cleanup} 
        autoplay 
        controls>
    </audio>
</div>