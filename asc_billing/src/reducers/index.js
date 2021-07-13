import { combineReducers } from "redux";
import cartReducer from "./cartReducer";
import customerReducer from "./customerReducer";
import partyReducer from "./partyReducer";
import saleReducer from "./saleReducer";
import purchaseReducer from "./purchaseReducer";
import authReducer from "./authReducer";
import urlReducer from "./urlReducer";

export default combineReducers({
  cart: cartReducer,
  customer: customerReducer,
  party: partyReducer,
  sale: saleReducer,
  purchase: purchaseReducer,
  auth: authReducer,
  redirectURL: urlReducer,
});
