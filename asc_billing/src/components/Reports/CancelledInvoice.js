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
    sales: [],
    fromDate: new Date().toISOString().slice(0, 10),
    toDate: new Date().toISOString().slice(0, 10),
    isLoading: false,
  };

  componentDidMount = async () => {
    this.setState({ isLoading: true });
    const response = await billing.get("cancelled-invoice");
    this.setState({ sales: response.data.sales, isLoading: false });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: new Date(e.target.value).toISOString().slice(0, 10),
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    let { fromDate, toDate } = this.state;
    this.setState({ isLoading: true });
    const response = await billing.get("cancelled-invoice", {
      params: {
        from: fromDate,
        to: toDate,
      },
    });
    this.setState({ sales: response.data.sales, isLoading: false });
  };

  renderTableBody = () => {
    const { sales, isLoading } = this.state;
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
          {sales.length > 0 ? (
            sales.map((sale, idx) => (
              <tr key={sale.id}>
                <td>{idx + 1}</td>
                <td>
                  <Link to={`/invoice/${sale.id}`}>{"IN00" + sale.id}</Link>
                </td>
                <td>{Number(sale.total_amount).toFixed(2)}</td>
                <td>{Number(sale.profit).toFixed(2)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No Sale
              </td>
            </tr>
          )}
        </tbody>
        {sales.length > 0 ? (
          <tfoot>
            <tr>
              <th colSpan="2">Total</th>
              <th>
                {Number(
                  sales.reduce((total, sale) => total + sale.profit, 0)
                ).toFixed(2)}
              </th>
            </tr>
          </tfoot>
        ) : null}
      </>
    );
  };

  render() {
    const { fromDate, toDate } = this.state;
    return (
      <FullLayout>
        <aside key="sidebar">
          <h1>Cancelled Invoice Report</h1>
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
            <Table bordered striped>
              <thead>
                <tr>
                  <th>SNo.</th>
                  <th>Invoice #</th>
                  <th>Invoice Total</th>
                  <th>Total Profit</th>
                </tr>
              </thead>
              {this.renderTableBody()}
            </Table>
          </div>
        </main>
      </FullLayout>
    );
  }
}

export default requireAuth(SaleProfit);
