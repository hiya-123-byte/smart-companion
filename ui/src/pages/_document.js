import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Lexend Font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;600&display=swap"
          rel="stylesheet"
        />

        {/* OpenDyslexic Font */}
        <link
          href="https://fonts.cdnfonts.com/css/opendyslexic"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}