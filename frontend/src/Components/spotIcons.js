import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { deepPurple, indigo, blue} from '@material-ui/core/colors/';

import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import SearchIcon from '@material-ui/icons/Search';
import RestaurantIcon from "@material-ui/icons/Restaurant";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import LocalCafeIcon from "@material-ui/icons/LocalCafe";
import FlareIcon from '@material-ui/icons/Flare';

export const iconStyles = makeStyles({
    Retail: {
        backgroundColor: deepPurple[500],
        color: "white"
    },
    Restaurant: {
        backgroundColor: indigo[500],
        color: "white"
    },
    Museum: {
        backgroundColor: blue[500],
        color: "white"
    },
    Searched: {
        backgroundColor: blue[900],
        color: "white"
    },
    Event: {
        backgroundColor: blue[900],
        color: "white"
    }
});

export const iconDict = {
    Retail: <LocalMallIcon style={{ color: deepPurple[500] }}/>,
    Restaurant: <RestaurantIcon style={{ color: indigo[500] }}/>,
    Museum: <AccountBalanceIcon style={{ color: blue[500] }}/>,
    Searched: <SearchIcon style={{ color: blue[900] }}/>,
    Cafe: <LocalCafeIcon />,
    Event: <FlareIcon style={{ color: blue[900] }}/>
}