import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Student Profile",
  description: "generate student profile from bytrait",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" type="image/svg+xml" href="/bytrait.svg" />

      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#F4F5F8] red-hat`}
      >
        {children}
      </body>
    </html>
  );
}
