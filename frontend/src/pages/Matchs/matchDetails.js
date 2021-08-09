import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './matchs.css';

import { Grid, CircularProgress, Fab, Button, Dialog, DialogTitle, DialogContent,
DialogContentText, DialogActions } from '@material-ui/core';
import { ArrowBack, Done, Close } from '@material-ui/icons';
import api from '../../services/api';
import adress from '../../services/config';

export default function MatchDetails({ history }) {

    const [ matchs, setMatchs ] = useState([]);
    const [ products, setProducts ] = useState([]);
    const [ user, setUser ] = useState();
    const [ loading, setLoading ] = useState(false);
    const [ openDelete, setOpenDelete ] = useState(false);
    const [ openValidate, setOpenValidate ] = useState(false);
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
        
    }, [history, matchs, products, loading, user, consignee, isProposition, productId, userToken]);

    if (matchs.data === undefined)
        return <CircularProgress size="100px" />;

    const handleClickOpenDelete = () => {
        setOpenDelete(true);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
    };

    const handleClickOpenValidate = () => {
        setOpenValidate(true);
    };

    const handleCloseValidate = () => {
        setOpenValidate(false);
    };

    const validateMatch = async (matches) => {
        const swapProducts = products.map(product => product.data.name);

        if(isProposition === '0'){
            if(!await api.get(`/match/${user.data._id}/${consignee}/${productId}`, { headers: { 'userToken': userToken } }).then(result => {
                return(!!result.data.length);
            })){
                return false;
            }
        }

        await api.get(`/product/${matches[0].productOwner}`, { headers: {'userToken': userToken} }).then(result => swapProducts.push(result.data.name));
        await api.post(`/swap/add`, {owner: matches[0].owner, products: swapProducts, consignee: matches[0].consignee}, { headers: {'userToken': userToken} });
        
        for(const match of matches){
            await api.delete(`/matchs/delete/${match.productConsignee}`, { headers: {'userToken': userToken} });
            await api.delete(`/product/delete/${match.productConsignee}`, { headers: {'userToken': userToken} });
        }

        await api.delete(`/matchs/delete/${matches[0].productOwner}`, { headers: {'userToken': userToken} });
        await api.delete(`/product/delete/${matches[0].productOwner}`, { headers: {'userToken': userToken} });

        history.push('/matches');
    }

    const removeMatch = async (matches) => {
        await api.delete(`/matchs/deleteProposition/${matches[0].productOwner}/${matches[0].consignee}`, { headers: {'userToken': userToken} });
        
        history.push('/matches');
    }

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

    if(products.length > 0){
        if(products[0].data.user._id === user.data._id){
            return(
                <div id="products">
                    <Grid container spacing={1}>
                        { getProducts() }
                    </Grid>
                    <Fab aria-label="previous" id="backBtn" onClick={history.goBack}>
                        <ArrowBack />
                    </Fab>

                    <Button id="deleteBtn" variant="contained" color="default" startIcon={<Close />} onClick={handleClickOpenDelete}>
                        Refuser
                    </Button>
                    <Dialog
                        open={openDelete}
                        onClose={handleCloseDelete}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"Retirer le match ?"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Vous ne pourrez pas revenir en arrière et cet échange disparaitra !
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDelete} color="primary">
                                Non
                            </Button>
                            <Button onClick={() => removeMatch(matchs.data)} color="primary" autoFocus>
                                Oui
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            )
        } else {
            return(
                <div id="products">
                    <Grid container spacing={1}>
                        { getProducts() }
                    </Grid>
                    <Fab aria-label="previous" id="backBtn" onClick={history.goBack}>
                        <ArrowBack />
                    </Fab>

                    <Button id="validateBtn" variant="contained" color="default" startIcon={<Done />} onClick={handleClickOpenValidate}>
                        Accepter
                    </Button>
                    <Dialog
                        open={openValidate}
                        onClose={handleCloseValidate}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"Accepter l'échange ?"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Super ! Es-tu sûr vouloir faire cet échange ?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseValidate} color="primary">
                                Non
                            </Button>
                            <Button onClick={() => validateMatch(matchs.data)} color="primary" autoFocus>
                                Oui
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Button id="deleteBtn" variant="contained" color="default" startIcon={<Close />} onClick={handleClickOpenDelete}>
                        Refuser
                    </Button>
                    <Dialog
                        open={openDelete}
                        onClose={handleCloseDelete}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"Retirer le match ?"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Vous ne pourrez pas revenir en arrière et cet échange disparaitra !
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDelete} color="primary">
                                Non
                            </Button>
                            <Button onClick={() => removeMatch(matchs.data)} color="primary" autoFocus>
                                Oui
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            )
        }
    }
    else{
        return (
            <div>Ce match n'existe plus, il a déjà été géré
                <Fab aria-label="previous" id="backBtn" onClick={history.goBack}>
                    <ArrowBack />
                </Fab>
            </div>
        );
    }
    
}