import { UPDATE_URL } from "../actions/types";

export default function saleReducer(state = "/", action) {
  switch (action.type) {
    case UPDATE_URL:
      return action.payload;
    default:
      return state;
  }
}
