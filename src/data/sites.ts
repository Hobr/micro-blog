export const sites = [
    {
        command: "open blog",
        name: "Blog",
        description: "Long-form notes, build logs, and writing experiments.",
        href: "/blog",
    },
    {
        command: "open archive",
        name: "Archive",
        description: "Chronological index of everything already published.",
        href: "/archive",
    },
    {
        command: "open tags/site",
        name: "Tag View",
        description: "Jump into the site-building posts directly.",
        href: "/tags/site",
    },
] as const;
