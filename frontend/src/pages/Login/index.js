import React, { useState } from 'react';
import api from '../../services/api'

import './login.css';
import logo from '../../assets/logo.png';

import { FormControl, TextField, Fab } from '@material-ui/core';
import { Done } from '@material-ui/icons';

export default function Login({ history }){

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    const handleSubmit = async event => {
        event.preventDefault();

        const response = await api.post('/login', { email, password });
        const userId = response.data._id || false;

        if(userId){
            localStorage.setItem('user', userId);
            history.push('/finder');
        }
        else{
            const { message } = response.data;
            console.log(message);
        }

        console.log(response);
    }

    return(
        <form id="form" onSubmit={handleSubmit}>
            <img src={logo} id="logo" alt="logo" />
                <FormControl className="form"> 
                    <TextField id="email" label="Email" type="email"
                    onChange={event => setEmail(event.target.value)}/>
                    <TextField id="password" label="Password" type="password" 
                    onChange={event => setPassword(event.target.value)}/>
                </FormControl>
            <Fab aria-label="login" id="logBtn" type="submit">
                <Done />
            </Fab>
        </form>
    );
}