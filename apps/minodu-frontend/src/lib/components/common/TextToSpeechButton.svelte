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
        ttsPlayer.speak(text)
        playing = true
    }
</script>

<div>
    <button 
        onclick={handleClick}
        disabled={playing}>Listen</button>
</div>