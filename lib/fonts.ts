import { Bitcount_Single, Geist, Geist_Mono } from "next/font/google";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const APP_LOGO_FONT_VARIATION =
  '"slnt" -8, "wght" 650, "ELSH" 55' as const;

export const bitcountSingle = Bitcount_Single({
  subsets: ["latin"],
  weight: "variable",
  axes: ["slnt", "ELSH"],
});
