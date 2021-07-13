import React, { Component } from "react";
import { connect } from "react-redux";
import { logoutUser } from "../../actions";

class Logout extends Component {
  componentDidMount() {
    this.props.logoutUser(() => this.props.history.push("/login"));
  }
  render() {
    return <div>Loading...</div>;
  }
}

export default connect(null, { logoutUser })(Logout);
