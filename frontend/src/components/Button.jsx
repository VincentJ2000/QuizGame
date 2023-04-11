import React from 'react';
import Fab from '@mui/material/Fab';
import { teal } from '@mui/material/colors';
import Typography from '@mui/material/Typography';

function Button (props) {
  return <Fab
    sx={{
      width: '150px',
      marginLeft: '30px',
      marginRight: '30px',
      bgcolor: teal.A100
    }}
    variant="extended"
    {...props}
    onClick={(e) => { props.onClick(e); }}
  >
    <Typography sx={{ fontSize: '1.1rem' }}>{props.children}</Typography>
  </Fab>
}

export default Button;
