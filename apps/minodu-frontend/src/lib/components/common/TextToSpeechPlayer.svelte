<script lang="ts">
	import { AiServicesApi } from "$lib/apis/ai_services/api";
	import type { Optional } from "$lib/types";
    import { writable } from 'svelte/store';

    export const playbackReset = writable<{ timestamp: number } | null>(null);

    let cleanupQueue : { cleanup : () => void }[] = []

    export async function stop() {
        playbackReset.set({timestamp: Date.now()})

        cleanupQueue.forEach(element => {
            element.cleanup()
        });
    }
    
    export async function speak(text: string) {

        stop()

        let response = await AiServicesApi.generateTextToSpeechStream({
            text: text,
            language: "en",
            format: "mp3",
            return_header: false
        })

        const reader = response.body?.getReader();
        
        if (!reader)
            throw Error("Could not initialize audio response reader");


        let player = new Audio();

        player.addEventListener("ended", onMediaEnded)

        let mediaSource = new MediaSource();
        let mediaSourceBuffer : SourceBuffer 
        let audioQueue : ArrayBuffer[] = [];

        player.src = URL.createObjectURL(mediaSource);
        player.play()

        mediaSource.addEventListener('error', (e) => {
            console.error('MediaSource error:', e);
        });

        mediaSource.addEventListener('sourceopen', handleSourceOpened)

        function handleSourceOpened() {
            if (player.paused)
                return
            mediaSourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');

            mediaSourceBuffer.addEventListener('updateend', () => {
                processQueue()
            });

            mediaSourceBuffer.addEventListener('error', (e) => {
                console.error('SourceBuffer error:', e);
            });

            processQueue()
        }

        function processQueue() {
            if (!mediaSourceBuffer || mediaSourceBuffer.updating)
                return;

            if (audioQueue.length > 0) {
                mediaSourceBuffer.appendBuffer(audioQueue.shift()!);
            }
        }

        function cleanup() {
            reader?.cancel()

            player.removeEventListener("ended", onMediaEnded)
            player.pause();

            mediaSource.removeEventListener('sourceopen', handleSourceOpened)

            if (mediaSource.readyState === 'open') {

                mediaSourceBuffer?.abort()
                 if (mediaSourceBuffer) {
                    mediaSource.removeSourceBuffer(mediaSourceBuffer)
                }
                mediaSource.endOfStream();
            }   

            player.removeAttribute('src');
            URL.revokeObjectURL(player.src);
        }

        cleanupQueue.push({ cleanup: cleanup });

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                if (mediaSource.readyState === 'open')
                    mediaSource.endOfStream();
                break;
            }
            audioQueue.push(value.buffer);
            processQueue();
        }
    }

    function onMediaEnded() {
        playbackReset.set({timestamp: Date.now()})
    }
    
</script>