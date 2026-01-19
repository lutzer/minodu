<script lang="ts">
	import { BackendApi } from "$lib/apis/backend/api";
	import type { BackendCategory } from "$lib/apis/backend/models/backendCategory";
	import type { BackendPost } from "$lib/apis/backend/models/backendPost";
	import AgriculturePostElement from "$lib/components/agriculture/AgriculturePostElement.svelte";
	import { onMount } from "svelte";

    let posts : BackendPost[] = []
    let categories : BackendCategory[] = []

    let scrollContainer : HTMLDivElement;

    onMount( async () => {
		posts = await BackendApi.getPosts();
        categories = await BackendApi.getCategories();
        console.log(posts, categories)
	});



	function selectCategory(id: number): any {
		throw new Error("Function not implemented.");
	}

</script>

<style>

    .scroll-container {
		position: fixed;
		top:0;
		left:0;
		right:0;
		bottom: var(--footer-height);
		background-color: #EDCA82;
		overflow: scroll;
	}

    #categories {
        position: fixed;
        top:0;
        left:0;
        right:0;
        height: var(--header-height);
    }

    #categories ul {
        display: flex;
        gap: var(--small-padding);
        padding: var(--small-padding);
    }

    #categories li {
        width: 20%;
    }

    #categories button {
        background-color: red;
        width: 100%;
        border-radius: var(--border-radius);
        overflow: hidden;
        text-overflow: ellipsis;
        padding: var(--small-padding);
        white-space: nowrap;
    }

    .post-container {
        margin-top: var(--header-height);
		padding: var(--page-padding);
		margin-bottom: calc(var(--page-padding) + var(--button-size));
		box-sizing: border-box;
	}

</style>


<div class="forum-page">
    
	<div class="scroll-container" bind:this={scrollContainer}>
		<div class="post-container content-width">
			{#if posts.length > 0}
            <ul>
                {#each posts as post}
                <li>
                    <AgriculturePostElement
                        post={post}
                    />
                </li>
                {/each}
            </ul>
			{:else}
			<p class="no-posts">No posts yet.</p>
			{/if}
		</div>
	</div>
    <div id="categories" class="content-width">
        <ul>
            {#each categories as category}
            <li><button onclick={() => selectCategory(category.id)}>{category.name}</button></li>
            {/each}
        </ul>
    </div>
</div>