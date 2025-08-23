import React, { useEffect, useState } from 'react';
import { Container, } from './stylesAppDefault';

//paginas iniciais: 
import Login from './pages/login';
import Home from './pages/home';

const App = () => {

  const [pageHome, setPageHome] = useState(false);
  const [pageLogin, setPageLogin] = useState(false);

  const ActionLogin = () => {
    setPageHome(true);
    setPageLogin(false);
  }

  useEffect(() => {
    setPageHome(false);
    setPageLogin(true);
  }, []);

  return (
    <Container>

      {pageHome && (
        <Home />
      )}

      {pageLogin && (
        <Login nextHome={ActionLogin} />
      )}

    </Container>
  );
}

export default App;