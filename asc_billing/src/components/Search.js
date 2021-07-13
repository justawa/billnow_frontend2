import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import billing from '../api/billing';

class Search extends Component {
  state = {
    value: this.props.intialValue,
    suggestions: [],
  };

  onChange = (event, { newValue }) => {
    this.setState(
      {
        value: newValue,
      },
      this.props.handleChange(newValue)
    );
  };

  onSuggestionsFetchRequested = async ({ value }) => {
    if (value.length >= 3) {
      const suggestions = await this.getSuggestions(value);
      this.setState({
        suggestions,
      });
    }
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  // Teach Autosuggest how to calculate suggestions for any given input value.
  getSuggestions = async (value) => {
    // const inputValue = value.trim().toLowerCase();
    // const inputLength = inputValue.length;

    // return inputLength === 0
    //   ? []
    //   : languages.filter(
    //       (lang) => lang.name.toLowerCase().slice(0, inputLength) === inputValue
    //     );

    try {
      const response = await billing.get(`customer-list?q=${value}`);
      // console.log(response);
      return response.data.customers;
    } catch (err) {
      return [];
    }
  };

  // When suggestion is clicked, Autosuggest needs to populate the input
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.
  getSuggestionValue = (suggestion) => {
    this.props.handleChange(suggestion.name);
    return suggestion.name;
  };

  renderSuggestion = (suggestion) => (
    <div>
      {suggestion.phone}, {suggestion.name}
    </div>
  );

  render() {
    const { value, suggestions } = this.state;

    const inputProps = {
      placeholder: 'Search Customer',
      value,
      className: 'form-control',
      onChange: this.onChange,
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps}
      />
    );
  }
}

export default Search;
