<script lang="ts">
	import { ForumApi } from '$lib/apis/forum/api';
	import type { ForumAvatar } from '$lib/apis/forum/models/fromAvatar';
	import { Store } from '$lib/store';
	import type { Optional } from '$lib/types';

	export let onCreated: () => void;

	export function open() {
		dialog?.showModal();
		loadAvatars();
	}

	let dialog: HTMLDialogElement;
	let name: string;
	let avatarList: ForumAvatar[] = [];

	async function loadAvatars() {
		avatarList = await ForumApi.getAvatars();
	}

	async function createAuthor(name: string, avatar: Optional<number>) {
		try {
			let response = await ForumApi.createAuthor({ name: name, avatar: avatar });
			Store.forumToken = response.token;
			name = '';
			dialog?.close();
			onCreated();
		} catch (e) {
			window.alert(e);
		}
	}
</script>

<dialog bind:this={dialog}>
	<h2>Create Author</h2>
	<div class="form-row">
		<label for="name">Name</label>
		<input id="name" maxlength="64" type="text" bind:value={name} />
	</div>
	<div class="avatar-list">
		{#each avatarList as avatar}
			<label for={`avatar-${avatar.id}`}>Avatar</label>
			<input type="radio" id={`avatar-${avatar.id}`} name="avatar" value={`avatar-${avatar.id}`} />
		{/each}
	</div>
	<button onclick={() => dialog?.close()}>Cancel</button>
	<button onclick={() => createAuthor(name, undefined)}>Ok</button>
</dialog>

<style>
	.form-row {
		display: flex;
		align-items: center;
		margin-bottom: 15px;
	}

	.form-row label {
		width: 80px;
		margin-right: 10px;
	}

	.form-row input {
		background-color: lightgray;
		padding: 5px;
		flex: 1;
	}
</style>
