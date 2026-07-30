import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const shareImage = `${protocol}://${host}/og.png`;

  return {
    title: "旧衣回收灵感 · 铛铛一下",
    description: "从灵感来源到铛铛一下品牌效果的视觉档案。",
    openGraph: {
      title: "旧衣回收灵感 · 铛铛一下",
      description: "从灵感来源到铛铛一下品牌效果的视觉档案。",
      images: [
        {
          url: shareImage,
          width: 1706,
          height: 937,
          alt: "铛铛一下灵感墙",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "旧衣回收灵感 · 铛铛一下",
      description: "从灵感来源到铛铛一下品牌效果的视觉档案。",
      images: [shareImage],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
