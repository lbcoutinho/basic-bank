import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchCreditCard, deleteCreditCard } from '../../actions';
import Loading from '../Loading';

class CreditCardDetails extends Component {
  constructor(props) {
    super(props);
    this.deleteCard = this.deleteCard.bind(this);
  }

  componentDidMount() {
    // Get param from URL and fetch card data
    const id = this.props.match.params.id;
    this.props.fetchCreditCard(id);
  }

  deleteCard() {
    if (window.confirm('Are you sure you want to delete this credit card?')) {
      this.props.deleteCreditCard(this.props.creditCard._id, this.props.history);
    }
  }

  renderHistory(history) {
    return history.map(item => (
      <tr key={item.date}>
        <td>{new Date(item.date).toLocaleDateString('pt-BR')}</td>
        <td>{item.description}</td>
        <td>{item.amount}</td>
      </tr>
    ));
  }

  render() {
    if (this.props.creditCard) {
      const card = this.props.creditCard;
      return (
        <div>
          <div className="teal lighten-2 page-title">
            <button onClick={this.deleteCard} className="btn orange right page-title-btn">
              Delete
            </button>
            <div className="info-group">
              <label>Number: </label>
              <span>{card.number}</span>
            </div>
            <div className="info-group">
              <label>Expiration: </label>
              <span>
                {card.expirationMonth}/{card.expirationYear}
              </span>
            </div>
            <div className="info-group">
              <label>Total: </label>
              <span>R$ {card.totalSpent}</span>
            </div>
          </div>
          <table className="account-history">
            <thead>
              <tr>
                <th>Date</th>
                <th>History</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>{this.renderHistory(card.history)}</tbody>
          </table>
        </div>
      );
    } else {
      return <Loading />;
    }
  }
}

function mapStateToProps(state) {
  return { creditCard: state.creditCard.card };
}
export default connect(
  mapStateToProps,
  { fetchCreditCard, deleteCreditCard }
)(CreditCardDetails);
