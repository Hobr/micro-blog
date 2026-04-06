<script lang="ts">
    export type SiteCommand = {
        command: string;
        name: string;
        description: string;
        href: string;
    };

    let { sites = [] as SiteCommand[] } = $props();
</script>

<ul class="site-command-list" aria-label="Owned sites">
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
