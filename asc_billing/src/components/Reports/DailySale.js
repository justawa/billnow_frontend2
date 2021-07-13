import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
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
import { connect } from "react-redux";
import FullLayout from "../Layouts/FullLayout";
import requireAuth from "../../helpers/requireAuth";

class DailySale extends Component {
  state = {
    sales: [],
    fromDate: new Date().toISOString().slice(0, 10),
    toDate: new Date().toISOString().slice(0, 10),
    isLoading: false,
    error: "",
  };

  onAlertDismiss = () => {
    this.setState({ error: "" });
  };

  componentDidMount = async () => {
    this.setState({ isLoading: true });
    try {
      const response = await billing.get("daily-sale");
      this.setState({ sales: response.data.sales, isLoading: false });
    } catch (err) {
      this.setState({ error: err.response.data.error, isLoading: false });
    }
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
    try {
      const response = await billing.get("daily-sale", {
        params: {
          from: fromDate,
          to: toDate,
        },
      });
      this.setState({ sales: response.data.sales, isLoading: false });
    } catch (err) {
      this.setState({ error: err.response.data.error, isLoading: false });
    }
  };

  handleCancelInvoice = async (e, id) => {
    const { sales } = this.state;
    try {
      await billing.put(`cancel-invoice/${id}`);
      const updatedSales = sales.filter((sale) => sale.id !== id);
      this.setState({ sales: updatedSales });
    } catch (err) {
      this.setState({ error: err.response.data.error, isLoading: false });
    }
  };

  renderTableBody = () => {
    const { sales, isLoading } = this.state;
    const { auth } = this.props;
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
                <td>{sale.customer.name}</td>
                <td>{sale.payment_mode}</td>
                <td>{sale.total_amount}</td>
                {auth.permission && auth.permission.name === "all" && (
                  <td>
                    <Button
                      color="danger"
                      onClick={(e) => this.handleCancelInvoice(e, sale.id)}
                    >
                      Cancel
                    </Button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No Sale
              </td>
            </tr>
          )}
        </tbody>
        {sales.length > 0 ? (
          <tfoot>
            <tr>
              <th colSpan="4">Total</th>
              <th>
                {Number(
                  sales.reduce((total, sale) => total + sale.total_amount, 0)
                ).toFixed(2)}
              </th>
              {auth.permission && auth.permission.name === "all" && <th></th>}
            </tr>
          </tfoot>
        ) : null}
      </>
    );
  };

  render() {
    const { fromDate, toDate } = this.state;
    const { auth } = this.props;
    return (
      <FullLayout>
        <aside key="sidebar">
          <h1>Daily Sale Report</h1>
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
              </Row>
              <Button>Search</Button>
            </Form>
            <Alert
              color="danger"
              isOpen={this.state.error}
              toggle={this.onAlertDismiss}
            >
              {this.state.error}
            </Alert>
            <Table bordered striped>
              <thead>
                <tr>
                  <th>SNo.</th>
                  <th>Invoice #</th>
                  <th>Customer</th>
                  <th>Payment Mode</th>
                  <th>Total Amount</th>
                  {auth.permission && auth.permission.name === "all" && (
                    <th>Action</th>
                  )}
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

const mapStateToProps = (state) => {
  return { auth: state.auth.authenticated };
};

export default connect(mapStateToProps)(requireAuth(DailySale));
