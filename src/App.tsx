import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Main from './components/Main';
import CheckUser from "./components/users/CheckUser";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

function App() {
  const [isValid, setValid] = useState(true);

  
  return <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {isValid ? <Main /> : <CheckUser setValid={setValid}/>}
        </Box>
      </Container>
  </>
}

export default App;
