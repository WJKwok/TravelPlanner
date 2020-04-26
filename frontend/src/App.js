import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';

import {AuthRoute, UnAuthRoute} from './utils/AuthRoute';

import Container from "@material-ui/core/Container";

import NavHeader from './Components/navHeader';
import Itinerary from './Pages/itinerary';
import Login from './Pages/login';
import Register from './Pages/register';
import Itineraries from './Pages/itineraries';
import PlaceAutoComplete from './Components/placeAutoComplete';
import PlaceContextProvider from './Store/PlaceContext';
import { AuthContextProvider } from './Store/AuthContext';


function App() {
  return (
    <Container maxWidth="lg">
      <AuthContextProvider>
        <PlaceContextProvider>
          <BrowserRouter>
            <NavHeader/>
            <Route exact path='/' component={Itinerary}/>
            <Route exact path='/search' component={PlaceAutoComplete}/>
            <AuthRoute exact path='/login' component={Login}/>
            <AuthRoute exact path='/register' component={Register}/>
            <UnAuthRoute exact path='/itineraries' component={Itineraries}/>
            <UnAuthRoute exact path='/itinerary/:itineraryId' component={Itinerary}/>
          </BrowserRouter>
        </PlaceContextProvider>
      </AuthContextProvider>
    </Container> 
  );
}

export default App;
