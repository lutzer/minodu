<script lang="ts">
	import type { ForumPost } from "$lib/apis/forum/models/forumPost";
    import TextToSpeechButton from "../common/TextToSpeechButton.svelte";
	import TextToSpeechPlayer from "../common/TextToSpeechPlayer.svelte";

    export let ttsPlayer : TextToSpeechPlayer
    export let post : ForumPost 
    export let isOwn : boolean
    export let onDeleteClicked: () => {}

</script>

<style>
    .post {
        padding: 10px;
        margin: 10px;
        background-color: lightpink;
    }
</style>


<div class="post">
    <p>{post.id} - {post.title} : {post.text}</p>
    <TextToSpeechButton text={post.text} ttsPlayer={ttsPlayer}/>
    {#if isOwn}
        <button onclick={onDeleteClicked}>Delete</button>
    {/if}
</div>