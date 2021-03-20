import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import './matchs.css';

import { AppBar, BottomNavigation, BottomNavigationAction, List, ListItem, ListItemText, Divider, CircularProgress } from '@material-ui/core';
import { SwapHoriz, Favorite, LocalMall, Person } from '@material-ui/icons';

import api from '../../services/api';

export default function Matchs({ history }) {
    const [matchs, setMatchs] = useState([]);
    const [products, setProducts] = useState([]);
    const [consignees, setConsignees] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        
        const userToken = localStorage.getItem('userToken');

        if (matchs.data === undefined) {
            api.get('/matchs', { headers: { 'userToken': userToken } }).then(result => {
                setMatchs(result);
            }).catch((err) => {
                history.push('/');
            });
        }

        if (matchs.data !== undefined && !loading) {
            setLoading(true);
            matchs.data.map(async (match) => {

                await api.get(`/user/${match._id.consignee}`, { headers: { 'userToken': userToken } }).then(result => {
                    setConsignees(values => [...values, result]);
                }).catch((err) => {
                    history.push('/');
                });

                await api.get(`/product/${match._id.productOwner}`, { headers: { 'userToken': userToken } }).then(result => {
                    setProducts(values => [...values, result]);
                }).catch((err) => {
                    history.push('/');
                });
            });
        }
    }, [matchs, consignees, products, history, loading]);

    if (matchs.data === undefined || consignees.length === 0)
        return <CircularProgress size="100px" />;

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
            <List component="nav" aria-label="matches">
                {products.map((product, i) => (
                    <span key={i}>
                        <ListItem button>
                            <ListItemText primary={product.data.name} secondary={consignees[i].data.email} />
                        </ListItem>
                        <Divider />
                    </span>
                ))}
            </List>
        </div>
    );
}