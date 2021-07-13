import { SHOW_BILL } from "../actions/types";

const INITIAL_STATE = {
  party: {},
  items: [],
};

export default function purchaseReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SHOW_BILL:
      return action.payload;
    default:
      return state;
  }
}
