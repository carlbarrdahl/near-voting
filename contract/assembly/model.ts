// @nearfile

import {
  context,
  base64,
  u128,
  logging,
  ContractPromise,
  RNG,
  PersistentMap,
  PersistentVector,
} from "near-sdk-as";

export const proposalsMap = new PersistentMap<string, Proposal>("proposals");
export const proposalsList = new PersistentVector<string>("list");

@nearBindgen
export class Action {
  contract_name: string;
  method_name: string;
  args: string;
  deposit: string;
  gas: string;
}

@nearBindgen
export class Proposal {
  proposalId: string;
  proposer: string;
  // receiver: string;
  startBlock: u64;
  endBlock: u64;
  description: string;
  executed: bool = false;
  status: string;
  actions: Action[];
  votes: Vote[];

  static castVote(
    proposalId: string,
    account: string,
    support: u8,
    reason: string
  ): Vote {
    const proposal = proposalsMap.getSome(proposalId);
    const vote = new Vote(proposalId, account, support, reason);
    logging.log("Pushing vote");
    proposal.votes.push(vote);
    proposalsMap.set(proposalId, proposal);
    logging.log(proposal.votes.length);

    return vote;
  }

  constructor(description: string, actions: Action[]) {
    const rng = new RNG<u32>(1, u32.MAX_VALUE);
    this.proposalId = rng.next().toString();
    this.proposer = context.predecessor;
    this.startBlock = context.blockTimestamp / 1000000;
    this.endBlock = this.startBlock + 7 * 24 * 3600 * 1000;
    this.description = description;
    this.actions = actions;
    this.votes = [];

    logging.log(this.proposalId);
  }
  _hasSupport(): bool {
    let forVotes = 0;
    for (let i = 0; i < this.votes.length; i++) {
      forVotes += this.votes[i].support === 1 ? 1 : 0;
    }

    return forVotes > this.votes.length / 2;
  }

  getStatus(): string {
    if (this.executed) {
      return "executed";
    }
    // if (this.startBlock > context.blockTimestamp / 1000000) {
    //   return "pending";
    // }
    if (this.endBlock > context.blockTimestamp / 1000000) {
      return "active";
    }
    if (this._hasSupport()) {
      return "succeeded";
    } else {
      return "defeated";
    }
  }

  static execute(proposalId: string): ContractPromise {
    const proposal = proposalsMap.getSome(proposalId);
    assert(proposal, "Proposal not found");
    const status = proposal.getStatus();
    // assert(status === "succeeded", "Proposal was not successful");

    logging.log(`Executing: ${proposal.proposalId}`);
    logging.log(`status: ${proposal.executed}`);
    logging.log(`status: ${proposal.getStatus()}`);
    const actions = new Array<ContractPromise>();
    for (let i = 0; i < proposal.actions.length; i++) {
      const action = proposal.actions[i];
      logging.log(`Contract name: ${action.contract_name}`);
      logging.log(`Method: ${action.method_name}`);
      logging.log(`Args: ${action.args}`);
      actions.push(
        ContractPromise.create(
          action.contract_name,
          action.method_name,
          base64.decode(action.args),
          20000000000000, // U64.parseInt(action.gas)
          u128.Zero // action.deposit ? u128.fromString(action.deposit) : u128.Zero
        )
      );
    }

    proposal.executed = true;
    proposalsMap.set(proposal.proposalId, proposal);

    logging.log(`${actions.length} actions to execute...`);
    return ContractPromise.all(actions);
  }
}

@nearBindgen
export class Vote {
  voter: string;
  proposalId: string;
  support: u8;
  reason: string;
  constructor(proposalId: string, voter: string, support: u8, reason: string) {
    this.proposalId = proposalId;
    this.voter = voter;
    this.support = support;
    this.reason = reason;
  }
}
