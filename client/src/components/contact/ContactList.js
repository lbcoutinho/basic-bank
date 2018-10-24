import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchContacts, deleteContact } from '../../actions';
import { Link } from 'react-router-dom';
import Loading from '../Loading';

class ContactList extends Component {
  constructor(props) {
    super(props);
    this.deleteContact = this.deleteContact.bind(this);
  }

  componentDidMount() {
    this.props.fetchContacts();
  }

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps', nextProps);
  }

  deleteContact(e) {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      this.props.deleteContact(e.target.id);
    }
  }

  renderContacts(contacts) {
    return contacts.map(contact => (
      <tr key={contact._id}>
        <td>{contact.fullName}</td>
        <td>{contact.email}</td>
        <td>
          <button id={contact._id} onClick={this.deleteContact} className="btn orange">
            Delete
          </button>
        </td>
      </tr>
    ));
  }

  render() {
    console.log('render', this.props.contacts);
    if (this.props.contacts) {
      return (
        <div className="center">
          <div className="teal lighten-2 page-title">
            <Link className="btn right orange page-title-btn" to="/contact/new">
              Add Contact
            </Link>
            <h5>Contacts</h5>
          </div>
          <table className="contact-table table">
            <thead>
              <tr>
                <th>Contact</th>
                <th>E-mail</th>
                <th />
              </tr>
            </thead>
            <tbody>{this.renderContacts(this.props.contacts)}</tbody>
          </table>
        </div>
      );
    } else {
      return <Loading />;
    }
  }
}

function mapStateToProps(state) {
  return { contacts: state.account.contacts };
}
export default connect(
  mapStateToProps,
  { fetchContacts, deleteContact }
)(ContactList);
