import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';

import {AuthRoute, UnAuthRoute} from './utils/AuthRoute';

import Container from "@material-ui/core/Container";

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
import { AuthContextProvider } from './Store/AuthContext';
import SpotContextProvider from './Store/SpotContext';
import { SnackbarProvider } from 'notistack';


function App() {
  return (
    <Container maxWidth="lg">
      <AuthContextProvider>
        <PlaceContextProvider>
          <SpotContextProvider>
            <SnackbarProvider maxSnack={3} >
              <BrowserRouter>
                <NavHeader/>
                <Route exact path='/' component={Landing}/>
                <Route exact path='/planner/:guideBookId' component={Planner}/>
                <Route exact path='/logger' component={Logger}/>
                <AuthRoute exact path='/login' component={Login}/>
                <AuthRoute exact path='/register' component={Register}/>
                <UnAuthRoute exact path='/itineraries' component={Itineraries}/>
                <UnAuthRoute exact path='/itinerary/:itineraryId' component={Itinerary}/>
                <UnAuthRoute exact path='/trips' component={Trips}/>
                <UnAuthRoute exact path='/planner/:guideBookId/:tripId' component={Planner}/>
              </BrowserRouter>
            </SnackbarProvider>
          </SpotContextProvider>
        </PlaceContextProvider>
      </AuthContextProvider>
    </Container> 
  );
}

export default App;
