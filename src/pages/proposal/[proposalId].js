import React from "react";
import { useRouter } from "next/router";
import Layout from "../../components/shared/Layout";
import { useProposal } from "../../hooks/proposals";

import { SimpleGrid, Box } from "@chakra-ui/layout";

import ProposalDetails from "../../components/ProposalDetails";
import VotesTable from "../../components/VotesTable";
import VoteBox from "../../components/VoteBox";
import ProposalInformation from "../../components/ProposalInformation";
import VoteResults from "../../components/VoteResults";
import Actions from "../../components/Actions";
import ExecuteButton from "../../components/ExecuteButton";

export default function ProposalDetailsPage() {
  const router = useRouter();
  const { data: proposal = {} } = useProposal(router.query.proposalId);
  console.log("ProposalDetailsPage", proposal);

  return (
    <Layout title={proposal.description}>
      <SimpleGrid spacingX={8} templateColumns={["1fr", "1fr", "2fr 1fr"]}>
        <Box>
          <ProposalDetails {...proposal} />
          <Actions {...proposal} />
          <VoteBox {...proposal} />
          <VotesTable votes={proposal?.votes} />
        </Box>
        <Box>
          <ProposalInformation {...proposal} />
          <VoteResults {...proposal} />
          <ExecuteButton
            status={proposal?.status}
            proposalId={proposal?.proposalId}
            isFullWidth
          />
        </Box>
      </SimpleGrid>
    </Layout>
  );
}
