import React from 'react';
// import { useNavigate } from 'react-router-dom';
import Nav from './Nav';
import { checkToken } from './Refresh';

const Dashboard = ({ token }) => {
  checkToken('/dashboard', true);
  console.log(token)
  return (
    <>
        <Nav />
        <hr />
        <div>DASHBOARD</div>
    </>
  )
}

export default Dashboard;
