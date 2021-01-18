import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TinderCard from 'react-tinder-card';

import './finder.css';

import { AppBar, BottomNavigation, BottomNavigationAction, CircularProgress } from '@material-ui/core';
import { SwapHoriz, Favorite, LocalMall, Person } from '@material-ui/icons';
import api from '../../services/api';
import adress from '../../services/config';

export default function Finder({ history }){

    const [ products, setProducts ] = useState([]);

    useEffect(() => {
        const userToken = localStorage.getItem('userToken');

        api.get('/products/notseen', { headers: { 'userToken': userToken } }).then(result => {
            setProducts(result);
        }).catch((err) => {
            history.push('/');
        });
    }, [history]);
    
    if(products.data === undefined)
        return <CircularProgress size="100px"/>;
    
    const onSwipe = (direction) => {
        console.log(direction);
    }

    return(
        <div id="finder">
            <AppBar id="bottomBar">
                <BottomNavigation showLabels>
                    <BottomNavigationAction disabled label="Finder" icon={<SwapHoriz />} component={Link} to="/finder"/>
                    <BottomNavigationAction label="Matchs" icon={<Favorite />} component={Link} to="/matches"/>
                    <BottomNavigationAction label="Produits" icon={<LocalMall />} component={Link} to="/products"/>
                    <BottomNavigationAction label="Profil" icon={<Person />} component={Link} to="/profile"/>
                </BottomNavigation>
            </AppBar>
            <div id="swipeContainer">
                <div id="emptyCard">
                        <h3>Vous avez regardé tous les produits !</h3>
                </div>
                {products.data.map(product => (
                <TinderCard preventSwipe={['up', 'down']} key={product._id} onSwipe={onSwipe}>
                    <div id="card" style={{ backgroundImage: `url(${adress + '/files/' + product.image})`}}>
                        <h3>{product.name}</h3>
                    </div>
                </TinderCard>
                ))}
            </div>
        </div>
    );
}
