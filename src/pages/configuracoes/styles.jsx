import styled, { createGlobalStyle } from 'styled-components';
import { colors } from '../../theme'; // Lembrando de importar o tema para usar as cores

export const SwalCustomStyles = createGlobalStyle`
  .swal-custom-popup {
    background-color: ${colors.darkGrayTwo};
    font-family: 'Octosquares Extra Light';
    border-radius: 5px;
  }

  .swal-custom-title {
    font-size: 25px;
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
  flex-direction: column;
  align-items: center;
  height: 100vh;
  background-color: ${colors.darkGray};
  overflow: hidden;
`;

export const DefaultButton = styled.button`
  display: flex;
  width: ${props => props.width || '150px'};
  height: ${props => props.height || '35px'};
  background-color: ${colors.orange};
  border-radius: 5px;
  margin-top: 15px;
  margin-bottom: 15px;
  align-items: center;
  justify-content: center;
  padding: 5px;
  margin-right: ${props => props.right || '20px'};
  border: none;
  cursor: pointer;
`;

export const ModalAreaTotalDisplay = styled.div`
  position: fixed;
  top: 0; 
  left: 0; 
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

export const ModalAreaInfo = styled.div`
  background-color: ${colors.darkGray};
  padding: 30px;
  border-radius: 20px;
  width: 90%;
  height: 80%;
`;

export const Input = styled.input`
  width:${props => props.width || '250px'};
  background-color: ${colors.silver};
  margin-left:${props => props.left || '0px'};
  height: 30px;
  color: ${colors.black};
  padding-left: 10px;
  border: 1px solid ${colors.darkGrayTwo};
  font-size: 13px;
  border-radius: 5px;
  font-family: ${(props) => props.family || 'Octosquares Extra Light'};
`;

export const Button = styled.button`
  display: flex;
  flex: 1;
  height: 40px;
  flex-direction: ${(props) => props.direction || 'row'};
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.color || colors.orange};
  color: ${colors.silver};
  border: none;
  font-size: 14px;
  cursor: pointer;
  box-sizing: border-box;

  /* remove margens para os botões se encostarem */
  margin: 0;

  /* transição suave ao passar o mouse */
  transition: background 0.2s ease;

  &:hover {
    filter: brightness(1.1);
  }
`;

export const ListaEmpresasWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 95%;
  margin-top: 20px;
  margin-bottom: 20px;
  overflow-y: auto;
  padding-right: 10px;
  margin-left: 10px; // para garantir o alinhamento entre o Header e o componente que com as informações da empresa

  /* Scrollbar personalizada */
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #f63b2a;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`;

export const Dev = styled.img`
  width:  ${(props) => props.width || '60%'};
  height: auto;
`;