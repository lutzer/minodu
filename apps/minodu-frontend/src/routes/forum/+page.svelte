<script lang="ts">
    import { onMount } from 'svelte';
    import { ForumApi } from '$lib/apis/forum/api';
	import type { ForumPost } from '$lib/apis/forum/models/forumPost';
  
    let posts : ForumPost[] = []

    onMount(async () => {
        posts = await ForumApi.getPosts()
    });
</script>


<h2>Forum</h2>

<h3>Posts</h3>
{#if posts.length > 0 }
<ul>
    {#each posts as post}
      <li>{post.id} - {post.title}</li>
    {/each}
</ul>
{:else}
<p> No posts yet.</p>
{/if}

<button>Create Post</button>