import React from 'react';
import Nav from './Nav';
import { useNavigate } from 'react-router-dom';
import { checkToken } from './Refresh';

const Login = ({ onSuccess }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();
  checkToken('/dashboard');

  async function login () {
    const response = await fetch('http://localhost:5005/admin/auth/login', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      })
    });
    const data = await response.json();
    onSuccess(data.token);
    navigate('/dashboard')
  }

  return (
    <>
        <Nav />
        <hr />
        Login
        Email: <input value={email} onChange={(e) => setEmail(e.target.value)} /><br />
        Password: <input value={password} onChange={(e) => setPassword(e.target.value)} /><br />
        <button onClick={login}>Login</button>
    </>
  )
};

export default Login;
