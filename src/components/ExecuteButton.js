import React from "react";
import { Spinner } from "@chakra-ui/react";

import { useExecuteProposal } from "../hooks/proposals";
import Button from "./shared/Button";

function ExecuteButton({ proposalId, status, ...props }) {
  const { mutateAsync: executeProposal, isLoading } = useExecuteProposal();
  function handleExecute() {
    return executeProposal(proposalId);
  }

  const canExecute = status === "succeeded";

  return canExecute ? (
    <Button
      disabled={isLoading || !canExecute}
      onClick={handleExecute}
      {...props}
    >
      {isLoading ? <Spinner /> : "Execute"}
    </Button>
  ) : null;
}

export default ExecuteButton;
