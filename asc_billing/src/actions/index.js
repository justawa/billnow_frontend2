import {
  AUTH_LOGIN,
  AUTH_ERROR,
  AUTH_LOGOUT,
  UPDATE_URL,
  ADD_TO_CART,
  UPDATE_CART,
  UPDATE_CART_ITEM,
  UPDATE_CART_MODE_OF_PAYMENT,
  UPDATE_CART_TOTAL_AMOUNT,
  UPDATE_CART_AMOUNT_REPAY,
  UPDATE_CART_AMOUNT_PAID,
  UPDATE_CART_DISCOUNT,
  CLEAR_CART,
  SEARCH_CUSTOMER,
  SELECT_CUSTOMER,
  CLEAR_CUSTOMER,
  SEARCH_PARTY,
  SELECT_PARTY,
  SHOW_INVOICE,
  SHOW_BILL,
} from './types';
import billing from '../api/billing';

// const EMAIL = { initial: "nishant@admin.com", reports: "reports@admin.com" };
// const PASSWORD = { initial: "12345678", reports: "12345678" };

const permissions = {
  all: {
    name: 'all',
    redirectTo: '/',
  },
  reports: {
    name: 'reports',
    redirectTo: '/daily-sale-report',
  },
  dataEntrySale: {
    name: 'data-entry-sale',
    redirectTo: '/',
  },
  dataEntryPurchase: {
    name: 'data-entry-purchase',
    redirectTo: '/bill',
  },
  other: {
    name: 'other',
    redirectTo: '/',
  },
};

const users = [
  {
    email: 'all@admin.com',
    password: '12345678',
    permission: permissions.all,
  },
  {
    email: 'reports@admin.com',
    password: '12345678',
    permission: permissions.reports,
  },
  {
    email: 'dataentrysale@admin.com',
    password: '12345678',
    permission: permissions.dataEntrySale,
  },
  {
    email: 'dataentrypurchase@admin.com',
    password: '12345678',
    permission: permissions.dataEntryPurchase,
  },
  {
    email: 'other@admin.com',
    password: '12345678',
    permission: permissions.other,
  },
];

export const loginUser = (email, password, callback, formLoading) => {
  // if (EMAIL[type] === email && PASSWORD[type] === password) {
  //   localStorage.setItem("token", "ufkkhidfdsfkldjkrhghkvkcdfs");
  //   callback();
  //   if (type === "initial") {
  //     return { type: AUTH_LOGIN_INTIAL, payload: true };
  //   } else {
  //     return { type: AUTH_LOGIN_REPORTS, payload: true };
  //   }
  // } else {
  //   formLoading();
  //   return { type: AUTH_ERROR, payload: "Invalid Email or Password" };
  // }

  const foundUser = users.find(
    (user) => user.email === email && user.password === password
  );
  if (foundUser) {
    callback(foundUser.permission.redirectTo);
    return { type: AUTH_LOGIN, payload: foundUser };
  } else {
    formLoading();
    return { type: AUTH_ERROR, payload: 'Invalid Email or Password' };
  }
};

export const logoutUser = (callback) => async (dispatch) => {
  dispatch({ type: AUTH_LOGOUT, payload: '' });
  callback();
};

export const updateURL = (url) => {
  return { type: UPDATE_URL, payload: url };
};

export const addToCart = (item) => {
  const updatedItem = { ...item, discount: 0, price: 0, qty: 1 };
  delete updatedItem.created_at;
  delete updatedItem.updated_at;

  return { type: ADD_TO_CART, payload: updatedItem };
};

export const updateCart = (items) => {
  return { type: UPDATE_CART, payload: items };
};

export const updateCartItem = (items) => {
  return { type: UPDATE_CART_ITEM, payload: items };
};

export const updateCartModeOfPayment = (modeOfPayment) => {
  return { type: UPDATE_CART_MODE_OF_PAYMENT, payload: modeOfPayment };
};

export const updateCartTotalAmount = (totalAmount) => {
  return { type: UPDATE_CART_TOTAL_AMOUNT, payload: totalAmount };
};

export const updateCartAmountRepay = (amountRepay) => {
  return { type: UPDATE_CART_AMOUNT_REPAY, payload: amountRepay };
};

export const updateCartAmountPaid = (amountPaid) => {
  return { type: UPDATE_CART_AMOUNT_PAID, payload: amountPaid };
};

