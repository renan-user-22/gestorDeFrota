import styled, { createGlobalStyle } from 'styled-components';
import { colors } from '../../theme';

export const Container = styled.div`
  display: flex; width: 100%; height: 100vh;
  justify-content: center; align-items: center;
  background-color: ${colors.black};
`;

export const Input = styled.input`
  border: 1px solid ${colors.silver};
  width: 100%; padding: 10px; height: 40px; box-sizing: border-box;
  border-top-left-radius: 5px; border-bottom-left-radius: 5px;
  font-size: 14px; font-family: 'Octosquares Extra Light';
  outline: none;
`;

export const ButtonVisibility = styled.button`
  border-top-right-radius: 5px; border-bottom-right-radius: 5px;
  border: none; height: 40px; cursor: pointer;
  display: flex; align-items: center; justify-content:center;
  background-color: ${colors.silver}; font-size: 25px;
`;

export const Button = styled.button`
  display: flex; justify-content: center; align-items: center;
  width: 100%; height: 40px; padding: 10px; box-sizing: border-box;
  background-color: ${(props) => props.color || 'transparent'};
  color: ${colors.silver}; border: none; border-radius: 5px;
  font-size: 14px; cursor: pointer;
`;

/* Bloqueia props de estilo de irem ao DOM (sem warnings) */
export const LogoImg = styled.img.withConfig({
  shouldForwardProp: (prop) => !['$width', '$left', '$right', '$top', '$bottom'].includes(prop),
})`
  width: ${(p) => p.$width || '350px'};
  height: auto;
  margin-left: ${(p) => p.$left || '0px'};
  margin-bottom: ${(p) => p.$bottom || '0px'};
  margin-right: ${(p) => p.$right || '0px'};
  margin-top: ${(p) => p.$top || '0px'};
`;
