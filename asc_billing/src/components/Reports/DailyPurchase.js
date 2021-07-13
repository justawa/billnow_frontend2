import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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
} from 'reactstrap';
import billing from '../../api/billing';
import FullLayout from '../Layouts/FullLayout';
import requireAuth from '../../helpers/requireAuth';
import { connect } from 'react-redux';

class DailyPurchase extends Component {
  state = {
    purchases: [],
    fromDate: new Date().toISOString().slice(0, 10),
    toDate: new Date().toISOString().slice(0, 10),
    isLoading: false,
    error: '',
  };

  onAlertDismiss = () => {
    this.setState({ error: '' });
  };

  componentDidMount = async () => {
    this.setState({ isLoading: true });
    try {
      const response = await billing.get('daily-purchase');
      this.setState({ purchases: response.data.purchases, isLoading: false });
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
      const response = await billing.get('daily-purchase', {
        params: {
          from: fromDate,
          to: toDate,
        },
      });
      this.setState({ purchases: response.data.purchases, isLoading: false });
    } catch (err) {
      this.setState({ error: err.response.data.error, isLoading: false });
    }
  };

  handleCancelBill = async (e, id) => {
    const { purchases } = this.state;
    try {
      await billing.put(`cancel-bill/${id}`);
      const updatedPurchases = purchases.filter(
        (purchase) => purchase.id !== id
      );
      this.setState({ purchases: updatedPurchases });
    } catch (err) {
      this.setState({ error: err.response.data.error });
    }
  };

  renderTableBody = () => {
    const { purchases, isLoading } = this.state;
    const { auth } = this.props;
    if (isLoading)
      return (
        <Spinner
          color='dark'
          style={{ display: 'flex', justifyContent: 'center' }}
        />
      );
    return (
      <>
        <tbody>
          {purchases.length > 0 ? (
            purchases.map((purchase, idx) => (
              <tr key={purchase.id}>
                <td>{idx + 1}</td>
                <td>
                  <Link to={`/bill/${purchase.id}`}>
                    {'BI00' + purchase.id}
                  </Link>
                </td>
                <td>{purchase.party.name}</td>
                <td>{purchase.payment_mode}</td>
                <td>{purchase.total_amount}</td>
                {auth.permission && auth.permission.name === 'all' && (
                  <td>
                    <Button
                      color='danger'
                      onClick={(e) => this.handleCancelBill(e, purchase.id)}
                    >
                      Cancel
                    </Button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='6' className='text-center'>
                No Purchase
              </td>
            </tr>
          )}
        </tbody>
        {purchases.length > 0 ? (
          <tfoot>
            <tr>
              <th colSpan='4'>Total</th>
              <th>
                {Number(
                  purchases.reduce(
                    (total, purchase) => total + purchase.total_amount,
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
    const { fromDate, toDate } = this.state;
    const { auth } = this.props;
    return (
      <FullLayout>
        <aside key='sidebar'>
          <h1>Daily Purchase Report</h1>
        </aside>
        <main key='main' className='card'>
          <div className='card-body'>
            <Form className='mb-3' onSubmit={this.handleSubmit}>
              <Row>
                <Col>
                  <FormGroup>
                    <Label for='fromDate'>From</Label>
                    <Input
                      type='date'
                      name='fromDate'
                      id='fromDate'
                      value={fromDate}
                      onChange={this.handleChange}
                    />
                  </FormGroup>{' '}
                </Col>
                <Col>
                  <FormGroup>
                    <Label for='toDate'>To</Label>
                    <Input
                      type='date'
                      name='toDate'
                      id='toDate'
                      value={toDate}
                      onChange={this.handleChange}
                    />
                  </FormGroup>{' '}
                </Col>
                <Button hidden>Search</Button>
              </Row>
              <Button>Search</Button>
            </Form>
            <Alert
              color='danger'
              isOpen={this.state.error}
              toggle={this.onAlertDismiss}
            >
              {this.state.error}
            </Alert>
            <Table bordered striped>
              <thead>
                <tr>
                  <th>SNo.</th>
                  <th>Bill #</th>
                  <th>Party</th>
                  <th>Payment Mode</th>
                  <th>Total Amount</th>
                  {auth.permission && auth.permission.name === 'all' && (
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

export default connect(mapStateToProps)(requireAuth(DailyPurchase));
