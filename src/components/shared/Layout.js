import React from "react";
import NextLink from "next/link";
import Head from "next/head";
import { Flex, Box, Container } from "@chakra-ui/react";

import { useAuth } from "../../hooks/auth";

import Button from "./Button";

function NavLink(props) {
  return (
    <NextLink passHref {...props}>
      <Button as={"a"} mr={4} variant="ghost" colorScheme="gray">
        {props.children}
      </Button>
    </NextLink>
  );
}
function Layout({ children, title }) {
  const { isSignedIn, accountId, signIn, signOut } = useAuth();

  return (
    <Box minHeight="100vh">
      <Head>
        <title>NEAR On-Chain Voting - {title}</title>
        <meta name="description" content="Near On-Chain Voting" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex mb={4} borderBottom="1px" borderColor="gray.300">
        <Container
          as={Flex}
          p={4}
          maxWidth="container.lg"
          justifyContent="space-between"
        >
          <Box>
            <NavLink href="/">Home</NavLink>
            <NavLink href="/proposal/new">New proposal</NavLink>
          </Box>
          {isSignedIn ? (
            <Button colorScheme="gray" onClick={signOut}>
              Sign out {accountId}
            </Button>
          ) : (
            <Button colorScheme="gray" onClick={signIn}>
              Connect wallet
            </Button>
          )}
        </Container>
      </Flex>
      <Container maxWidth="container.lg" mb={24}>
        {children}
      </Container>
    </Box>
  );
}

export default Layout;
