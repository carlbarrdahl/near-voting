import React from "react";
import { Table, Thead, Tbody, Th, Tr, Td } from "@chakra-ui/react";

import Badge from "./shared/Badge";

const voteMap = ["Against", "For"];
function VotesTable({ votes = [] }) {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>
            Votes <Badge color="gray">{votes.length}</Badge>
          </Th>
          <Th>Reason</Th>
          <Th>Voted</Th>
        </Tr>
      </Thead>
      <Tbody>
        {votes.map((vote, i) => (
          <Tr key={vote.voter + i}>
            <Td>{vote.voter}</Td>
            <Td>{vote.reason}</Td>
            <Td>{voteMap[vote.support]}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

export default VotesTable;
