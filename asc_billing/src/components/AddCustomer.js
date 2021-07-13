import React, { Component } from 'react';
import { connect } from 'react-redux';
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
} from 'reactstrap';
import {
  searchCustomerByPhone,
  updateCustomer,
  selectCustomer,
} from '../actions';
import Search from './Search';

class AddCustomer extends Component {
  state = {
    isOpen: false,
    phone: '',
    phoneError: '',
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    card: '',
  };

  toggleModal = () => {
    this.setState(function (prevState) {
      return { isOpen: !prevState.isOpen };
    });
  };

  handlePhoneChange = (phone) => {
    this.setState({ phone, phoneError: '' });
  };

  addNewCustomer = (e) => {
    e.preventDefault();
    if (!this.state.phone) {
      this.setState({ phoneError: 'Customer Mobile Number is required' });
      return;
    }
    this.props.searchCustomerByPhone(this.state.phone, this.toggleModal);
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleFormSubmit = (e, id) => {
    e.preventDefault();
    this.props.updateCustomer(id, this.state, this.toggleModal);
  };

  renderForm = () => {
    const { customer } = this.props;
    return customer.name &&
      customer.billing_address &&
      customer.billing_city &&
      customer.billing_state &&
      customer.billing_pincode ? (
      <>
        <h3 className='text-center text-uppercase'>{customer.type} customer</h3>
        <Row form>
          <Col md={6}>
            <FormGroup>
              <Label for='phone'>Phone</Label>
              <Input
                type='text'
                name='phone'
                id='phone'
                value={customer.phone}
                readOnly
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for='name'>Name</Label>
              <Input
                type='text'
                name='name'
                id='name'
                value={customer.name}
                readOnly
              />
            </FormGroup>
          </Col>
        </Row>
        <FormGroup>
          <Label for='address'>Address</Label>
          <Input
            type='textarea'
            name='address'
            id='address'
            value={customer.billing_address}
            readOnly
          />
        </FormGroup>
        <Row form>
          <Col md={4}>
            <FormGroup>
              <Label for='city'>City</Label>
              <Input
                type='text'
                name='city'
                id='city'
                value={customer.billing_city}
                readOnly
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for='state'>State</Label>
              <Input
                type='text'
                name='state'
                id='state'
                value={customer.billing_state}
                readOnly
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for='pincode'>Pincode</Label>
              <Input
                type='text'
                name='pincode'
                id='pincode'
                value={customer.billing_pincode}
                readOnly
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup>
              <Label for='card'>Card Id</Label>
              <Input
                type='text'
                name='card'
                id='card'
                value={customer.card}
                readOnly
              />
            </FormGroup>
          </Col>
        </Row>
        <Button
          color='success'
          onClick={() => this.props.selectCustomer(customer, this.toggleModal)}
        >
          Select Customer
        </Button>
      </>
    ) : (
      <Form onSubmit={(e) => this.handleFormSubmit(e, customer.id)}>
        <Row form>
          <Col md={6}>
            <FormGroup>
              <Label for='phone'>Phone</Label>
              <Input
                type='text'
                name='phone'
                id='phone'
                value={customer.phone}
                readOnly
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for='name'>Name</Label>
              <Input
                type='text'
                name='name'
                id='name'
                onChange={this.handleInputChange}
              />
            </FormGroup>
          </Col>
        </Row>
        <FormGroup>
          <Label for='address'>Address</Label>
          <Input
            type='textarea'
            name='address'
            id='address'
            onChange={this.handleInputChange}
          />
        </FormGroup>
        <Row form>
          <Col md={4}>
            <FormGroup>
              <Label for='city'>City</Label>
              <Input
                type='text'
                name='city'
                id='city'
                onChange={this.handleInputChange}
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for='state'>Force Name</Label>
              <Input
                type='text'
                name='state'
                id='state'
                onChange={this.handleInputChange}
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for='pincode'>Pincode</Label>
              <Input
                type='text'
                name='pincode'
                id='pincode'
                onChange={this.handleInputChange}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup>
              <Label for='card'>Card Id</Label>
              <Input
                type='text'
                name='card'
                id='card'
                onChange={this.handleInputChange}
              />
            </FormGroup>
          </Col>
        </Row>
        <Button color='success'>Submit Customer</Button>
      </Form>
    );
  };

  render() {
    return (
      <>
        {/* <InputGroup>
          <InputGroupAddon addonType='prepend'>
            <InputGroupText>+91</InputGroupText>
          </InputGroupAddon>
          <Input
            placeholder='Customer Mobile Number'
            maxLength='10'
            value={this.state.phone}
            onChange={this.handlePhoneChange}
          />
        </InputGroup> */}
        <form onSubmit={this.addNewCustomer}>
          <Search
            handleChange={this.handlePhoneChange}
            intialValue={this.state.phone}
          />
          <div style={{ display: 'block', color: 'red', fontSize: '12px' }}>
            {this.state.phoneError}
          </div>
          <Button
            color='success'
            className='text-uppercase mt-2'
            size='sm'
            block
            onClick={this.addNewCustomer}
          >
            add new customer
          </Button>
        </form>
        <Modal
          isOpen={this.state.isOpen}
          toggle={this.toggleModal}
          backdrop={'static'}
        >
          <ModalHeader>Add New Customer</ModalHeader>
          {/* toggle={this.toggleModal} */}
          <ModalBody>{this.renderForm()}</ModalBody>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return { customer: state.customer };
};

export default connect(mapStateToProps, {
  searchCustomerByPhone,
  updateCustomer,
  selectCustomer,
})(AddCustomer);
