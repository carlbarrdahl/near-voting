import React from "react";
import { Flex, Box, Heading, Progress, Text, Divider } from "@chakra-ui/react";

function calcVotes(votes) {
  return (
    +Math.round(
      (votes.reduce((sum, x) => sum + x.support, 0) / votes.length) * 100
    ) || 0
  );
}

function VoteResults({ votes = [] }) {
  const support = calcVotes(votes);

  const results = [
    {
      title: "For",
      data: support,
    },
    {
      title: "Against",
      data: support ? 100 - support : 0,
    },
  ];
  return (
    <Box borderColor="gray.300" borderWidth={1} mb={6}>
      <Heading as="h4" fontSize="md" p={4}>
        Current results
      </Heading>

      <Divider />
      <Box p={4}>
        {results.map((result) => (
          <Box key={result.title} mb={3}>
            <Flex justifyContent="space-between" mb={1}>
              <Text>{result.title}</Text>
              <Text>{result.data}%</Text>
            </Flex>
            <Progress value={result.data} size="sm" colorScheme="green" />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default VoteResults;
