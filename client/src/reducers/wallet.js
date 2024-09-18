import { SET_WALLET } from "../actions/types";

const initialState = {
  wallet: "",
};

export default function wallet(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_WALLET:
      return {
        wallet: payload,
      };
    default:
      return state;
  }
}
