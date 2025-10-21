<script lang="ts">
    import type { ForumAuthor } from '$lib/apis/forum/models/forumAuthor.ts';
	import type { Optional } from '$lib/types';
	import AudioRecorder from '../common/AudioRecorder.svelte';
	import ForumImagePicker from './ForumImagePicker.svelte';
    
    export let author: Optional<ForumAuthor>
    export let onCreateAuthorClicked: () => {}
    export let onLogoutAuthorClicked: () => {}
    export let onSubmitPostClicked: (title: string, text: string, audio : Optional<Blob>, image : Optional<File>) => {}

    let title : string = ""
    let text : string = ""
    let audio : Optional<Blob>
    let image : Optional<File>

    let submitEnabled: boolean = false

    $ : {
        submitEnabled = (title.length >= 3 && text.length >= 3) 
            || audio != undefined 
            || image != undefined
    }

    export function reset() {
        title = ""
        text = ""
        audio = undefined
        image = undefined
    }

</script>

<style>
    .forum-input-container {
        display: flex; 
    }

    .input-block {
        background-color: lightgray;
        margin: 10px;
        padding: 10px;
    }

    .author {
        width: 100px;
        text-align: center;
    }

    .text-input {
    }

    .audio-input {
    }

</style>

<div class="forum-input-container">
    <div class="author input-block">
    {#if (author != undefined)}
        <h4>{author.name}</h4>
        <p>{author.avatar}</p>
        <button onclick={onLogoutAuthorClicked}>logout</button>
    {:else}
        <button onclick={onCreateAuthorClicked}>Create Author</button>
    {/if}
    </div>
    <div class="text-input input-block">
        <div class="input">
            <label for="title">Title</label>
            <input id="title" type="text" bind:value={title}/>
        </div>
        <div class="input">
            <label for="text">Text</label>
            <textarea id="text" bind:value={text} disabled={author == undefined}></textarea>
        </div>
    </div>
    <div class="audio-input input-block">
        <AudioRecorder bind:blob={audio}></AudioRecorder>
    </div>
    <div class="input-block">
        <ForumImagePicker bind:image={image}/>
    </div>
    <div class="submit input-block">
        <button onclick={() => onSubmitPostClicked(title, text, audio, image)} 
            disabled={!submitEnabled}>Submit</button>
    </div>
</div>

