<script lang="ts">
	import type { Optional } from '$lib/types';
    import { onMount } from 'svelte'

    export let streaming : boolean = false;
    export let mediaDeviveAvailable : boolean = true
    
    let prepared : boolean = false;
    let mediaRecorder : MediaRecorder;

    onMount(async () => {
        mediaDeviveAvailable = navigator.mediaDevices?.getUserMedia !== undefined
    })

    async function prepareRecorder() {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        mediaRecorder.ondataavailable = (e) => {
            console.log(e.data)
        }

        mediaRecorder.onstop = () => {
            streaming = false;
        }

        mediaRecorder.onerror = (err) => {
            console.error(err)
        }

        mediaRecorder.onstart = () => {
            streaming = true
        }

        prepared = true;
    }

    export async function startStream() {
        reset()
        if (!prepared) {
            await prepareRecorder()
        }
        mediaRecorder?.start()
    }

    export function stopStream() {
        mediaRecorder?.stop()
    }

    export function reset() {
        mediaRecorder?.stop()
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
    <audio bind:this={audioElement}></audio>
    {#if !mediaDeviveAvailable}
    <input 
        bind:this={fileInput}
        type="file" 
        accept="audio/*" 
        capture="environment"
        onchange={(e) => handleCapture(e)}
        style="display: none;">
    {/if}
</div>
