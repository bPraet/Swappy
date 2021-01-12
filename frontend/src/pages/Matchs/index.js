import React from 'react';
import { Link } from 'react-router-dom';

import './matchs.css';

import { AppBar, BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import { SwapHoriz, Favorite, LocalMall, Person } from '@material-ui/icons';


export default function Matchs(){
    return(
        <div id="matchs">
            <AppBar id="bottomBar">
                <BottomNavigation showLabels>
                    <BottomNavigationAction label="Finder" icon={<SwapHoriz />} component={Link} to="/finder"/>
                    <BottomNavigationAction disabled label="Matchs" icon={<Favorite />} component={Link} to="/matches"/>
                    <BottomNavigationAction label="Produits" icon={<LocalMall />} component={Link} to="/products"/>
                    <BottomNavigationAction label="Profil" icon={<Person />} component={Link} to="/profile"/>
                </BottomNavigation>
            </AppBar>
        </div>
    );
}