// @nearfile

/*
 * This is an example of an AssemblyScript smart contract with two simple,
 * symmetric functions:
 *
 * 1. setGreeting: accepts a greeting, such as "howdy", and records it for the
 *    user (account_id) who sent the request
 * 2. getGreeting: accepts an account_id and returns the greeting saved for it,
 *    defaulting to "Hello"
 *
 * Learn more about writing NEAR smart contracts with AssemblyScript:
 * https://docs.near.org/docs/develop/contracts/as/intro
 *
 */

import {
  Context,
  context,
  logging,
  storage,
  u128,
  u256,
  PersistentMap,
  PersistentVector,
  util,
  base64,
  math,
  RNG,
} from "near-sdk-as";
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
  // const proposal = proposalsMap.getSome(proposalId);
  Proposal.execute(proposalId);
}
// Exported functions will be part of the public interface for your smart contract.
// Feel free to extract behavior to non-exported functions!
export function getGreeting(accountId: string): string | null {
  // This uses raw `storage.get`, a low-level way to interact with on-chain
  // storage for simple contracts.
  // If you have something more complex, check out persistent collections:
  // https://docs.near.org/docs/concepts/data-storage#assemblyscript-collection-types
  return storage.get<string>(accountId, "DEFAULT_MESSAGE");
}

export function setGreeting(message: string): void {
  const accountId = Context.sender;
  // Use logging.log to record logs permanently to the blockchain!
  logging.log(`Saving greeting "${message}" for account "${accountId}"`);
  storage.set(accountId, message);
}
