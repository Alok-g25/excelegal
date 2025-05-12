import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { ReduxProvider } from "@/app/redux/provider";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Head from "next/head"; // Import Head

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Excelegal | Admin",
  description: "Excelegal | Empowering students with quality education and resources online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastContainer autoClose={2000} />
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
