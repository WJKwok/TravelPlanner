import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import {AuthRoute, UnAuthRoute} from './utils/AuthRoute';

import { makeStyles } from '@material-ui/core/styles';

import Container from '@material-ui/core/Container'
import NavHeader from './Components/navHeader';
import Itinerary from './Pages/itinerary';
import Login from './Pages/login';
import Register from './Pages/register';
import Itineraries from './Pages/itineraries';
import Planner from './Pages/planner'
import Logger from './Pages/logger';
import Landing from './Pages/landing';
import Trips from './Pages/trips';

import PlaceContextProvider from './Store/PlaceContext';
import SnackBarContextProvider from './Store/SnackBarContext'
import { AuthContextProvider } from './Store/AuthContext';
import SpotContextProvider from './Store/SpotContext';
import { SnackbarProvider } from 'notistack';

const useStyles = makeStyles((theme) => ({
  container: {
      margin: '10px 0px 56px 0px'
  },
}));

function App() {

  const classes = useStyles();

  return (
      <AuthContextProvider>
        <PlaceContextProvider>
          <SpotContextProvider>
            <SnackbarProvider maxSnack={3} >
              <SnackBarContextProvider>
              <BrowserRouter>
                <NavHeader/>
                <Container className={classes.container}>
                  <Route exact path='/' component={Landing}/>
                  <Route exact path='/planner/:guideBookId' component={Planner}/>
                  <Route exact path='/logger' component={Logger}/>
                  <AuthRoute exact path='/login' component={Login}/>
                  <AuthRoute exact path='/register' component={Register}/>
                  <UnAuthRoute exact path='/itineraries' component={Itineraries}/>
                  <UnAuthRoute exact path='/itinerary/:itineraryId' component={Itinerary}/>
                  <UnAuthRoute exact path='/trips' component={Trips}/>
                  <UnAuthRoute exact path='/planner/:guideBookId/:tripId' component={Planner}/>
                </Container>
              </BrowserRouter>
              </SnackBarContextProvider>
            </SnackbarProvider>
          </SpotContextProvider>
        </PlaceContextProvider>
      </AuthContextProvider>
  );
}

export default App;
