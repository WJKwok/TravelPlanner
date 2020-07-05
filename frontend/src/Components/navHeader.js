import React, { useState, useContext } from 'react';
import { Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

import { AuthContext } from '../Store/AuthContext'
import { PlaceContext } from '../Store/PlaceContext';

function NavHeader() {
    const { dispatch : placeDispatch } = useContext(PlaceContext);
    const { authState : {user}, dispatch } = useContext(AuthContext);

    const [activeItem, setActiveItem] = useState('name');
    const handleItemClick = ( e, {name} ) =>  setActiveItem(name);

    const handleLogout = () => {
        dispatch({type:"LOGOUT"});
        placeDispatch({type:"CLEAR_STATE"});
    }

    const navBar = user ? (
        <Menu pointing secondary>
            <Menu.Item
                as={Link}
                to='/itineraries'
                name={user.username}
                active
            />
            <Menu.Item
                as={Link}
                to='/planner'
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
                name='home'
                active={activeItem === 'home'}
                onClick={handleItemClick}
            />
            <Menu.Item
                as={Link}
                to='/planner'
                name='planner'
                active={activeItem === 'planner'}
                onClick={handleItemClick}
            />
            <Menu.Menu position='right'>
                <Menu.Item
                    as={Link}
                    to='/login'
                    name='login'
                    active={activeItem === 'login'}
                    onClick={handleItemClick}
                />
                <Menu.Item
                    as={Link}
                    to='/register'
                    name='register'
                    active={activeItem === 'register'}
                    onClick={handleItemClick}
                />
            </Menu.Menu>
        </Menu>
    )

    return navBar;

    // WHY?
    // return(
    //     {user} ? userNavBar : navBar
    // )
}

export default NavHeader;