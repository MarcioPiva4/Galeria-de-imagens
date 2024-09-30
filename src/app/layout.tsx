import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Galeria de exposição",
  description: "Exposição de imagens para o trabalho de lingua portuguesa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
