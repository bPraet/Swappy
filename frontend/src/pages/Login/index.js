import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api'

import './login.css';
import logo from '../../assets/logo.png';

import { FormControl, TextField, Fab } from '@material-ui/core';
import { Done, Add } from '@material-ui/icons';
import { motion } from 'framer-motion';


export default function Login({ history }){

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ message, setMessage ] = useState("");

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
        }
    }

    return(
        <div id="loginContainer">
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                <div id="loginMessage">{message}</div>
                <form id="loginForm" onSubmit={handleSubmit}>
                    <img src={logo} id="logo" alt="logo" />
                        <FormControl className="loginForm"> 
                            <TextField id="email" label="Email" type="email"
                            onChange={event => setEmail(event.target.value)}/>
                            <TextField id="password" label="Password" type="password" 
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