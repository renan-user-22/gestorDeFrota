import React, { useEffect, useState } from 'react';
import { colors } from './theme';
import { Container, } from './stylesAppDefault';

//paginas iniciais: 
import Login from './pages/login';
import Home from './pages/home';
//import Empresas from './pages/empresas';

const App = () => {

  const [pageHome, setPageHome] = useState(false);
  const [pageLogin, setPageLogin] = useState(false);

  const [pageEmpresas, setPageEmpresas] = useState(false);

  useEffect(() => {
    setPageHome(false);
    setPageLogin(true);
    //setPageEmpresas(false);
  }, []);

  const ActionLogin = () => {
    setPageHome(true);
    setPageLogin(false);
    //setPageEmpresas(false);
  }

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