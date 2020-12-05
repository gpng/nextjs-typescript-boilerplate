import React, { FC } from 'react';
import type { AppProps } from 'next/app';
// styles
import 'normalize.css';

const App: FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Component {...pageProps} />
      <style global jsx>{`
        *,
        *:before,
        *:after {
          box-sizing: border-box;
        }

        p {
          margin: 0;
        }

        button {
          cursor: pointer;
          outline: none;
        }

        button:focus {
          outline: none;
        }
      `}</style>
    </>
  );
};

export default App;
