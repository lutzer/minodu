<script lang="ts">
	import BotMessageElement from "$lib/components/bot/BotMessageElement.svelte";
    import TextToSpeechPlayer from "$lib/components/common/TextToSpeechPlayer.svelte";
	import { Store } from "$lib/store";
	import type { BotMessage } from "$lib/types";
	import { onMount } from "svelte";

    let inputText : string = ""
    let messages : BotMessage[] = []
    let ttsPlayer : TextToSpeechPlayer;
    let generating = false

    onMount(() => {
        messages = Store.getChatMessages()
    })

    $ : {
        messages;
        generating = isGenerating()
    }

    function updateGenerateState() {
        Store.saveChatMessages(messages);
        generating = isGenerating()
    }

    function isGenerating() : boolean {
        return messages.reduce((prev, val) => prev || !val.generated, false)
    }
    
    function submitMessage() {
        messages = [...messages, {question: inputText, response : "", generated : false}]
        inputText = ""
    }

    function clearChat() {
        Store.clearChatMessages()
        messages = []
    }
    
</script>

<style>
    
</style>

<div class="chat-container">
    <div class="chat">
        <ul>
            {#each messages as msg }
                <li>
                    <BotMessageElement message={msg} onResponseGenerated={updateGenerateState}/>
                </li>
            {/each}
        </ul>
    </div>
    <div class="input">
        <textarea class="input-text" bind:value={inputText}>

        </textarea>
        <button onclick={submitMessage} disabled={generating || inputText.length <=3}>Submit</button>
        <button onclick={clearChat}>Clear Chat</button>
    </div>
    <TextToSpeechPlayer bind:this={ttsPlayer}/>
</div>