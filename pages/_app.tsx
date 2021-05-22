import Head from 'next/head';
import React from 'react';

import { GlobalStyle } from '@/components/GlobalStyle';

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link rel="shortcut icon" href="icons/favicon.ico" />
        <script
          type="text/javascript"
          src="//dapi.kakao.com/v2/maps/sdk.js?appkey=27b23dc85a0dcc560fd27104acd30069"
        />
      </Head>
      <GlobalStyle />
      <Component {...pageProps} />
    </>
  );
}

export default App;
