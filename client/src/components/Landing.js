import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="center">
      <h2>Welcome to the Basic Bank</h2>
      <br />
      <h5>Create a new account to start using our features</h5>
      <br />
      <Link className="btn" to="/surveys/new">
        Create new account
      </Link>
    </div>
  );
};

export default Landing;
