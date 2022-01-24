import React from "react";

import Badge from "./shared/Badge";

const statusMap = {
  executed: {
    color: "gray",
  },
  succeeded: {
    color: "green",
  },
  defeated: {
    color: "red",
  },
};

function ProposalStatus({ status, ...props }) {
  return (
    <Badge {...statusMap[status]} {...props}>
      {status}
    </Badge>
  );
}

export default ProposalStatus;
