import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input, Spinner } from "reactstrap";
import queryString from "query-string";
import { connect } from "react-redux";
import { loginUser } from "../../actions";
import FullLayout from "../Layouts/FullLayout";

class Login extends Component {
  state = {
    isFormloading: false,
    email: "",
    password: "",
  };

  componentDidMount() {
    const parsed = queryString.parse(this.props.location.search);
    this.setState(parsed);
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    this.setState({ isFormloading: true, hasErrors: false });
    this.props.loginUser(
      email,
      password,
      (redirectTo) => this.props.history.push(redirectTo),
      () => this.setState({ isFormloading: false })
    );
  };

  render() {
    if (this.state.isFormloading) return <Spinner color="primary" />;
    return (
      <FullLayout>
        <aside key="sidebar">
          <h1>Login</h1>
        </aside>
        <main key="main" className="card">
          <div className="card-body">
            <Form onSubmit={this.handleSubmit}>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Your Email"
                  value={this.state.email}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Your Password"
                  value={this.state.password}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <Button>Sign in</Button>
              <p style={{ color: "red", fontSize: "12px" }}>
                {this.props.errorMessage}
              </p>
            </Form>
          </div>
        </main>
      </FullLayout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth.authenticated,
    errorMessage: state.auth.error,
    redirectURL: state.redirectURL,
  };
};

export default connect(mapStateToProps, { loginUser })(Login);
