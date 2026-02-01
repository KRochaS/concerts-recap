import { Html, Head, Main, NextScript } from "next/document";
import { JSX } from "react";

export default function Document() {
  return (
    <Html lang="en" className="app-background">
      <Head />
      <body className="antialiased text-content-body">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
  
}
