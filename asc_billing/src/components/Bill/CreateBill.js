import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';
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
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap';
import { connect } from 'react-redux';
import { createBill } from '../../actions';
import FullLayout from '../Layouts/FullLayout';
import Sidebar from '../Sidebar';
import AddParty from '../AddParty';
import billing from '../../api/billing';
import AddItemModal from '../Item/AddItemModal';

const EXCLUSIVE_OF_TAX = 'e';
const INCLUSIVE_OF_TAX = 'i';
class CreateBill extends Component {
  state = {
    tableData: [
      {
        key: uuidv4(),
        product_code: '',
        product_name: '',
        hsn: '',
        image: '',
        ws_margin: '',
        r_margin: '',
        mrp: 0,
        unit_cost: 0,
        discount: 0,
        final_unit_cost: 0,
        unit_cost_with_gst: 0,
        sale_price: 0,
        whole_sale_price: 0,
        sale_price_to_mrp: '',
        whole_sale_price_to_mrp: '',
        gst: 0,
        expiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
          .toISOString()
          .slice(0, 10),
        mfg: new Date().toISOString().slice(0, 10),
        qty: 0,
        total_cost: 0,
      },
    ],
    payment_mode: '',
    total_amount: 0,
    amount_repay: 0,
    amount_paid: 0,
    discount: '',
    tax_type: EXCLUSIVE_OF_TAX,
    message: {
      headMessage: '',
      bodyMessage: [],
      messageColor: '',
    },
    addItem: false,
  };

  setAddItem = () => {
    this.setState((prevState) => {
      return { addItem: !prevState.addItem };
    });
  };

  deleteRow = (key) => {
    // console.log(idx);
    const { tableData } = this.state;
    const filteredItems = tableData.filter((item) => item.key !== key);
    const total_amount = filteredItems.reduce((total, item) => {
      return Number(parseFloat(total) + parseFloat(item.total_cost)).toFixed(2);
    }, 0);
    this.setState({ tableData: filteredItems, total_amount: total_amount });
  };

  addRow = () => {
    const { tableData } = this.state;
    const filteredData = [
      ...tableData,
      {
        key: uuidv4(),
        product_code: '',
        product_name: '',
        hsn: '',
        image: '',
        ws_margin: '',
        r_margin: '',
        mrp: 0,
        unit_cost: 0,
        discount: 0,
        final_unit_cost: 0,
        unit_cost_with_gst: 0,
        sale_price: 0,
        whole_sale_price: 0,
        sale_price_to_mrp: '',
        whole_sale_price_to_mrp: '',
        gst: 0,
        expiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
          .toISOString()
          .slice(0, 10),
        mfg: new Date().toISOString().slice(0, 10),
        qty: 0,
        total_cost: 0,
      },
    ];
    // console.log(filteredData);
    this.setState({ tableData: filteredData });
  };

  handleInput = (e, idx) => {
    this.formInputs(e, idx);
  };

  setTaxType = (e, type) => {
    this.setState({ tax_type: type }, () => this.setSalePriceForAllItems(type));
  };

  calculateTotalCost = (unit_cost, qty, gst, tax_type) => {
    if (tax_type === INCLUSIVE_OF_TAX) {
      return Number(unit_cost * qty).toFixed(2);
    } else {
      const calculated_gst = (gst * unit_cost) / 100;
      return Number((Number(unit_cost) + Number(calculated_gst)) * qty).toFixed(
        2
      );
    }
  };

  setSalePriceForAllItems = (tax_type) => {
    const { tableData } = this.state;
    const updatedData = tableData.map((item) => {
      item.sale_price = this.calculateSalePrice(
        tax_type,
        item.unit_cost,
        item.r_margin,
        item.gst
      );
      item.whole_sale_price = this.calculateWholeSalePrice(
        tax_type,
        item.unit_cost,
        item.ws_margin,
        item.gst
      );
      item.sale_price_to_mrp = this.calculateSaleProfitPercent(
        item.mrp,
        item.sale_price
      );
      item.whole_sale_price_to_mrp = this.calculateWholeSaleProfitPercent(
        item.mrp,
        item.whole_sale_price
      );
      item.total_cost = this.calculateTotalCost(
        item.unit_cost,
        item.qty,
        item.gst,
        tax_type
      );
      return item;
    });
    this.setState({ tableData: updatedData });
  };

