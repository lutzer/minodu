<script lang="ts">
	import { page } from '$app/stores';
	import { t, language } from '$lib/translations';

	$: postId = $page.params.id;
</script>

<div>
	<h2>{t('chatbot.forPost', $language)} {postId}</h2>
</div>