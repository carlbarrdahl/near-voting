import React from "react";
import { Box, Heading, Text, Divider } from "@chakra-ui/react";

import { deserialize } from "../hooks/proposals";

function Actions({ actions = [] }) {
  return (
    <Box borderColor="gray.300" borderWidth={1} mb={6}>
      <Heading as="h4" fontSize="md" p={4}>
        Actions
      </Heading>
      <Divider />
      <Box p={4}>
        {actions.map((action, i) => (
          <Text key={i} as="pre" fontSize="xs">
            {JSON.stringify(
              { ...action, args: deserialize(action.args) },
              null,
              2
            )}
          </Text>
        ))}
      </Box>
    </Box>
  );
}

export default Actions;
