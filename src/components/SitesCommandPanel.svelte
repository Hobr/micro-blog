<script lang="ts">
    import type { LocalizedSiteCommand } from "../data/sites";

    type Props = {
        sites?: LocalizedSiteCommand[];
        label?: string;
    };

    let { sites = [], label = "Owned sites" }: Props = $props();
</script>

<ul aria-label={label}>
    {#each sites as site (site.href)}
        <li>
            <a href={site.href}>{site.command}</a>
            <small>[{site.name}]</small>
            <p>{site.description}</p>
        </li>
    {/each}
</ul>
