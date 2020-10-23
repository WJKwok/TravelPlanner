import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

import { AuthContext } from '../Store/AuthContext'

import FaceIcon from '@material-ui/icons/Face';
import FlightTakeoffIcon from '@material-ui/icons/FlightTakeoff';

import RegisterModel from './registerModal'
import SnackBar from './snackBar'

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        position: 'fixed',
        bottom: 0,
        zIndex: 200
    },
    navBar: {
        backgroundColor: 'red',
    }
  }));

function NavHeader() {
    const { authState : {user} } = useContext(AuthContext);

    const [registerOpen, setRegisterOpen] = useState(false);

    const classes = useStyles();
    const [navTab, setNavTab] = React.useState('recents');
    const handleNavChange = (_, newValue) => {
        setNavTab(newValue);
    };

    const navBar = user ? (
        <div className={classes.root}>
            <BottomNavigation className={classes.navBar} value={navTab} onChange={handleNavChange}>
                <BottomNavigationAction component={Link} to='/trips' label="Trips" value="Trips" icon={<FaceIcon/>} />
                <BottomNavigationAction component={Link} to='/' label="Planner" value="Planner" icon={<FlightTakeoffIcon />} />
            </BottomNavigation>
            <SnackBar/>
        </div>
    ) : (
        <div className={classes.root}>
            <BottomNavigation className={classes.navBar} value={navTab} onChange={handleNavChange} >
                <BottomNavigationAction onClick={() => setRegisterOpen(true)} label="Trips" value="Trips" icon={<FaceIcon/>} />
                <BottomNavigationAction component={Link} to='/' label="Planner" value="Planner" icon={<FlightTakeoffIcon />} />
                <RegisterModel registerOpen={registerOpen} setRegisterOpen={setRegisterOpen}/>
            </BottomNavigation>
            <SnackBar/>
        </div>
    )

    return navBar;
}

export default NavHeader;