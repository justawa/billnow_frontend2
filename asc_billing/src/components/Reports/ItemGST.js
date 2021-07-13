import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  Row,
  Col,
  Form,
  Button,
  FormGroup,
  Label,
  Input,
  Spinner,
} from "reactstrap";
import billing from "../../api/billing";
import FullLayout from "../Layouts/FullLayout";
import requireAuth from "../../helpers/requireAuth";

class SaleProfit extends Component {
  state = {
    items: [],
    gstPercent: 5,
    fromDate: null,
    toDate: null,
    isLoading: false,
  };

  componentDidMount = async () => {
    this.setState({ isLoading: true });
    const response = await billing.get("item-gst");
    this.setState({ items: response.data.items, isLoading: false });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: new Date(e.target.value).toISOString().slice(0, 10),
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    let { fromDate, toDate, gstPercent } = this.state;
    this.setState({ isLoading: true });
    const response = await billing.get("item-gst", {
      params: {
        from: fromDate,
        to: toDate,
        gst: gstPercent,
      },
    });
    this.setState({ items: response.data.items, isLoading: false });
  };

  handleGstChange = async (e) => {
    e.preventDefault();
    let { fromDate, toDate } = this.state;
    this.setState({ isLoading: true, gstPercent: e.target.value });

    const response = await billing.get("item-gst", {
      params: {
        from: fromDate,
        to: toDate,
        gst: e.target.value,
      },
    });
    this.setState({
      items: response.data.items,
      isLoading: false,
    });
  };

  isProfitOrLoss = (sale_price, purchase_price) => {
    if (sale_price - purchase_price > 0) {
      return "Profit";
    } else if (sale_price - purchase_price < 0) {
      return "Loss";
    } else {
      return "-";
    }
  };

