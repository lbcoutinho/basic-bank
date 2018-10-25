import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setPassword } from '../../actions';

class PasswordNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: ''
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.setPassword(this.state.password, this.props.history);
  }

  render() {
    return (
      <div>
        <div className="center">
          <div className="teal lighten-2 page-title">
            <h5>Welcome</h5>
            <p>
              Since this is your first access to the Basic Bank, you need to create a your password
              before proceeding.
            </p>
          </div>
        </div>
        <form onSubmit={this.onSubmit}>
          <div className="field-group col s12 m4">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="small-input"
              onChange={this.onChange}
              value={this.state.password}
              pattern=".{6,}"
              title="Minimun 6 characters"
              required
            />
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
  return { auth: state.auth };
}
export default connect(
  mapStateToProps,
  { setPassword }
)(PasswordNew);
