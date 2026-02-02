import type { AppProps } from "next/app";
import { Work_Sans, Satisfy } from "next/font/google";
import { Header } from "@/presentation/shared/components/header/Header";
import "@/styles/globals.css";

const workSansDisplay = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const satisfyDisplay = Satisfy({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-satisfy",
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${workSansDisplay.className} ${satisfyDisplay.variable} h-screen`}>
      <Header />

      <Component {...pageProps} />
    </div>
  );
}
