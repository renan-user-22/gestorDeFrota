// main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import App from './App.jsx';
import { GlobalStyle } from './stylesAppDefault.jsx';
import { StyleSheetManager } from 'styled-components';

const BLOCKED = new Set([
  'bottom','top','left','right',
  'justify','align','flex','wrap','gap','direction',
  'visible','isActive','weight',
  'bottomSpace','topSpace','leftSpace','rightSpace',
  'paddingTop','paddingLeft','paddingRight','paddingBottom','color','width','height',
]);

const rootFilter = (prop) => !(typeof prop === 'string' && BLOCKED.has(prop));

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StyleSheetManager shouldForwardProp={rootFilter}>
      <Provider store={store}>
        <GlobalStyle />
        <App />
      </Provider>
    </StyleSheetManager>
  </StrictMode>
);
