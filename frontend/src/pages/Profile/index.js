import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

import './profile.css';

import { AppBar, BottomNavigation, BottomNavigationAction, FormControl, TextField, Fab, CircularProgress } from '@material-ui/core';
import { SwapHoriz, Favorite, LocalMall, Person, Done } from '@material-ui/icons';

export default function Profile({ history }) {

    let [ email, setEmail ] = useState();
    let [ password, setPassword ] = useState();
    let [ firstName, setFirstnName] = useState();
    let [ lastName, setLastName ] = useState();
    let [ pseudo, setPseudo ] = useState();
    let [ adress, setAdress ] = useState();
    let [ user, setUser ] = useState();
    const userToken = localStorage.getItem('userToken');
    
    useEffect(() => {
        api.get('/user', { headers: {'userToken': userToken} }).then( result => {
            setUser(result);
        }).catch((err) => {
            history.push('/');
        });
    }, [history, userToken]);

    if(user === undefined)
        return <CircularProgress size="100px"/>;

    const handleSubmit = async event => {
        event.preventDefault();
        if (email === undefined)
            email = user.data.email;
        if (firstName === undefined)
            firstName = user.data.firstName;
        if (lastName === undefined)
            lastName = user.data.lastName;
        if (pseudo === undefined)
            pseudo = user.data.pseudo;
        if (adress === undefined)
            adress = user.data.adress;

        try {
            await api.put('/user/update', { email, password, firstName, lastName, pseudo, adress }, { headers: {'userToken': userToken} });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div id="profile">
            <AppBar id="bottomBar">
                <BottomNavigation showLabels>
                    <BottomNavigationAction label="Finder" icon={<SwapHoriz />} component={Link} to="/finder" />
                    <BottomNavigationAction label="Matchs" icon={<Favorite />} component={Link} to="/matches" />
                    <BottomNavigationAction label="Produits" icon={<LocalMall />} component={Link} to="/products" />
                    <BottomNavigationAction disabled label="Profil" icon={<Person />} component={Link} to="/profile" />
                </BottomNavigation>
            </AppBar>


            <form id="profileForm" onSubmit={handleSubmit}>
                <FormControl className="registerForm">
                    <TextField id="email" label="Email" defaultValue={user.data.email} type="email"
                        onChange={event => setEmail(event.target.value)} />
                    <TextField id="password" label="Mot de passe" type="password"
                        onChange={event => setPassword(event.target.value)} />
                    <TextField id="firstName" label="Prénom" defaultValue={user.data.firstName}
                        onChange={event => setFirstnName(event.target.value)} />
                    <TextField id="lastName" label="Nom" defaultValue={user.data.lastName}
                        onChange={event => setLastName(event.target.value)} />
                    <TextField id="pseudo" label="Pseudo" defaultValue={user.data.pseudo}
                        onChange={event => setPseudo(event.target.value)} />
                    <TextField id="adress" label="Adresse" defaultValue={user.data.adress}
                        onChange={event => setAdress(event.target.value)} />
                </FormControl>
                <Fab aria-label="update" id="updateBtn" type="submit">
                    <Done />
                </Fab>
            </form>
        </div>
    );
}