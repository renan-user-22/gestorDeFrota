import styled, { createGlobalStyle } from 'styled-components';
import { colors } from '../../theme';

export const SwalCustomStyles = createGlobalStyle`
  .swal-custom-popup {
    background-color: ${colors.darkGrayTwo};
    font-family: 'Octosquares Extra Light';
    border-radius: 5px;
  }

  .swal-custom-title {
    font-size: 15px;
    color: ${colors.silver} !important;
  }
  .swal-custom-text {
    color: ${colors.silver};
    font-family: 'Octosquares Extra Light';
  }

  .swal-custom-confirm {
    background-color: ${colors.orange} !important;
    color: ${colors.silver} !important;
    font-family: 'Octosquares Extra Light';
    border-radius: 5px;
  }

  .swal-custom-cancel {
    background-color: ${colors.black} !important;
    color: ${colors.silver} !important;
    font-family: 'Octosquares Extra Light';
    border-radius: 5px;
  }

  /* Ícone de warning */
  .swal2-icon.swal2-warning {
    border-color: ${colors.orange} !important;
    color: ${colors.orange} !important;
  }
`;

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background-color: ${colors.black};
`;

export const Input = styled.input`
  border: 1px solid ${colors.silver};
  width: 100%;
  padding: 10px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  font-size: 14px;
  font-family: 'Octosquares Extra Light';
  box-sizing: border-box;
  height: 40px;
  outline: none;
`;

export const ButtonVisibility = styled.button`
  background-color: transparent; // Cor de fundo cinza claro para o botão de visibilidade
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  border: none;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content:center;
  background-color: ${colors.silver};
  font-size: 25px;
`;

export const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 40px;
  background-color: ${(props) => props.color || 'transparent'};
  padding: 10px;
  color: ${colors.silver};
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  box-sizing: border-box;
`;

export const LogoImg = styled.img`
  width: ${(props) => props.width || '350px'};
  height: auto;
  margin-left: ${(props) => props.left || '0px'};
  margin-bottom: ${(props) => props.bottom || '0px'};
  margin-right: ${(props) => props.right || '0px'};
  margin-top: ${(props) => props.top || '0px'};
`;
