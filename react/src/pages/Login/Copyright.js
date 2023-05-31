import React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit">
        RH QUESTIONS
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
      <br />
      <br />
      <strong>2012281 - Patrick Henrique Borba da Silva</strong>
      <br />
      <strong>2001782 - Rafael Vilaça de Lima</strong>
    </Typography>
  );
}

export default Copyright
