import { Input, Label } from "reactstrap";
import Checkbox from "@mui/material/Checkbox";
import axios from 'axios'
import Cookies from 'js-cookie'
import { serverAddress } from "../functions/ServerAddress";
import { useState, useEffect } from "react";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

export default function Home() {

  const [Loading, SetLoading] = useState(false);
  const [OpenError, SetOpenError] = useState(false);
  const [ErrorMessage, SetErrorMessage] = useState(false);

  const ShowError = (message) => {
    SetErrorMessage(message)
    SetOpenError(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    SetOpenError(false);
  };

  const Login = (e) => {
    e.preventDefault()
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
    if (username === '' || password === '') {
      ShowError('مقادیر را به طور کامل وارد کنید')
    } else {
      SetLoading(true)
      axios.post(serverAddress + "/accounts/api/token/", {
        username: username,
        password: password,
      })
        .then((response) => {
          SetLoading(false)
          if (response.data.refresh && response.data.access) {
            Cookies.set('refresh', response.data.refresh, { expires: 1 })
            Cookies.set('access', response.data.access, { expires: 1 })

            if (document.getElementById('remember_me').checked) {
              const oneYearLater = new Date()
              oneYearLater.setFullYear(oneYearLater.getFullYear() + 1)

              Cookies.set('username', username, { expires: oneYearLater })
              Cookies.set('password', password, { expires: oneYearLater })
            }
            Cookies.set('roll', response.data.role.role_id)
            Cookies.set('roll_name', response.data.role.role_name)
            Cookies.set('name', response.data.user_firstname)
            Cookies.set('ip', response.data.user_ip)
            Cookies.set('lastname', response.data.user_lastname)
            window.location.assign('/bahman')
          } else {
            return toast.error('ورود ناموفق', {
              position: 'bottom-left'
            })
          }
        })
        .catch((err) => {
          SetLoading(false)
          if (err.response.data.error === "recaptcha error occured") {
            ShowError('کپچا گوگل تایید نشد')
          }
          if (err.response.statusText === 'Unauthorized') {
            ShowError('ورود ناموفق')
          }
        })
    }
  }

  useEffect(() => {
    const username = Cookies.get('username')
    const password = Cookies.get('password')
    if (username && password) {
      document.getElementById('username').value = username
      document.getElementById('password').value = password
    } else {
      document.getElementById('username').value = ''
      document.getElementById('password').value = ''
    }
  }, [])

  return (
    <div id="main">
      <div id="loginBox" className="Glass">
        <h4 style={{ fontWeight: 'bold' }}>
          به سامانه بهمن خوش‌ آمدید!
        </h4>
        <form>
          <Label className="mt-3">نام کاربری</Label>
          <Input
            id="username"
            style={{
              borderStyle: 'none',
              background: 'rgba(255,255,255,0.25)',
              color: 'white',
            }}
            className="Glass loginInput"
          />
          <Label>رمز عبور</Label>
          <Input
            id="password"
            style={{
              borderStyle: 'none',
              background: 'rgba(255,255,255,0.25)',
              color: 'white',
            }}
            className="Glass loginInput"
            type="password"
          />
          <div style={{ textAlign: 'right', padding: '0px' }}>
            <Checkbox style={{ color: 'rgb(200,200,200)', marginRight: '-12px' }} id="remember_me" />
            <Label for="remember_me" style={{ cursor: 'pointer' }}>به‌خاطر بسپار</Label>
          </div>
          <button className="NiceButton mb-3" onClick={(e) => { Login(e) }} style={{ textAlign: 'center' }}>
            {
              Loading ?
                <CircularProgress size="24px" style={{ marginBottom: '-10px' }} />
                :
                <span>ورود</span>
            }
          </button>
        </form>
        <a href="/recovery" className="mt-4" style={{ color: 'inherit', textDecoration: 'none' }}>رمز عبور خود را فراموش کرده‌اید؟</a>
      </div>
      <Snackbar open={OpenError} autoHideDuration={2500} onClose={handleClose} style={{ direction: 'rtl' }} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
            </IconButton>
          }
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {ErrorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
