<script lang="ts">
	import type { ForumPost } from "$lib/apis/forum/models/forumPost";
	import TtsButton from "../TtsButton.svelte";
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
    <TtsButton text={post.text}/>
    {#if isOwn}
        <button onclick={() => onDeleteClicked()}>Delete</button>
    {/if}
</div>