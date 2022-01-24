import { connect, Contract, keyStores, WalletConnection } from "near-api-js";
import React, { createContext, useContext, useEffect, useState } from "react";

import getConfig from "../config";

const config = getConfig(process.env.NODE_ENV || "development");

const NearContext = createContext({});

export function useNear(props) {
  return useContext(NearContext);
}

function useWallet() {
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
        config
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
          config.contractName,
          {
            viewMethods: ["getProposals", "getProposal"],
            changeMethods: ["propose", "castVote", "execute"],
          }
        );

        setState({
          isLoading: false,
          accountId,
          contract,
          config,
          walletConnection,
        });
      })
      .catch((err) => setState({ error: err.toString() }));
  }, []);

  return state;
}

export default function NearProvider(props) {
  const state = useWallet();
  return (
    <NearContext.Provider value={state}>{props.children}</NearContext.Provider>
  );
}