export const updateCartDiscount = (discount) => {
  return { type: UPDATE_CART_DISCOUNT, payload: discount };
};

export const searchCustomerByPhone = (phone, openModal) => async (dispatch) => {
  try {
    const response = await billing.post('search-customer', {
      phone,
    });
    dispatch({
      type: SEARCH_CUSTOMER,
      payload: response.data.searched_customer,
    });
    openModal();
    // cb();
  } catch (err) {
    console.log(err);
  }
};

export const updateCustomer = (
  id,
  { name, address, city, state, pincode, card },
  closeModal
) => async (dispatch) => {
  try {
    const response = await billing.put(`update-customer/${id}`, {
      name,
      billing_address: address,
      billing_city: city,
      billing_state: state,
      billing_pincode: pincode,
      card: card,
    });
    dispatch({
      type: SELECT_CUSTOMER,
      payload: response.data.selected_customer,
    });
    closeModal();
  } catch (err) {
    console.log(err);
  }
};

export const selectCustomer = (customer, closeModal) => {
  closeModal();
  return { type: SEARCH_CUSTOMER, payload: customer };
};

export const searchPartyByPhone = (phone, openModal) => async (dispatch) => {
  try {
    const response = await billing.post('search-party', {
      phone,
    });
    dispatch({
      type: SEARCH_PARTY,
      payload: response.data.searched_party,
    });
    openModal();
    // cb();
  } catch (err) {
    console.log(err);
  }
};

export const updateParty = (
  id,
  { name, address, city, state, pincode },
  closeModal
) => async (dispatch) => {
  try {
    const response = await billing.put(`update-party/${id}`, {
      name,
      billing_address: address,
      billing_city: city,
      billing_state: state,
      billing_pincode: pincode,
    });
    dispatch({
      type: SELECT_PARTY,
      payload: response.data.selected_party,
    });
    closeModal();
  } catch (err) {
    console.log(err);
  }
};

export const selectParty = (party, closeModal) => {
  closeModal();
  return { type: SEARCH_PARTY, payload: party };
};

export const createBill = (data, party, successMessage, failMessage) => async (
  dispatch
) => {
  try {
    const {
      tableData,
      payment_mode,
      total_amount,
      amount_repay,
      amount_paid,
      discount,
      tax_type,
    } = data;

    const response = await billing.post('create-bill', {
      items: JSON.stringify(tableData),
      payment_mode: payment_mode,
      total_amount: total_amount,
      amount_repay: amount_repay,
      amount_paid: amount_paid,
      discount: discount,
      party_id: party.id,
      tax_type: tax_type,
    });

    console.log(response.data);
    successMessage({
      headMessage: 'Success',
      bodyMessage: ['Purchase created successfully'],
      messageColor: 'green',
    });
  } catch (err) {
    console.log(err);
    failMessage({
      headMessage: 'Failure',
      bodyMessage: ['Failed to create purchase. Please try again'],
      messageColor: 'red',
    });
  }
};

export const createInvoice = (data, customer, redirect) => async (dispatch) => {
  try {
    const {
      items,
      payment_mode,
      total_amount,
      amount_repay,
      amount_paid,
      discount,
    } = data;

    const response = await billing.post('create-invoice', {
      items: JSON.stringify(items),
      payment_mode: payment_mode,
      total_amount: total_amount,
      amount_repay: amount_repay,
      amount_paid: amount_paid,
      discount: discount,
      customer_id: customer.id,
    });
    dispatch({ type: CLEAR_CART, payload: '' });
    dispatch({ type: CLEAR_CUSTOMER });
    return redirect(response.data.sale.id);
  } catch (err) {
    console.log(err);
  }
};

export const clearCart = () => {
  return { type: CLEAR_CART, payload: '' };
};

export const showInvoice = (id) => async (dispatch) => {
  try {
    const response = await billing.get(`invoice/${id}`);
    dispatch({ type: SHOW_INVOICE, payload: response.data.sale });
  } catch (err) {
    console.log(err);
  }
};

export const showBill = (id) => async (dispatch) => {
  try {
    const response = await billing.get(`bill/${id}`);
    dispatch({ type: SHOW_BILL, payload: response.data.purchase });
  } catch (err) {
    console.log(err);
  }
};
