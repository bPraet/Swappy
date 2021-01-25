import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

import './matchs.css';

import { AppBar, BottomNavigation, BottomNavigationAction, List, ListItem, ListItemText, Divider, CircularProgress } from '@material-ui/core';
import { SwapHoriz, Favorite, LocalMall, Person } from '@material-ui/icons';

import api from '../../services/api';

export default function Matchs({ history }) {
    const [matchs, setMatchs] = useState([]);

    useEffect(() => {
        const userToken = localStorage.getItem('userToken');

        api.get('/matchs', { headers: { 'userToken': userToken } }).then(result => {
            setMatchs(result);
        }).catch((err) => {
            history.push('/');
        });
    }, [history]);

    if (matchs.data === undefined)
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
                {matchs.data.map((match, i) => (
                    <span key={i}>
                        <ListItem button>
                            <ListItemText primary={match._id.consignee}/>
                        </ListItem>
                        <Divider />
                    </span>
                ))}
            </List>
        </div>
    );
}