import React, { Component } from "react";
import { Button, Form, FormGroup, Input, Row, Col, Label } from "reactstrap";
import billing from "../../api/billing";
import FullLayout from "../Layouts/FullLayout";

export default class EditCustomer extends Component {
  state = {
    customer: "",
  };

  componentDidMount = async () => {
    const phone = this.props.match.params.phone;
    const response = await billing.post("search-customer", {
      phone,
    });

    this.setState({ customer: response.data.searched_customer });
  };

  handleChange = (e) => {
    this.setState({
      customer: { ...this.state.customer, [e.target.name]: e.target.value },
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { customer } = this.state;
    const response = await billing.put(`update-customer/${customer.id}`, {
      name: customer.name,
      billing_address: customer.billing_address,
      billing_city: customer.billing_city,
      billing_state: customer.billing_state,
      billing_pincode: customer.billing_pincode,
    });
    this.props.history.push("/customers");
    // this.setState({ customer: response.data.selected_customer });
  };

  render() {
    const { customer } = this.state;
    return (
      <FullLayout>
        <aside key="sidebar">
          <h1>Edit Customer</h1>
        </aside>
        <main key="main" className="card">
          <div className="card-body">
            <Form onSubmit={this.handleSubmit}>
              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label for="phone">Phone</Label>
                    <Input
                      type="text"
                      name="phone"
                      value={customer && customer.phone}
                      readOnly
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="name">Name</Label>
                    <Input
                      type="text"
                      name="name"
                      onChange={this.handleChange}
                      value={customer && customer.name}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                <Label for="address">Address</Label>
                <Input
                  type="textarea"
                  name="billing_address"
                  onChange={this.handleChange}
                  value={customer && customer.billing_address}
                />
              </FormGroup>
              <Row form>
                <Col md={4}>
                  <FormGroup>
                    <Label for="city">City</Label>
                    <Input
                      type="text"
                      name="billing_city"
                      onChange={this.handleChange}
                      value={customer && customer.billing_city}
                    />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="state">State</Label>
                    <Input
                      type="text"
                      name="billing_state"
                      onChange={this.handleChange}
                      value={customer && customer.billing_state}
                    />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="pincode">Pincode</Label>
                    <Input
                      type="text"
                      name="billing_pincode"
                      onChange={this.handleChange}
                      value={customer && customer.billing_pincode}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormGroup>
                    <Label for="card">Card Id</Label>
                    <Input
                      type="text"
                      name="card"
                      onChange={this.handleChange}
                      value={customer && customer.card}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Button color="success" size="sm">
                Update Customer
              </Button>
            </Form>
          </div>
        </main>
      </FullLayout>
    );
  }
}
