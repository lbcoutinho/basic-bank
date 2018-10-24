import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createContact } from '../../actions';

class ContactNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ''
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.contact && nextProps.contact.error) {
      window.alert(nextProps.contact.error);
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const newContact = {
      email: this.state.email
    };
    this.props.createContact(newContact, this.props.history);
  }

  render() {
    return (
      <div>
        <div className="teal lighten-2 center page-title">
          <h5>New Contact</h5>
        </div>
        <form onSubmit={this.onSubmit}>
          <div className="field-group col s12 m4">
            <label>Contact Email</label>
            <input type="email" name="email" onChange={this.onChange} value={this.state.email} />
          </div>
          <div className="field-group">
            <button type="submit" className="btn orange">
              Save
            </button>
          </div>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { contact: state.account.contact };
}
export default connect(
  mapStateToProps,
  { createContact }
)(ContactNew);
