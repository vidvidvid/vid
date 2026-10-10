import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html
        lang="en"
        data-scroll-behavior="smooth"
        style={{ colorScheme: "dark" }}
      >
        <Head />
        <body style={{ margin: 0 }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
