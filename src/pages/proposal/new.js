import React from "react";
import { useRouter } from "next/router";
import Layout from "../../components/shared/Layout";

import { SimpleGrid, Heading, Box } from "@chakra-ui/layout";

import ProposalForm from "../../components/ProposalForm";
import { useCreateProposal } from "../../hooks/proposals";

export default function ProposalDetailsPage() {
  const router = useRouter();
  const { mutateAsync: createProposal, isLoading, error } = useCreateProposal();

  const handleCreate = (data) => {
    createProposal(data).then((proposal) =>
      router.push(`/proposal/${proposal.proposalId}`)
    );
  };

  return (
    <Layout title="New Proposal">
      <Heading as="h3" fontSize="2xl" mb={4}>
        New proposal
      </Heading>
      <SimpleGrid spacingX={8} templateColumns={["1fr", "1fr", "2fr 1fr"]}>
        <Box>
          <ProposalForm onCreate={handleCreate} isLoading={isLoading} />
        </Box>
      </SimpleGrid>
    </Layout>
  );
}
