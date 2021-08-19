import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './proposal.css';

import { Grid, CircularProgress, FormControlLabel, Checkbox, Fab, FormControl } from '@material-ui/core';
import { ArrowBack, Done } from '@material-ui/icons';
import { motion } from 'framer-motion';
import api from '../../services/api';
import adress from '../../services/config';

export default function Proposal({ history }) {

    const [productsUser, setProductsUser] = useState([]);
    const { productId } = useParams();

    let states = {};
    for (let i = 0; i < 16; i++) {
        states[i] = false;
    }

    const [state, setState] = useState(states);

    useEffect(() => {
        const userToken = localStorage.getItem('userToken');

        api.get('/productsUser', { headers: { 'userToken': userToken } }).then(result => {
            setProductsUser(result);
        }).catch((err) => {
            history.push('/');
        });
    }, [history]);

    if (productsUser.data === undefined)
        return <CircularProgress size="100px" />;

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };

    const handleSubmit = async event => {
        event.preventDefault();
        const userToken = localStorage.getItem('userToken');
        let product;
        try{
            product = await api.get(`/product/${productId}`, { headers: {'userToken': userToken} });
            history.push('/finder');
        }catch(error){
            console.log(error);
        };
        for(const checked in state){
            if(state[checked]){
                try {
                    await api.post(`/match/add`, {owner: product.data.user._id, productOwner: productId, productConsignee: productsUser.data[checked]}, { headers: {'userToken': userToken} });

                } catch (error) {
                    console.log(error);
                }
            }
        }
    };

    const getProducts = () => {
        const products = [];

        if(productsUser.data.length){
            for (let i = 0; i < 16; i++) {
                products.push(
                    productsUser.data[i] ?
                        <Grid item xs={3} key={i}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={state[i]} onChange={handleChange} name={i.toString()} />
                                }
                                label={
                                    <img src={adress + '/files/' + productsUser.data[i].image} className="productImg proposalProduct" alt={`product${i}`} draggable="false"></img>
                                } className="productImgContainer">
                            </FormControlLabel>
                        </Grid>
                    : ""
                );
            }
        }
        else{
            products.push(<h1 key='noProducts'>Vous n'avez pas encore de produit à échanger, veuillez en ajouter !</h1>)
        }

        return products;
    }

    return (
        <div id="products">
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                <form id="proposalForm" onSubmit={handleSubmit}>
                    <FormControl>
                        <Grid container spacing={1} id="proposalContainer">
                            { getProducts() }
                        </Grid>
                    </FormControl>

                    <div id="proposalBtn">
                        <Fab aria-label="previous" id="backBtn" onClick={history.goBack}>
                            <ArrowBack />
                        </Fab>
                        <Fab aria-label="add" id="addProductBtn" type="submit">
                            <Done />
                        </Fab>
                    </div>

                </form>
            </motion.div>
        </div>
    );
}