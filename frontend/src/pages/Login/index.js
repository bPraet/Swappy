import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api'

import './login.css';
import logo from '../../assets/animatedLogo.svg';

import { FormControl, TextField, Fab, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { Done, Add } from '@material-ui/icons';
import { motion } from 'framer-motion';

export default function Login({ history }){

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ message, setMessage ] = useState("");
    const [open, setOpen] = useState(false);

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
                            <TextField id="password" label="Mot de passe" type="password" 
                            onChange={event => setPassword(event.target.value)}/>
                        </FormControl>
                    <div id="btn">
                        <Fab aria-label="login" id="logBtn" type="submit">
                            <Done />
                        </Fab>
                        <Fab aria-label="register" id="registerBtn" component={Link} to="/register">
                            <Add />
                        </Fab>
                    </div>
                </form>
            </motion.div> 
        </div>
    );
}