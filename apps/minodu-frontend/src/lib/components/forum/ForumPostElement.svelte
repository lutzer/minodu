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
    <h2>{post.author.name}</h2>
    <h3>{post.id} - {post.title}</h3>
    <p>{post.text}</p>
    {#each post.files as file }
        <h4>{file.id} - {file.filename}</h4>
        <p><i>{file.text}</i></p>
    {/each}
    <TextToSpeechButton text={post.text} ttsPlayer={ttsPlayer}/>
    {#if isOwn}
        <button onclick={onDeleteClicked}>Delete</button>
    {/if}
</div>