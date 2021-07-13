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
import FullLayout from '../Layouts/FullLayout';
import SearchProduct from '../SearchProduct';
import requireAuth from '../../helpers/requireAuth';


import Search from '../Search';
class CreateGst extends Component {
  state = {
    isOpen: false,
    phone: '',
    phoneError: '',
    name: '',
    
    message: {
      headMessage: '',
      bodyMessage: [],
      messageColor: '',
    },
    latestSales: [],
  };

  handleValue = (item) => {
    this.setState({ item, itemError: '' });
  };
  handlePhoneChange = (phone) => {
    this.setState({ phone, phoneError: '' });
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

  // renderSearchItem = () =>{
  //   const { cart } = this.props;
  //   return cart.items.length ? (
  //     cart.items.map((item, idx) => (
  //       <FormGroup>
  //         <SearchItem />
  //       </FormGroup>
  //     ))
  //   ) : (
  //     <p>No Item.</p>
  //   );
  // };

  updateQty = (e, idx) => {
    this.getItemFromIdAndCalculatePrice(idx, e.target.value);
  };
  
  removeFromCart = (id) => {
    const { items } = this.props.cart;
    const filteredItems = items.filter((item) => item.id !== id);
    this.props.updateCart(filteredItems);
  };

  renderTableBody = () => {
    const { cart } = this.props;
    return cart.items.length ? (
      cart.items.map((item, idx) => (
        <tr key={item.id}>
          
          <td>{idx + 1}</td>
          {/* <td>{item.product_code}</td> */}
          <td>{item.product_name}</td>
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
          <td></td>
          {/* <td>{item.mrp}</td> */}
          {/* <td>{item.discount}</td> */}
          <td>{item.sale_price}</td>
          <td>{item.discount}</td>
          {/* <td>{item.gst + '%'}</td> */}
          {/* <td>{this.calculatedGst(item)}</td> */}
          
          <td>{item.price}</td>
          <td>
            <button
              onClick={() => this.removeFromCart(item.id)}
              className='btn btn-danger btn-sm'
            >
              <i className='fa fa-times' aria-hidden='true'></i>
            </button>
          </td>
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



    render() {
        return (
          
            <div class="container py-4">
              <h2 class="text-center">GST Invoice</h2> <br/>
              <Row>
                <Col
                    className="py-3 px-4"
                >
                <Input
                    type='radio'
                    id='incl_taxes'
                    name='tax'
                    // onChange={(e) =>
                    //   this.props.updateCartModeOfPayment(e.target.value)
                    // }
                  >
                
                  </Input>
                  <span>Invoice is Incl of Taxes</span>
                </Col>
                <Col
                    className="py-3"
                >
                  <Input
                    type='radio'
                    id='excl_taxes'
                    name='taxe'
                    // onChange={(e) =>
                    //   this.props.updateCartModeOfPayment(e.target.value)
                    // }
                  >
                
                  </Input>
                  <span for='excl_taxes'>Invoice is Excl of Taxes</span> 
                </Col>
                <Col>
                  <Label for='invoice_no'>Invoice No.</Label>
                  <Input
                    type='text'
                    id='invoice_no'
                    name='taxes11'
                    // onChange={(e) =>
                    //   this.props.updateCartModeOfPayment(e.target.value)
                    // }
                  >
                
                  </Input>
                    
                </Col>
                <Col
                    className="px-4"
                >
                    <Button
                        color='success'
                        className='mt-4'
                        size='md'
                        // disabled={cart.total_amount <= 0}
                        onClick={this.handleInvoiceSubmit}
                    >
                    More Options{' '}
                    
                  </Button>
                </Col>
              </Row>
              <Row
                className="mt-5"
              >
              <Col>
                  <Label for='customer'>Choose Party</Label>
                  
                  <Search
                    handleChange={this.handlePhoneChange}
                    intialValue={this.state.name}
                 />
                </Col>
                <Col>
                  <Label for='invoice_date'>Invoice Date</Label>
                  <Input
                    type='date'
                    id='invoice_date'
                    name=''
                    
                    // onChange={(e) =>
                    //   this.props.updateCartModeOfPayment(e.target.value)
                    // }
                  >
                
                  </Input>
                    
                </Col>
                <Col>
                  <Label for='due_date'>Due Date</Label>
                  <Input
                    type='date'
                    id='due_date'
                    name=''
                    // onChange={(e) =>
                    //   this.props.updateCartModeOfPayment(e.target.value)
                    // }
                  >
                
                  </Input>
                    
                </Col>  
              </Row>
              <Row>
                <Col>
                <Button
                        color='success'
                        className='my-4'
                        size='md'
                        // disabled={cart.total_amount <= 0}
                        onClick={this.handleInvoiceSubmit}
                    >
                    Add Items{' '}
                    
                  </Button>
                    <FormGroup className='pt-5'>
                      <SearchProduct
                       handleChange={this.handleValue}
                       intialValue={this.state.name}
                      />
                    </FormGroup>
                </Col>
                
              </Row>
              <Row 
                className="mt-2"
              >
                <Table bordered striped>
                    <thead>
                    <tr>
                        <th>SNo.</th>
                        <th>Item/Product</th>
                        <th>Qty</th>
                        <th></th>
                        <th>Rate</th>
                        <th>Discount</th>
                        {/* <th>Discount</th> */}
                        <th>Amount</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                      {/* {this.renderSearchItem()} */}
                      {this.renderTableBody()}
                    </tbody>
                </Table> 
              </Row>
              <Row>
                <Col>
                    <Button
                        color='success'
                        className=''
                        size='md'
                        // disabled={cart.total_amount <= 0}
                        onClick={this.handleInvoiceSubmit}
                    >
                    Add More{' '}
                    
                  </Button>
                </Col>
              </Row>
              <Row
                className='mt-4'
              >
                  <Col>
                    <h6 class="py-2">Mode of Payment</h6>
                    <Input
                        type='checkbox'
                        id='mode_of_payment'
                        name='mode_of_payment'
                    >

                    </Input>
                    <span>Cash</span><br/>
                    <Input
                        type='checkbox'
                        id='mode_of_payment'
                        name='mode_of_payment'
                    >

                    </Input>
                    <span>Bank</span><br/>
                    <Input
                        type='checkbox'
                        id='mode_of_payment'
                        name='mode_of_payment'
                    >

                    </Input>
                    <span>Cash</span><br/>
                    <Input
                        type='checkbox'
                        id='mode_of_payment'
                        name='mode_of_payment'
                    >

                    </Input>
                    <span>Cash</span><br/>
                    <Row 
                      className='mt-4'
                    >
                    <Col>
                    <Label for='discount'>Total Amt (Rs)</Label>
                            <Input
                                type='text'
                                id='discount'
                                name='discount'
                                //value={cart.discount}
                                //onChange={(e) =>
                                //this.props.updateCartDiscount(e.target.value)
                                
                            >
                            </Input>
                    </Col>
                            <Col>
                            <Label for='discount'>Total Amt (Rs)</Label>
                            <Input
                                type='text'
                                id='discount'
                                name='discount'
                                //value={cart.discount}
                                //onChange={(e) =>
                                //this.props.updateCartDiscount(e.target.value)
                                
                            >
                            </Input>
                            </Col>
                    </Row>
                    <Row>
                      
                    </Row>
                  </Col>
                    
                  <Col>
                    <Row>
                        <Col>
                            <Label for='discount'>Total Amt (Rs)</Label>
                            <Input
                                type='text'
                                id='discount'
                                name='discount'
                                //value={cart.discount}
                                //onChange={(e) =>
                                //this.props.updateCartDiscount(e.target.value)
                                
                            >
                            </Input>
                        </Col>
                        <Col>
                            <Label for='discount'>Total GST+CESS (Rs)</Label>
                            <Input
                                type='text'
                                id='discount'
                                name='discount'
                                //value={cart.discount}
                                //onChange={(e) =>
                                //this.props.updateCartDiscount(e.target.value)
                                
                            >
                            </Input>
                        </Col>
                    </Row><br/>
                    <Row>
                        <Col>
                            <Label for='discount'>Grand Total (Rs)</Label>
                                <Input
                                    type='text'
                                    id='discount'
                                    name='discount'
                                    //value={cart.discount}
                                    //onChange={(e) =>
                                    //this.props.updateCartDiscount(e.target.value)
                                    
                                >
                                </Input>
                        </Col>
                    </Row><br/>
                    <Row>
                        <Col>
                            <Label for='discount'>Round off (Rs)</Label>
                            <Input
                                type='text'
                                id='discount'
                                name='discount'
                                //value={cart.discount}
                                //onChange={(e) =>
                                //this.props.updateCartDiscount(e.target.value)
                                
                            >
                            </Input>
                        </Col>
                        <Col>
                            <Label for='discount'>Net Amount</Label>
                            <Input
                                type='text'
                                id='discount'
                                name='discount'
                                //value={cart.discount}
                                //onChange={(e) =>
                                //this.props.updateCartDiscount(e.target.value)
                                
                            >
                            </Input>
                        </Col>
                    </Row>
                  </Col>
              </Row>
              <Row
                className='mt-4'
              >
                <Col
                      className="px-4"
                  >
                      <Button
                          color='success'
                          className='mt-4'
                          size='md'
                          // disabled={cart.total_amount <= 0}
                          onClick={this.handleInvoiceSubmit}
                      >
                    Save Invoiece!{' '}
                    
                  </Button>
                </Col>
                <Col
                    className="px-4"
                >
                    <Button
                        color='success'
                        className='mt-4'
                        size='md'
                        // disabled={cart.total_amount <= 0}
                        onClick={this.handleInvoiceSubmit}
                    >
                    Save & Create Invoice{' '}
                    
                  </Button>
                </Col>
                <Col
                    className="px-4"
                >
                    <Button
                        color='success'
                        className='mt-4'
                        size='md'
                        // disabled={cart.total_amount <= 0}
                        onClick={this.handleInvoiceSubmit}
                    >
                    Save & Mail Invoice{' '}
                    
                  </Button>
                </Col>
                <Col
                    className="px-4"
                >
                    <Button
                        color='success'
                        className='mt-4'
                        size='md'
                        // disabled={cart.total_amount <= 0}
                        onClick={this.handleInvoiceSubmit}
                    >
                    Save & Eway Bill{' '}
                    
                  </Button>
                </Col>
              </Row>
            </div>
            
        )
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
})(requireAuth(CreateGst));
