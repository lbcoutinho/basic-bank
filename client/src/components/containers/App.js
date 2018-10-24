import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { fetchUser } from '../../actions';
import './App.css';

import Header from './Header';
import Landing from '../Landing';
import Dashboard from '../Dashboard';
import CreditCardList from '../creditCard/CreditCardList';
import CreditCardDetails from '../creditCard/CreditCardDetails';
import CreditCardNew from '../creditCard/CreditCardNew';
import ContactList from '../contact/ContactList';
import ContactNew from '../contact/ContactNew';

class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    return (
      <BrowserRouter>
        <div className="container">
          <Header />
          <main>
            <Switch>
              <Route exact path="/" component={Landing} />
              <Route exact path="/home" component={Dashboard} />
              <Route exact path="/creditcard" component={CreditCardList} />
              <Route exact path="/creditcard/details/:id" component={CreditCardDetails} />
              <Route exact path="/creditcard/new" component={CreditCardNew} />
              <Route exact path="/contact" component={ContactList} />
              <Route exact path="/contact/new" component={ContactNew} />
            </Switch>
          </main>
        </div>
      </BrowserRouter>
    );
  }
}

export default connect(
  null,
  { fetchUser }
)(App);
