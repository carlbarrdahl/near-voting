import { serialize } from "borsh";
import { base_decode, base_encode } from "near-api-js/lib/utils/serialize";
import { transactions, utils } from "near-api-js";

const testContractAddress = "dev-1642959524227-28531923083634";

beforeAll(async function () {
  // NOTE: nearlib and nearConfig are made available by near-cli/test_environment
  const near = await nearlib.connect(nearConfig);
  window.accountId = nearConfig.contractName;
  window.contract = await near.loadContract(nearConfig.contractName, {
    viewMethods: ["getProposals"],
    changeMethods: ["propose", "castVote", "execute"],
    sender: window.accountId,
  });

  // window.testContract = await near.loadContract(testContractAddress, {
  //   viewMethods: ["getGreeting"],
  //   sender: window.accountId,
  // });

  window.walletConnection = {
    requestSignIn() {},
    signOut() {},
    isSignedIn() {
      return true;
    },
    getAccountId() {
      return window.accountId;
    },
  };
});
test(
  "propose",
  async () => {
    const bufferizeArgs = (args) =>
      Buffer.from(
        JSON.stringify(args).replaceAll('^"', "").replaceAll('"^', "")
      ).toString("base64");

    const proposal = await window.contract.propose({
      args: {
        description: "Test proposal",
        actions: [
          {
            contract_name: testContractAddress,
            method_name: "setGreeting",
            args: bufferizeArgs({ message: "proposal executed" }, null, 2),
            gas: "0",
            deposit: "0",
          },
          // {
          //   contract_name: "dev-1642959524227-28531923083634",
          //   method_name: "transfer",
          //   args: JSON.stringify(
          //     {
          //       to: "wallet.near",
          //       tokens: utils.format.parseNearAmount("0.01"),
          //     },
          //     null,
          //     2
          //   ),
          //   gas: "150000000000000",
          //   deposit: "0",
          // },
        ],

        //   {
        //     contract_name: "contactName",
        //     method_name: "transfer",
        //     args: bufferizeArgs({
        //       receiver: "contractAddress",
        //       amount: 1,
        //       memo: "memo",
        //     }),
        //     deposit: "1",
        //     gas: "150000000000000",
        //   },
        // ],
      },
    });

    console.log("pid", proposal.proposalId);

    await window.contract.castVote({
      args: {
        proposalId: proposal.proposalId,
        support: 1,
        reason: "test-reason",
      },
    });

    const proposals = await window.contract.getProposals({
      accountId: window.accountId,
    });

    // const greeting = await window.testContract.getGreeting();

    // console.log("Greeting", greeting);
    await window.contract.execute({
      args: { proposalId: proposal.proposalId },
    });

    // const votes = await window.contract.getVotes({
    //   accountId: window.accountId,
    //   args: { proposalId: proposal.proposalId },
    // });
    console.log(JSON.stringify(proposals, null, 2));
    // console.log(JSON.stringify(vote, null, 2));
    expect(proposals).toEqual([]);
    // expect(vote).toEqual([]);
  },
  60 * 1000
);

test.skip("getGreeting cross-contract", async () => {
  // const greeting = await window.testContract.getGreeting();
  // console.log("Greeting", greeting);
  // expect(greeting).toEqual("");
});
