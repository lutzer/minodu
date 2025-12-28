<script lang="ts">
    export let link : string 
    export let icon : string
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
</style>

<div class="footer-menu-button">
    <a href={link}>
        <img src={icon} alt="Icon for link to {link}"/>
    </a>
</div>