// src/pages/Recurso/styles.jsx
import styled from 'styled-components';
import { colors } from '../../theme';

/* ===== Layout base da página ===== */
export const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  background-color: ${colors.darkGray};
  overflow: hidden;
  font-family: 'Octosquares Extra Light', sans-serif;
`;

/* Botão padrão com transient props */
export const DefaultButton = styled.button`
  display: inline-flex;
  width: ${p => p.$width || '150px'};
  height: ${p => p.$height || '35px'};
  background-color: ${colors.orange};
  color: ${colors.silver};
  border-radius: 6px;
  margin-top: 15px;
  margin-bottom: 15px;
  align-items: center;
  justify-content: center;
  padding: 5px 10px;
  margin-right: ${p => p.$right || '20px'};
  border: none;
  cursor: pointer;
  font-family: 'Octosquares Extra Light', sans-serif;
  transition: filter .2s ease, transform .08s ease;
  &:hover { filter: brightness(1.08); }
  &:active { transform: scale(0.98); }
`;

/* Input padrão com transient props */
export const Input = styled.input`
  width: ${p => p.$width || '260px'};
  background-color: ${colors.silver};
  margin-left: ${p => p.$left || '0px'};
  height: 32px;
  color: ${colors.black};
  padding: 0 10px;
  border: 1px solid ${colors.darkGrayTwo};
  font-size: 13px;
  border-radius: 6px;
  font-family: 'Octosquares Extra Light', sans-serif;
`;