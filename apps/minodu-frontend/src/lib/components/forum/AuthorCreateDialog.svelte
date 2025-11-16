<script lang="ts">
	import { ForumApi } from "$lib/apis/forum/api";
	import type { ForumAvatar } from "$lib/apis/forum/models/fromAvatar";
	import { Store } from "$lib/store";
	import type { Optional } from "$lib/types";

    export let onCreated: () => {}
    export function open() {
        dialog?.showModal()
        loadAvatars()
    }

    let dialog : HTMLDialogElement;
    let name : string
    let avatarList: ForumAvatar[] = []

    async function loadAvatars() {
        avatarList = await ForumApi.getAvatars()
    }

    async function createAuthor(name: string, avatar: Optional<number>) {
        try {
            let response = await ForumApi.createAuthor({name: name, avatar: avatar})
            Store.forumToken = response.token
            dialog?.close()
            name = ""
            onCreated()
        } catch (e) {
            window.alert(e)
        }
    }
</script>

<dialog bind:this={dialog}>
  <h2>Create Author</h2>
  <input id="name" maxlength=64 type="text" bind:value={name}>
  <button onclick={() => dialog?.close()}>Cancel</button>
  <button onclick={() => createAuthor(name, undefined)}>Ok</button>
</dialog>