import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}


// Essa pagina so será renderizada uma unica vez, que vai ser quando o usuario abrir o site.
// Todas as paginas serão renderizadas dentro do body desta pagina