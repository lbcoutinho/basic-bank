import React, { Component } from 'react';
import { connect } from 'react-redux';
import { newTransfer, fetchContacts, validateTransfer, executeTransfer } from '../../actions';
import { Link } from 'react-router-dom';
import Loading from '../Loading';

class TransferNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      destination: '',
      value: '',
      card: '',
      showCreditCardSelector: false
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.renderCreditCards = this.renderCreditCards.bind(this);
  }

  componentDidMount() {
    this.props.newTransfer();
    this.props.fetchContacts();
  }

  // This method will execute when the component receives the validateTransfer response.
  componentWillReceiveProps(nextProps) {
    const validation = nextProps.transferValidation;
    if (validation) {
      if (validation.noFunds) {
        // If no funds and no credit card, then check if user wants to create a new credit card
        if (window.confirm(validation.noFunds)) {
          // Redirect to create credit card page
          this.props.history.push('/creditcard/new');
        } else {
          window.alert('Insufficient funds to transfer.');
        }
      } else if (validation.useCreditCard) {
        // If user has credit cards, check if user wants to use a credit card for transfer
        if (window.confirm(validation.useCreditCard)) {
          // Show credit card selector
          this.setState({ showCreditCardSelector: true });
        } else {
          window.alert('Insufficient funds to transfer.');
        }
      } else {
        // If validation response does not contain noFunds or useCreditCard messages then proceed with transfer
        this.props.executeTransfer(validation, this.props.history);
      }
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    // If transfer operation has not been validated, then validate
    if (!this.props.transferValidation) {
      const newTransfer = {
        destination: this.state.destination,
        value: this.state.value
      };
      this.props.validateTransfer(newTransfer);
    } else {
      const transfer = this.props.transferValidation;
      transfer.creditCardId = this.state.card;
      this.props.executeTransfer(transfer, this.props.history);
    }
  }

  renderContacts() {
    if (this.props.contacts.length) {
      const opts = this.props.contacts.map(contact => (
        <option key={contact._id} value={contact._id}>
          {contact.fullName}
        </option>
      ));
      return (
        <select
          className="browser-default"
          name="destination"
          onChange={this.onChange}
          value={this.state.destination}
        >
          <option value="" disabled>
            Choose a contact
          </option>
          {opts}
        </select>
      );
    } else {
      return (
        <div>
          Please, add a contact to perform the transfer.
          <br />
          <br />
          <Link className="btn orange" to="/contact/new">
            Add Contact
          </Link>
        </div>
      );
    }
  }

  renderCreditCards() {
    if (!this.state.showCreditCardSelector) return;

    const opts = this.props.creditCardList.map(card => (
      <option key={card._id} value={card._id}>
        {card.flag} - {card.number}
      </option>
    ));
    return (
      <div className="field-group col s12 m4">
        <label>Credit Card</label>
        <select
          className="browser-default"
          name="card"
          onChange={this.onChange}
          value={this.state.card}
        >
          <option value="" disabled>
            Choose a credit card
          </option>
          {opts}
        </select>
      </div>
    );
  }

  render() {
    if (this.props.contacts) {
      return (
        <div>
          <div className="center">
            <div className="teal lighten-2 page-title">
              <h5>Transfer</h5>
            </div>
          </div>
          <form onSubmit={this.onSubmit}>
            {this.renderCreditCards()}

            <div className="field-group col s12 m4">
              <label>Destination</label>
              {this.renderContacts()}
            </div>
            <div className="field-group col s12 m4">
              <label>Value</label>
              <input
                type="number"
                name="value"
                className="small-input"
                onChange={this.onChange}
                value={this.state.value}
              />
            </div>
            <div className="field-group">
              <button type="submit" className="btn orange">
                Send
              </button>
            </div>
          </form>
        </div>
      );
    } else {
      return <Loading />;
    }
  }
}

function mapStateToProps(state) {
  return {
    contacts: state.account.contacts,
    transferValidation: state.account.transferValidation,
    creditCardList: state.account.creditCardList
  };
}
export default connect(
  mapStateToProps,
  { newTransfer, fetchContacts, validateTransfer, executeTransfer }
)(TransferNew);
