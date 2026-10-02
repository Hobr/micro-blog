import { createHash } from "node:crypto";
import { defaultLocale, type Locale } from "../i18n/config.ts";

export type ProfileData = {
    name: string;
    email: string;
    role: string;
    bio: string;
};

const avatarEmail = "mail@hobr.site";
const gravatarHash = createHash("sha256")
    .update(avatarEmail.trim().toLowerCase())
    .digest("hex");
export const avatarUrl = `https://gravatar.com/avatar/${gravatarHash}?s=320&d=404&r=g`;
export const profileName = "Hobr";
export const siteDescription = profileName + "'s Blog";

const profiles: Record<Locale, ProfileData> = {
    "zh-CN": {
        name: profileName,
        email: avatarEmail,
        role: "计算机民科 / 二次元",
        bio: `
        计算机狂热爱好者, 开源实践者, 追求有品位的技术。日语专业出身。
        一个贰刺猿, 萌二纸片痴, 甩手偶像厨, 主推: 京都动画 / Key社 / 邦多利。
        目前关注: 人工智能 / AI Agent / RISC-V。
        `,
    },

    en: {
        name: profileName,
        email: avatarEmail,
        role: "Computer Science Crank / Otaku",
        bio: `
        A total computer geek. Open-Source practitioner. Seeking for tasteful technology. Japanese major by background.
        An ACGN Otaku nerd, and also a radical idol otaku. Mainly favor in: Kyoto Animation / Key / BanG Dream.
        Currently following: AI / AI Agent / RISC-V.
        `,
    },
};

export function getProfile(locale: Locale): ProfileData {
    return profiles[locale];
}

export const profile = getProfile(defaultLocale);
