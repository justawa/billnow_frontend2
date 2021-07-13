import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

class Header extends React.Component {
  render() {
    const { auth } = this.props;
    return (
      <Navbar color='faded' light expand='md'>
        <NavbarBrand
          to={auth.permission ? auth.permission.redirectTo : '/login'}
        >
          ASC Billing
        </NavbarBrand>
        {auth.isLoggedIn && (
          <>
            <NavbarToggler />
            <Collapse navbar>
              <Nav className='ml-auto' navbar>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    Admin
                  </DropdownToggle>
                  <DropdownMenu right>
                    {auth.permission &&
                      (auth.permission.name === 'all' ||
                        auth.permission.name === 'reports') && (
                        <DropdownItem
                          tag={Link}
                          to='/daily-sale-report'
                          color='warning'
                          className='text-uppercase m-1'
                          size='sm'
                        >
                          Daily Sale
                        </DropdownItem>
                      )}
                    {auth.permission &&
                      (auth.permission.name === 'all' ||
                        auth.permission.name === 'data-entry-sale' ||
                        auth.permission.name === 'other') && (
                        <DropdownItem
                          tag={Link}
                          to='/'
                          color='warning'
                          className='text-uppercase m-1'
                          size='sm'
                        >
                          Invoice
                        </DropdownItem>
                      )}
                    {auth.permission && auth.permission.name === 'all' && (
                      <DropdownItem
                        tag={Link}
                        to='/sale-profit'
                        color='warning'
                        className='text-uppercase m-1'
                        size='sm'
                      >
                        Sale Profit
                      </DropdownItem>
                    )}
                    {auth.permission &&
                      (auth.permission.name === 'all' ||
                        auth.permission.name === 'reports') && (
                        <DropdownItem
                          tag={Link}
                          to='/stock-summary'
                          color='warning'
                          className='text-uppercase m-1'
                          size='sm'
                        >
                          Stock Summary
                        </DropdownItem>
                      )}
                    {auth.permission &&
                      (auth.permission.name === 'all' ||
                        auth.permission.name === 'reports' ||
                        auth.permission.name === 'other') && (
                        <DropdownItem
                          tag={Link}
                          to='/expense'
                          color='warning'
                          className='text-uppercase m-1'
                          size='sm'
                        >
                          Expense
                        </DropdownItem>
                      )}
                    {auth.permission &&
                      (auth.permission.name === 'all' ||
                        auth.permission.name === 'reports') && (
                        <DropdownItem
                          tag={Link}
                          to='/daily-purchase-report'
                          color='warning'
                          className='text-uppercase m-1'
                          size='sm'
                        >
                          Daily Purchase
                        </DropdownItem>
                      )}
                    {auth.permission &&
                      (auth.permission.name === 'all' ||
                        auth.permission.name === 'other') && (
                        <DropdownItem
                          tag={Link}
                          to='/customers'
                          color='warning'
                          className='text-uppercase m-1'
                          size='sm'
                        >
                          Customers
                        </DropdownItem>
                      )}
                    {auth.permission &&
                      (auth.permission.name === 'all' ||
                        auth.permission.name === 'data-entry-purchase') && (
                        <DropdownItem
                          tag={Link}
                          to='/bill'
                          color='warning'
                          className='text-uppercase m-1'
                          size='sm'
                        >
                          Bill
                        </DropdownItem>
                      )}
                    {auth.permission && auth.permission.name === 'all' && (
                      <DropdownItem
                        tag={Link}
                        to='/most-sold-items'
                        color='warning'
                        className='text-uppercase m-1'
                        size='sm'
                      >
                        Most Sold Items
                      </DropdownItem>
                    )}
                    {auth.permission && auth.permission.name === 'all' && (
                      <DropdownItem
                        tag={Link}
                        to='/createGST'
                        color='warning'
                        className='text-uppercase m-1'
                        size='sm'
                      >
                        GST Invoice
                      </DropdownItem>
                    )}
                    {auth.permission && auth.permission.name === 'all' && (
                      <DropdownItem
                        tag={Link}
                        to='/cancelled-invoice'
                        color='warning'
                        className='text-uppercase m-1'
                        size='sm'
                      >
                        Cancelled Invoice
                      </DropdownItem>
                    )}
                    {auth.permission &&
                      (auth.permission.name === 'all' ||
                        auth.permission.name === 'reports') && (
                        <DropdownItem
                          tag={Link}
                          to='/item-gst'
                          color='warning'
                          className='text-uppercase m-1'
                          size='sm'
                        >
                          Item GST
                        </DropdownItem>
                      )}
                    {auth.permission && auth.permission.name === 'all' && (
                      <DropdownItem
                        tag={Link}
                        to='/add-item'
                        color='warning'
                        className='text-uppercase m-1'
                        size='sm'
                      >
                        Add Item
                      </DropdownItem>
                    )}
                    {auth.permission && auth.permission.name === 'all' && (
                      <DropdownItem
                        tag={Link}
                        to='/items'
                        color='warning'
                        className='text-uppercase m-1'
                        size='sm'
                      >
                        All Items
                      </DropdownItem>
                    )}
                    <DropdownItem divider />
                    <DropdownItem tag={Link} to='/logout'>
                      Logout
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Nav>
            </Collapse>
          </>
        )}
      </Navbar>
    );
  }
}

const mapStateToProps = (state) => {
  return { auth: state.auth.authenticated };
};

export default connect(mapStateToProps)(Header);

{
  /* <nav className="navbar navbar-expand-md navbar-light">
  <div className="container">
    <Link
      className="navbar-brand"
      to={auth.permission ? auth.permission.redirectTo : "/login"}
    >
      ASC Billing
    </Link>
  </div>
</nav>; */
}
