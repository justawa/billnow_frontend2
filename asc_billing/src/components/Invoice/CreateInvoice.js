import React, { Component } from 'react';
import {
  Button,
  FormGroup,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  Input,
  Table,
  Row,
  Col,
  Label,
} from 'reactstrap';
import { connect } from 'react-redux';
import {
  updateCart,
  updateCartItem,
  updateCartModeOfPayment,
  updateCartTotalAmount,
  updateCartAmountRepay,
  updateCartAmountPaid,
  updateCartDiscount,
  clearCart,
  createInvoice,
} from '../../actions';
import billing from '../../api/billing';
import SidebarLayout from '../Layouts/SidebarLayout';
import Sidebar from '../Sidebar';
import AddCustomer from '../AddCustomer';
import SearchItem from '../SearchItem';
import requireAuth from '../../helpers/requireAuth';

class CreateInvoice extends Component {
  state = {
    message: {
      headMessage: '',
      bodyMessage: [],
      messageColor: '',
    },
    latestSales: [],
  };

  componentDidMount = async () => {
    // this.props.clearCart();
    try {
      const response = await billing.get('last-customers');
      this.setState({ latestSales: response.data.latestSales });
    } catch (err) {
      console.log(err);
    }
  };

  removeFromCart = (id) => {
    const { items } = this.props.cart;
    const filteredItems = items.filter((item) => item.id !== id);
    this.props.updateCart(filteredItems);
  };

  updateQty = (e, idx) => {
    this.getItemFromIdAndCalculatePrice(idx, e.target.value);
  };

  // updateDiscount = (e, id, calculated_gst) => {
  //   this.getItemFromIdAndCalculatePrice(
  //     id,
  //     "discount",
  //     e.target.value,
  //     calculated_gst
  //   );
  // };

  getItemFromIdAndCalculatePrice = (idx, value) => {
    const { items } = this.props.cart;
    items[idx].qty = Number(value);
    const itemCost = Number(items[idx].sale_price * items[idx].qty).toFixed(2);
    items[idx].price = itemCost;
    // since the object are reference type, passing it to function and changing its value will change original object ie "foundItem"
    // so passing "foundItem" in calculateItemPrice will change original "foundItem" values
    // this.calculateItemPrice(foundItem);
    console.log('items', items);
    const updatedItems = [...items];
    this.props.updateCartItem(updatedItems);
  };

  // calculateItemPrice = (foundItem) => {
  //   const itemCost = Number(foundItem.sale_price * foundItem.qty).toFixed(2);
  //   foundItem.price = itemCost;
  // };

