<script lang="ts">
	import type { Optional } from '$lib/types';
    import { onMount } from 'svelte'

    export let blob : Optional<Blob>

    $: {
        if (!blob) {
            reset()
        }
    }

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
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        mediaRecorder.ondataavailable = (e) => media.push(e.data)

        mediaRecorder.onstop = () => {
            recording = false;
            blob = new Blob(media, {'type' : mediaRecorder.mimeType });
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

    async function startRecording() {
        reset()
        if (!prepared) {
            await prepareRecorder()
        }
        mediaRecorder?.start()
    }

    function stopRecording() {
        mediaRecorder?.stop()
    }

    function reset() {
        mediaRecorder?.stop()
        blob = undefined
        media = []
        if (audioElement) {
            audioElement.src = ""
        }
    }

    function startPlayback() {
        audioElement?.play()
    }

    function pausePlayback() {
        audioElement?.pause()
    }

    function stopPlayback() {
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
        <button on:click={startRecording} disabled={blob !== undefined}>Record</button>
    {:else}
        <button on:click={stopRecording}>Stop</button>
    {/if}
    <button on:click={reset} disabled={blob === undefined}>Reset</button>
    <button on:click={startPlayback} disabled={blob === undefined}>Play</button>
</div>
