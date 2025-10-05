<script lang="ts">
    import type { ForumAuthor } from '$lib/apis/forum/models/forumAuthor.ts';
	import type { Optional } from '$lib/types';
    
    export let author: Optional<ForumAuthor>
    export let onCreateAuthorClicked: () => {}
    export let onLogoutAuthorClicked: () => {}
    export let onSubmitPostClicked: (title: string, text: string) => {}

    let title : string = ""
    let text : string = ""
</script>

<style>
    .forum-input-container {
        display: flex;
    }

    .author {
        background-color: lightgray;
        margin: 10px;
        padding: 10px;
        width: 100px;
        text-align: center;
    }

    .post-input {
        background-color: lightgray;
        margin: 10px;
        padding: 10px;
    }
</style>

<div class="forum-input-container">
    <div class="author">
    {#if (author != undefined)}
        <h4>{author.name}</h4>
        <p>{author.avatar}</p>
        <button onclick={onLogoutAuthorClicked}>logout</button>
    {:else}
        <button onclick={onCreateAuthorClicked}>Create Author</button>
    {/if}
    </div>
    <div class="post-input">
        <div class="input">
            <label for="title">Title</label>
            <input id="title" type="text" bind:value={title}/>
        </div>
        <div class="input">
            <label for="text">Text</label>
            <textarea id="text" bind:value={text} disabled={author == undefined}></textarea>
        </div>
        <button onclick={() => onSubmitPostClicked(title, text)} 
            disabled={author == undefined || text.length < 1 || title.length < 1}>Submit</button>
    </div>
</div>

