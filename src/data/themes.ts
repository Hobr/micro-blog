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
        id: "default-sakura",
        label: "Default Sakura",
        variant: "light",
        palette: {
            base00: "#feedf3",
            base01: "#f8e2e7",
            base02: "#e0ccd1",
            base03: "#755f64",
            base04: "#665055",
            base05: "#564448",
            base06: "#42383a",
            base07: "#33292b",

            base08: "#df2d52",
            base09: "#f6661e",
            base0A: "#c29461",
            base0B: "#2e916d",
            base0C: "#1d8991",
            base0D: "#006e93",
            base0E: "#5e2180",
            base0F: "#ba0d35",
        },
    },
    {
        id: "catppuccin-frappe",
        label: "Catppuccin Frappe Dark",
        variant: "dark",
        palette: {
            base00: "#303446",
            base01: "#292c3c",
            base02: "#414559",
            base03: "#51576d",
            base04: "#626880",
            base05: "#c6d0f5",
            base06: "#f2d5cf",
            base07: "#babbf1",

            base08: "#e78284",
            base09: "#ef9f76",
            base0A: "#e5c890",
            base0B: "#a6d189",
            base0C: "#81c8be",
            base0D: "#8caaee",
            base0E: "#ca9ee6",
            base0F: "#eebebe",
        },
    },
    {
        id: "catppuccin-latte",
        label: "Catppuccin Latte Light",
        variant: "light",
        palette: {
            base00: "#eff1f5",
            base01: "#e6e9ef",
            base02: "#ccd0da",
            base03: "#bcc0cc",
            base04: "#acb0be",
            base05: "#4c4f69",
            base06: "#dc8a78",
            base07: "#7287fd",

            base08: "#d20f39",
            base09: "#fe640b",
            base0A: "#df8e1d",
            base0B: "#40a02b",
            base0C: "#179299",
            base0D: "#1e66f5",
            base0E: "#8839ef",
            base0F: "#dd7878",
        },
    },
    {
        id: "catppuccin-macchiato",
        label: "Catppuccin Macchiato Dark",
        variant: "dark",
        palette: {
            base00: "#24273a",
            base01: "#1e2030",
            base02: "#363a4f",
            base03: "#494d64",
            base04: "#5b6078",
            base05: "#cad3f5",
            base06: "#f4dbd6",
            base07: "#b7bdf8",

            base08: "#ed8796",
            base09: "#f5a97f",
            base0A: "#eed49f",
            base0B: "#a6da95",
            base0C: "#8bd5ca",
            base0D: "#8aadf4",
            base0E: "#c6a0f6",
            base0F: "#f0c6c6",
        },
    },
    {
        id: "catppuccin-mocha",
        label: "Catppuccin Mocha Dark",
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
