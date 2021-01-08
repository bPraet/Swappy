import React from 'react';
//import api from '../../services/api'

import './login.css';
import logo from '../../assets/logo.png';

import { FormControl, TextField, Fab } from '@material-ui/core';
import { Done } from '@material-ui/icons';

export default function Login(){
    return(
        <div id="form">
            <img src={logo} id="logo" alt="logo" />
            <div>
                <FormControl className="form">
                    
                    <TextField id="email" label="Email" />
                    
                    <TextField
                        id="password"
                        label="Password"
                        type="password"
                    />
                </FormControl>
            </div>
            <Fab aria-label="login" id="logBtn">
                <Done />
            </Fab>
        </div>
    );
}