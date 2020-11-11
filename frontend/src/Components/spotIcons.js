import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { deepPurple, indigo, blue, pink} from '@material-ui/core/colors/';

import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import SearchIcon from '@material-ui/icons/Search';
import RestaurantIcon from "@material-ui/icons/Restaurant";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import LocalCafeIcon from "@material-ui/icons/LocalCafe";
import FlareIcon from '@material-ui/icons/Flare';
import FavoriteIcon from '@material-ui/icons/Favorite';


export const iconColour = {
    Retail: deepPurple[500],
    Restaurant: indigo[500],
    Museum: blue[500],
    Searched: blue[900],
    Event: blue[900],
    Liked: pink[500]
}

export const badgeStyles = makeStyles({
    Retail: {
        backgroundColor: iconColour.Retail,
        color: "white"
    },
    Restaurant: {
        backgroundColor: iconColour.Restaurant,
        color: "white"
    },
    Museum: {
        backgroundColor: iconColour.Museum,
        color: "white"
    },
    Searched: {
        backgroundColor: iconColour.Searched,
        color: "white"
    },
    Event: {
        backgroundColor: iconColour.Event,
        color: "white"
    },
    Liked: {
        backgroundColor: iconColour.Liked,
        color: "white"
    },
});



export const iconDict = {
    Retail: <LocalMallIcon fontSize="small" style={{ color: iconColour.Retail }}/>,
    Restaurant: <RestaurantIcon fontSize="small" style={{ color: iconColour.Restaurant }}/>,
    Museum: <AccountBalanceIcon fontSize="small" style={{ color: iconColour.Museum }}/>,
    Searched: <SearchIcon fontSize="small" style={{ color: iconColour.Searched }}/>,
    Cafe: <LocalCafeIcon fontSize="small" />,
    Event: <FlareIcon fontSize="small" style={{ color: iconColour.Event }}/>,
    Liked: <FavoriteIcon fontSize="small" style={{ color: iconColour.Liked }}/>
}

export const iconDictWhite = {
    Retail: <LocalMallIcon fontSize="small"/>,
    Restaurant: <RestaurantIcon fontSize="small"/>,
    Museum: <AccountBalanceIcon fontSize="small"/>,
    Searched: <SearchIcon fontSize="small"/>,
    Cafe: <LocalCafeIcon fontSize="small"/>,
    Event: <FlareIcon fontSize="small"/>,
    Liked: <FavoriteIcon fontSize="small"/>
}