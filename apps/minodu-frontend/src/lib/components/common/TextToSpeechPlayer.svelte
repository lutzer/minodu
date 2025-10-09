<script lang="ts">
	import { AiServicesApi } from "$lib/apis/ai_services/api";
	import type { Optional } from "$lib/types";
    import { writable } from 'svelte/store';

    export const playbackReset = writable<{ timestamp: number } | null>(null);

    // let audioElement : HTMLAudioElement;
    // let mediaSource : Optional<MediaSource>;
    // let mediaSourceBuffer : Optional<SourceBuffer>;
    // let audioQueue: ArrayBuffer[] = [];

    type StreamingPlayer = {
        audioElement: HTMLAudioElement
        mediaSource: MediaSource
        sourceBuffer: Optional<SourceBuffer>
        streamReader: ReadableStreamDefaultReader<Uint8Array<ArrayBuffer>>
    }

    let streamingPlayers : StreamingPlayer[] = []

    export async function stop() {
        playbackReset.set({timestamp: Date.now()})

        streamingPlayers.forEach((p) => {
            p.streamReader.cancel()

            p.audioElement.removeEventListener("ended", onMediaEnded)
            p.audioElement.pause();

            if (p.mediaSource.readyState === 'open') {
                 if (p.sourceBuffer && p.sourceBuffer) {
                    p.sourceBuffer.abort()
                    p.mediaSource.removeSourceBuffer(p.sourceBuffer)
                }

                p.mediaSource.endOfStream();
            }   

            p.audioElement.removeAttribute('src');
            URL.revokeObjectURL(p.audioElement.src);
        })
        streamingPlayers = []
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

        var streamingPlayer : StreamingPlayer = {
            audioElement : player,
            mediaSource: mediaSource,
            sourceBuffer: undefined,
            streamReader: reader
        }

        streamingPlayers.push(streamingPlayer)

        mediaSource.addEventListener('error', (e) => {
            console.error('MediaSource error:', e);
        });

        mediaSource.addEventListener('sourceopen', function () {
            mediaSourceBuffer = this.addSourceBuffer('audio/mpeg');
            streamingPlayer.sourceBuffer = mediaSourceBuffer

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