<script lang="ts">
	import { ForumApi } from "$lib/apis/forum/api";
	import type { ForumAvatar } from "$lib/apis/forum/models/fromAvatar";

    export let onSubmit: (name : string, avatarId : number | undefined) => {}
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

    function handleSubmit() {
        onSubmit(name, undefined)
        dialog?.close()
    }
</script>

<dialog bind:this={dialog}>
  <h2>Create Author</h2>
  <input id="name" maxlength=64 type="text" bind:value={name}>
  <button onclick={() => dialog?.close()}>Cancel</button>
  <button onclick={() => handleSubmit()}>Ok</button>
</dialog>