  calculateSalePrice = (tax_type, unit_cost, r_margin, gst) => {
    if (tax_type === EXCLUSIVE_OF_TAX) {
      const sale_price_before_gst =
        Number(unit_cost) + (r_margin * unit_cost) / 100;

      return sale_price_before_gst + (gst * sale_price_before_gst) / 100;
    }
    const calculated_gst = Number(
      Number(unit_cost) - Number(unit_cost) * (100 / (100 + parseFloat(gst)))
    ).toFixed(2);

    const actual_unit_cost = unit_cost - calculated_gst;

    return Number(
      Number(actual_unit_cost) +
        (r_margin * actual_unit_cost) / 100 +
        Number(calculated_gst)
    ).toFixed(2);
  };

  calculateWholeSalePrice = (tax_type, unit_cost, ws_margin, gst) => {
    if (tax_type === EXCLUSIVE_OF_TAX) {
      const whole_sale_price_before_gst =
        Number(unit_cost) + (ws_margin * unit_cost) / 100;

      return (
        whole_sale_price_before_gst + (gst * whole_sale_price_before_gst) / 100
      );
    }
    const calculated_gst = Number(
      Number(unit_cost) - Number(unit_cost) * (100 / (100 + parseFloat(gst)))
    ).toFixed(2);

    const actual_unit_cost = unit_cost - calculated_gst;

    return Number(
      Number(actual_unit_cost) +
        (ws_margin * actual_unit_cost) / 100 +
        Number(calculated_gst)
    ).toFixed(2);
  };

  formInputs = (e, idx) => {
    const { tableData, tax_type } = this.state;
    tableData[idx][e.target.name] = e.target.value;
    if (e.target.name === 'unit_cost' || e.target.name === 'gst') {
      tableData[idx].sale_price = this.calculateSalePrice(
        tax_type,
        tableData[idx].unit_cost,
        tableData[idx].r_margin,
        tableData[idx].gst
      );
      tableData[idx].whole_sale_price = this.calculateWholeSalePrice(
        tax_type,
        tableData[idx].unit_cost,
        tableData[idx].ws_margin,
        tableData[idx].gst
      );
    }
    if (e.target.name === 'mrp') {
      tableData[idx].sale_price_to_mrp = this.calculateSaleProfitPercent(
        tableData[idx].mrp,
        tableData[idx].sale_price
      );

      tableData[
        idx
      ].whole_sale_price_to_mrp = this.calculateWholeSaleProfitPercent(
        tableData[idx].mrp,
        tableData[idx].whole_sale_price
      );
    }
    if (e.target.name === 'unit_cost' || e.target.name === 'discount') {
      tableData[idx].final_unit_cost = this.calculateFinalUnitCost(
        tableData[idx].unit_cost,
        tableData[idx].discount
      );
    }
    if (e.target.name === 'unit_cost' || e.target.name === 'qty') {
      tableData[idx].total_cost = this.calculateTotalCost(
        tableData[idx].final_unit_cost,
        tableData[idx].qty,
        tableData[idx].gst,
        tax_type
      );
    }
    const filteredData = [...tableData];
    const total_amount = filteredData.reduce((total, item) => {
      return Number(parseFloat(total) + parseFloat(item.total_cost)).toFixed(2);
    }, 0);
    this.setState({ tableData: filteredData, total_amount: total_amount });
  };

  calculateSaleProfitPercent = (mrp, sale_price) => {
    const sale_price_to_mrp = Number(mrp - sale_price).toFixed(2);

    return Number((sale_price_to_mrp * 100) / mrp).toFixed(1);
  };

