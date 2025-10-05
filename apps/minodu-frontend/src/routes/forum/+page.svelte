<script lang="ts">
    import { onMount } from 'svelte';
    import { ForumApi } from '$lib/apis/forum/api';
	import type { ForumPost } from '$lib/apis/forum/models/forumPost';
	import AuthorCreateDialog from '$lib/components/forum/AuthorCreateDialog.svelte';
	import type { ForumAuthor } from '$lib/apis/forum/models/forumAuthor';
	import type { Optional } from '$lib/types';
	import ForumPostElement from '$lib/components/forum/ForumPostElement.svelte';
	import ForumInputElement from '$lib/components/forum/ForumInputElement.svelte';
	import TtsButton from '$lib/components/TtsButton.svelte';
  
    let createAuthorDialog : AuthorCreateDialog;

    let posts : ForumPost[] = []
    let author : Optional<ForumAuthor> = undefined

    onMount(async () => {
        update()
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

    async function createPost(title: string, text: string) {
        await ForumApi.createPost({ title: title, text : text});
        update()
    }

    async function deletePost(id: number) {
        await ForumApi.deletePost(id)
        update()
    }

    async function logout() {
        ForumApi.deleteToken()
        author = undefined
    }
</script>

<div>
    <h2>Forum</h2>

    <TtsButton text="Hello there"/>

    <h3>Posts</h3>
    {#if posts.length > 0 }
    <ul>
        {#each posts as post}
        <li>
            <ForumPostElement
                post={post} 
                isOwn={author?.id == post.author.id}
                onDeleteClicked={() => deletePost(post.id)}
                />
        </li>
        {/each}
    </ul>
    {:else}
    <p> No posts yet.</p>
    {/if}

    <ForumInputElement
        author={author}
        onCreateAuthorClicked={async () => createAuthorDialog.open()}
        onSubmitPostClicked={async (title, text) => createPost(title, text)}
        onLogoutAuthorClicked={async () => logout()}
    />

    <AuthorCreateDialog bind:this={createAuthorDialog} 
        onSubmit={async (name, avatar) => createAuthor(name, avatar)} 
    />
</div>


