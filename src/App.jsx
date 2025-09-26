// src/App.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { Container, SwalCustomStyles } from './stylesAppDefault';
import Login from './pages/login';
import Home from './pages/home';

const App = () => {
  const [pageHome, setPageHome] = useState(false);
  const [pageLogin, setPageLogin] = useState(false);

  const ActionLogin = useCallback(() => {
    setPageHome(true);
    setPageLogin(false);
  }, []);

  const ActionLogout = useCallback(() => {
    setPageHome(false);
    setPageLogin(true);
  }, []);

  useEffect(() => {
    setPageHome(false);
    setPageLogin(true);
  }, []);

  return (
    <Container>

      <SwalCustomStyles />
      
      {pageHome && <Home onLogout={ActionLogout} />}
      {pageLogin && <Login nextHome={ActionLogin} />}
    </Container>
  );
}

export default App;

{/* 

// src/App.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { Container } from './stylesAppDefault';

// páginas iniciais
import Login from './pages/login';
import Home from './pages/home';

const SESSION_KEY = 'fs:session';

const App = () => {
  const [pageHome, setPageHome] = useState(false);
  const [pageLogin, setPageLogin] = useState(false);

  const ActionLogin = useCallback((token = 'true') => {
    // persiste a sessão (opcional)
    localStorage.setItem(SESSION_KEY, token);
    setPageHome(true);
    setPageLogin(false);
  }, []);


  const ActionLogout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setPageHome(false);
    setPageLogin(true);
  }, []);

  useEffect(() => {
    // boot: se tiver sessão, vai pra Home; senão, Login
    const hasSession = !!localStorage.getItem(SESSION_KEY);
    setPageHome(hasSession);
    setPageLogin(!hasSession);
  }, []);

  useEffect(() => {
    // sincroniza entre abas
    const onStorage = (e) => {
      if (e.key === SESSION_KEY) {
        const logged = !!e.newValue;
        setPageHome(logged);
        setPageLogin(!logged);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <Container>
      {pageHome && <Home onLogout={ActionLogout} />}
      {pageLogin && <Login nextHome={ActionLogin} />}
    </Container>
  );
};

export default App;
*/}