// @nearfile

import { context, logging } from "near-sdk-as";
import { Proposal, Action, proposalsList, proposalsMap, Vote } from "./model";

export function propose(description: string, actions: Action[]): Proposal {
  const proposal = new Proposal(description, actions);
  proposalsMap.set(proposal.proposalId, proposal);
  proposalsList.push(proposal.proposalId);

  return proposal;
}

export function getProposals(): Proposal[] {
  const count = proposalsList.length;
  const result = new Array<Proposal>();
  for (let i = 0; i < count; i++) {
    let proposal = proposalsMap.get(proposalsList[i]);
    if (proposal) {
      proposal.status = proposal.getStatus();
      result[i] = proposal;
    }
  }
  return result;
}

export function getProposal(proposalId: string): Proposal {
  let proposal = proposalsMap.getSome(proposalId);
  proposal.status = proposal.getStatus();
  return proposal;
}

export function castVote(
  proposalId: string,
  support: u8,
  reason: string
): Vote {
  logging.log(`castVote: ${proposalId}`);
  const vote = Proposal.castVote(
    proposalId,
    context.predecessor,
    support,
    reason
  );

  logging.log(`Voted: ${support} - ${reason}`);

  return vote;
}

export function execute(proposalId: string): void {
  Proposal.execute(proposalId);
}
