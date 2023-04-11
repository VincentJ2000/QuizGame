import React from 'react';
import { Link } from 'react-router-dom';

const Nav = () => {
  async function logout () {
    const response = await fetch('http://localhost:5005/admin/auth/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await response.json();
    console.log(data);
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
