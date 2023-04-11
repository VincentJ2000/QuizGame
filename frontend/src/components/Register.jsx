import React from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from './Nav'
import { checkToken } from './Refresh';

const Register = ({ onSuccess }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const navigate = useNavigate();
  checkToken('/dashboard');

  async function register () {
    const response = await fetch('http://localhost:5005/admin/auth/register', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        name,
      })
    });
    const data = await response.json();
    onSuccess(data.token);
    navigate('/dashboard');
  }

  return (
    <>
        <Nav />
        <hr />
        Register
        <br />
        Email: <input value={email} onChange={e => setEmail(e.target.value)} /> <br />
        Password: <input value={password} onChange={(e) => setPassword(e.target.value)} /><br />
        Name: <input value={name} onChange={(e) => setName(e.target.value)} /><br />
        <button onClick={register}>Register</button>
    </>
  );
};

export default Register;
