import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import "./InvoicePdf.module.css";
import { showInvoice } from "../../actions/index";

class InvoicePdf extends Component {
  componentDidMount() {
    this.props.showInvoice(this.props.match.params.id);
  }

  showDateFromTimeStamp = (dateTime) => {
    return new Date(dateTime).toISOString().slice(0, 10);
  };

  render() {
    const { sale } = this.props;
    const { customer, items } = sale;
    console.log(customer);
    return (
      <div className="w-100">
        <div className="col-12">
          <Link to="/" className="non-printable">
            {`<<`} Go to Create Invoice
          </Link>
          <div className="card">
            <div className="card-body">
              <h3 className="text-center font-weight-bold mb-1">
                Incl. of Taxes
              </h3>
              <hr />
              <p className="text-center font-weight-bold mb-0">
                Ardh Sainik Canteen
              </p>
              <p className="text-center small font-weight-bold mb-0">
                Ward No. 1, College Road, Kathua
              </p>
              <p className="text-center small font-weight-bold mb-0">
                GSTIN No.: 01BTIPS1066E1ZZ
              </p>
              <div className="row pb-2 p-2">
                <div className="col-md-12 sides">
                  <p className="mb-0">
                    <span
                      style={{
                        width: "50%",
                        display: "inline-block",
                        textAlign: "left",
                      }}
                    >
                      <strong>No.</strong>:{" "}
                      <small className="small">IN00{sale.id}</small>
                    </span>
                    <span
                      style={{
                        width: "50%",
                        display: "inline-block",
                        textAlign: "right",
                      }}
                    >
                      <strong>Date</strong>:{" "}
                      <small className="small">
                        {sale.created_at &&
                          this.showDateFromTimeStamp(sale.created_at)}
                      </small>
                    </span>
                  </p>
                  <p className="mb-0">
                    <strong>Name</strong>:{" "}
                    <small className="small">
                      {customer.name}, +91{customer.phone}
                    </small>
                  </p>
                  <p>
                    <strong>Card Id</strong>:{" "}
                    <small className="small">{customer.card}</small>
                  </p>
                </div>

                {/* <div className="col-md-6 sides text-right">
                  <p className="mb-1">
                    <strong>Date</strong>:{" "}
                    <small className="small">{sale.created_at}</small>
                  </p>
                </div> */}
              </div>
              <div className="table-responsive">
                <table className="table table-bordered mb-0">
                  <thead>
                    <tr>
                      <th className="text-uppercase small font-weight-bold non-printable">
                        SNo.
                      </th>
                      <th className="text-uppercase small font-weight-bold">
                        Item
                      </th>
                      <th className="text-uppercase small font-weight-bold">
                        Qty
                      </th>
                      <th className="text-uppercase small font-weight-bold">
                        MRP
                        <span style={{ textTransform: "capitalize" }}>
                          (Rs)
                        </span>
                      </th>
                      <th className="text-uppercase small font-weight-bold">
                        Sale Price
                        <span style={{ textTransform: "capitalize" }}>
                          (Rs)
                        </span>
                      </th>
                      <th className="text-uppercase small font-weight-bold">
                        Tax %
                      </th>
                      <th className="text-uppercase small font-weight-bold">
                        Total
                        <span style={{ textTransform: "capitalize" }}>
                          (Rs)
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items &&
                      items.map((item, idx) => (
                        <tr key={item.id}>
                          <td className="non-printable">{idx + 1}</td>
                          <td>{item.product_name}</td>
                          <td>{item.pivot.qty}</td>
                          <td>{item.mrp}</td>
                          <td>{item.sale_price}</td>
                          <td>{item.gst}</td>
                          <td>{item.pivot.price}</td>
                        </tr>
                      ))}
                  </tbody>
                  <tfoot className="font-weight-bold">
                    <tr>
                      <td className="non-printable"></td>
                      <td colSpan="5">Total Amount</td>
                      <td>{"Rs " + sale.total_amount}</td>
                    </tr>
                    <tr>
                      <td className="non-printable"></td>
                      <td colSpan="5">Payment Mode</td>
                      <td className="text-uppercase">
                        {sale.payment_mode || "No Payment"}
                      </td>
                    </tr>
                    <tr>
                      <td className="non-printable"></td>
                      <td colSpan="5" className="small">
                        You have saved
                      </td>
                      <td className="font-weight-bold">
                        {items &&
                          "Rs " +
                            Number(
                              items.reduce(
                                (total, item) =>
                                  total +
                                  item.mrp * item.pivot.qty -
                                  item.sale_price * item.pivot.qty,
                                0
                              )
                            ).toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <p className="font-weight-bold small mt-3 mb-1">
                Terms &amp; Conditions
              </p>
              <p className="mb-5 mt-0 small">
                Items once sold. No Refund. No Exchange.
              </p>
              <p className="font-weight-bold small mt-3 text-center">
                Thanks! for supporting
              </p>
              <p className="font-weight-bold small mb-0 text-center">
                Paramilitary Forces nation first for us.
              </p>
              <p className="font-weight-bold small mb-0 text-center">
                Initiative of Ardh Sainik Canteen (Regd.)
              </p>
              <p className="font-weight-bold small mb-0 text-center">
                Phone: +91 7417122363
              </p>
              <p className="font-weight-bold small mb-0 text-center">
                || Jai Hind ||
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { sale: state.sale };
};

export default connect(mapStateToProps, { showInvoice })(InvoicePdf);
