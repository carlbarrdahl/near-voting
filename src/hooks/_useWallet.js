import { connect, Contract, keyStores, WalletConnection } from "near-api-js";
import { useEffect, useState } from "react";

import getConfig from "../config";

// const { networkId } = getConfig(process.env.NODE_ENV || "development");

const nearConfig = getConfig(process.env.NODE_ENV || "development");

export function useWallet() {
  const [state, setState] = useState({
    accountId: null,
    contract: null,
    isLoading: true,
  });
  useEffect(() => {
    // Initialize connection to the NEAR testnet
    connect(
      Object.assign(
        { deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } },
        nearConfig
      )
    )
      .then(async (near) => {
        // Initializing Wallet based Account. It can work with NEAR testnet wallet that
        // is hosted at https://wallet.testnet.near.org
        const walletConnection = new WalletConnection(near);

        // Getting the Account ID. If still unauthorized, it's just empty string
        const accountId = walletConnection.getAccountId();

        // Initializing our contract APIs by contract name and configuration
        const contract = await new Contract(
          walletConnection.account(),
          nearConfig.contractName,
          {
            viewMethods: ["getProposals"],
            changeMethods: ["propose", "castVote"],
          }
        );

        setState({ isLoading: false, accountId, contract });
      })
      .catch((err) => setState({ error: err.toString() }));
  }, []);

  return state;
}
