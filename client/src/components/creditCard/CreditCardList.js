import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchCreditCards } from '../../actions';
import { Link } from 'react-router-dom';
import Loading from '../Loading';

class CreditCardList extends Component {
  componentDidMount() {
    this.props.fetchCreditCards();
  }

  renderCard(card) {
    let flag;
    if (card.flag === 'Master') {
      flag = <img src={require('../../images/master.png')} width="60" height="40" alt="Card flag" />
    } else {
      flag = <img src={require('../../images/visa.png')} width="60" height="25" alt="Card flag" className="card-visa" />    
    }

    return (
      <div key={card._id} className="col s12 m4">
        <div className="card blue-grey darken-1">
          <div className="card-content white-text">
            <div className="card-header">
              <div className="left">
                <img src={require('../../images/bank.png')} width="40" height="40" alt="Basic Bank" />
              </div>
              <div className="right">Basic Bank</div>
            </div>
            <div className="card-number">{card.number}</div>
            <div className="card-footer">
              <span className="right">
                { flag }
              </span>
              <div className="left">{this.props.auth.fullName}</div>
              <br/>
              <div className="left">Exp: {card.expirationMonth}/{card.expirationYear}</div>
            </div>
          </div>
          <div className="card-action">
            <Link to={`/creditcard/details/${card._id}`}>Details</Link>
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (this.props.creditCards) {
      return (
        <div className="center">
          <div className="teal lighten-2 page-title">
            <Link className="btn right orange page-title-btn" to="/creditcard/new">
              Request new card
            </Link>
            <h5>Credit Cards</h5>
          </div>
          <div className="row">
            {this.props.creditCards.map(card => this.renderCard(card)) }
          </div>
        </div>
      );
    } else {
      return <Loading />;
    }
  }
}

function mapStateToProps(state) {
  return { creditCards: state.creditCard.all, auth: state.auth };
}
export default connect(
  mapStateToProps,
  { fetchCreditCards }
)(CreditCardList);
