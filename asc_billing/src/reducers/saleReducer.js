import { SHOW_INVOICE } from "../actions/types";

const INITIAL_STATE = {
  customer: {},
  items: [],
};

export default function saleReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SHOW_INVOICE:
      return action.payload;
    default:
      return state;
  }
}
