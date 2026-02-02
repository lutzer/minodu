<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import FooterMenuButton from '$lib/components/common/FooterMenuButton.svelte';

	import agricultureIcon from '$lib/assets/agriculture-icon.png';
	import agricultureIconDisabled from '$lib/assets/agriculture-icon-disabled.png';
	import forumIcon from '$lib/assets/forum-icon.png';
	import forumIconDisabled from '$lib/assets/forum-icon-disabled.png';
	import treeIcon from '$lib/assets/tree-icon.png';
	import treeIconDisabled from '$lib/assets/tree-icon-disabled.png';
	import weatherIcon from '$lib/assets/weather-icon.png';
	import weatherIconDisabled from '$lib/assets/weather-icon-disabled.png';
	import marketIcon from '$lib/assets/market-icon.png';
	import marketIconDisabled from '$lib/assets/market-icon-disabled.png';

	import Toast from '$lib/components/common/Toast.svelte';
	import '../global.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="app-container">
	<div id="content" class="content-width">
		{@render children?.()}
	</div>
	<Toast />
	<div id="footer">
		<div class="menu-bar">
			<FooterMenuButton
				link="/agriculture"
				icon={agricultureIcon}
				iconSelected={agricultureIconDisabled}
			/>
			<FooterMenuButton link="/forum" icon={forumIcon} iconSelected={forumIconDisabled} />
			<FooterMenuButton
				link="/"
				icon={treeIcon}
				iconSelected={treeIconDisabled}
				strictRoute={true}
			/>
			<FooterMenuButton link="/weather" icon={weatherIcon} iconSelected={weatherIconDisabled} />
			<FooterMenuButton link="/market" icon={marketIcon} iconSelected={marketIconDisabled} />
		</div>
	</div>
</div>

<style>
	#footer {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: var(--footer-height);
	}

	#content {
		max-width: 1100px;
	}

	.menu-bar {
		display: flex;
		height: 100%;
		background-color: var(--bg-color-light);
		margin: 0 auto;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		gap: var(--small-padding);
		padding: 0 var(--small-padding);
	}

	@media screen and (min-width: 550px) {
		.menu-bar {
			border-radius: var(--border-radius) var(--border-radius);
			margin-top: -20px;
			max-width: 450px;
		}
	}
</style>
