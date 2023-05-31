import React, { useState, useEffect } from 'react'
import './App.css';
import { AppRoute } from './routes/routes';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarComp from './components/Navbar';
import Copyright from './pages/Login/Copyright';
import { BrowserRouter as Router } from "react-router-dom"
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import logo from './components/files/logo.png'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { react_constants } from './components/constants'
import { SnackBarAlert } from './components/snackBarAlert'

const loginDefault = {
  login: "",
  senha: ""
}

const theme = createTheme();

function App() {
  const [logged, setLogged] = useState(true);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [login, setLogin] = useState(loginDefault);

  const onChangeValue = (e) => {
    setLogin({...login, [e.target.name]:e.target.value})
  }

  useEffect(() => {
    if (!localStorage.getItem("login")
      || !localStorage.getItem("senha")
      || !localStorage.getItem("codigo")
      || !localStorage.getItem("admin_system")) {
      setLogged(false)
    }
  }, [])

  function handleSubmit () {
    fetch(`${react_constants["local_api"]}/usuario/login`,{
      method:"put",
      body:JSON.stringify(login),
      headers:{
          'Content-type':'application/json',
          'Accept':'application/json'
      }
    })
    .then(retorno => retorno.json())
    .then(retorno_convertido => {
      if (retorno_convertido == null || retorno_convertido.login == null || retorno_convertido.senha == null) {
        setLogged(false);
        setType("error");
        setMessage("Login ou Senha incorretos");
        setOpen(true);
      } else if (!retorno_convertido.ativo) {
        setLogged(false);
        setType("info");
        setMessage("Usuário não está ativo, entre em contato com a administradora");
        setOpen(true);
      } else {
        localStorage.setItem("login",retorno_convertido.login);
        localStorage.setItem("senha",retorno_convertido.senha);
        localStorage.setItem("codigo",retorno_convertido.codigo);
        localStorage.setItem("admin_system",retorno_convertido.admin_system);
        setLogged(true);
      }
    }) 
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="App">
      {!logged && (
        <ThemeProvider theme={theme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography component="h1" variant="h5">
                <img src={logo}
                  alt="Logo"
                  width="300"
                  height="300"
                  href="/home" />
                <p>RH Questions</p>
              </Typography>
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Box sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="login"
                  label="Login"
                  name="login"
                  value={login.login}
                  onChange={onChangeValue}
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="senha"
                  label="Senha"
                  type="password"
                  id="senha"
                  value={login.senha}
                  onChange={onChangeValue}
                />
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={handleSubmit}
                >
                  Entrar
                </Button>
              </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
            <SnackBarAlert open={open} type={type} message={message} handleClose={handleClose} />
          </Container>
        </ThemeProvider>
      )}
      {logged && (
        <>
          <NavbarComp />
          <Router>
            <AppRoute />
          </Router>
        </>
      )}
    </div>
  )
}

export default App;

