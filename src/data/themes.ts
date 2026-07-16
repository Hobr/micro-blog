export type ThemeVariant = "light" | "dark";

export type SiteTheme = {
    id: string;
    label: string;
    variant: ThemeVariant;
    palette: Record<string, string>;
};

export const THEME_STORAGE_KEY = "hobr.theme";
export const defaultThemeId = "phosphor-dark";

export const themes: SiteTheme[] = [
    {
        id: "phosphor-dark",
        label: "Phosphor Dark",
        variant: "dark",
        palette: {
            background: "#0b0f0c",
            backgroundSubtle: "#101612",
            backgroundElevated: "#101612",
            surfaceBorder: "#29332b",
            surfaceBorderStrong: "#3a473c",
            textMain: "#c7d0c8",
            textSoft: "#7f8b81",
            textStrong: "#edf3ed",
            accent: "#9adf75",
            accentContrast: "#0b0f0c",
            selection: "#29332b",
            codeBackground: "#101612",
            error: "#d57676",
            warning: "#d5bd68",
            success: "#9adf75",
            shadow: "rgba(0, 0, 0, 0.34)",
        },
    },
    {
        id: "paper-light",
        label: "Paper Light",
        variant: "light",
        palette: {
            background: "#eef1eb",
            backgroundSubtle: "#e5e9e2",
            backgroundElevated: "#e5e9e2",
            surfaceBorder: "#c8d0c5",
            surfaceBorderStrong: "#9da99d",
            textMain: "#344037",
            textSoft: "#667269",
            textStrong: "#152019",
            accent: "#356f27",
            accentContrast: "#eef1eb",
            selection: "#c8d0c5",
            codeBackground: "#e5e9e2",
            error: "#9a3434",
            warning: "#77620f",
            success: "#356f27",
            shadow: "rgba(20, 28, 22, 0.14)",
        },
    },
];

export const themeIds = themes.map((theme) => theme.id);

export function getThemeStyles() {
    const themeRules = themes
        .map((theme) => {
            const paletteVars = Object.entries(theme.palette)
                .map(([key, value]) => `    --${key}: ${value};`)
                .join("\n");

            return `:root[data-theme="${theme.id}"] {
    color-scheme: ${theme.variant};
${paletteVars}
}`;
        })
        .join("\n\n");

    return `${themeRules}

html {
    background: var(--background);
    color: var(--textMain);
}
`;
}
