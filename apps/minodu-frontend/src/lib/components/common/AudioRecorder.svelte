<script lang="ts">
    import { onMount } from 'svelte'

    let media : Blob[] = [];
    let mediaRecorder : MediaRecorder;
    let audioElement : HTMLAudioElement;

    let recording : boolean = false;
    let prepared : boolean = false;

    function isPlaying() : boolean {
        return !audioElement?.paused || false
    }

    async function prepareRecorder() {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (e) => media.push(e.data)

        mediaRecorder.onstop = () => {
            recording = false;
            const blob = new Blob(media, {'type' : 'audio/ogg; codecs=opus' });
            audioElement.src = URL.createObjectURL(blob);
            media = []
        }

        mediaRecorder.onerror = (err) => {
            console.error(err)
        }

        mediaRecorder.onstart = () => {
            recording = true
        }

        prepared = true;
    }

    function loadMedia() {
        
    }

    export async function startRecording() {
        if (!prepared) {
            await prepareRecorder()
        }
        reset()
        mediaRecorder?.start()
    }

    export function stopRecording() {
        mediaRecorder?.stop()
    }

    export function reset() {
        mediaRecorder?.stop()
        media = []
        if (audioElement) {
            audioElement.src = ""
        }
    }

    export function startPlayback() {
        audioElement?.play()
    }

    export function pausePlayback() {
        audioElement?.pause()
    }

    export function stopPlayback() {
        if (audioElement) {
            audioElement.currentTime = 0;
            audioElement.pause()
        }
    }

</script>

<style>
    .audio-recorder {
        text-align: center;
    }
    audio {
        display: block;
        padding-bottom: 10px;
    }
</style>

<div class="audio-recorder">
    <audio bind:this={audioElement} controls></audio>
    {#if !recording}
        <button on:click={startRecording}>Record</button>
    {:else}
        <button on:click={stopRecording}>Stop</button>
    {/if}
    <button on:click={reset}>Reset</button>
    <button on:click={startPlayback}>Play</button>
</div>
