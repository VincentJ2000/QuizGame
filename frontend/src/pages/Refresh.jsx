import { useNavigate } from 'react-router-dom';
import React from 'react';

export const checkToken = (path, check) => {
  const navigate = useNavigate();
  if (check === true) {
    React.useEffect(() => {
      if (localStorage.getItem('token') !== null) {
        navigate(path);
      } else {
        navigate('/');
      }
    }, []);
  } else {
    React.useEffect(() => {
      if (localStorage.getItem('token') !== null) {
        navigate(path);
      }
    }, []);
  }
}
