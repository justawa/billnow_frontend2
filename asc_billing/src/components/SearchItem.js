import React, { Component } from 'react';
// import Autosuggest from "react-autosuggest";
import '../Search.css';
import billing from '../api/billing';
import { connect } from 'react-redux';
import { addToCart } from '../actions';
// import { Input } from "reactstrap";

// const items = [
//   {
//     product_code: 11111,
//     product_name: "Shirt",
//     gst: 5,
//     unit_cost: 30,
//   },
//   {
//     product_code: 11112,
//     product_name: "Skirt",
//     gst: 5,
//     unit_cost: 30,
//   },
// ];

function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

class SearchItem extends Component {
  state = {
    value: '',
    suggestions: [],
  };

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };

  handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      const { value } = e.target;
      const { customerType } = this.props;
      let currentItem = this.props.cart.items.find(
        (item) => item.product_code === value
      );
      if (!currentItem) {
        let currentItem = await this.searchProduct(value, customerType);
        this.props.addToCart(currentItem);
      }
      this.setState({ value: '' });
    }
  };

  searchProduct = async (value, customerType) => {
    const response = await billing.post('search-single-item', {
      product_code: value,
      customerType,
    });

    return response.data.item;
  };

  getSuggestions(value) {
    const escapedValue = escapeRegexCharacters(value.trim());

    if (escapedValue === '') {
      return [];
    }

    const regex = new RegExp('^' + escapedValue, 'i');

    return this.state.suggestions.filter(
      (item) => regex.test(item.product_name) || regex.test(item.product_code)
    );
  }

  getSuggestionValue(suggestion) {
    return suggestion.product_name;
  }

  renderSuggestion(suggestion) {
    return <span>{suggestion.product_name}</span>;
  }

  onSuggestionsFetchRequested = async ({ value }) => {
    try {
      const response = await billing.post('search-list', {
        q: value,
      });
      this.setState({
        suggestions: response.data.searched_items,
      });
    } catch (err) {
      console.log(err);
    }

    // this.setState({
    //   suggestions: this.getSuggestions(value),
    // });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  render() {
    const { value, suggestions } = this.state;
    // const inputProps = {
    //   placeholder: "Search product by code or name",
    //   value,
    //   autoFocus: true,
    //   className: "form-control",
    //   onChange: this.onChange,
    //   onKeyDown: this.handleKeyDown,
    // };

    // return (
    //   <Autosuggest
    //     suggestions={suggestions}
    //     onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
    //     onSuggestionsClearRequested={this.onSuggestionsClearRequested}
    //     getSuggestionValue={this.getSuggestionValue}
    //     renderSuggestion={this.renderSuggestion}
    //     inputProps={inputProps}
    //   />
    // );

    return (
      <input
        placeholder='Search Product by code'
        value={value}
        autoFocus={true}
        className='form-control'
        onChange={this.onChange}
        onKeyDown={this.handleKeyDown}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return { cart: state.cart, customerType: state.auth.authenticated.user.type };
};

export default connect(mapStateToProps, { addToCart })(SearchItem);
