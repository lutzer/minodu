<script lang="ts">
	import type { Optional } from '$lib/types';

	export let image: Optional<File> = undefined;

	$: {
		if (!image) clearImage();
	}

	let imageUrl: Optional<string>;
	let galleryInput: HTMLInputElement;
	let cameraInput: HTMLInputElement;

	function handleCapture(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file && file.type.startsWith('image/')) {
			imageUrl = URL.createObjectURL(file);
			image = file;
		}
	}

	export function clearImage() {
		if (imageUrl) {
			URL.revokeObjectURL(imageUrl);
			imageUrl = undefined;
			image = undefined;
		}
	}
</script>

<div class="image-picker-container">
	{#if !imageUrl}
		<input
			bind:this={galleryInput}
			type="file"
			accept="image/*"
			onchange={(e) => handleCapture(e)}
			style="display: none;"
		/>
		<input
			bind:this={cameraInput}
			type="file"
			accept="image/*"
			capture="environment"
			onchange={(e) => handleCapture(e)}
			style="display: none;"
		/>
		<div class="select-button">
			<button class="shadow" onclick={() => galleryInput.click()}>Pic Photo from Gallery</button>
		</div>
		<div class="select-button">
			<button class="shadow" onclick={() => cameraInput.click()}>Take Photo</button>
		</div>
	{:else}
		<div class="preview">
			<img src={imageUrl} alt="Captured" />
		</div>
		<!-- <button onclick={() => (image = undefined)}>Clear Image</button> -->
	{/if}
</div>

<style>
	.image-picker-container {
		height: 200px;
		display: flex;
		gap: var(--small-padding);
	}

	.select-button {
		width: 50%;
		flex-shrink: 1;
	}

	.select-button button {
		width: 100%;
		height: 100%;
		background-color: #eeeeee;
		text-align: center;
		--box-shadow-color: #cccccc;
	}

	.preview {
		flex-grow: 1;
		background-color: #ffffff88;
		border-radius: var(--border-radius);
		padding: var(--small-padding);
		text-align: center;
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		/* box-shadow: 3px 3px 3px #cccccc; */
	}
</style>
