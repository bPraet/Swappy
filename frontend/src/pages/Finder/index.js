import React from 'react';
import { Link } from 'react-router-dom';

import './finder.css';

import { AppBar, BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import { SwapHoriz, Favorite, LocalMall, Person } from '@material-ui/icons';


export default function Finder(){
    return(
        <div id="finder">
            <AppBar id="bottomBar">
                <BottomNavigation showLabels>
                    <BottomNavigationAction disabled label="Finder" icon={<SwapHoriz />} component={Link} to="/finder"/>
                    <BottomNavigationAction label="Matchs" icon={<Favorite />} component={Link} to="/matches"/>
                    <BottomNavigationAction label="Produits" icon={<LocalMall />} component={Link} to="/products"/>
                    <BottomNavigationAction label="Profil" icon={<Person />} component={Link} to="/profile"/>
                </BottomNavigation>
            </AppBar>
        </div>
    );
}
