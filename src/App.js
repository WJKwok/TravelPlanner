import React from 'react';

import Page from './Components/page';
import PlaceContextProvider from './Store/PlaceContext';


function App() {
  return (
    <div>
      <PlaceContextProvider>
        <Page/>
      </PlaceContextProvider>
    </div>
  );
}

export default App;
