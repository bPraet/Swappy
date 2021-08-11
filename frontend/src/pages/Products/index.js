import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import './products.css';
import addProduct from '../../assets/addProduct.png';

import { AppBar, BottomNavigation, BottomNavigationAction, Grid, CircularProgress, Button } from '@material-ui/core';
import { Favorite, LocalMall, SwapHoriz, Person, Add, Search } from '@material-ui/icons';
import api from '../../services/api';
import adress from '../../services/config';

export default function Products({ history }){

    const [ productsUser, setProductsUser ] = useState([]);
    

    useEffect(() => {
        const userToken = localStorage.getItem('userToken');

        api.get('/productsUser', { headers: { 'userToken': userToken } }).then(result => {
            setProductsUser(result);
        }).catch((err) => {
            history.push('/');
        });
    }, [history]);
    
    if(productsUser.data === undefined)
        return <CircularProgress size="100px"/>;

    const getProducts = () => {
        const products = [];

        for (let i = 0; i < 16; i++) {
            products.push(
            <Grid item xs={3} key={i}>
                {productsUser.data[i] ? 
                <Link to={"/modifyProduct/" + productsUser.data[i]._id}><img src={adress + '/files/' + productsUser.data[i].image} className="productImg" alt={`product${i+1}`} draggable="false"></img></Link> : 
                <img src={addProduct} className="productImg" alt={`product${i+1}`} draggable="false"></img>}
            </Grid>);
        }

        return products;
    }

    return(
        <div id="products">
            <AppBar id="bottomBar">
                <BottomNavigation showLabels>
                    <BottomNavigationAction className="bottomBtn" label="Finder" icon={<Search />} component={Link} to="/finder"/>
                    <BottomNavigationAction className="bottomBtn" label="Matchs" icon={<Favorite />} component={Link} to="/matches"/>
                    <BottomNavigationAction className="bottomBtn" disabled label="Produits" icon={<LocalMall />} component={Link} to="/products"/>
                    <BottomNavigationAction className="bottomBtn" label="Profil" icon={<Person />} component={Link} to="/profile"/>
                    <BottomNavigationAction className="bottomBtn" label="Swaps" icon={<SwapHoriz />} component={Link} to="/swaps" />
                </BottomNavigation>
            </AppBar>
            <Grid container spacing={1}>
                { getProducts() }
            </Grid>
            { productsUser.data.length === 15 ? 
                <Button id="addBtn" variant="contained" color="default" startIcon={<Add />} component={Link} to="/addProduct">
                    Ajouter un produit
                </Button> : 
                'Vous avez atteint le maximum de 16 produits !'
            }
            
        </div> 
    );
}