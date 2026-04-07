import { defaultLocale, type Locale } from "../i18n/config.ts";

export type ProfileData = {
    name: string;
    eyebrow: string;
    role: string;
    bio: string;
    avatar: string;
    avatarAlt: string;
    stack: string[];
    stackLabel: string;
};

const profiles: Record<Locale, ProfileData> = {
    "zh-CN": {
        name: "Hobr",
        eyebrow: "会话资料",
        role: "软件折腾者 / 静态站构建者 / Typst 写作者",
        bio: "我会做静态工具、终端风界面，以及那些我真正上线过的系统的长篇记录。这个站点是我用来写作、发布和串联其他作品的控制台。",
        avatar: "/avatar.svg",
        avatarAlt: "Hobr 头像",
        stack: ["TypeScript", "Astro", "Svelte", "Typst", "Nix"],
        stackLabel: "技术栈",
    },
    en: {
        name: "Hobr",
        eyebrow: "session profile",
        role: "Software tinkerer / static site builder / typst writer",
        bio: "I build static tools, terminal-flavored interfaces, and long-form notes about the systems I actually ship. This site is my control panel for writing, publishing, and linking the rest of my work together.",
        avatar: "/avatar.svg",
        avatarAlt: "Hobr avatar",
        stack: ["TypeScript", "Astro", "Svelte", "Typst", "Nix"],
        stackLabel: "Tech stack",
    },
    ja: {
        name: "Hobr",
        eyebrow: "プロフィール",
        role: "ソフトウェア実験者 / 静的サイト構築者 / Typst ライター",
        bio: "私は静的ツール、ターミナル風 UI、そして実際に公開したシステムの長文メモを書いています。このサイトは、その作業をまとめるためのコントロールパネルです。",
        avatar: "/avatar.svg",
        avatarAlt: "Hobr のアバター",
        stack: ["TypeScript", "Astro", "Svelte", "Typst", "Nix"],
        stackLabel: "技術スタック",
    },
};

export function getProfile(locale: Locale): ProfileData {
    return profiles[locale];
}

export const profile = getProfile(defaultLocale);
