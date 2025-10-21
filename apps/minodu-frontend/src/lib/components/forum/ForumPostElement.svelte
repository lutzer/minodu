<script lang="ts">
	import type { ForumPost } from "$lib/apis/forum/models/forumPost";
	import AudioPlayer from "../common/AudioPlayer.svelte";
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
        background-color: lightgray;
    }

    .image {
        height: 500px;
        width: 100%;
    }


    .image > img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
</style>


<div class="post">
    <h3>{post.title} - from {post.author.name}</h3>
    <p>
        {post.text}
        {#if (post.text.length > 0)}
            <TextToSpeechButton text={post.text} ttsPlayer={ttsPlayer}/>
        {/if}
    </p>
    
    <ul>
    {#each post.files as file }
        <li class="file">
        {#if file.content_type.startsWith("audio")}
            <AudioPlayer audioSource={file.file_urlpath}></AudioPlayer>
        {:else if file.content_type.startsWith("image")}
            <div class="image">
                <img src={file.file_urlpath} alt={"forum image"}/>
            </div>
        {:else}
            {file.id} - {file.filename} : {file.file_urlpath}
        {/if}
            <p><i>{file.text}</i></p>
        </li>
    {/each}
    </ul>
    {#if isOwn}
        <button onclick={onDeleteClicked}>Delete</button>
    {/if}
</div>