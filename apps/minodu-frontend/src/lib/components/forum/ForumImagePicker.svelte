<script lang="ts">
	import type { Optional } from "$lib/types"

    export let image : Optional<File> = undefined

    $ : {
        if (!image)
            clearImage()
    }
    
    let imageUrl : Optional<string>
    let fileInput : HTMLInputElement

    function handleCapture(e : Event) {
        const target = e.target as HTMLInputElement
        const file = target.files?.[0]
        if (file && file.type.startsWith('image/')) {
            imageUrl = URL.createObjectURL(file)
            image = file
        }
    }

    function clearImage() {
        if (imageUrl) {
            URL.revokeObjectURL(imageUrl)
            imageUrl = undefined
        }
    }
</script>
<style>
    .preview {
        width: 100px;
        height: 100px;
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
</style>

<div>
    {#if !imageUrl}
    <input
          bind:this={fileInput}
          type="file"
          accept="image/*"
          capture="environment"
          onchange={(e) => handleCapture(e)}
          style="display: none;"
        />
    <button onclick={() => fileInput.click()}>Take Image</button>
    {:else}
    <div class="preview">
        <img src={imageUrl} alt="Captured" />
    </div>
    <button onclick={() => image = undefined}>Clear Image</button>
    {/if}
</div>