import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Spinner } from "reactstrap";

import billing from "../../api/billing";
import FullLayout from "../Layouts/FullLayout";
import Pagination from '../Pagination';
// import Input from '../Input';


class CustomerList extends Component{
  state = {
    customers: [],
    isLoading: false,
    pages: [25],
    page: 0,
    rowsPerPage: 25,
    // filterFn: []
     
    
  };
//const [filterFn, setfilterFn] = useState({fn:items => {return items;}})
  // const [page, setPage] = useState();

  // handleSearch = e => {
  //   let target = e.target;
  //   this.filterFn({
  //     fn:items => {
  //       if(target.value == "")
  //         return items;
  //         else
  //         return items.filter(x => x.name.includes(target.value))
  //     }
  //   })
  // }

  customersAfterPaging =  () => {
    return (this.state.customers).slice(this.state.page*this.state.rowsPerPage,(this.state.page+1)*this.state.rowsPerPage)
};

  updatePage = (newPage) =>{
  this.setState({page:newPage})
}
 


  
  // state = {  [page, setPage] = React.useState();
  // const [rowsPerPage, setRowsPerPage] = React.useState();
  // };

   
 
  componentDidMount = async () => {
    this.setState({isLoading: true });
    const response = await billing.get("customers");
    this.setState({ customers: response.data.customers, isLoading: false });
    
  };

  
  renderTableBody = () => {
    const { customers, isLoading } = this.state;
    if (isLoading)
      return (
        <Spinner
          color="dark"
          style={{ display: "flex", justifyContent: "center" }}
        />
      );
    return (
      <>
        <tbody>
          {customers.length > 0 ? (
            this.customersAfterPaging().map((customer, idx) => (
              <tr key={customer.id}>
                <td>{idx + 1}</td>
                <td>{customer.name}</td>
                <td>
                  <Link to={`customer/${customer.phone}`}>
                    {customer.phone}
                  </Link>
                </td>
                <td>{Number(customer.paid_total).toFixed(2)}</td>
                <td>{Number(customer.credit_total).toFixed(2)}</td>
                <td>
                  <Link to={`/customers/${customer.id}`}>
                    All Invoices{" "}
                    <span style={{ fontSize: 12 }}>
                      ({customer.sales.length || 0})
                    </span>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No Customer
              </td>
            </tr>
          )}
        </tbody>
      </>
    );
  };

  render() {
    return (
      <FullLayout>
        <aside key="sidebar">
          <h1>Customer List</h1>
        </aside>
        <main key="main" className="card">
    
          <div className="card-body">
            
              {/* <Input
                label="Search Customer"
                onChange={this.handleSearch}
                
              />
             */}
            <Table className="mt-2" bordered striped>
              <thead>
                <tr>
                  <th>SNo.</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Total Paid</th>
                  <th>Total Credit</th>
                  <th></th>
                </tr>
              </thead>
              {this.renderTableBody()}
            </Table>
            
          </div>
          <Pagination
            customers={this.state.customers} 
            page={this.state.page}
            pages={this.state.pages}
            rowsPerPage={this.state.rowsPerPage}
            customersAfterPaging={this.customersAfterPaging}
            updatePage={this.updatePage}
          />
        
        </main>
      </FullLayout>
    );
  }
}

export default CustomerList;
