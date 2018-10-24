import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import $ from 'jquery';

class Header extends Component {
  hideSideBar() {
    if (!this.props.auth) {
      $(this.refs.sideBar).remove();
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

          {this.hideSideBar()}
          <div ref="sideBar">
            <a data-activates="main-menu" className="button-collapse show-on-large">
              <i className="fa fa-bars" />
            </a>
            <ul className="side-nav" id="main-menu">
              <li><Link to="/home"><i className="fa fa-home" /> Home</Link></li>
              <li><Link to="/creditcard"><i className="fa fa-credit-card" /> Cards</Link></li>
              <li><Link to="/contact"><i className="fa fa-users" /> Contacts</Link></li>
            </ul>
          </div>

          <ul className="right">{this.renderLoginLogout()}</ul>
        </div>
      </nav>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}
export default connect(mapStateToProps)(Header);
