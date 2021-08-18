import React, { useState, useEffect } from 'react';
import api from '../../services/api'

import './login.css';
import logo from '../../assets/animatedLogo.svg';

import { FormControl, TextField, Fab, Snackbar, IconButton, Input, InputAdornment, InputLabel } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { Done, Add, Visibility, VisibilityOff } from '@material-ui/icons';
import { motion } from 'framer-motion';

export default function Login({ history }){

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ message, setMessage ] = useState("");
    const [open, setOpen] = useState(false);
    const [ showPassword, setShowPassword ] = useState(false);

    useEffect(() => {
        if(localStorage.getItem('userToken') !== null)
            history.push('/products');

        document.getElementById('bottomBar').style.display = 'none';
    }, [history]);

    const handleSubmit = async event => {
        event.preventDefault();

        const response = await api.post('/login', { email, password });
        const userToken = response.data.userToken || false;

        if(userToken){
            localStorage.setItem('userToken', userToken);
            history.push('/products');
        }
        else{
            setMessage(response.data.message);
            setOpen(true);
        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };

    const Alert = (props) => {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return(
        <div id="loginContainer">
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error">
                        {message}
                    </Alert>
                </Snackbar>
                <form id="loginForm" onSubmit={handleSubmit}>
                    <img src={logo} id="logo" alt="logo" />
                        <FormControl className="loginForm"> 
                            <TextField id="email" label="Email" type="email"
                            onChange={event => setEmail(event.target.value)}/>
                        </FormControl>
                        <FormControl className="loginForm"> 
                            <InputLabel htmlFor="password">Mot de passe</InputLabel>
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={event => setPassword(event.target.value)}
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                                }
                            />
                        </FormControl>
                    <div id="btn">
                        <Fab aria-label="login" id="logBtn" type="submit">
                            <Done />
                        </Fab>
                        <Fab aria-label="register" id="registerBtn" onClick={() => window.location = '/#/register'}>
                            <Add />
                        </Fab>
                    </div>
                </form>
            </motion.div> 
        </div>
    );
}