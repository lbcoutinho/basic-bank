import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import M from 'materialize-css/dist/js/materialize.min.js';
import 'materialize-css/dist/css/materialize.min.css';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSideBar: false
    };
  }

  componentWillReceiveProps(nextProps) {
    const showSideBar = nextProps.auth && !nextProps.auth.firstAccess;
    this.setState({ showSideBar });
  }

  componentDidUpdate() {
    M.Sidenav.init(document.querySelectorAll('.sidenav'), { menuWidth: 250, closeOnClick: true });
  }

  renderSideBar() {
    if (this.state.showSideBar) {
      return (
        <div>
          <a data-target="main-menu" className="sidenav-trigger show-on-large">
            <i className="fa fa-bars" />
          </a>
          <ul id="main-menu" className="sidenav">
            <li>
              <Link to="/home" className="sidenav-close">
                <i className="fa fa-home" /> Home
              </Link>
            </li>
            <li>
              <Link to="/creditcard" className="sidenav-close">
                <i className="fa fa-credit-card" /> Cards
              </Link>
            </li>
            <li>
              <Link to="/contact" className="sidenav-close">
                <i className="fa fa-users" /> Contacts
              </Link>
            </li>
            <li>
              <Link to="/transfer/new" className="sidenav-close">
                <i className="fa fa-exchange" /> Transfer
              </Link>
            </li>
          </ul>
        </div>
      );
    } else {
      return <div />;
    }
  }

  renderLoginLogout() {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return (
          <li>
            <a href="/auth/google">Login with Google</a>
          </li>
        );
      default:
        return (
          <li>
            <a href="/api/logout">Logout</a>
          </li>
        );
    }
  }

  render() {
    return (
      <nav className="blue darken-3">
        <div className="nav-wrapper">
          <Link to={this.props.auth ? '/home' : '/'} className="brand-logo center">
            Basic Bank
          </Link>
          {this.renderSideBar()}
          <ul className="right">{this.renderLoginLogout()}</ul>
        </div>
      </nav>
    );
  }
}

function mapStateToProps(state) {
  return { auth: state.auth };
}
export default connect(mapStateToProps)(Header);
