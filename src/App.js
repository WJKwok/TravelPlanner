import React from 'react';

import Board from './Components/board';
import PlaceContextProvider from './Store/PlaceContext';


function App() {
  return (
    <div>
      <PlaceContextProvider>
        <Board/>
      </PlaceContextProvider>
    </div>
  );
}

export default App;
