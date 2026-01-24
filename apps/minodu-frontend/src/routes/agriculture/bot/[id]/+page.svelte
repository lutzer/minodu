<script lang="ts">
	import { page } from '$app/stores';
	import { language } from '$lib/stores';
	import { t } from '$lib/translations';

	$: postId = $page.params.id;
</script>

<div>
	<h2>{t('chatbot.forPost', $language)} {postId}</h2>
</div>
