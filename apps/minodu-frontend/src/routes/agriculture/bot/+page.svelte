<script lang="ts">
	import ChatbotPage from '$lib/pages/ChatbotPage.svelte';
	import { language } from '$lib/stores';
	import { t } from '$lib/translations';
</script>

<div>
	<a href="/">{t('nav.home', $language)}</a>
	<h2>{t('chatbot.title', $language)}</h2>
	<ChatbotPage />
</div>
