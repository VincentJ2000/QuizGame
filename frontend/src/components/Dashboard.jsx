import React from 'react';
// import { useNavigate } from 'react-router-dom';
import { checkToken } from './Refresh';

const Dashboard = ({ token }) => {
  checkToken('/dashboard', true);
  console.log(token)
  return (
    <div>DASHBOARD</div>
  )
}

export default Dashboard;
