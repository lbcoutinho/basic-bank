import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createCreditCard } from '../../actions';

class CreditCardNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: ''
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const newCard = {
      flag: this.state.flag
    };
    this.props.createCreditCard(newCard, this.props.history);
  }

  render() {
    return (
      <div>
        <div className="teal lighten-2 center page-title">
          <h5>New Credit Card</h5>
        </div>
        <form onSubmit={this.onSubmit}>
          <div className="field-group col s12 m4">
            <label>Card Flag</label>
            <select
              className="browser-default"
              name="flag"
              onChange={this.onChange}
              value={this.state.flag}
            >
              <option value="" disabled>
                Choose a flag
              </option>
              <option value="Visa">Visa</option>
              <option value="Master">Master</option>
            </select>
          </div>
          <div className="field-group">
            <button type="submit" className="btn orange">
              Send Request
            </button>
          </div>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}
export default connect(
  mapStateToProps,
  { createCreditCard }
)(CreditCardNew);
