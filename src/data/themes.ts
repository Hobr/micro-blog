export type ThemeVariant = "light" | "dark";

type ThemePalette = Record<string, string>;

export type SiteTheme = {
    id: string;
    label: string;
    variant: ThemeVariant;
    palette: ThemePalette;
};

export const THEME_STORAGE_KEY = "hobr.theme";

export const themes: SiteTheme[] = [
    {
        id: "default-dark",
        label: "Default Dark",
        variant: "dark",
        palette: {
            base00: "#181818",
            base01: "#282828",
            base02: "#383838",
            base03: "#585858",
            base04: "#b8b8b8",
            base05: "#d8d8d8",
            base06: "#e8e8e8",
            base07: "#f8f8f8",
            base08: "#ab4642",
            base09: "#dc9656",
            base0A: "#f7ca88",
            base0B: "#a1b56c",
            base0C: "#86c1b9",
            base0D: "#7cafc2",
            base0E: "#ba8baf",
            base0F: "#a16946",
        },
    },
    {
        id: "gruvbox-dark-hard",
        label: "Gruvbox Dark Hard",
        variant: "dark",
        palette: {
            base00: "#1d2021",
            base01: "#3c3836",
            base02: "#504945",
            base03: "#665c54",
            base04: "#bdae93",
            base05: "#d5c4a1",
            base06: "#ebdbb2",
            base07: "#fbf1c7",
            base08: "#fb4934",
            base09: "#fe8019",
            base0A: "#fabd2f",
            base0B: "#b8bb26",
            base0C: "#8ec07c",
            base0D: "#83a598",
            base0E: "#d3869b",
            base0F: "#d65d0e",
        },
    },
    {
        id: "nord",
        label: "Nord",
        variant: "dark",
        palette: {
            base00: "#2e3440",
            base01: "#3b4252",
            base02: "#434c5e",
            base03: "#4c566a",
            base04: "#d8dee9",
            base05: "#e5e9f0",
            base06: "#eceff4",
            base07: "#8fbcbb",
            base08: "#bf616a",
            base09: "#d08770",
            base0A: "#ebcb8b",
            base0B: "#a3be8c",
            base0C: "#88c0d0",
            base0D: "#81a1c1",
            base0E: "#b48ead",
            base0F: "#5e81ac",
        },
    },
    {
        id: "catppuccin-mocha",
        label: "Catppuccin Mocha",
        variant: "dark",
        palette: {
            base00: "#1e1e2e",
            base01: "#181825",
            base02: "#313244",
            base03: "#45475a",
            base04: "#585b70",
            base05: "#cdd6f4",
            base06: "#f5e0dc",
            base07: "#b4befe",
            base08: "#f38ba8",
            base09: "#fab387",
            base0A: "#f9e2af",
            base0B: "#a6e3a1",
            base0C: "#94e2d5",
            base0D: "#89b4fa",
            base0E: "#cba6f7",
            base0F: "#f2cdcd",
        },
    },
    {
        id: "ayu-light",
        label: "Ayu Light",
        variant: "light",
        palette: {
            base00: "#fafafa",
            base01: "#f3f4f5",
            base02: "#f8f9fa",
            base03: "#abb0b6",
            base04: "#828c99",
            base05: "#5c6773",
            base06: "#242936",
            base07: "#1a1f29",
            base08: "#f07178",
            base09: "#fa8d3e",
            base0A: "#f2ae49",
            base0B: "#86b300",
            base0C: "#4cbf99",
            base0D: "#36a3d9",
            base0E: "#a37acc",
            base0F: "#e6ba7e",
        },
    },
];

export const defaultThemeId = "default-dark";
export const themeIds = themes.map((theme) => theme.id);

export function getThemeStyles() {
    const themeRules = themes
        .map((theme) => {
            const paletteVars = Object.entries(theme.palette)
                .map(([key, value]) => `    --theme-${key}: ${value};`)
                .join("\n");

            return `:root[data-theme="${theme.id}"] {
    color-scheme: ${theme.variant};
${paletteVars}
    --background-color: var(--theme-base00);
    --block-background-color: var(--theme-base01);
    --font-color: var(--theme-base05);
    --invert-font-color: ${theme.variant === "light" ? "#ffffff" : "var(--theme-base00)"};
    --primary-color: var(--theme-base0D);
    --secondary-color: var(--theme-base03);
    --error-color: var(--theme-base08);
    --progress-bar-background: var(--theme-base03);
    --progress-bar-fill: var(--theme-base0D);
    --code-bg-color: var(--theme-base01);
    --background: var(--theme-base00);
    --background-subtle: var(--theme-base01);
    --background-elevated: var(--theme-base10, var(--theme-base01));
    --surface-border: var(--theme-base03);
    --surface-border-strong: var(--theme-base04);
    --text-main: var(--theme-base05);
    --text-soft: var(--theme-base04);
    --text-strong: var(--theme-base06);
    --accent-primary: var(--theme-base0D);
    --accent-secondary: var(--theme-base0B);
    --accent-warm: var(--theme-base09);
    --accent-cyan: var(--theme-base0C);
    --accent-danger: var(--theme-base08);
    --accent-bright: var(--theme-base16, var(--theme-base0D));
}`;
        })
        .join("\n\n");

    return `${themeRules}

html {
    background: var(--background-color);
    color: var(--font-color);
}
`;
}
