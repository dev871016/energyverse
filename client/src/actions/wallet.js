import { SET_WALLET } from "./types";

// set wallet
export const setWallet = (walletAddress) => (dispatch) => {
  dispatch({
    type: SET_WALLET,
    payload: walletAddress,
  });
};