  calculateWholeSaleProfitPercent = (mrp, whole_sale_price) => {
    const whole_sale_price_to_mrp = Number(mrp - whole_sale_price).toFixed(2);

    return Number((whole_sale_price_to_mrp * 100) / mrp).toFixed(1);
  };

  calculateFinalUnitCost = (unit_cost, discount = 0) => {
    const final_cost = unit_cost - (unit_cost * discount) / 100;

    return Number(final_cost).toFixed(2);
  };

  handlePayment = (e) => {
    this.setState({ [e.target.name]: e.target.value }, () => {
      if (e.target.name === 'amount_paid') {
        const amount_paid = this.state.amount_paid || 0;
        const amount_repay = Number(
          parseFloat(this.state.total_amount) - parseFloat(amount_paid)
        ).toFixed(2);
        this.setState({
          amount_repay: amount_repay,
        });
      }
    });
  };

  handleBillSubmit = () => {
    this.props.createBill(
      this.state,
      this.props.party,
      (message) => {
        this.setState({
          tableData: [
            {
              key: uuidv4(),
              product_code: '',
              product_name: '',
              hsn: '',
              image: '',
              ws_margin: '',
              r_margin: '',
              mrp: 0,
              unit_cost: 0,
              discount: 0,
              final_unit_cost: 0,
              unit_cost_with_gst: 0,
              sale_price: 0,
              whole_sale_price: 0,
              sale_price_to_mrp: '',
              whole_sale_price_to_mrp: '',
              gst: 0,
              expiry: new Date(
                new Date().setFullYear(new Date().getFullYear() + 1)
              )
                .toISOString()
                .slice(0, 10),
              mfg: new Date().toISOString().slice(0, 10),
              qty: 0,
              total_cost: 0,
            },
          ],
          payment_mode: '',
          total_amount: 0,
          amount_repay: 0,
          amount_paid: 0,
          discount: '',
          tax_type: EXCLUSIVE_OF_TAX,
          message: message,
        });
      },
      (message) => {
        this.setState({ message: message });
      }
    );
  };

  searchFixItem = async (productCode) => {
    try {
      const response = await billing.get(
        `/get-fix-item?product_code=${productCode}`
      );
      console.log(response);
      return response.data.item;
    } catch (err) {
      new Promise((resolve, reject) => {
        return reject('Error while fetching item');
      });
    }
  };

  handleKeyDown = async (e, i) => {
    if (e.key === 'Enter') {
      const { value } = e.target;
      try {
        let item = await this.searchFixItem(value);
        console.log(item);
        const { tableData } = this.state;
        tableData[i].product_code = item.product_code;
        tableData[i].product_name = item.product_name;
        tableData[i].hsn = item.hsn;
        tableData[i].image = item.full_image_path;
        tableData[i].ws_margin = item.ws_margin;
        tableData[i].r_margin = item.r_margin;
        tableData[i].gst = item.gst;

        const filteredData = [...tableData];
        this.setState({ tableData: filteredData });
      } catch (err) {
        console.log(err);
      }
    }
  };

