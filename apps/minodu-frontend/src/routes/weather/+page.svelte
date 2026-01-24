<script lang="ts">
	import { language } from '$lib/stores';
	import { t } from '$lib/translations';
</script>

<div>
	<a href="/">{t('nav.home', $language)}</a>
	<h2>{t('nav.weather', $language)}</h2>
</div>
