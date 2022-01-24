import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

import NearProvider from "../hooks/near";

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <NearProvider>
          <Component {...pageProps} />
        </NearProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}
export default MyApp;