  render() {
    const { party } = this.props;
    // console.log(this.state.tableRows);
    return (
      <FullLayout>
        <Sidebar key='side-left'>
          <AddParty />
        </Sidebar>
        <div key='side-right'>
          <div>
            <Button onClick={this.setAddItem}>Add Item</Button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {party.name && (
              <>
                <p>
                  <strong>Party</strong>: {party.name}, {'+91' + party.phone}
                </p>
                <p>
                  {party.billing_address}, {party.billing_city}{' '}
                  {party.billing_state} - {party.billing_pincode}
                </p>
              </>
            )}
          </div>
        </div>
        <main key='main' className='card border-dark'>
          <div class='card-header bg-dark text-light'>
            <label>
              <input
                type='radio'
                checked={this.state.tax_type === INCLUSIVE_OF_TAX}
                onChange={(e) => this.setTaxType(e, INCLUSIVE_OF_TAX)}
              />{' '}
              Inclusive of Tax?
            </label>
            &nbsp;&nbsp;&nbsp;
            <label>
              <input
                type='radio'
                checked={this.state.tax_type === EXCLUSIVE_OF_TAX}
                onChange={(e) => this.setTaxType(e, EXCLUSIVE_OF_TAX)}
              />{' '}
              Exclusive of Tax?
            </label>
          </div>
          <div className='card-body'>
            {this.state.tableData.map((row, i) => (
              <div className='card mb-3' key={row.key}>
                <div className='card-header d-flex justify-content-between bg-info text-light'>
                  <strong className='w-80'>#{i + 1}</strong>
                  <button
                    onClick={() => this.deleteRow(row.key)}
                    className='btn btn-danger btn-sm'
                  >
                    <i class='fa fa-times' aria-hidden='true'></i>
                  </button>
                </div>
                <div className='card-body'>
                  <Row>
                    <Col>
                      {row.image && (
                        <img
                          className='img-thumbnail mx-auto d-block'
                          src={row.image}
                          alt='product'
                          style={{ width: '60%' }}
                        />
                      )}
                    </Col>
                    <Col>
                      <FormGroup>
                        <label>Product Code</label>
                        <input
                          name='product_code'
                          className='form-control form-control-sm'
                          value={row.product_code}
                          onChange={(e) => this.handleInput(e, i)}
                          onKeyDown={(e) => this.handleKeyDown(e, i)}
                          tabIndex={i}
                        />
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <label>Product Name</label>
                        <input
                          name='product_name'
                          className='form-control form-control-sm'
                          value={row.product_name}
                          onChange={(e) => this.handleInput(e, i)}
                          readOnly
                          tabIndex='-1'
                        />
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <label>HSN</label>
                        <input
                          name='hsn'
                          className='form-control form-control-sm'
                          value={row.hsn}
                          onChange={(e) => this.handleInput(e, i)}
                          readOnly
                          tabIndex='-1'
                        />
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <label>GST</label>
                        <input
                          name='gst'
                          className='form-control form-control-sm'
                          value={row.gst}
                          onChange={(e) => this.handleInput(e, i)}
                          readOnly
                          tabIndex='-1'
                        />
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <label>Sale Price</label>
                        <input
                          name='sale_price'
                          className='form-control form-control-sm'
                          value={row.sale_price}
                          onChange={(e) => this.handleInput(e, i)}
                          readOnly
                          tabIndex='-1'
                        />
                        <span>
                          {row.sale_price_to_mrp &&
                            (row.sale_price_to_mrp > 0 ? (
                              <span style={{ fontSize: 12, color: 'green' }}>
                                {row.sale_price_to_mrp + '% less than MRP'}
                              </span>
                            ) : (
                              <span style={{ fontSize: 12, color: 'red' }}>
                                {Math.abs(row.sale_price_to_mrp) +
                                  '% more than MRP'}
                              </span>
                            ))}
                        </span>
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <label>Wholesale Price</label>
                        <input
                          name='whole_sale_price'
                          className='form-control form-control-sm'
                          value={row.whole_sale_price}
                          onChange={(e) => this.handleInput(e, i)}
                          readOnly
                          tabIndex='-1'
                        />
                        <span>
                          {row.whole_sale_price_to_mrp &&
                            (row.whole_sale_price_to_mrp > 0 ? (
                              <span style={{ fontSize: 12, color: 'green' }}>
                                {row.whole_sale_price_to_mrp +
                                  '% less than MRP'}
                              </span>
                            ) : (
                              <span style={{ fontSize: 12, color: 'red' }}>
                                {Math.abs(row.whole_sale_price_to_mrp) +
                                  '% more than MRP'}
                              </span>
                            ))}
                        </span>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FormGroup>
                        <label>Unit Cost</label>
                        <input
                          name='unit_cost'
                          className='form-control form-control-sm'
                          value={row.unit_cost}
                          onChange={(e) => this.handleInput(e, i)}
                          tabIndex={i}
                        />
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <label>Discount</label>
                        <input
                          name='discount'
                          className='form-control form-control-sm'
                          value={row.discount}
                          onChange={(e) => this.handleInput(e, i)}
                          tabIndex={i}
                        />
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <label>Final Cost</label>
                        <input
                          name='final_unit_cost'
                          className='form-control form-control-sm'
                          value={row.final_unit_cost}
                          onChange={(e) => this.handleInput(e, i)}
                          tabIndex={-1}
                          readOnly
                        />
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <label>MRP</label>
                        <input
                          name='mrp'
                          className='form-control form-control-sm'
                          value={row.mrp}
                          onChange={(e) => this.handleInput(e, i)}
                          tabIndex={i}
                        />
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <label>Qty</label>
                        <input
                          name='qty'
                          className='form-control form-control-sm'
                          value={row.qty}
                          onChange={(e) => this.handleInput(e, i)}
                          tabIndex={i}
                        />
                      </FormGroup>
                    </Col>
                    <Col>
                      <label>Total Cost</label>
                      <div>{row.total_cost}</div>
                    </Col>
                    <Col>
                      <FormGroup>
                        <label>MFG date</label>
                        <input
                          type='date'
                          name='mfg'
                          className='form-control form-control-sm'
                          placeholder='YYYY-mm-dd'
                          value={row.mfg}
                          onChange={(e) => this.handleInput(e, i)}
                          tabIndex={i}
                        />
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <label>Expiry</label>
                        <input
                          type='date'
                          name='expiry'
                          className='form-control form-control-sm'
                          placeholder='YYYY-mm-dd'
                          value={row.expiry}
                          onChange={(e) => this.handleInput(e, i)}
                          tabIndex={i}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </div>
              </div>
            ))}
            {/* <Table
              style={{ tableLayout: "fixed", width: "100%" }}
              bordered
              striped
            >
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Product Code</th>
                  <th>Product Name</th>
                  <th>HSN</th>
                  <th>MRP</th>
                  <th>Unit Cost</th>
                  <th>Discount</th>
                  <th>Sale Price</th>
                  <th>GST</th>
                  <th>Mfg</th>
                  <th>Expiry</th>
                  <th>Qty</th>
                  <th>Total Cost</th>
                </tr>
              </thead>
              <tbody>
                {this.state.tableData.map((row, i) => (
                  <tr key={row.key}>
                    <td>
                      <button
                        onClick={() => this.deleteRow(i)}
                        className="btn btn-danger btn-sm"
                      >
                        x
                      </button>
                    </td>
                    <td>
                      <input
                        name="product_code"
                        className="form-control input-sm"
                        value={row.product_code}
                        onChange={(e) => this.handleInput(e, i)}
                      />
                    </td>
                    <td>
                      <input
                        name="product_name"
                        className="form-control input-sm"
                        value={row.product_name}
                        onChange={(e) => this.handleInput(e, i)}
                      />
                    </td>
                    <td>
                      <input
                        name="hsn"
                        className="form-control input-sm"
                        value={row.hsn}
                        onChange={(e) => this.handleInput(e, i)}
                      />
                    </td>
                    <td>
                      <input
                        name="mrp"
                        className="form-control input-sm"
                        value={row.mrp}
                        onChange={(e) => this.handleInput(e, i)}
                      />
                    </td>
                    <td>
                      <input
                        name="unit_cost"
                        className="form-control input-sm"
                        value={row.unit_cost}
                        onChange={(e) => this.handleInput(e, i)}
                      />
                    </td>
                    <td>
                      <input
                        name="discount"
                        className="form-control input-sm"
                        value={row.discount}
                        onChange={(e) => this.handleInput(e, i)}
                      />
                    </td>
                    <td>
                      <input
                        name="sale_price"
                        className="form-control input-sm"
                        value={row.sale_price}
                        onChange={(e) => this.handleInput(e, i)}
                      />
                    </td>
                    <td>
                      <input
                        name="gst"
                        className="form-control input-sm"
                        value={row.gst}
                        onChange={(e) => this.handleInput(e, i)}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        name="mfg"
                        className="form-control input-sm"
                        placeholder="YYYY-mm-dd"
                        value={row.mfg}
                        onChange={(e) => this.handleInput(e, i)}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        name="expiry"
                        className="form-control input-sm"
                        placeholder="YYYY-mm-dd"
                        value={row.expiry}
                        onChange={(e) => this.handleInput(e, i)}
                      />
                    </td>
                    <td>
                      <input
                        name="qty"
                        className="form-control input-sm"
                        value={row.qty}
                        onChange={(e) => this.handleInput(e, i)}
                      />
                    </td>
                    <td>{row.total_cost}</td>
                  </tr>
                ))}
              </tbody>
            </Table> */}
            <hr />
            <Row>
              <Col>
                <Button
                  onClick={this.addRow}
                  color='info'
                  className='mb-3'
                  size='sm'
                >
                  Add New Row
                </Button>
              </Col>
            </Row>
            <Row>
              <Col>
                <Label for='mode_of_payment'>Payment Mode</Label>
                <Input
                  type='select'
                  id='mode_of_payment'
                  name='payment_mode'
                  onChange={this.handlePayment}
                >
                  <option value=''>Select Payment</option>
                  <option value='cash'>Cash Payment</option>
                  <option value='bank'>Bank Payment</option>
                </Input>
              </Col>
              <Col>
                <Label for='total_amount'>Total Amount</Label>
                <InputGroup>
                  <InputGroupAddon addonType='prepend'>
                    <InputGroupText>Rs</InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id='total_amount'
                    name='total_amount'
                    value={this.state.total_amount}
                    onChange={this.handlePayment}
                  />
                </InputGroup>
              </Col>
              {/* <Col>
                <Label for='amount_repay'>Amount Repay</Label>
                <InputGroup>
                  <InputGroupAddon addonType='prepend'>
                    <InputGroupText>Rs</InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id='amount_repay'
                    name='amount_repay'
                    value={this.state.amount_repay}
                    onChange={this.handlePayment}
                  />
                </InputGroup>
              </Col> */}
              <Col>
                <Label for='amount_paid'>Amount Paid</Label>
                <InputGroup>
                  <InputGroupAddon addonType='prepend'>
                    <InputGroupText>Rs</InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id='amount_paid'
                    name='amount_paid'
                    value={this.state.amount_paid}
                    onChange={this.handlePayment}
                  />
                </InputGroup>
              </Col>
            </Row>
            <br />
            {/* <Row>
              <Col sm='3'>
                <Label for='discount_or_offers'>Discount/Offers</Label>
                <Input
                  type='select'
                  id='discount_or_offers'
                  name='discount'
                  onChange={this.handlePayment}
                >
                  <option value=''>Select Discount/Offers</option>
                  <option value='discount'>Discount</option>
                  <option value='offer'>Offer</option>
                </Input>
              </Col>
            </Row> */}
            <Button
              color='success'
              className='mt-3'
              size='sm'
              onClick={this.handleBillSubmit}
            >
              Continue To Bill
            </Button>
            <span
              style={{
                color: this.state.message.messageColor,
                fontSize: '12px;',
              }}
              className='ml-3'
            >
              {this.state.message.bodyMessage[0]}
            </span>
          </div>
          <AddItemModal isOpen={this.state.addItem} toggle={this.setAddItem} />
        </main>
      </FullLayout>
    );
  }
}

const mapStateToProps = (state) => {
  return { party: state.party };
};

export default connect(mapStateToProps, { createBill })(CreateBill);
