import React, { Component } from 'react';
import billing from '../../api/billing';
import { connect } from 'react-redux';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  Input,
  Row,
  Col,
  Label,
} from 'reactstrap';
import { searchPartyByPhone, updateParty, selectParty } from '../../actions';

let file = null;
class AddParty extends Component {
  state = {
    product_code: '',
    product_name: '',
    hsn: '',
    image: '',
    brand: '',
    wholesale_percent: '',
    retail_percent: '',
    gst: '',
    message: '',
    loading: false,
  };

  handleChange = (e) => {
    // console.log(e.target);
    if (e.target.type === 'file') {
      this.setState({
        [e.target.name]: e.target.files[0],
      });
      file = e.target.files[0];
      // console.log(file);
    }
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    console.log(this.state);
    this.setState({
      loading: true,
      message: '',
    });
    const {
      product_code,
      product_name,
      hsn,
      image,
      brand,
      wholesale_percent,
      retail_percent,
      gst,
    } = this.state;
    const formData = new FormData();

    // Update the formData object
    formData.append('product_code', product_code);
    formData.append('product_name', product_name);
    formData.append('hsn', hsn || '');
    formData.append('image', file || '');
    formData.append('brand', brand || '');
    formData.append('wholesale_percent', wholesale_percent);
    formData.append('retail_percent', retail_percent);
    formData.append('gst', gst);
    try {
      await billing.post('add-fix-item', formData, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      });
      this.setState({
        message: 'Item added successfully',
        loading: false,
        retail_percent: '',
        wholesale_percent: '',
        gst: '',
        image: '',
        hsn: '',
        product_name: '',
        product_code: '',
      });
    } catch (err) {
      this.setState({ message: err.response.data.message, loading: false });
    }
  };

  render() {
    const {
      product_code,
      product_name,
      hsn,
      brand,
      wholesale_percent,
      retail_percent,
      gst,
      message,
      loading,
    } = this.state;
    return (
      <>
        <Modal
          isOpen={this.props.isOpen}
          toggle={this.props.toggle}
          fullscreen={true}
          size='lg'
        >
          <ModalHeader toggle={this.props.toggle}>Add Item</ModalHeader>
          <ModalBody>
            <Row>
              <Col>
                <FormGroup>
                  <Label>Product Code</Label>
                  <Input
                    type='text'
                    name='product_code'
                    value={product_code}
                    onChange={this.handleChange}
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>Product Name</Label>
                  <Input
                    type='text'
                    name='product_name'
                    value={product_name}
                    onChange={this.handleChange}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <Label>HSN</Label>
                  <Input
                    type='text'
                    name='hsn'
                    value={hsn}
                    onChange={this.handleChange}
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>Image</Label>
                  <Input
                    type='file'
                    name='image'
                    onChange={this.handleChange}
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>Brand</Label>
                  <Input
                    type='text'
                    name='brand'
                    value={brand}
                    onChange={this.handleChange}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <Label>Wholesale % margin</Label>
                  <InputGroup>
                    <Input
                      type='text'
                      name='wholesale_percent'
                      value={wholesale_percent}
                      onChange={this.handleChange}
                    />
                    <InputGroupAddon addonType='append'>
                      <InputGroupText>%</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>Retail % margin</Label>
                  <InputGroup>
                    <Input
                      type='text'
                      name='retail_percent'
                      value={retail_percent}
                      onChange={this.handleChange}
                    />
                    <InputGroupAddon addonType='append'>
                      <InputGroupText>%</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>GST %</Label>
                  <InputGroup>
                    <Input
                      type='text'
                      name='gst'
                      value={gst}
                      onChange={this.handleChange}
                    />
                    <InputGroupAddon addonType='append'>
                      <InputGroupText>%</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </FormGroup>
              </Col>
            </Row>
            <Button
              color='success'
              className='mt-3'
              size='sm'
              onClick={this.handleSubmit}
              disabled={loading}
            >
              Add Item
            </Button>
            <span>{message}</span>
          </ModalBody>
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
