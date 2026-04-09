import type { Metadata, Viewport } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";
import { PwaRegister } from "./_components/pwa-register";

const mulish = Mulish({
  subsets: ["latin-ext"],
});

export const viewport: Viewport = {
  themeColor: "#22c55e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Vaultly",
  description: "Plataforma de gestão financeira com inteligência artificial.",
  appleWebApp: {
    capable: true,
    title: "Vaultly",
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${mulish.className} dark antialiased`}>
        <ClerkProvider
          appearance={{
            baseTheme: dark,
          }}
        >
          <PwaRegister />
          <div className="flex h-full flex-col overflow-hidden">{children}</div>
          <Toaster richColors theme="dark" />
        </ClerkProvider>
      </body>
    </html>
  );
}
