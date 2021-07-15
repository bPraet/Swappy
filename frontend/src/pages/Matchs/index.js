import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import './matchs.css';

import { AppBar, BottomNavigation, BottomNavigationAction, List, ListItem, ListItemText, Divider, CircularProgress, IconButton, ListItemSecondaryAction } from '@material-ui/core';
import { SwapHoriz, Favorite, LocalMall, Person, Send } from '@material-ui/icons';

import api from '../../services/api';

export default function Matchs({ history }) {
    const [matchs, setMatchs] = useState([]);
    const [propositions, setPropositions] = useState([]);
    const [isPropositionsSet, setIsPropositionsSet] = useState(false);
    const [isMatchsSet, setIsMatchsSet] = useState(false);
    const userToken = localStorage.getItem('userToken');

    let [propositionsGrid] = useState([]);
    let [matchsGrid] = useState([]);

    useEffect(() => {
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


    }, [matchs, propositions]);

    if (matchs.data === undefined || propositions.data === undefined)
        return <CircularProgress size="100px" />;
    
    const getMatchs = () => {
        if(!isMatchsSet){
            setIsMatchsSet(true);
            for(const [i, match] of matchs.data.entries()){
                matchsGrid.push(
                    <span key={i}>
                        <ListItem button onClick={ () => history.push(`/match/${match.consignee._id}/${match.productOwner._id}/0`)}>
                            <ListItemText primary={match.productOwner.name} secondary={match.consignee.email} />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="send" onClick={ () => { history.push(`/chat/${match.consignee._id}`) }}>
                                    <Send />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                    </span>
                );
            }
        }

        return matchsGrid;
    }

    const getPropositions = () => {
        if(!isPropositionsSet){
            setIsPropositionsSet(true);

            for(const [i, proposition] of propositions.data.entries()){
                propositionsGrid.push(
                    <span key={i}>
                        <ListItem button onClick={ () => history.push(`/match/${proposition.owner._id}/${proposition.productOwner._id}/1`)}>
                            <ListItemText primary={proposition.productOwner.name} secondary={proposition.owner.email} />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="send" onClick={ () => { history.push(`/chat/${proposition.owner._id}`) }}>
                                    <Send />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                    </span>
                );
            }
        }

        return propositionsGrid;
    }

    return (
        <div id="matchs">
            <AppBar id="bottomBar">
                <BottomNavigation showLabels>
                    <BottomNavigationAction label="Finder" icon={<SwapHoriz />} component={Link} to="/finder" />
                    <BottomNavigationAction disabled label="Matchs" icon={<Favorite />} component={Link} to="/matches" />
                    <BottomNavigationAction label="Produits" icon={<LocalMall />} component={Link} to="/products" />
                    <BottomNavigationAction label="Profil" icon={<Person />} component={Link} to="/profile" />
                    <BottomNavigationAction label="Swaps" icon={<SwapHoriz />} component={Link} to="/swaps" />
                </BottomNavigation>
            </AppBar>
            <h1>Matchs:</h1>
            <List component="nav" aria-label="matches">
                {getMatchs()}
            </List>
            <h1>Vos Propositions:</h1>
            <List component="nav" aria-label="propositions">
                {getPropositions()}
            </List>
        </div>
    );
}