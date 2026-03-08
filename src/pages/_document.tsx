import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
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
