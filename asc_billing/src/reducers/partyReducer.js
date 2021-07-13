import { SEARCH_PARTY, SELECT_PARTY } from "../actions/types";

export default function partyReducer(state = {}, action) {
  switch (action.type) {
    case SEARCH_PARTY:
      return action.payload;
    case SELECT_PARTY:
      return action.payload;
    default:
      return state;
  }
}
