import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import './swaps.css';

import { AppBar, BottomNavigation, BottomNavigationAction, List, CircularProgress, ListItem, ListItemText,
ListItemSecondaryAction, IconButton, Divider } from '@material-ui/core';
import { SwapHoriz, Favorite, LocalMall, Person, Send } from '@material-ui/icons';

import api from '../../services/api';

export default function Matchs({ history }) {

    const [swaps, setSwaps] = useState([]);
    const [user, setUser] = useState();
    const [swapsGrid, setSwapsGrid] = useState([]);

    useEffect(() => {
        const userToken = localStorage.getItem('userToken');

        api.get('/user', { headers: {'userToken': userToken} }).then( result => {
            setUser(result);
        }).catch((err) => {
            history.push('/');
        });

        api.get('/swaps', { headers: { 'userToken': userToken } }).then(result => {
            setSwaps(result);
        }).catch((err) => {
            history.push('/');
        });
    }, [history]);

    if (swaps.data === undefined)
        return <CircularProgress size="100px" />;
    
    const getSwaps = () => {
        console.log(swaps);
        for(const [i, swap] of swaps.data.entries()){
            const swapDetails = swap.products.slice(0, -1).join(' - ')+' VS '+swap.products.slice(-1);

            swapsGrid.push(
                <span key={i}>
                    <ListItem button onClick={console.log(user)}>
                        <ListItemText primary={swapDetails} secondary={user.data._id === swap.consignee._id ? swap.owner.pseudo : swap.consignee.pseudo} />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="send" onClick={ () => { history.push(`/chat/${user.data._id === swap.consignee._id ? swap.owner._id : swap.consignee._id}`) }}>
                                <Send />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                </span>
            );
        }
        console.log(swapsGrid);
        return swapsGrid;
    }

    return (
        <div id="swaps">
            <AppBar id="bottomBar">
                <BottomNavigation showLabels>
                    <BottomNavigationAction label="Finder" icon={<SwapHoriz />} component={Link} to="/finder" />
                    <BottomNavigationAction label="Matchs" icon={<Favorite />} component={Link} to="/matches" />
                    <BottomNavigationAction label="Produits" icon={<LocalMall />} component={Link} to="/products" />
                    <BottomNavigationAction label="Profil" icon={<Person />} component={Link} to="/profile" />
                    <BottomNavigationAction disabled label="Swaps" icon={<SwapHoriz />} component={Link} to="/swaps" />
                </BottomNavigation>
            </AppBar>
            <h1>Swaps:</h1>
            <List component="nav" aria-label="swaps">
                {getSwaps()}
            </List>
        </div>
    );
}