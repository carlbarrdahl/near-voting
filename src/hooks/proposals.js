import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNear } from "./near";

export const serialize = (args) =>
  Buffer.from(
    JSON.stringify(args).replaceAll('^"', "").replaceAll('"^', "")
  ).toString("base64");

export const deserialize = (str = "") => {
  try {
    return JSON.parse(Buffer.from(str, "base64").toString("utf-8"));
  } catch (error) {
    console.log("Error deserializing string into json", error);
    return {};
  }
};

export function useProposals() {
  const { accountId, contract } = useNear();
  return useQuery(["proposals"], () => contract.getProposals({ accountId }), {
    enabled: !!contract,
  });
}

export function useProposal(proposalId) {
  console.log("proposalId", proposalId);
  const { accountId, contract } = useNear();
  return useQuery(
    ["proposals", proposalId],
    () => contract.getProposal({ proposalId }).catch(console.log),
    {
      enabled: !!(contract && proposalId),
    }
  );
}
export function useVotes(proposalId) {
  console.log("Getting votes", proposalId);
  const { accountId, contract } = useNear();
  return useQuery(
    ["proposals", proposalId],
    () => contract.getVotes({ proposalId }).catch(console.log),
    {
      enabled: !!(contract && proposalId),
    }
  );
}

export function useCreateProposal() {
  const { contract } = useNear();
  return useMutation(
    ({ description, receiver, actions }) => {
      console.log("Creating proposal", description, receiver, actions);
      return contract
        ?.propose({
          args: {
            description,
            receiver,
            actions: actions.map((action) => ({
              ...action,
              args: serialize(JSON.parse(action.args)),
            })),
          },
        })
        .catch(console.log);
    },
    {
      enabled: !!contract?.propose,
    }
  );
}

export function useExecuteProposal() {
  const cache = useQueryClient();
  const { contract } = useNear();
  return useMutation(
    (proposalId) => {
      console.log("Executing proposal", proposalId);
      return contract?.execute({ args: { proposalId } }).then((proposals) => {
        cache.invalidateQueries(["proposals"]);
        cache.invalidateQueries(["proposals", proposalId]);
        return proposals;
      });
    },
    {
      enabled: !!contract?.propose,
    }
  );
}

export function useCastVote() {
  const cache = useQueryClient();
  const { accountId, contract } = useNear();
  return useMutation(
    ({ proposalId, support, reason }) => {
      console.log("Voting for proposal", proposalId, support, reason);
      return contract
        .castVote({ args: { proposalId, support, reason } })
        .then((vote) => {
          console.log("vote", vote);
          cache.invalidateQueries(["proposals", vote.proposalId]);
          return vote;
        })
        .catch(console.log);
    },
    {
      enabled: !!contract?.castVote,
    }
  );
}
