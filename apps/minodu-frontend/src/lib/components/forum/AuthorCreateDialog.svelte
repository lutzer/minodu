<script lang="ts">
	import { ForumApi } from '$lib/apis/forum/api';
	import type { ForumAvatar } from '$lib/apis/forum/models/fromAvatar';
	import { Storage } from '$lib/storage';
	import { language } from '$lib/stores';
	import type { Optional } from '$lib/types';
	import { t } from '$lib/translations';
	import forumBackImage from '$lib/assets/forum-back.png';
	import forumAcceptImage from '$lib/assets/forum-accept.png';
	import { onMount } from 'svelte';

	export let onCreated: () => void;
	export let onBack: () => void;

	let dialog: HTMLDialogElement;
	let name: string = "";
	let selectedAvatar : Optional<number>;
	let avatarList: ForumAvatar[] = [];

	$: inputIsValid = name.length >= 3 && selectedAvatar !== undefined

	onMount(() => {
		dialog?.showModal();
		loadAvatars();
	})

	async function loadAvatars() {
		avatarList = await ForumApi.getAvatars();
	}

	async function createAuthor(name: string, avatar: number) {
		try {
			let response = await ForumApi.createAuthor({ name: name, avatar: avatar });
			Storage.forumToken = response.token;
			onCreated();
		} catch (e) {
			window.alert(e);
		}
	}
</script>

<dialog bind:this={dialog} class="shadow">
	<h2>{t('forum.createAuthor', $language)}</h2>
	<ul class="avatar-list">
		{#each avatarList as avatar}
		<li>
			<label for={`avatar-${avatar.id}`}>
				<img src={avatar.file_urlpath} alt={t('alt.avatarImage', $language)}/>
			</label>
			<input 
				type="radio" 
				id={`avatar-${avatar.id}`} 
				name="avatar" 
				value={avatar.id}
				bind:group={selectedAvatar}/>
		</li>
		{/each}
	</ul>
	<div class="input-text">
		<input id="name" maxlength="64" type="text" bind:value={name} placeholder={t('forum.yourName', $language)}/>
	</div>
	<div class="button-group">
		<button class="back long shadow" onclick={() => onBack()}>
			<img src={forumBackImage} alt={t('action.cancel', $language)}/>
		</button>
		<button class="accept long shadow" onclick={() => createAuthor(name, selectedAvatar!)} disabled={!inputIsValid}>
			<img src={forumAcceptImage} alt={t('action.ok', $language)}/>
		</button>
	</div>
</dialog>

<style>

	.avatar-list {
		display: flex;
		flex-wrap: wrap;
  		gap: var(--small-padding);
		align-items: center;
		justify-content: center;
		margin: var(--medium-padding) 0;
	}

	.avatar-list li {
		width: 28%;
		max-width: 150px;
		min-width: 60px;
		border-radius: var(--border-radius);
		padding: 5px;
		background-color: #ffffff;
	}

	.avatar-list li input[type="radio"] {
		display: none;
	}
	
	.avatar-list li:has(input[type="radio"]:checked) {
		background-color: #37CC84;
	}

	.avatar-list img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	button.accept {
		background-color: #37CC84;
		border-radius: var(--border-radius);
		--box-shadow-color: #25B86E;
	}

	button.back {
		background-color: #ffffff;
		border-radius: var(--border-radius);
		--box-shadow-color: #CCCCCC;
	}

	.button-group {
		display: flex;
		padding: var(--medium-padding) 0;
		justify-content: space-between;
		gap: var(--medium-padding);
	}
</style>
