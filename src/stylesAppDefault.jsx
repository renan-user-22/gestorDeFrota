import styled, { createGlobalStyle } from 'styled-components';
import { colors } from './theme';

/* =========================================================
 * 1) Estilos Globais (migrados do index.css)
 *    -> assim você pode remover o index.css e o import no main.jsx
 * ========================================================= */
export const GlobalStyle = createGlobalStyle`
  /* Ajuste os paths conforme sua estrutura real */
  @font-face {
    font-family: 'Nebula';
    src: url('/src/fonts/Nebula-Regular.otf') format('opentype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Caviar Dreams';
    src: url('/src/fonts/CaviarDreams.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Octosquares Bold';
    src: url('/src/fonts/TT Octosquares Trial Bold Italic.ttf') format('truetype');
    font-weight: bold;
    font-style: italic;
    font-display: swap;
  }

  @font-face {
    font-family: 'Octosquares Italic';
    src: url('/src/fonts/TT Octosquares Trial Bold Italic.ttf') format('truetype');
    font-weight: normal;
    font-style: italic;
    font-display: swap;
  }

  @font-face {
    font-family: 'Octosquares Extra Light';
    src: url('/src/fonts/TT Octosquares Trial ExtraLight.ttf') format('truetype');
    font-weight: 200;
    font-style: normal;
    font-display: swap;
  }

  html, body, #root { height: 100%; }

  body {
    margin: 0;
    overflow: hidden; /* mantido do index.css */
    background-color: #f5f5f5;
    font-family: 'Nebula', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
                 'Octosquares Extra Light', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
                 'Helvetica Neue', 'Century Gothic', 'Caviar Dreams', 'Octosquares Bold', 'Octosquares Italic',
                 sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  code {
    font-family: 'Nebula', source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
                 'Caviar Dreams', 'Octosquares Bold', 'Octosquares Italic', 'Octosquares Extra Light',
                 monospace;
  }
`;

/* =========================================================
 * 2) Helpers: bloquear props de estilo de irem ao DOM
 *    (mantemos os nomes originais das props sem mudar o JSX)
 * ========================================================= */
const deny = (...names) => (prop) => !names.includes(prop);

/* =========================
 * 3) Container (igual ao original)
 * ========================= */
export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
`;

/* ========== 1.1) NOVO: SweetAlert Global ========== */
export const SwalCustomStyles = createGlobalStyle`
  .swal-custom-popup { background-color: ${colors.darkGrayTwo}; font-family: 'Octosquares Extra Light'; border-radius: 5px; }
  .swal-custom-title { font-size: 15px; color: ${colors.silver} !important; }
  .swal-custom-text { color: ${colors.silver}; font-family: 'Octosquares Extra Light'; }
  .swal-custom-confirm { background-color: ${colors.orange} !important; color: ${colors.silver} !important; font-family: 'Octosquares Extra Light'; border-radius: 5px; }
  .swal-custom-cancel { background-color: ${colors.black} !important; color: ${colors.silver} !important; font-family: 'Octosquares Extra Light'; border-radius: 5px; }
  .swal2-icon.swal2-warning { border-color: ${colors.orange} !important; color: ${colors.orange} !important; }
`;

/* =========================
 * 4) Box — idêntico ao original
 *    (mesmas props e defaults; só filtramos no DOM)
 * ========================= */
export const Box = styled.div.withConfig({
  shouldForwardProp: deny(
    'position', 'wrap', 'gap', 'flex', 'color', 'width', 'height',
    'justify', 'align', 'direction',
    'bottomSpace', 'topSpace', 'leftSpace', 'rightSpace',
    'radius',
    'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom'
  ),
})`
  display: flex;
  position:  ${props => props.position || 'none'};
  flex-wrap: ${props => props.wrap || 'nowrap'};
  gap: ${props => props.gap || '0px'};
  flex: ${props => props.flex};
  background-color: ${props => props.color};
  width: ${props => props.width};
  height: ${props => props.height};
  justify-content: ${props => props.justify};
  align-items: ${props => props.align};
  flex-direction: ${props => props.direction};
  margin-bottom: ${props => props.bottomSpace || '0px'};
  margin-top: ${props => props.topSpace || '0px'};
  margin-left: ${props => props.leftSpace || '0px'};
  margin-right: ${props => props.rightSpace || '0px'};
  border-radius: ${props => props.radius || '5px'};
  padding-left: ${props => props.paddingLeft || '0px'};
  padding-right: ${props => props.paddingRight || '0px'};
  padding-top: ${props => props.paddingTop || '0px'};
  padding-bottom: ${props => props.paddingBottom || '0px'};
`;

/* =========================
 * 5) InfoBox — idêntico ao original
 * ========================= */
export const InfoBox = styled.div.withConfig({
  shouldForwardProp: deny('align', 'open', 'rightSpace'),
})`
  overflow: hidden;
  width: 100%;
  align-items:${props => props.align || 'center'};
  /* //margin-right: ${props => props.rightSpace || '-100px'}; */
  max-height: ${({ open }) => open ? '500px' : '0'};
  opacity: ${({ open }) => open ? 1 : 0};
  transition: max-height 1s ease, opacity 1s ease;
  display: flex;
  flex-direction: column;
`;

/* =========================
 * 6) TextDefault — idêntico ao original
 * ========================= */
export const TextDefault = styled.h1.withConfig({
  shouldForwardProp: deny('align', 'size', 'color', 'weight', 'left', 'right', 'top', 'bottom', 'family'),
})`
  text-align: ${props => props.align || 'left'};
  font-size: ${props => props.size || '17px'}; /* 17px grande, 15px médio, 14px pequena, 12px mínima */
  color: ${(props) => props.color || colors.silver};
  font-weight: ${props => props.weight || 'normal'};
  margin-left: ${props => props.left || '0px'};
  margin-right: ${props => props.right || '0px'};
  margin-top: ${props => props.top || '0px'};
  margin-bottom: ${props => props.bottom || '0px'};
  font-family: ${(props) => props.family || 'Octosquares Extra Light'};
`;
