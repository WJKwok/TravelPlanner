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

import PlaceContextProvider from './Store/PlaceContext';
import { AuthContextProvider } from './Store/AuthContext';
import SpotContextProvider from './Store/SpotContext';


function App() {
  return (
    <Container maxWidth="lg">
      <AuthContextProvider>
        <PlaceContextProvider>
          <SpotContextProvider>
            <BrowserRouter>
              <NavHeader/>
              <Route exact path='/' component={Itinerary}/>
              <Route exact path='/planner' component={Planner}/>
              <Route exact path='/logger' component={Logger}/>
              <AuthRoute exact path='/login' component={Login}/>
              <AuthRoute exact path='/register' component={Register}/>
              <UnAuthRoute exact path='/itineraries' component={Itineraries}/>
              <UnAuthRoute exact path='/itinerary/:itineraryId' component={Itinerary}/>
            </BrowserRouter>
          </SpotContextProvider>
        </PlaceContextProvider>
      </AuthContextProvider>
    </Container> 
  );
}

export default App;
