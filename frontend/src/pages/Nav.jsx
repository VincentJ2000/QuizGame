import React from 'react';
import { Link } from 'react-router-dom';

const Nav = () => {
  return (
    <>
        <span><Link to="/register">Register</Link></span>&nbsp;|&nbsp;
        <span><Link to="/login">Login</Link></span>;
    </>
  )
};

export default Nav;
