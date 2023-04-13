import React from 'react';
import Fab from '@mui/material/Fab';
import { teal } from '@mui/material/colors';
import Typography from '@mui/material/Typography';

function Button (props) {
  return <Fab
    sx={{
      width: props.full ? '100%' : '150px',
      marginLeft: props.full ? '0px' : '30px',
      marginRight: props.full ? '0px' : '30px',
      marginTop: props.full ? '10px' : 0,
      bgcolor: props.bgcolor ? props.bgcolor : teal.A200,
      color: props.color ? props.color : 'common.black',
    }}
    variant="extended"
    {...props}
    onClick={(e) => { props.onClick(e); }}
  >
    <Typography sx={{ fontSize: '1.1rem' }}>{props.children}</Typography>
  </Fab>
}

export default Button;
