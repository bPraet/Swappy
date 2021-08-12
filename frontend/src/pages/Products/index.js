import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import './products.css';
import addProduct from '../../assets/addProduct.png';

import { Grid, CircularProgress, Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { motion } from 'framer-motion';
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

        document.getElementById('bottomBar').style.display = 'block';
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
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                <Grid container spacing={1}>
                    { getProducts() }
                </Grid>
                { productsUser.data.length < 16 ? 
                    <Button id="addBtn" variant="contained" color="default" startIcon={<Add />} component={Link} to="/addProduct">
                        Ajouter un produit
                    </Button> : 
                    'Vous avez atteint le maximum de 16 produits !'
                }
            </motion.div>
        </div> 
    );
}