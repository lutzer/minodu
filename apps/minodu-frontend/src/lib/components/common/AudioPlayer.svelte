<script lang="ts">
    export let audioSource : string;
    let audioElement : HTMLAudioElement;

    function startPlayback() {
        audioElement?.play()
    }

    function pausePlayback() {
        audioElement?.pause()
    }


</script>

<div class="audio-player">
    <audio bind:this={audioElement} src={audioSource} controls></audio>
</div>