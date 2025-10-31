import "./globals.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { UserProvider } from "@/context/UserContext";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Pages & Peace Finances",
  description: "Internal accounting system for Pages & Peace",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
