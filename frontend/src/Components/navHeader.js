import React, { useState, useContext } from 'react';
import { Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

import { AuthContext } from '../Store/AuthContext'
import { PlaceContext } from '../Store/PlaceContext';

import LoginModel from './loginModal';

function NavHeader() {
    const { dispatch : placeDispatch } = useContext(PlaceContext);
    const { authState : {user}, dispatch } = useContext(AuthContext);

    const [activeItem, setActiveItem] = useState("");
    const [loginOpen, setLoginOpen] = useState(false);

    const handleClickOpen = () => {
        setLoginOpen(true);
    };
    const handleClose = () => {
        setLoginOpen(false);
    };

    const handleItemClick = ( e, {name} ) =>  setActiveItem(name);

    const handleLogout = () => {
        dispatch({type:"LOGOUT"});
        placeDispatch({type:"CLEAR_STATE"});
    }

    const navBar = user ? (
        <Menu pointing secondary>
            <Menu.Item
                as={Link}
                to='/trips'
                name='trips'
                active={activeItem === 'trips'}
                onClick={handleItemClick}
            />
            <Menu.Item
                as={Link}
                to='/'
                name='planner'
                active={activeItem === 'planner'}
                onClick={handleItemClick}
            />
            <Menu.Menu position='right'>
                <Menu.Item
                    name='logout'
                    active={activeItem === 'logout'}
                    onClick={handleLogout}
                />
            </Menu.Menu>
        </Menu>
    ) : (
        <Menu pointing secondary>
            <Menu.Item
                as={Link}
                to='/'
                name='planner'
                active={activeItem === 'planner'}
                onClick={handleItemClick}
            />
            <Menu.Menu position='right'>
                <Menu.Item
                    // as={Link}
                    // to='/login'
                    name='login'
                    active={activeItem === 'login'}
                    onClick={handleClickOpen}
                />
                <Menu.Item
                    as={Link}
                    to='/register'
                    name='register'
                    active={activeItem === 'register'}
                    onClick={handleItemClick}
                />
            </Menu.Menu>
            <LoginModel loginOpen={loginOpen} handleClose={handleClose}/>
        </Menu>
    )

    return navBar;

    // WHY?
    // return(
    //     {user} ? userNavBar : navBar
    // )
}

export default NavHeader;