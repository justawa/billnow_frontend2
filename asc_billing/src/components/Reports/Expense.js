import React, { Component } from "react";
import { connect } from "react-redux";
// import { Link } from "react-router-dom";
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

class Expense extends Component {
  state = {
    expenses: [],
    amount: "",
    type: "",
    date: "",
    description: "",
    fromDate: new Date().toISOString().slice(0, 10),
    toDate: new Date().toISOString().slice(0, 10),
    isEditing: false,
    editingId: "",
    isLoading: false,
  };

  componentDidMount = async () => {
    this.setState({ isLoading: true });
    const response = await billing.get("expenses");
    this.setState({ expenses: response.data.expenses, isLoading: false });
  };

  handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "date") {
      value = new Date(value).toISOString().slice(0, 10);
    }
    this.setState({
      [name]: value,
    });
  };

  handleCancelExpense = async (e, id) => {
    const { expenses } = this.state;

    await billing.put(`cancel-expense/${id}`);
    const updatedExpenses = expenses.filter((expense) => expense.id !== id);
    this.setState({ sales: updatedExpenses });
  };

  // handleSubmit = async (e) => {
  //   e.preventDefault();
  //   let { fromDate, toDate } = this.state;
  //   const response = await billing.get("expenses", {
  //     from: fromDate,
  //     to: toDate,
  //   });
  //   this.setState({ expenses: response.data.expenses });
  // };

  handleEditClick = (e, id) => {
    e.preventDefault();
    const { expenses } = this.state;
    const foundExpense = expenses.find((expense) => expense.id === id);
    this.setState({
      amount: foundExpense.amount,
      type: foundExpense.type,
      date: foundExpense.date,
      description: foundExpense.description,
      isEditing: true,
      editingId: id,
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const {
      amount,
      type,
      date,
      description,
      isEditing,
      editingId,
    } = this.state;
    const url = isEditing ? `edit-expense/${editingId}` : "create-expense";
    try {
      await billing.post(url, {
        amount,
        type,
        date,
        description,
      });
      const response = await billing.get("expenses");
      this.setState({
        expenses: response.data.expenses,
        amount: "",
        type: "",
        date: "",
        description: "",
        isEditing: false,
        editingId: "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  renderTableBody = () => {
    const { expenses, isLoading } = this.state;
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
          {expenses.length > 0 ? (
            expenses.map((expense, idx) => (
              <tr key={expense.id}>
                <td>{idx + 1}</td>
                <td>{expense.date}</td>
                <td>{expense.type}</td>
                <td>{expense.amount}</td>
                {auth.permission.name === "all" && (
                  <td>
                    <Button
                      color="danger"
                      onClick={(e) => this.handleCancelExpense(e, expense.id)}
                    >
                      Cancel
                    </Button>{" "}
                    <Button
                      color="primary"
                      onClick={(e) => this.handleEditClick(e, expense.id)}
                    >
                      Edit
                    </Button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No Expense
              </td>
            </tr>
          )}
        </tbody>
        {expenses.length > 0 ? (
          <tfoot>
            <tr>
              <th colSpan="3">Total</th>
              <th>
                {Number(
                  expenses.reduce((total, expense) => total + expense.amount, 0)
                ).toFixed(2)}
              </th>
            </tr>
          </tfoot>
        ) : null}
      </>
    );
  };

  render() {
    const { amount, date, type, description } = this.state;
    const { auth } = this.props;
    return (
      <FullLayout>
        <aside key="sidebar">
          <h1>Expense Report</h1>
        </aside>
        <main key="main">
          <div className="card mb-3">
            <div className="card-body">
              <Form className="mb-3" onSubmit={this.handleSubmit}>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label for="amount">Amount</Label>
                      <Input
                        type="number"
                        name="amount"
                        id="amount"
                        value={amount}
                        onChange={this.handleChange}
                      />
                    </FormGroup>{" "}
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label for="date">Date</Label>
                      <Input
                        type="date"
                        name="date"
                        id="date"
                        value={date}
                        onChange={this.handleChange}
                      />
                    </FormGroup>{" "}
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label for="type">Type</Label>
                      <Input
                        type="text"
                        name="type"
                        id="type"
                        value={type}
                        onChange={this.handleChange}
                      />
                    </FormGroup>{" "}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label for="description">Description</Label>
                      <Input
                        type="textarea"
                        name="description"
                        id="description"
                        value={description}
                        onChange={this.handleChange}
                      />
                    </FormGroup>{" "}
                  </Col>
                </Row>
                <Button>{this.state.isEditing ? "Update" : "Submit"}</Button>
              </Form>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              {/* <Form className="mb-3" onSubmit={this.handleSubmit}>
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
            </Form> */}
              <Table bordered striped>
                <thead>
                  <tr>
                    <th>SNo.</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Amount</th>
                    {auth.permission.name === "all" && <th>Action</th>}
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

const mapStateToProps = (state) => {
  return { auth: state.auth.authenticated };
};

export default connect(mapStateToProps)(Expense);
