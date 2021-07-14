import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './matchs.css';

import { Grid, CircularProgress, Fab } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import api from '../../services/api';
import adress from '../../services/config';

export default function matchDetails({ history }) {

    const [ matchs, setMatchs ] = useState([]);
    const [ products, setProducts ] = useState([]);
    const [ user, setUser ] = useState();
    const [loading, setLoading] = useState(false);
    const { consignee, productId, isProposition } = useParams();
    const userToken = localStorage.getItem('userToken');

    useEffect(() => {
        if(user === undefined){
            api.get('/user', { headers: {'userToken': userToken} }).then( result => {
                setUser(result);
            }).catch((err) => {
                history.push('/');
            });
        }
        
        if(matchs.data === undefined && user !== undefined){
            if(isProposition === '0'){
                api.get(`/match/${user.data._id}/${consignee}/${productId}`, { headers: { 'userToken': userToken } }).then(result => {
                    setMatchs(result);
                }).catch((err) => {
                    history.push('/');
                });
            }else{
                api.get(`/match/${consignee}/${user.data._id}/${productId}`, { headers: { 'userToken': userToken } }).then(result => {
                    setMatchs(result);
                }).catch((err) => {
                    history.push('/');
                });
            }
        }
        
        if (matchs.data !== undefined && !loading) {
            setLoading(true);
            matchs.data.map(async (match) => {
                api.get(`/product/${match.productConsignee}`, { headers: { 'userToken': userToken } }).then(result => {
                    setProducts(values => [...values, result]);
                }).catch((err) => {
                    history.push('/');
                });
            });
        }
        
    }, [history, matchs, products, loading, user]);

    if (matchs.data === undefined)
        return <CircularProgress size="100px" />;

    const getProducts = () => {
        const productsGrid = [];

        if(products !== undefined){
            const sortedProducts = products.sort((a, b) => a.data._id > b.data._id ? 1 : -1);

            for(const [i, product] of sortedProducts.entries()){
                productsGrid.push(
                    <Grid item xs={3} key={i} component={Link} to={'/productDetails/' + product.data._id}>
                        <img src={adress + '/files/' + product.data.image} className="productImg" alt={product.data.name} draggable="false"></img>
                    </Grid>
                );
            }
        }

        return productsGrid;
    }

    return (
        <div id="products">
            <Grid container spacing={1}>
                { getProducts() }
            </Grid>
            <Fab aria-label="previous" id="backBtn" onClick={history.goBack}>
                <ArrowBack />
            </Fab>
        </div>
    );
}