<script lang="ts">
	import { onMount } from "svelte";
    import TextToSpeechPlayer from "./TextToSpeechPlayer.svelte";

    export let ttsPlayer : TextToSpeechPlayer
    export let text: string

    let playing = false

    onMount(() => {
        ttsPlayer.playbackReset.subscribe(() => {
            playing = false;
        });
    })
    
    function handleClick() {
        if (!playing) {
            ttsPlayer.speak(text)
            playing = true
        } else {
            ttsPlayer.stop()
        }
    }
</script>

<div>
    <button 
        onclick={handleClick}>{playing ? "Stop" : "Listen"}</button>
</div>