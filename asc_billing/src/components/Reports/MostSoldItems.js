import React, { useState, useEffect } from 'react';
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

export default function MostSoldItems() {
  const [items, setItem] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fromDate, setFromDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [toDate, setToDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState('');

  useEffect(() => {
    async function cb() {
      setIsLoading(true);
      const response = await billing.get('most-sold-items');
      setItem(response.data.itemsWithCount);
      setIsLoading(false);
    }
    cb();
  }, []);

  function renderTableBody() {
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
          {items.length > 0 ? (
            items.map((item, idx) => (
              <tr key={item.id}>
                <td>{idx + 1}</td>
                <td>{item.product_name}</td>
                <td>{item.rem_qty}</td>
                <td>{item.count}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='4' className='text-center'>
                No Item
              </td>
            </tr>
          )}
        </tbody>
      </>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      setIsLoading(true);
      const response = await billing.get('most-sold-items', {
        params: {
          from: fromDate,
          to: toDate,
        },
      });
      setItem(response.data.itemsWithCount);
      setIsLoading(false);
    } catch (err) {
      this.setState({ error: err.response.data.error });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <FullLayout>
      <aside key='sidebar'>
        <h1>Most Sold Items Report</h1>
      </aside>
      <main key='main' className='card'>
        <div className='card-body'>
          <Form className='mb-3' onSubmit={handleSubmit}>
            <Row>
              <Col>
                <FormGroup>
                  <Label for='fromDate'>From</Label>
                  <Input
                    type='date'
                    name='fromDate'
                    id='fromDate'
                    value={fromDate}
                    onChange={(e) =>
                      setFromDate(
                        new Date(e.target.value).toISOString().slice(0, 10)
                      )
                    }
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
                    onChange={(e) =>
                      setToDate(
                        new Date(e.target.value).toISOString().slice(0, 10)
                      )
                    }
                  />
                </FormGroup>{' '}
              </Col>
            </Row>
            <Button>Search</Button>
          </Form>
          <Table bordered striped>
            <thead>
              <tr>
                <th>SNo.</th>
                <th>Item</th>
                <th>Remaining Qty.</th>
                <th>Count</th>
              </tr>
            </thead>
            {renderTableBody()}
          </Table>
        </div>
      </main>
    </FullLayout>
  );
}
