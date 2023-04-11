import React from 'react';
import { Link } from 'react-router-dom';

const Nav = () => {
  function logout () {
    localStorage.removeItem('token');
  }
  return (
    <>
        <span><Link to="/register">Register</Link></span>&nbsp;|&nbsp;
        <span><Link to="/login">Login</Link></span>&nbsp;|&nbsp;
        <span><Link to="/" onClick={logout}>Logout</Link></span>
    </>
  )
};

export default Nav;