  renderTableBody = () => {
    const { items, isLoading } = this.state;
    if (isLoading)
      return (
        <Spinner
          color="dark"
          style={{ display: "flex", justifyContent: "center" }}
        />
      );
    return (
      <>
        <tbody>
          {items.length > 0 ? (
            items.map((item, idx) => (
              <tr key={item.id}>
                <td>{idx + 1}</td>
                <td>{item.product_name}</td>
                <td>{item.qty}</td>
                <td>{Number(item.unit_cost_without_gst).toFixed(2)}</td>
                <td>{Number(item.gst_amount_from_unit_cost).toFixed(2)}</td>
                <td>
                  {Number(item.unit_cost_without_gst * item.qty).toFixed(2)}
                </td>
                <td>
                  {Number(item.gst_amount_from_unit_cost * item.qty).toFixed(2)}
                </td>
                <td>{Number(item.unit_cost * item.qty).toFixed(2)}</td>
                <td>{item.sold_qty}</td>
                <td>{Number(item.sale_price_without_gst).toFixed(2)}</td>
                <td>{Number(item.gst_amount_from_sale_price).toFixed(2)}</td>
                <td>
                  {Number(item.sale_price_without_gst * item.sold_qty).toFixed(
                    2
                  )}
                </td>
                <td>
                  {Number(
                    item.gst_amount_from_sale_price * item.sold_qty
                  ).toFixed(2)}
                </td>
                <td>{Number(item.sale_price * item.sold_qty).toFixed(2)}</td>
                <td>
                  {Number(
                    item.sale_price * item.sold_qty - item.unit_cost * item.qty
                  ).toFixed(2)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" className="text-center">
                No Item
              </td>
            </tr>
          )}
        </tbody>
        {items.length > 0 ? (
          <tfoot>
            <tr>
              <th colSpan="2">Total</th>
              <th>
                {Number(
                  items.reduce((total, item) => total + item.qty, 0)
                ).toFixed(2)}
              </th>
              <th>
                {Number(
                  items.reduce(
                    (total, item) => total + item.unit_cost_without_gst,
                    0
                  )
                ).toFixed(2)}
              </th>
              <th>
                {Number(
                  items.reduce(
                    (total, item) => total + item.gst_amount_from_unit_cost,
                    0
                  )
                ).toFixed(2)}
              </th>
              <th>
                {Number(
                  items.reduce(
                    (total, item) =>
                      total + item.unit_cost_without_gst * item.qty,
                    0
                  )
                ).toFixed(2)}
              </th>
              <th>
                {Number(
                  items.reduce(
                    (total, item) => total + item.unit_cost * item.qty,
                    0
                  )
                ).toFixed(2)}
              </th>
              <th>
                {Number(
                  items.reduce(
                    (total, item) => total + item.unit_cost * item.qty,
                    0
                  )
                ).toFixed(2)}
              </th>
              <th>
                {Number(
                  items.reduce((total, item) => total + item.sold_qty, 0)
                ).toFixed(2)}
              </th>
              <th>
                {Number(
                  items.reduce(
                    (total, item) => total + item.sale_price_without_gst,
                    0
                  )
                ).toFixed(2)}
              </th>
              <th>
                {Number(
                  items.reduce(
                    (total, item) => total + item.gst_amount_from_sale_price,
                    0
                  )
                ).toFixed(2)}
              </th>
              <th>
                {Number(
                  items.reduce(
                    (total, item) =>
                      total + item.sale_price_without_gst * item.sold_qty,
                    0
                  )
                ).toFixed(2)}
              </th>
              <th>
                {Number(
                  items.reduce(
                    (total, item) =>
                      total + item.gst_amount_from_sale_price * item.sold_qty,
                    0
                  )
                ).toFixed(2)}
              </th>
              <th>
                {Number(
                  items.reduce(
                    (total, item) => total + item.sale_price * item.sold_qty,
                    0
                  )
                ).toFixed(2)}
              </th>
            </tr>
          </tfoot>
        ) : null}
      </>
    );
  };

  render() {
    const { fromDate, toDate, gstPercent } = this.state;
    return (
      <FullLayout>
        <aside key="sidebar">
          <h1>Item GST Report</h1>
        </aside>
        <main key="main" className="card">
          <div className="card-body">
            <Form className="mb-3" onSubmit={this.handleSubmit}>
              <Row>
                <Col>
                  <FormGroup>
                    <Label for="fromDate">From</Label>
                    <Input
                      type="date"
                      name="fromDate"
                      id="fromDate"
                      value={fromDate}
                      onChange={this.handleChange}
                    />
                  </FormGroup>{" "}
                </Col>
                <Col>
                  <FormGroup>
                    <Label for="toDate">To</Label>
                    <Input
                      type="date"
                      name="toDate"
                      id="toDate"
                      value={toDate}
                      onChange={this.handleChange}
                    />
                  </FormGroup>{" "}
                </Col>
                <Button hidden>Search</Button>
              </Row>
              <Button>Search</Button>
            </Form>
            <p style={{ textAlign: "center" }}>
              Data showing for <strong>{gstPercent + "%"}</strong>{" "}
              {fromDate && toDate && (
                <>
                  for dates between <strong>{fromDate}</strong> -{" "}
                  <strong>{toDate}</strong>
                </>
              )}
            </p>
            <div className="ml-auto col-md-4">
              <FormGroup>
                <Label for="select-gst">Select GST</Label>
                <Input
                  type="select"
                  name="gst"
                  id="select-gst"
                  value={gstPercent}
                  onChange={this.handleGstChange}
                >
                  <option>0</option>
                  <option>5</option>
                  <option>12</option>
                  <option>18</option>
                  <option>28</option>
                </Input>
              </FormGroup>
            </div>
            <div className="table-responsive">
              <Table bordered striped>
                <thead>
                  <tr>
                    <th>SNo.</th>
                    <th>Item</th>
                    <th>Purchased Qty</th>
                    <th>Unit Cost</th>
                    <th>GST Amount</th>
                    <th>Unit Cost Value</th>
                    <th>GST Value</th>
                    <th>Purchase Value</th>
                    <th>Sold Qty</th>
                    <th>Sale Price</th>
                    <th>Sale GST</th>
                    <th>Sale Price Value</th>
                    <th>GST Value</th>
                    <th>Sale Value</th>
                    <th>Profit/Loss</th>
                  </tr>
                </thead>
                {this.renderTableBody()}
              </Table>
            </div>
          </div>
        </main>
      </FullLayout>
    );
  }
}

export default requireAuth(SaleProfit);
