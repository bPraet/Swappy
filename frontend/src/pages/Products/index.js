import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import './products.css';
import addProduct from '../../assets/addProduct.png';

import { AppBar, BottomNavigation, BottomNavigationAction, Grid, CircularProgress, Button } from '@material-ui/core';
import { Favorite, LocalMall, SwapHoriz, Person, Add } from '@material-ui/icons';
import api from '../../services/api';
import adress from '../../services/config';

export default function Products(){

    const [ productsUser, setProductsUser ] = useState([]);
    

    useEffect(() => {
        const userid = localStorage.getItem('user');
        api.get('/productsUser', { headers: { 'userid': userid } }).then( result => {
            setProductsUser(result);
        })    
    }, []);
    
    if(productsUser.data === undefined)
        return <CircularProgress size="100px"/>;

    return(
        <div id="products">
            <AppBar id="bottomBar">
                <BottomNavigation showLabels>
                    <BottomNavigationAction label="Finder" icon={<SwapHoriz />} component={Link} to="/finder"/>
                    <BottomNavigationAction label="Matchs" icon={<Favorite />} component={Link} to="/matches"/>
                    <BottomNavigationAction disabled label="Produits" icon={<LocalMall />}/>
                    <BottomNavigationAction label="Profil" icon={<Person />} component={Link} to="/profile"/>
                </BottomNavigation>
            </AppBar>
            <Grid container spacing={1}>
                <Grid item xs={3}>
                    {productsUser.data[0] ? 
                    <img src={adress + '/files/' + productsUser.data[0].image} className="productImg" alt="product1"></img> : 
                    <img src={addProduct} className="productImg" alt="product1"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[1] ? 
                    <img src={adress + '/files/' + productsUser.data[1].image} className="productImg" alt="product2"></img> : 
                    <img src={addProduct} className="productImg" alt="product2"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[2] ? 
                    <img src={adress + '/files/' + productsUser.data[2].image} className="productImg" alt="product3"></img> : 
                    <img src={addProduct} className="productImg" alt="product3"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[3] ? 
                    <img src={adress + '/files/' + productsUser.data[3].image} className="productImg" alt="product4"></img> : 
                    <img src={addProduct} className="productImg" alt="product4"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[4] ? 
                    <img src={adress + '/files/' + productsUser.data[4].image} className="productImg" alt="product5"></img> : 
                    <img src={addProduct} className="productImg" alt="product5"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[5] ? 
                    <img src={adress + '/files/' + productsUser.data[5].image} className="productImg" alt="product6"></img> : 
                    <img src={addProduct} className="productImg" alt="product6"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[6] ? 
                    <img src={adress + '/files/' + productsUser.data[6].image} className="productImg" alt="product7"></img> : 
                    <img src={addProduct} className="productImg" alt="product7"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[7] ? 
                    <img src={adress + '/files/' + productsUser.data[7].image} className="productImg" alt="product8"></img> : 
                    <img src={addProduct} className="productImg" alt="product8"></img>}
                </Grid>
                <Grid item xs={3}>
                    {productsUser.data[8] ? 
                    <img src={adress + '/files/' + productsUser.data[8].image} className="productImg" alt="product9"></img> : 
                    <img src={addProduct} className="productImg" alt="product9"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[9] ? 
                    <img src={adress + '/files/' + productsUser.data[9].image} className="productImg" alt="product10"></img> : 
                    <img src={addProduct} className="productImg" alt="product10"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[10] ? 
                    <img src={adress + '/files/' + productsUser.data[10].image} className="productImg" alt="product11"></img> : 
                    <img src={addProduct} className="productImg" alt="product11"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[11] ? 
                    <img src={adress + '/files/' + productsUser.data[11].image} className="productImg" alt="product12"></img> : 
                    <img src={addProduct} className="productImg" alt="product12"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[12] ? 
                    <img src={adress + '/files/' + productsUser.data[12].image} className="productImg" alt="product13"></img> : 
                    <img src={addProduct} className="productImg" alt="product13"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[13] ? 
                    <img src={adress + '/files/' + productsUser.data[13].image} className="productImg" alt="product14"></img> : 
                    <img src={addProduct} className="productImg" alt="product14"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[14] ? 
                    <img src={adress + '/files/' + productsUser.data[14].image} className="productImg" alt="product15"></img> : 
                    <img src={addProduct} className="productImg" alt="product15"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[15] ? 
                    <img src={adress + '/files/' + productsUser.data[15].image} className="productImg" alt="product16"></img> : 
                    <img src={addProduct} className="productImg" alt="product16"></img>}
                </Grid>
            </Grid>
            <Button id="addBtn" variant="contained" color="default" startIcon={<Add />} component={Link} to="/addProduct">
                Ajouter un produit
            </Button>
        </div> 
    );
}