import React from "react";
import { Heading, Text } from "@chakra-ui/react";

import ProposalStatus from "./ProposalStatus";

function ProposalDetails({ description, status }) {
  return (
    <>
      <Heading as="h2" fontSize="2xl" mb={2}>
        {description}
      </Heading>
      <ProposalStatus status={status} mb={2} />
      {/* <Text mb={4}>Description</Text> */}
    </>
  );
}

export default ProposalDetails;
