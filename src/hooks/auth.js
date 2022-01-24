import { useEffect, useState } from "react";
import { useNear } from "./near";

export function useAuth() {
  const [state, setState] = useState({});
  const { walletConnection, config } = useNear();

  useEffect(() => {
    if (walletConnection && !state.isSignedIn) {
      const isSignedIn = walletConnection.isSignedIn();
      setState({ isSignedIn, accountId: walletConnection.getAccountId() });
    }
  }, [walletConnection, state.isSignedIn]);

  return {
    ...state,
    signIn: () => walletConnection.requestSignIn(config.contractName),
    signOut: () => {
      walletConnection.signOut();
      window.location.replace(
        window.location.origin + window.location.pathname
      );
    },
  };
}
