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
        bio: `
自小学开始玩电脑, 接触到SA-MP服务端后开始了编程之路, 目前在南京理工大学日语专业就读, 非科班出身也未曾接受过系统的计算机教育, 但对计算机技术充满热情, 喜欢折腾各种技术, 接触过各类计算机语言及工具, 长期关注前沿技术及开源项目, 日常使用Linux
`,
    },
    en: {
        name: "Hobr",
        role: "Computer enthusiast / Full-Stack Developer / Anime Fan / Student",
        bio: `
I’ve been using computers since primary school. My journey into programming began when I got involved with SA-MP server development.\n
I am currently studying Japanese at Nanjing University of Science and Technology. Although I don’t come from a formal computer science background and haven’t received systematic CS education, I am deeply passionate about technology.\n
I enjoy exploring and tinkering with various technologies, have experience with a wide range of programming languages and tools, and keep a close eye on cutting-edge trends and open-source projects. I use Linux in my daily workflow.
`,
    },
    ja: {
        name: "Hobr",
        role: "コンピューター愛好家 / フルスタック開発者 / 二次元 / 学生",
        bio: `
小学生の頃からコンピューターに触れており、SA-MPのサーバー開発をきっかけにプログラミングの道に入りました。\n
現在は南京理工大学で日本語を専攻しています。情報系の専門ではなく、体系的なコンピューター教育を受けたわけではありませんが、技術に対して強い情熱を持っています。\n
さまざまな技術を試したりいじったりするのが好きで、多くのプログラミング言語やツールに触れてきました。最先端技術やオープンソースプロジェクトにも日頃から注目しています。普段はLinuxを使用しています。
`,
    },
};

export function getProfile(locale: Locale): ProfileData {
    return profiles[locale];
}

export const profile = getProfile(defaultLocale);
