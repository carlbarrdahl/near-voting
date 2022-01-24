import React from "react";
import { Flex, Box, Heading, Text, Divider } from "@chakra-ui/react";

function formatDate(date) {
  if (!date) {
    return "";
  }
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  };
  return new Intl.DateTimeFormat("en-US", options).format(new Date(+date));
}

function ProposalInformation({ proposer, startBlock, endBlock }) {
  const list = [
    {
      title: "Author",
      data: proposer,
    },
    {
      title: "Start date",
      data: formatDate(startBlock),
    },
    {
      title: "End date",
      data: formatDate(endBlock),
    },
  ];
  return (
    <Box borderColor="gray.300" borderWidth={1} mb={6}>
      <Heading as="h4" fontSize="md" p={4}>
        Information
      </Heading>

      <Divider />
      <Box p={4}>
        {list.map((item, i) => (
          <Flex key={i} justifyContent="space-between">
            <Text color="gray.500" fontWeight="bold">
              {item.title}
            </Text>
            <Text>{item.data}</Text>
          </Flex>
        ))}
      </Box>
    </Box>
  );
}

export default ProposalInformation;
