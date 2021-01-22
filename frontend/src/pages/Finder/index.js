import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TinderCard from 'react-tinder-card';

import './finder.css';

import { AppBar, BottomNavigation, BottomNavigationAction, CircularProgress, IconButton} from '@material-ui/core';
import { SwapHoriz, Favorite, LocalMall, Person, Info } from '@material-ui/icons';
import api from '../../services/api';
import adress from '../../services/config';

export default function Finder({ history }) {

    const [products, setProducts] = useState([]);

    useEffect(() => {
        const userToken = localStorage.getItem('userToken');

        api.get('/products/notseen', { headers: { 'userToken': userToken } }).then(result => {
            setProducts(result);
        }).catch((err) => {
            history.push('/');
        });
    }, [history]);

    if (products.data === undefined)
        return <CircularProgress size="100px" />;

    const onCardLeftScreen = async (direction, productId) => {
        const userToken = localStorage.getItem('userToken');
        try {
            if (direction === "left")
                await api.post('/track/add', { productId }, { headers: { 'userToken': userToken } });
            else {
                await api.post('/track/add', { productId }, { headers: { 'userToken': userToken } });
                history.push(`/proposal/${productId}`);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div id="finder">
            <AppBar id="bottomBar">
                <BottomNavigation showLabels>
                    <BottomNavigationAction disabled label="Finder" icon={<SwapHoriz />} component={Link} to="/finder" />
                    <BottomNavigationAction label="Matchs" icon={<Favorite />} component={Link} to="/matches" />
                    <BottomNavigationAction label="Produits" icon={<LocalMall />} component={Link} to="/products" />
                    <BottomNavigationAction label="Profil" icon={<Person />} component={Link} to="/profile" />
                </BottomNavigation>
            </AppBar>
            <div id="swipeContainer">
                <div id="emptyCard">
                    <h3>Vous avez regardé tous les produits !</h3>
                </div>
                {products.data.map(product => (
                    <TinderCard preventSwipe={['up', 'down']} key={product._id} onCardLeftScreen={(direction) => onCardLeftScreen(direction, `${product._id}`)}>
                        <div id="card" style={{ backgroundImage: `url(${adress + '/files/' + product.image})` }}>
                            <IconButton aria-label="productDetails" id="infoContainer" component={Link} to={'/productDetails/' + product._id}>
                                <Info id="infoBtn"/>
                            </IconButton>
                        </div>
                    </TinderCard>
                ))}
            </div>
        </div>
    );
}
