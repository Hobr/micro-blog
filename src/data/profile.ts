import { defaultLocale, type Locale } from "../i18n/config.ts";

export type ProfileData = {
    name: string;
    role: string;
    bio: string;
};

const profiles: Record<Locale, ProfileData> = {
    "zh-CN": {
        name: "Hobr",
        role: "计算机狂热爱好者 / 全栈 / 二次元 / 学生",
        bio: `自小对计算机充满热情, 喜欢折腾各种技术, 接触过各类计算机语言及工具, 长期关注前沿技术及开源项目, 非科班出身`,
    },
    en: {
        name: "Hobr",
        role: "Computer enthusiast / Full-Stack Developer / Anime Fan / Student",
        bio: `I have been passionate about computers since childhood, enjoy exploring and experimenting with various technologies, have worked with a wide range of programming languages and tools, and consistently follow cutting-edge technologies and open-source projects. I do not come from a formal computer science background.`,
    },
    ja: {
        name: "Hobr",
        role: "コンピューター愛好家 / フルスタック開発者 / 二次元 / 学生",
        bio: `子供の頃からコンピュータに強い情熱を持ち、さまざまな技術を試したり研究したりすることが好きで、多様なプログラミング言語やツールに触れてきました。長期にわたり最先端技術やオープンソースプロジェクトに注目しており、専門的な情報系の教育を受けたバックグラウンドはありません。コンピュータに強い情熱を持ち、さまざまな技術を試した`,
    },
};

export function getProfile(locale: Locale): ProfileData {
    return profiles[locale];
}

export const profile = getProfile(defaultLocale);
