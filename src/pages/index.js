import React from "react";

import Layout from "../components/shared/Layout";
import ProposalsTable from "../components/ProposalsTable";

import { useProposals } from "../hooks/proposals";

export default function Index() {
  const { data = [] } = useProposals();

  return (
    <Layout>
      <ProposalsTable proposals={data} />
    </Layout>
  );
}
