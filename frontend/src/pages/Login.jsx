import React from 'react';
import { useNavigate } from 'react-router-dom';
import { checkToken } from './Refresh';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '../components/Button'
import { teal } from '@mui/material/colors';

const Login = ({ onSuccess }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState(null);
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
      }),
    });
    const data = await response.json();
    if (data.error) {
      setErrorMessage(data.error);
    } else {
      onSuccess(data.token);
      navigate('/dashboard');
    }
  }

  return (
    <Box sx={{ height: '100vh', backgroundColor: '#00695c', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Container maxWidth="sm" sx={{ backgroundColor: 'common.white', p: 4, borderRadius: 2 }}>
        {errorMessage && (
        <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {errorMessage}
        </Alert>
        )}
        <TextField
        fullWidth
        variant="outlined"
        margin="normal"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
        fullWidth
        variant="outlined"
        margin="normal"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />
        <Button full="true" color="common.white" bgcolor={teal[800]} onClick={login}>Login</Button>
        <Button full="true" bgcolor="#e0f2f1" onClick={() => { navigate('/register'); }}>Go To Register</Button>
      </Container>
    </Box>
  );
};

export default Login;
