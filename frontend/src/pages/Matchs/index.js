import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import './matchs.css';

import { AppBar, BottomNavigation, BottomNavigationAction, List, ListItem, ListItemText, Divider, CircularProgress, IconButton, ListItemSecondaryAction } from '@material-ui/core';
import { SwapHoriz, Favorite, LocalMall, Person, Send } from '@material-ui/icons';

import api from '../../services/api';

export default function Matchs({ history }) {
    const [user, setUser] = useState();
    const [matchs, setMatchs] = useState([]);
    const [propositions, setPropositions] = useState([]);
    const [matchProducts, setMatchProducts] = useState([]);
    const [matchConsignees, setMatchConsignees] = useState([]);
    const [propositionProducts, setPropositionProducts] = useState([]);
    const [propositionOwners, setPropositionOwners] = useState([]);
    const [loadingMatchs, setLoadingMatchs] = useState(false);
    const [loadingPropositions, setLoadingPropositions] = useState(false);

    useEffect(() => {
        const userToken = localStorage.getItem('userToken');

        if(user === undefined){
            api.get('/user', { headers: {'userToken': userToken} }).then( result => {
                setUser(result);
            }).catch((err) => {
                history.push('/');
            });
        }

        if (matchs.data === undefined) {
            api.get('/matchs', { headers: { 'userToken': userToken } }).then(result => {
                setMatchs(result);
            }).catch((err) => {
                history.push('/');
            });
        }

        if (propositions.data === undefined){
            api.get('/propositions', { headers: { 'userToken': userToken } }).then(result => {
                setPropositions(result);
            }).catch((err) => {
                history.push('/');
            });
        }

        if (matchs.data !== undefined && !loadingMatchs) {
            setLoadingMatchs(true);
            matchs.data.map(async (match) => {
                await api.get(`/user/${match._id.consignee}`, { headers: { 'userToken': userToken } }).then(result => {
                    setMatchConsignees(values => [...values, result]);
                }).catch((err) => {
                    history.push('/');
                });

                await api.get(`/product/${match._id.productOwner}`, { headers: { 'userToken': userToken } }).then(result => {
                    setMatchProducts(values => [...values, result]);
                }).catch((err) => {
                    history.push('/');
                });
            });
        }

        if (propositions.data !== undefined && !loadingPropositions) {
            setLoadingPropositions(true);
            propositions.data.map(async (proposition) => {
                await api.get(`/user/${proposition._id.owner}`, { headers: { 'userToken': userToken } }).then(result => {
                    setPropositionOwners(values => [...values, result]);
                }).catch((err) => {
                    history.push('/');
                });

                await api.get(`/product/${proposition._id.productOwner}`, { headers: { 'userToken': userToken } }).then(result => {
                    setPropositionProducts(values => [...values, result]);
                }).catch((err) => {
                    history.push('/');
                });
            });
        }
    }, [matchs, matchConsignees, matchProducts, propositionProducts, propositionOwners, history, loadingMatchs, loadingPropositions, user]);

    if (matchs.data === undefined || propositions.data === undefined)
        return <CircularProgress size="100px" />;

    const getMatchProducts = () => {
        const matchProductsGrid = [];
        const sortedMatchProducts = matchProducts.sort((a, b) => a.data._id > b.data._id ? 1 : -1);

        for(const [i, product] of sortedMatchProducts.entries()){
            matchProductsGrid.push(
                <span key={i}>
                    <ListItem button onClick={ () => history.push(`/match/${matchConsignees[i].data._id}/${product.data._id}/0`)}>
                        <ListItemText primary={product.data.name} secondary={matchConsignees[i].data.email} />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="delete" onClick={ () => { history.push(`/chat/${matchConsignees[i].data._id}`) }}>
                                <Send />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                </span>
            );
        }

        return matchProductsGrid;
    }

    const getPropositionProducts = () => {
        const propositionProductsGrid = [];
        const sortedPropositionProducts = propositionProducts.sort((a, b) => a.data._id > b.data._id ? 1 : -1);

        for(const [i, product] of sortedPropositionProducts.entries()){
            propositionProductsGrid.push(
                <span key={i}>
                    <ListItem button onClick={ () => history.push(`/match/${propositionOwners[i].data._id}/${product.data._id}/1`)}>
                        <ListItemText primary={product.data.name} secondary={propositionOwners[i].data.email} />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="delete" onClick={ () => { history.push(`/chat/${propositionOwners[i].data._id}`) }}>
                                <Send />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                </span>
            );
        }

        return propositionProductsGrid;
    }

    return (
        <div id="matchs">
            <AppBar id="bottomBar">
                <BottomNavigation showLabels>
                    <BottomNavigationAction label="Finder" icon={<SwapHoriz />} component={Link} to="/finder" />
                    <BottomNavigationAction disabled label="Matchs" icon={<Favorite />} component={Link} to="/matches" />
                    <BottomNavigationAction label="Produits" icon={<LocalMall />} component={Link} to="/products" />
                    <BottomNavigationAction label="Profil" icon={<Person />} component={Link} to="/profile" />
                </BottomNavigation>
            </AppBar>
            <h1>Matchs:</h1>
            <List component="nav" aria-label="matches">
                {getMatchProducts()}
            </List>
            <h1>Vos Propositions:</h1>
            <List component="nav" aria-label="matches">
                {getPropositionProducts()}
            </List>
        </div>
    );
}