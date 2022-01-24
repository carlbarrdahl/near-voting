import React from "react";
import NextLink from "next/link";
import {
  Flex,
  Box,
  HStack,
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  Td,
  Image,
  Heading,
  LinkBox,
  LinkOverlay,
  Text,
} from "@chakra-ui/react";

import { truncate } from "../utils/format";
import { useProposals } from "../hooks/proposals";
import ProposalStatus from "./ProposalStatus";
import ExecuteButton from "./ExecuteButton";

function ProposalRow({ proposalId, status, description }) {
  return (
    <LinkBox as={Tr}>
      <Td>
        <Flex>
          {/* <Image src={"http://placehold.it/48x48"} alt="icon" mr={4} /> */}
          <Box>
            <NextLink passHref href={`/proposal/${proposalId}`}>
              <LinkOverlay>
                <Heading as="h3" fontSize="lg" mb={2}>
                  {description}
                </Heading>
              </LinkOverlay>
            </NextLink>
            <Text color="gray.500" fontSize="sm">
              <ProposalStatus status={status} mr={2} />• ID:{" "}
              {truncate(proposalId, 12)}
            </Text>
          </Box>
        </Flex>
      </Td>
      <Td isNumeric>
        <HStack justifyContent="flex-end">
          <ExecuteButton status={status} proposalId={proposalId} />
        </HStack>
      </Td>
    </LinkBox>
  );
}

function ProposalsTable({ proposals = [] }) {
  const { data = [], error, isLoading } = useProposals();
  console.log("proposals", data);
  return (
    <Box>
      <Table>
        <Thead>
          <Tr>
            <Th>Proposal</Th>
            <Th isNumeric>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {proposals
            .sort((a, b) => (+a.startBlock < +b.startBlock ? 1 : -1))
            .map((proposal) => (
              <ProposalRow key={proposal.proposalId} {...proposal} />
            ))}
        </Tbody>
      </Table>
    </Box>
  );
}

export default ProposalsTable;
