import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Table, Input, Button, FormGroup } from 'reactstrap';
import billing from '../../api/billing';
import FullLayout from '../Layouts/FullLayout';
import requireAuth from '../../helpers/requireAuth';

class CustomerInvoices extends Component {
  state = {
    customer: {},
    message: '',
  };

  componentDidMount = async () => {
    const response = await billing.get(
      `customers/${this.props.match.params.id}`
    );
    this.setState({ customer: response.data.customer });
  };

  handleChange = (e, i) => {
    const { customer } = this.state;
    customer.sales[i].payment_mode = e.target.value;
    const updatedCustomer = { ...customer };
    this.setState({ customer: updatedCustomer });
  };

  updatePaymentMode = async (e, i) => {
    const { customer } = this.state;

    try {
      const response = await billing.post('update-sale-payment-mode', {
        id: customer.sales[i].id,
        payment_mode: customer.sales[i].payment_mode,
      });
      this.setState({ message: response.data.message });
    } catch (err) {
      // console.log(err);
      this.setState({ message: err.response.data.message });
    }
  };

  render() {
    const { customer, message } = this.state;
    return (
      <FullLayout>
        <aside key='sidebar'>
          <h1>Customer Invoices</h1>
        </aside>
        <main key='main' className='card'>
          {message && <div>{message}</div>}
          <div className='card-body'>
            <Row>
              <Col>Phone: {customer.phone}</Col>
              <Col>Name: {customer.name}</Col>
              <Col>
                Address:{' '}
                {`${customer.billing_address}, ${customer.billing_city}, ${customer.billing_state} - ${customer.billing_pincode}`}
              </Col>
              <Col>Card: {customer.card}</Col>
              <Col>
                <Link to={`/customer/${customer.phone}`}>
                  Edit Customer Info
                </Link>
              </Col>
            </Row>
            <Table bordered striped style={{ marginBottom: 0 }}>
              <thead>
                <tr>
                  <th width='20%'>SNo.</th>
                  <th width='20%'>Invoice No.</th>
                  <th width='20%'>Date</th>
                  <th width='20%'>Total Amount</th>
                  <th width='20%'>Payment Mode</th>
                </tr>
              </thead>
            </Table>
            <div style={{ maxHeight: '45vh', overflowY: 'scroll' }}>
              <Table
                bordered
                striped
                style={{
                  marginBottom: 0,
                }}
              >
                <tbody>
                  {customer.sales && customer.sales.length > 0 ? (
                    customer.sales.map((sale, idx) => (
                      <tr key={sale.id}>
                        <td width='20%'>{idx + 1}</td>
                        <td width='20%'>
                          <Link to={`/invoice/${sale.id}`}>
                            {'00' + sale.id}
                          </Link>
                        </td>
                        <td width='20%'>{sale.created_at}</td>
                        <td width='20%'>{sale.total_amount}</td>
                        <td width='20%'>
                          <FormGroup>
                            <Input
                              type='select'
                              name='select'
                              value={sale.payment_mode}
                              onChange={(e) => this.handleChange(e, idx)}
                            >
                              <option value='cash'>Cash</option>
                              <option value='credit'>Credit</option>
                            </Input>
                          </FormGroup>
                          <Button
                            color='success'
                            onClick={(e) => this.updatePaymentMode(e, idx)}
                            block
                          >
                            Update
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan='5' className='text-center'>
                        No Invoice
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
            <Table bordered striped>
              {customer.sales && customer.sales.length > 0 ? (
                <tfoot>
                  <tr>
                    <th width='60%' colSpan='3'>
                      Total
                    </th>
                    <th width='20%'>
                      {Number(
                        customer.sales.reduce(
                          (total, sale) => total + sale.total_amount,
                          0
                        )
                      ).toFixed(2)}
                    </th>
                    <th width='20%'></th>
                  </tr>
                </tfoot>
              ) : null}
            </Table>
          </div>
        </main>
      </FullLayout>
    );
  }
}

export default CustomerInvoices;
