<script lang="ts">
    import type { LocalizedSiteCommand } from "../data/sites";

    type Props = {
        sites?: LocalizedSiteCommand[];
        label?: string;
    };

    let { sites = [], label = "Owned sites" }: Props = $props();
</script>

<ul class="site-command-list" aria-label={label}>
    {#each sites as site (site.href)}
        <li>
            <a class="site-command" href={site.href}>
                <span class="site-command__line">
                    <span class="site-command__prompt">$</span>
                    <span>{site.command}</span>
                    <span class="site-command__name">[{site.name}]</span>
                </span>
                <span class="site-command__desc">{site.description}</span>
            </a>
        </li>
    {/each}
</ul>
