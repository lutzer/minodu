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

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="app-container">
	<div id="content" class="content-width">
		{@render children?.()}
	</div>
	<div id="footer">
		<div class="menu-bar">
			<FooterMenuButton link="/agriculture" 
				icon={agricultureIcon} 
				iconDisabled={agricultureIconDisabled}/>
			<FooterMenuButton link="/forum" 
				icon={forumIcon} 
				iconDisabled={forumIconDisabled}/>
			<FooterMenuButton link="/" 
				icon={treeIcon} 
				iconDisabled={treeIconDisabled}
				strictRoute={true}/>
			<FooterMenuButton link="/weather" 
				icon={weatherIcon}
				iconDisabled={weatherIconDisabled}/>
			<FooterMenuButton link="/market" 
				icon={marketIcon}
				iconDisabled={marketIconDisabled}/>
		</div>
	</div>
</div>

<style>
	#footer {
		position: fixed;
		bottom:0;
		left: 0;
		right: 0;
		height: 100px;
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

	:global(:root) {
		--small-padding: 10px;
		--bg-color-light: #C2B4B0;
		--border-radius: 20px;
	}


	:global(.input-textarea) {
		background: white;
		border: 1px;
	}

	:global(textarea) {
		width: 100%;
		resize: none;
		border: none;
		background: none;
	}

	:global(textarea:focus) {
		outline: none;
		box-shadow: none;
	}

	:global(.input-text) {
		background: none;
		border: 1px;
	}

	:global(input[type='text']) {
		width: 100%;
		resize: none;
		border: none;
		background: none;
	}

	:global(input[type='text']:focus) {
		outline: none;
		box-shadow: none;
	}

	:global(h3) {
		margin: 0;
		font-size: 110%;
	}

	:global(.paragraph:not(:first-of-type)) {
		margin-top: 10px;
	}

	:global(.content-width) {
		max-width: 1100px;
		margin: 0 auto;
	}
</style>
