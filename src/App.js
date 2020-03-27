import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';

import Page from './Components/page';
import Login from './Pages/login';
import Register from './Pages/register';
import PlaceContextProvider from './Store/PlaceContext';
import { AuthContextProvider } from './Store/AuthContext';


function App() {
  return (
    <AuthContextProvider>
      <PlaceContextProvider>
        <BrowserRouter>
          <Route exact path='/' component={Page}/>
          <Route exact path='/login' component={Login}/>
          <Route exact path='/register' component={Register}/>
        </BrowserRouter>
      </PlaceContextProvider>
    </AuthContextProvider>
    
  );
}

export default App;
