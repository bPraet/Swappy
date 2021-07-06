import React, { useState } from 'react';
import api from '../../services/api';
import { userTypes } from '../../services/userTypes';

import './register.css';

import { FormControl, TextField, Fab } from '@material-ui/core';
import { Done } from '@material-ui/icons';

export default function Register({ history }){

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ firstName, setFirstnName] = useState("");
    const [ lastName, setLastName ] = useState("");
    const [ pseudo, setPseudo ] = useState("");
    const [ adress, setAdress ] = useState("");
    const [ message, setMessage ] = useState("");
    const roleid = userTypes.USER;

    const handleSubmit = async event => {
        event.preventDefault();

        const response = await api.post('/user/register', { email, password, firstName, lastName, pseudo, adress, roleid });
        const userToken = response.data.userToken || false;

        if(userToken){
            localStorage.setItem('userToken', userToken);
            history.push('/products');
        }
        else{
            setMessage(response.data.message);
        }
    };

    return(

        <div id="registerContainer">
            <div id="registerMessage">{message}</div>
            <form id="registerForm" onSubmit={handleSubmit}>
                <FormControl className="registerForm"> 
                    <TextField id="email" label="Email" type="email"
                    onChange={event => setEmail(event.target.value)}/>
                    <TextField id="password" label="Mot de passe" type="password" 
                    onChange={event => setPassword(event.target.value)}/>
                    <TextField id="firstName" label="Prénom"
                    onChange={event => setFirstnName(event.target.value)}/>
                    <TextField id="lastName" label="Nom"
                    onChange={event => setLastName(event.target.value)}/>
                    <TextField id="pseudo" label="Pseudo"
                    onChange={event => setPseudo(event.target.value)}/>
                    <TextField id="adress" label="Adresse"
                    onChange={event => setAdress(event.target.value)}/>
                </FormControl>
                <Fab aria-label="register" id="registerBtn" type="submit">
                    <Done />
                </Fab>
            </form>
        </div>
        
    );
}