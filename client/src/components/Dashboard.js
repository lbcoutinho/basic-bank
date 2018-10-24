import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAccount } from '../actions';
import Loading from './Loading';

class Dashboard extends Component {
  componentDidMount() {
    this.props.fetchAccount();
  }

  renderContent(auth, account) {
    const history = account.history.map(item => (
      <tr key={item.date}>
        <td>{new Date(item.date).toLocaleDateString('pt-BR')}</td>
        <td>{item.description}</td>
        <td className={item.amount > 0 ? 'positive' : 'negative'}>{item.amount}</td>
      </tr>
    ));

    return (
      <div>
        <div className="teal lighten-2 center account-info page-title">
          <h5>Hello {auth.givenName}</h5>
          <b>Account:</b> {account.number}
          <br />
          <b>Balance:</b> {account.balance}
        </div>
        <table className="account-history table">
          <thead>
            <tr>
              <th>Date</th>
              <th>History</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>{history}</tbody>
        </table>
      </div>
    );
  }

  render() {
    const auth = this.props.auth;
    const account = this.props.account;
    if (auth && account) {
      return this.renderContent(auth, account);
    } else {
      return <Loading />;
    }
  }
}

function mapStateToProps(state) {
  return { auth: state.auth, account: state.account.data };
}
export default connect(
  mapStateToProps,
  { fetchAccount }
)(Dashboard);
