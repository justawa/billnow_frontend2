import React, { Component } from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
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
} from 'reactstrap';
import billing from '../../api/billing';
import FullLayout from '../Layouts/FullLayout';
import requireAuth from '../../helpers/requireAuth';

const columns = [
  {
    name: 'Product Code',
    selector: 'product_code',
  },
  {
    name: 'Product Name',
    selector: 'product_name',
    sortable: true,
  },
  {
    name: 'Unit Cost',
    selector: 'unit_cost',
    sortable: true,
  },
  {
    name: 'Qty',
    selector: 'qty',
    sortable: true,
  },
  {
    name: 'Remaining Qty',
    selector: 'rem_qty',
    sortable: true,
  },
];

class StockSummary extends Component {
  state = {
    items: [],
    filterText: '',
    fromDate: new Date().toISOString().slice(0, 10),
    toDate: new Date().toISOString().slice(0, 10),
    isLoading: false,
    error: '',
  };

  componentDidMount = async () => {
    this.setState({ isLoading: true });
    const response = await billing.get('stock-summary');
    this.setState({ items: response.data.items, isLoading: false });
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
      const response = await billing.get('stock-summary', {
        params: {
          from: fromDate,
          to: toDate,
        },
      });
      this.setState({ items: response.data.items });
    } catch (err) {
      this.setState({ error: err.response.data.error });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  // renderTableBody = () => {
  //   const { items, isLoading } = this.state;
  //   if (isLoading)
  //     return (
  //       <Spinner
  //         color='dark'
  //         style={{ display: 'flex', justifyContent: 'center' }}
  //       />
  //     );
  //   return (
  //     <>
  //       <tbody>
  //         {items.length > 0 ? (
  //           items.map((item, idx) => (
  //             <tr key={item.id}>
  //               <td>{idx + 1}</td>
  //               <td>{item.product_name}</td>
  //               <td>{item.unit_cost}</td>
  //               <td>{item.qty}</td>
  //               <td>{item.rem_qty}</td>
  //               <td>{Number(item.rem_qty * item.unit_cost).toFixed(2)}</td>
  //             </tr>
  //           ))
  //         ) : (
  //           <tr>
  //             <td colSpan='6' className='text-center'>
  //               No Item
  //             </td>
  //           </tr>
  //         )}
  //       </tbody>
  //       {items.length > 0 ? (
  //         <tfoot>
  //           <tr>
  //             <th colSpan='5'>Total</th>
  //             <th>
  //               {Number(
  //                 items.reduce(
  //                   (total, item) => total + item.rem_qty * item.unit_cost,
  //                   0
  //                 )
  //               ).toFixed(2)}
  //             </th>
  //           </tr>
  //         </tfoot>
  //       ) : null}
  //     </>
  //   );
  // };

  setFilterText = (e) => {
    this.setState({ filterText: e.target.value });
  };

  render() {
    const { items, filterText } = this.state;
    const filteredItems = items.filter(
      (item) =>
        item.product_name &&
        item.product_name.toLowerCase().includes(filterText.toLowerCase())
    );
    return (
      <FullLayout>
        <aside key='sidebar'>
          <input type='search' />
        </aside>
        <main key='main' className='card'>
          <div className='card-body'>
            <input
              type='search'
              placeholder='Search by Item Name'
              className='form-control'
              onChange={this.setFilterText}
            />
            <DataTable
              title='Stock Summary'
              columns={columns}
              data={filteredItems}
              pagination
              fixedHeader
              noDataComponent={
                <Spinner
                  color='dark'
                  style={{ display: 'flex', justifyContent: 'center' }}
                />
              }
            />
            {/* <Form className='mb-3' onSubmit={this.handleSubmit}>
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
            <Table bordered striped> 
              <thead>
                <tr>
                  <th>SNo.</th>
                  <th>Item</th>
                  <th>Unit Cost</th>
                  <th>Qty</th>
                  <th>Remaining Qty</th>
                  <th>Value</th>
                </tr>
              </thead>
              {this.renderTableBody()}
            </Table>*/}
          </div>
        </main>
      </FullLayout>
    );
  }
}

export default requireAuth(StockSummary);
