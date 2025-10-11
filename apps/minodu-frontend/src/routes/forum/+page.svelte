<script lang="ts">
    import { onMount } from 'svelte';
    import { ForumApi } from '$lib/apis/forum/api';
	import type { ForumPost } from '$lib/apis/forum/models/forumPost';
	import AuthorCreateDialog from '$lib/components/forum/AuthorCreateDialog.svelte';
	import type { ForumAuthor } from '$lib/apis/forum/models/forumAuthor';
	import type { Optional } from '$lib/types';
	import ForumPostElement from '$lib/components/forum/ForumPostElement.svelte';
	import ForumInputElement from '$lib/components/forum/ForumInputElement.svelte';
	import TextToSpeechPlayer from '$lib/components/common/TextToSpeechPlayer.svelte';
	import { json } from '@sveltejs/kit';
  
    let createAuthorDialog : AuthorCreateDialog;
    let ttsPlayer : TextToSpeechPlayer;
    let forumInputElement : ForumInputElement;

    let posts : ForumPost[] = []
    let author : Optional<ForumAuthor> = undefined

    let events : EventSource

    onMount(async () => {
        update()

        events = ForumApi.getEventSource()
        events.onmessage = (msg) => {
            try {
                let data = JSON.parse(msg.data)
                console.log(data)
                if (data["topic"] === "update")
                    update()
            } catch (e) {
                console.error("Could not parse message", e)
            }
                
        }
    });

    async function update() {
        posts = await ForumApi.getPosts()
        author = await ForumApi.checkToken()
    }

    async function createAuthor(name: string, avatar: number | undefined) {
        let response = await ForumApi.createAuthor({name: name, avatar: avatar})
        await ForumApi.saveToken(response.token)
        update()
    }

    async function createPost(title: string, text: string, audioRecording: Optional<Blob>) {
        let post = await ForumApi.createPost({ title: title, text : text});
        if (audioRecording) {
            await ForumApi.attachFile(post.id, audioRecording, "en")
        }
        forumInputElement?.reset()
    }

    async function deletePost(id: number) {
        await ForumApi.deletePost(id)
    }

    async function logout() {
        ForumApi.deleteToken()
        author = undefined
    }
</script>

<div>
    <h2>Forum</h2>

    <h3>Posts</h3>
    {#if posts.length > 0 }
    <ul>
        {#each posts as post}
        <li>
            <ForumPostElement
                post={post} 
                isOwn={author?.id == post.author.id}
                onDeleteClicked={() => deletePost(post.id)}
                ttsPlayer={ttsPlayer}
                />
        </li>
        {/each}
    </ul>
    {:else}
    <p> No posts yet.</p>
    {/if}

    <ForumInputElement
        bind:this={forumInputElement}
        author={author}
        onCreateAuthorClicked={async () => createAuthorDialog.open()}
        onSubmitPostClicked={async (title, text, audioRecording) => createPost(title, text, audioRecording)}
        onLogoutAuthorClicked={async () => logout()}
    />

    <AuthorCreateDialog bind:this={createAuthorDialog} 
        onSubmit={async (name, avatar) => createAuthor(name, avatar)} 
    />

    <TextToSpeechPlayer bind:this={ttsPlayer}/>
</div>


