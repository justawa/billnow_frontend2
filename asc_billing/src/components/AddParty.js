import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Button,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
} from "reactstrap";
import { searchPartyByPhone, updateParty, selectParty } from "../actions";

class AddParty extends Component {
  state = {
    isOpen: false,
    phone: "",
    phoneError: "",
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  };

  toggleModal = () => {
    this.setState(function (prevState) {
      return { isOpen: !prevState.isOpen };
    });
  };

  handlePhoneChange = (e) => {
    this.setState({ phone: e.target.value, phoneError: "" });
  };

  addNewParty = () => {
    if (!this.state.phone) {
      this.setState({ phoneError: "Party Mobile Number is required" });
      return;
    }
    this.props.searchPartyByPhone(this.state.phone, this.toggleModal);
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleFormSubmit = (e, id) => {
    e.preventDefault();
    this.props.updateParty(id, this.state, this.toggleModal);
  };

  renderForm = () => {
    const { party } = this.props;
    return party.name &&
      party.billing_address &&
      party.billing_city &&
      party.billing_state &&
      party.billing_pincode ? (
      <>
        <Row form>
          <Col md={6}>
            <FormGroup>
              <Label for="phone">Phone</Label>
              <Input
                type="text"
                name="phone"
                id="phone"
                value={party.phone}
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
                id="name"
                value={party.name}
                readOnly
              />
            </FormGroup>
          </Col>
        </Row>
        <FormGroup>
          <Label for="address">Address</Label>
          <Input
            type="textarea"
            name="address"
            id="address"
            value={party.billing_address}
            readOnly
          />
        </FormGroup>
        <Row form>
          <Col md={4}>
            <FormGroup>
              <Label for="city">City</Label>
              <Input
                type="text"
                name="city"
                id="city"
                value={party.billing_city}
                readOnly
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="state">State</Label>
              <Input
                type="text"
                name="state"
                id="state"
                value={party.billing_state}
                readOnly
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="pincode">Pincode</Label>
              <Input
                type="text"
                name="pincode"
                id="pincode"
                value={party.billing_pincode}
                readOnly
              />
            </FormGroup>
          </Col>
        </Row>
        <Button
          color="success"
          onClick={() => this.props.selectParty(party, this.toggleModal)}
        >
          Select Party
        </Button>
      </>
    ) : (
      <Form onSubmit={(e) => this.handleFormSubmit(e, party.id)}>
        <Row form>
          <Col md={6}>
            <FormGroup>
              <Label for="phone">Phone</Label>
              <Input
                type="text"
                name="phone"
                id="phone"
                value={party.phone}
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
                id="name"
                onChange={this.handleInputChange}
              />
            </FormGroup>
          </Col>
        </Row>
        <FormGroup>
          <Label for="address">Address</Label>
          <Input
            type="textarea"
            name="address"
            id="address"
            onChange={this.handleInputChange}
          />
        </FormGroup>
        <Row form>
          <Col md={4}>
            <FormGroup>
              <Label for="city">City</Label>
              <Input
                type="text"
                name="city"
                id="city"
                onChange={this.handleInputChange}
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="state">State</Label>
              <Input
                type="text"
                name="state"
                id="state"
                onChange={this.handleInputChange}
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="pincode">Pincode</Label>
              <Input
                type="text"
                name="pincode"
                id="pincode"
                onChange={this.handleInputChange}
              />
            </FormGroup>
          </Col>
        </Row>
        <Button color="success">Submit Party</Button>
      </Form>
    );
  };

  render() {
    return (
      <>
        <InputGroup>
          <InputGroupAddon addonType="prepend">
            <InputGroupText>+91</InputGroupText>
          </InputGroupAddon>
          <Input
            placeholder="Party Mobile Number"
            maxLength="10"
            value={this.state.phone}
            onChange={this.handlePhoneChange}
          />
        </InputGroup>
        <div style={{ display: "block", color: "red", fontSize: "12px" }}>
          {this.state.phoneError}
        </div>
        <Button
          color="success"
          className="text-uppercase mt-2"
          size="sm"
          block
          onClick={this.addNewParty}
        >
          add new party
        </Button>
        <Modal isOpen={this.state.isOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>Add New Party</ModalHeader>
          <ModalBody>{this.renderForm()}</ModalBody>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return { party: state.party };
};

export default connect(mapStateToProps, {
  searchPartyByPhone,
  updateParty,
  selectParty,
})(AddParty);
