import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, ListGroup, ListGroupItem } from 'reactstrap';
import { connect } from 'react-redux';

class Sidebar extends Component {
  render() {
    const { latestSales, auth } = this.props;
    console.log('latestSales', latestSales);
    return (
      <div className='card'>
        <div className='card-body'>
          {/* {auth.permission &&
            (auth.permission.name === 'all' ||
              auth.permission.name === 'reports') && (
              <Button
                tag={Link}
                to='/daily-sale-report'
                color='warning'
                className='text-uppercase m-1'
                size='sm'
              >
                Daily Sale
              </Button>
            )}
          {auth.permission &&
            (auth.permission.name === 'all' ||
              auth.permission.name === 'data-entry' ||
              auth.permission.name === 'other') && (
              <Button
                tag={Link}
                to='/'
                color='warning'
                className='text-uppercase m-1'
                size='sm'
              >
                Invoice
              </Button>
            )}
          {auth.permission && auth.permission.name === 'all' && (
            <Button
              tag={Link}
              to='/sale-profit'
              color='warning'
              className='text-uppercase m-1'
              size='sm'
            >
              Sale Profit
            </Button>
          )}
          {auth.permission &&
            (auth.permission.name === 'all' ||
              auth.permission.name === 'reports') && (
              <Button
                tag={Link}
                to='/stock-summary'
                color='warning'
                className='text-uppercase m-1'
                size='sm'
              >
                Stock Summary
              </Button>
            )}
          {auth.permission &&
            (auth.permission.name === 'all' ||
              auth.permission.name === 'reports' ||
              auth.permission.name === 'other') && (
              <Button
                tag={Link}
                to='/expense'
                color='warning'
                className='text-uppercase m-1'
                size='sm'
              >
                Expense
              </Button>
            )}
          {auth.permission &&
            (auth.permission.name === 'all' ||
              auth.permission.name === 'reports') && (
              <Button
                tag={Link}
                to='/daily-purchase-report'
                color='warning'
                className='text-uppercase m-1'
                size='sm'
              >
                Daily Purchase
              </Button>
            )}
          {auth.permission &&
            (auth.permission.name === 'all' ||
              auth.permission.name === 'other') && (
              <Button
                tag={Link}
                to='/customers'
                color='warning'
                className='text-uppercase m-1'
                size='sm'
              >
                Customers
              </Button>
            )}
          {auth.permission &&
            (auth.permission.name === 'all' ||
              auth.permission.name === 'data-entry') && (
              <Button
                tag={Link}
                to='/bill'
                color='warning'
                className='text-uppercase m-1'
                size='sm'
              >
                Bill
              </Button>
            )}
          {auth.permission && auth.permission.name === 'all' && (
            <Button
              tag={Link}
              to='/most-sold-items'
              color='warning'
              className='text-uppercase m-1'
              size='sm'
            >
              Most Sold Items
            </Button>
          )}
          {auth.permission && auth.permission.name === 'all' && (
            <Button
              tag={Link}
              to='/cancelled-invoice'
              color='warning'
              className='text-uppercase m-1'
              size='sm'
            >
              Cancelled Invoice
            </Button>
          )}
          {auth.permission &&
            (auth.permission.name === 'all' ||
              auth.permission.name === 'reports') && (
              <Button
                tag={Link}
                to='/item-gst'
                color='warning'
                className='text-uppercase m-1'
                size='sm'
              >
                Item GST
              </Button>
            )}
          {auth.permission && auth.permission.name === 'all' && (
            <Button
              tag={Link}
              to='/add-item'
              color='warning'
              className='text-uppercase m-1'
              size='sm'
            >
              Add Item
            </Button>
          )} */}
          <div className='mt-4'>
            {/* <AddCustomer /> */}
            {this.props.children}
          </div>
          {latestSales && latestSales.length > 0 ? (
            <ListGroup>
              <h5 className='text-center pt-3'>Latest Customers</h5>
              {latestSales.map((sale) => (
                <ListGroupItem key={sale.customer.id} style={{ fontSize: 12 }}>
                  {sale.customer.phone} {sale.customer.name}{' '}
                  <Link to={`/customers/${sale.customer.id}`}>
                    All Invoices
                  </Link>
                </ListGroupItem>
              ))}
            </ListGroup>
          ) : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { auth: state.auth.authenticated };
};

export default connect(mapStateToProps)(Sidebar);
