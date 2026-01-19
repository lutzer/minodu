<script lang="ts">
    import { page } from '$app/stores';

    export let link : string;
    export let icon : string;
    export let iconSelected : string;
    export let strictRoute : boolean = false;

    let selected : boolean; 

    $: {
		selected = !(strictRoute ? $page.url.pathname === link : $page.url.pathname.startsWith(link)) && $page.url.pathname !== "/";
	}
</script>

<style>
    .footer-menu-button {
        display: flex;
        aspect-ratio: 1 / 1;
        flex-shrink: 1;
        flex-basis: 64px; /* or whatever size you want */
        min-width: 32px;
        min-height: 32px;
    }

    .footer-menu-button a {
        height: 100%;
        width: 100%;
    }

    .footer-menu-button img {
        max-height: 100%;
        width: 100%;
        object-fit: contain;
    }

    .footer-menu-button a.active {
        /* pointer-events: all; */
    } 
</style>

<div class="footer-menu-button">
    <a href={link} class={selected ? "active" : ""}>
        <img src={selected ? iconSelected : icon} alt="Icon for link to {link}"/>
    </a>
</div>