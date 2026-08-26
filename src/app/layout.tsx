import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spreadsheet to JSON",
  description: "Convert spreadsheets to JSON directly in your browser.",
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
