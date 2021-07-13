import {
  ADD_TO_CART,
  UPDATE_CART,
  UPDATE_CART_ITEM,
  UPDATE_CART_MODE_OF_PAYMENT,
  UPDATE_CART_TOTAL_AMOUNT,
  UPDATE_CART_AMOUNT_REPAY,
  UPDATE_CART_AMOUNT_PAID,
  UPDATE_CART_DISCOUNT,
  CLEAR_CART,
} from '../actions/types';

const INITIAL_STATE = {
  items: [],
  payment_mode: 'cash',
  total_amount: 0,
  item_amount: 0,
  item_gst: 0,
  amount_repay: 0,
  amount_paid: 0,
  discount: 0,
};

export default function cartReducer(state = INITIAL_STATE, action) {
  if (action.type === ADD_TO_CART) {
    const itemCost = Number(
      action.payload.sale_price * action.payload.qty
    ).toFixed(2);
    action.payload.price = itemCost;
    const newState = { ...state, items: [action.payload, ...state.items] };
    let itemTotal = newState.items.reduce(
      (total, item) =>
        Number(parseFloat(total) + parseFloat(item.price)).toFixed(2),
      0
    );
    itemTotal -= newState.discount;
    return {
      ...newState,
      total_amount: itemTotal,
      amount_repay: itemTotal,
    };
  }

  if (action.type === UPDATE_CART) {
    const newState = { ...state, items: action.payload };
    let itemTotal = newState.items.reduce(
      (total, item) =>
        Number(parseFloat(total) + parseFloat(item.price)).toFixed(2),
      0
    );
    // const totalItemPrice = newState.items.reduce((total, item) => {
    //   return Number(total + item.price).toFixed(2);
    // }, 0);
    // const totalItemGst = newState.items.reduce((total, item) => {
    //   let { calculated_gst, qty } = item;
    //   calculated_gst = calculated_gst || 0;
    //   return Number(total + calculated_gst * qty).toFixed(2);
    // }, 0);
    itemTotal -= newState.discount;
    return {
      ...newState,
      total_amount: itemTotal,
      amount_repay: itemTotal,
    };
  }

  if (action.type === UPDATE_CART_ITEM) {
    // const filteredItems = state.items.filter(
    //   (item) => item.id !== action.payload.id
    // );
    const newState = { ...state, items: action.payload };
    let itemTotal = newState.items.reduce(
      (total, item) =>
        Number(parseFloat(total) + parseFloat(item.price)).toFixed(2),
      0
    );
    // const totalItemPrice = newState.items.reduce((total, item) => {
    //   return Number(total + item.price).toFixed(2);
    // }, 0);
    // const totalItemGst = newState.items.reduce((total, item) => {
    //   let { qty } = item;
    //   return Number(total * qty).toFixed(2);
    // }, 0);
    itemTotal -= newState.discount;
    return {
      ...newState,
      total_amount: itemTotal,
      amount_repay: itemTotal,
    };
  }

  if (action.type === UPDATE_CART_MODE_OF_PAYMENT) {
    return { ...state, payment_mode: action.payload };
  }

  if (action.type === UPDATE_CART_TOTAL_AMOUNT) {
    return { ...state, total_amount: action.payload };
  }

  if (action.type === UPDATE_CART_AMOUNT_REPAY) {
    return { ...state, amount_repay: action.payload };
  }

  if (action.type === UPDATE_CART_AMOUNT_PAID) {
    const amount_paid = action.payload || 0;
    const amount_repay = Number(
      parseFloat(state.total_amount) - parseFloat(amount_paid)
    ).toFixed(2);
    return {
      ...state,
      amount_paid: action.payload,
      amount_repay: amount_repay,
    };
  }

  if (action.type === UPDATE_CART_DISCOUNT) {
    const newState = { ...state, discount: action.payload };
    let itemTotal = newState.items.reduce(
      (total, item) =>
        Number(parseFloat(total) + parseFloat(item.price)).toFixed(2),
      0
    );
    itemTotal -= newState.discount;
    return {
      ...newState,
      total_amount: itemTotal,
      amount_repay: itemTotal,
    };
  }

  if (action.type === CLEAR_CART) {
    return { ...INITIAL_STATE };
  }

  return state;
}
