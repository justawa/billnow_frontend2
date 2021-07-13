import React, { Component } from "react";
import { connect } from "react-redux";
import { updateURL } from "../actions";

export default function requireAuth(ChildComponent) {
  class ComposedComponent extends Component {
    componentDidMount() {
      this.shouldNavigateAway();
    }

    componentDidUpdate() {
      this.shouldNavigateAway();
    }

    shouldNavigateAway() {
      console.log(this.props.auth);
      this.props.updateURL(this.props.currentURL);
      if (!this.props.auth.isLoggedIn) {
        this.props.history.push(`/login`);
      }
    }

    render() {
      return <ChildComponent {...this.props} />;
    }
  }

  const mapStateToProps = (state, ownProps) => {
    return {
      auth: state.auth.authenticated,
      currentURL: ownProps.location.pathname,
    };
  };

  return connect(mapStateToProps, { updateURL })(ComposedComponent);
}
