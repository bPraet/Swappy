import React from 'react';
import Routes from './routes';

import './App.css';
import 'fontsource-roboto';
import { Container } from '@material-ui/core';

function App() {
  return (
    <div className="App">
      <Container maxWidth={false}>
          <Routes />
      </Container>
    </div>
  );
}

export default App;
