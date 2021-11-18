import React, { FC } from 'react';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';

const App: FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider resetCSS>
      <Component {...pageProps} />
    </ChakraProvider>
  );
};

export default App;
