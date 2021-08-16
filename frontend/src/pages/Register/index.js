import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

import './register.css';

import { FormControl, TextField, Fab, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { Done, ArrowBack } from '@material-ui/icons';
import { motion } from 'framer-motion';

export default function Register({ history }){

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ firstName, setFirstnName] = useState("");
    const [ lastName, setLastName ] = useState("");
    const [ pseudo, setPseudo ] = useState("");
    const [ adress, setAdress ] = useState("");
    const [ message, setMessage ] = useState("");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        document.getElementById('bottomBar').style.display = 'none';
    }, []);

    const handleSubmit = async event => {
        event.preventDefault();

        const response = await api.post('/user/register', { email, password, firstName, lastName, pseudo, adress });
        const userToken = response.data.userToken || false;

        if(userToken){
            localStorage.setItem('userToken', userToken);
            history.push('/products');
        }
        else{
            setMessage(response.data.message);
            setOpen(true);
        }
    };

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
        <div id="registerContainer">
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error">
                        {message}
                    </Alert>
                </Snackbar>
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
                    <div id="btn">
                        <Fab aria-label="previous" id="backBtn" component={Link} to={'/'}>
                            <ArrowBack />
                        </Fab>
                        <Fab aria-label="register" id="registerBtn" type="submit">
                            <Done />
                        </Fab>
                    </div>
                </form>
            </motion.div>
        </div>
        
    );
}