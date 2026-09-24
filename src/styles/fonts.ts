import {
  Archivo,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Noto_Sans_SC,
} from "next/font/google";

/**
 * Self-hosted qua next/font — build tự tải file font về, phục vụ same-origin.
 * Bỏ được request tới fonts.googleapis.com/fonts.gstatic.com lúc runtime,
 * giảm 2 round-trip DNS/TLS trên đường tới LCP và cho phép CSP không cần
 * mở font-src/style-src ra ngoài.
 */
export const archivo = Archivo({
  subsets: ["latin", "vietnamese"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

export const plexSans = IBM_Plex_Sans({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

export const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-sc",
  display: "swap",
});
