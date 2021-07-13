import {
  SEARCH_CUSTOMER,
  SELECT_CUSTOMER,
  CLEAR_CUSTOMER,
} from "../actions/types";

export default function customerReducer(state = {}, action) {
  switch (action.type) {
    case SEARCH_CUSTOMER:
      return action.payload;
    case SELECT_CUSTOMER:
      return action.payload;
    case CLEAR_CUSTOMER:
      return {};
    default:
      return state;
  }
}
