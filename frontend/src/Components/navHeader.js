import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Fade from '@material-ui/core/Fade';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

import { AuthContext } from '../Store/AuthContext'
import { PlaceContext } from '../Store/PlaceContext';
import { SnackBarContext } from '../Store/SnackBarContext';

import FaceIcon from '@material-ui/icons/Face';
import FlightTakeoffIcon from '@material-ui/icons/FlightTakeoff';

import RegisterModel from './registerModal'

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        position: 'fixed',
        bottom: 0,
        // [theme.breakpoints.down('sm')]: {
        //     bottom: 0,
        // },
        zIndex: 200
    },
    alertBar: {
        width: '100%',
        textAlign: 'center',
    }
  }));

function NavHeader() {
    const { authState : {user} } = useContext(AuthContext);
    const { snackMessage } = useContext(SnackBarContext)

    const [registerOpen, setRegisterOpen] = useState(false);

    // const theme = useTheme();
    // const matches = useMediaQuery(theme.breakpoints.up('sm'));

    const classes = useStyles();
    const [navTab, setNavTab] = React.useState('recents');
    const handleNavChange = (_, newValue) => {
        setNavTab(newValue);
    };

    const navBar = user ? (
        <div className={classes.root}>
            <BottomNavigation value={navTab} onChange={handleNavChange}>
                <BottomNavigationAction component={Link} to='/trips' label="Trips" value="Trips" icon={<FaceIcon/>} />
                <BottomNavigationAction component={Link} to='/' label="Planner" value="Planner" icon={<FlightTakeoffIcon />} />
            </BottomNavigation>
            <Fade in={!!snackMessage}>
                <p className={classes.alertBar}>{snackMessage}</p>
            </Fade>
        </div>
    ) : (
        <div className={classes.root}>
            <BottomNavigation value={navTab} onChange={handleNavChange} >
                <BottomNavigationAction onClick={() => setRegisterOpen(true)} label="Trips" value="Trips" icon={<FaceIcon/>} />
                <BottomNavigationAction component={Link} to='/' label="Planner" value="Planner" icon={<FlightTakeoffIcon />} />
                <RegisterModel registerOpen={registerOpen} setRegisterOpen={setRegisterOpen}/>
            </BottomNavigation>
            <Fade in={!!snackMessage}>
                <p className={classes.alertBar}>{snackMessage}</p>
            </Fade>
        </div>
    )

    return navBar;
}

export default NavHeader;