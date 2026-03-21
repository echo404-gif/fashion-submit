import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Magazine Database — Submission Platform",
  description: "Fashion magazine submission platform",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16", type: "image/x-icon" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
