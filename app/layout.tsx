import type { Metadata, Viewport } from "next";
import { APP_NAME } from "@/lib/constants";
import { geistMono, geistSans } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: `${APP_NAME}`,
  description:
    "Resume-based mock interviews with AI avatars, natural voices, target-role practice, and scored performance reports.",
};

export const viewport: Viewport = {
  themeColor: "#0a0908",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full w-full flex flex-col bg-background text-foreground antialiased"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
