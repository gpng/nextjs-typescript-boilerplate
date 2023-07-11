import { ChakraProvider } from '@chakra-ui/react';
import { NextSeo } from 'next-seo';
import type { AppProps } from 'next/app';
import { FC } from 'react';

const App: FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <NextSeo title="Singapore UEN Searcher" />
      <ChakraProvider resetCSS>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
};

export default App;