  renderTableBody = () => {
    const { cart } = this.props;
    return cart.items.length ? (
      cart.items.map((item, idx) => (
        <tr key={item.id}>
          <td>
            <button
              onClick={() => this.removeFromCart(item.id)}
              className='btn btn-danger btn-sm'
            >
              <i className='fa fa-times' aria-hidden='true'></i>
            </button>
          </td>
          <td>{idx + 1}</td>
          <td>{item.product_code}</td>
          <td>{item.product_name}</td>
          <td>{item.mrp}</td>
          {/* <td>{item.discount}</td> */}
          <td>{item.sale_price}</td>
          <td>{item.gst + '%'}</td>
          {/* <td>{this.calculatedGst(item)}</td> */}
          <td>
            <input
              type='number'
              className='form-control'
              min='0'
              onChange={(e) => this.updateQty(e, idx)}
              value={item.qty}
            />
            {/* <span
              style={{ color: "red", fontSize: 10 }}
            >{`${item.qty} remaining`}</span> */}
          </td>
          <td>{item.price}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan='10' className='text-center'>
          No Item in cart.
        </td>
      </tr>
    );
  };

  calculatedGst = (item) => {
    const { sale_price, gst, qty } = item;
    const calculated_gst = Number(
      sale_price - sale_price * (100 / (100 + parseFloat(gst)))
    ).toFixed(2);
    item.calculated_gst = calculated_gst;
    return Number(calculated_gst * qty).toFixed(2);
  };

  handleInvoiceSubmit = () => {
    this.props.createInvoice(
      this.props.cart,
      this.props.customer,
      (id) => this.props.history.push(`invoice/${id}`),
      (message) => {
        this.setState({ message: message });
      }
    );
  };

  render() {
    const { cart, customer } = this.props;
    // console.log(cart);
    return (
      <SidebarLayout>
        <Sidebar latestSales={this.state.latestSales} key='side'>
          <AddCustomer />
        </Sidebar>
        <main key='main' className='card'>
          <div className='card-body'>
            <FormGroup>
              <SearchItem />
            </FormGroup>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {customer.name && (
                <>
                  <p>
                    <strong>Party</strong>: {customer.name},{' '}
                    {'+91' + customer.phone}
                  </p>
                  <p>
                    {customer.billing_address}, {customer.billing_city}{' '}
                    {customer.billing_state} - {customer.billing_pincode}
                  </p>
                </>
              )}
            </div>
            <div
              style={{
                maxHeight: '58vh',
                overflowX: 'hidden',
                overflowY: 'scroll',
              }}
            >
              <Table bordered striped>
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>SNo.</th>
                    <th>Product Code</th>
                    <th>Product Name</th>
                    <th>MRP</th>
                    {/* <th>Discount</th> */}
                    <th>Sale Price</th>
                    <th>GST</th>
                    {/* <th>Calc. GST</th> */}
                    <th>Qty</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>{this.renderTableBody()}</tbody>
              </Table>
            </div>
            <hr />
            <div>
              <Row>
                {/* <Col>
                  <Label for='discount'>Discount</Label>
                  <Input
                    type='text'
                    id='discount'
                    name='discount'
                    value={cart.discount}
                    onChange={(e) =>
                      this.props.updateCartDiscount(e.target.value)
                    }
                  />
                </Col> */}
                <Col>
                  <Label for='mode_of_payment'>Payment Mode</Label>
                  <Input
                    type='select'
                    id='mode_of_payment'
                    name='payment_mode'
                    onChange={(e) =>
                      this.props.updateCartModeOfPayment(e.target.value)
                    }
                  >
                    {/* <option value="">Select Payment</option> */}
                    <option value='cash'>Cash Payment</option>
                    <option value='bank'>Bank Payment</option>
                    <option value='credit' selected={cart.amount_repay > 0}>
                      Credit
                    </option>
                  </Input>
                </Col>
                {/* <Col>
                <Label for="item_amount">Item Amount</Label>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>Rs</InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id="item_amount"
                    name="item_amount"
                    value={cart.item_amount}
                    readOnly
                  />
                </InputGroup>
              </Col>
              <Col>
                <Label for="total_gst">Item Gst</Label>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>Rs</InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id="item_gst"
                    name="item_gst"
                    value={cart.item_gst}
                    readOnly
                  />
                </InputGroup>
              </Col> */}
                <Col>
                  <Label for='total_amount'>Total Amount</Label>
                  <InputGroup>
                    <InputGroupAddon addonType='prepend'>
                      <InputGroupText>Rs</InputGroupText>
                    </InputGroupAddon>
                    <Input
                      id='total_amount'
                      name='total_amount'
                      value={cart.total_amount}
                      onChange={(e) =>
                        this.props.updateCartTotalAmount(e.target.value)
                      }
                      readOnly
                    />
                  </InputGroup>
                </Col>
                <Col>
                  <Label for='amount_paid'>Amount Paid</Label>
                  <InputGroup>
                    <InputGroupAddon addonType='prepend'>
                      <InputGroupText>Rs</InputGroupText>
                    </InputGroupAddon>
                    <Input
                      id='amount_paid'
                      name='amount_paid'
                      value={cart.amount_paid}
                      onChange={(e) =>
                        this.props.updateCartAmountPaid(e.target.value)
                      }
                    />
                  </InputGroup>
                </Col>
                {/* </Row> */}
                {/* <br /> */}
                {/* <Row> */}
                {/* <Col sm="3">
                <Label for="discount_or_offers">Discount/Offers</Label>
                <Input
                  type="select"
                  id="discount_or_offers"
                  name="discount"
                  onChange={(e) =>
                    this.props.updateCartDiscount(e.target.value)
                  }
                >
                  <option value="">Select Discount/Offers</option>
                  <option value="discount">Discount</option>
                  <option value="offer">Offer</option>
                </Input>
              </Col> */}
                <Col>
                  <Label for='amount_repay' style={{ color: 'red' }}>
                    Amount Repay
                  </Label>
                  <InputGroup>
                    <InputGroupAddon addonType='prepend'>
                      <InputGroupText>Rs</InputGroupText>
                    </InputGroupAddon>
                    <Input
                      id='amount_repay'
                      name='amount_repay'
                      value={cart.amount_repay}
                      onChange={(e) =>
                        this.props.updateCartAmountRepay(e.target.value)
                      }
                      readOnly
                    />
                  </InputGroup>
                </Col>
                <Col>
                  <Button
                    color='success'
                    className='mt-3'
                    size='md'
                    disabled={cart.total_amount <= 0}
                    onClick={this.handleInvoiceSubmit}
                  >
                    Continue To Invoice{' '}
                    <i class='fa fa-arrow-right' aria-hidden='true'></i>
                  </Button>
                  <span
                    style={{
                      color: this.state.message.messageColor,
                      fontSize: '12px',
                    }}
                    className='ml-3'
                  >
                    {this.state.message.bodyMessage[0]}
                  </span>
                </Col>
              </Row>
            </div>
          </div>
        </main>
      </SidebarLayout>
    );
  }
}

const mapStateToProps = (state) => {
  return { cart: state.cart, customer: state.customer };
};

export default connect(mapStateToProps, {
  updateCart,
  updateCartItem,
  updateCartModeOfPayment,
  updateCartTotalAmount,
  updateCartAmountRepay,
  updateCartAmountPaid,
  updateCartDiscount,
  createInvoice,
  clearCart,
})(requireAuth(CreateInvoice));
