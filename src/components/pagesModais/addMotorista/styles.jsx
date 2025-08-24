import styled, { createGlobalStyle } from 'styled-components';
import { colors } from '../../../theme'; // Lembrando de importar o tema para usar as cores

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

export const ListaEmpresasWrapper = styled.div`
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px;
  overflow-y: auto;
  height: 95%;

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

export const ModalAreaTotalDisplay = styled.div`
  position: absolute;
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
  width: 100%;
  height: 100vh;
  overflow-y: auto;

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


export const Input = styled.input`
  width:${props => props.width || '100%'};
  margin-left:${props => props.left || '0px'};
  height: 30px;
  padding-left: 10px;
  border: 1px solid ${colors.silver};
  font-size: 14px;
  margin-bottom: 10px;
  border-radius: 3px;
`;

export const Select = styled.select`
  width:${props => props.width || '100%'};
  margin-left:${props => props.left || '0px'};
  height: 33px;
  padding-left: 10px;
  border: 1px solid ${colors.silver};
  font-size: 13px;
  margin-bottom: 10px;
  border-radius: 3px;
`;

export const Button = styled.button`
  display: flex;
  width: ${(props) => props.width || 'auto'};
  height: 33px;
  flex-direction: ${(props) => props.direction || 'row'};
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.color || colors.orange};
  padding: 5px;
  margin-top: ${(props) => props.top || '0px'};
  margin-bottom: ${(props) => props.bottom || '0px'};
  margin-right: ${(props) => props.right || '0px'};
  margin-left: ${(props) => props.left || '0px'};
  color: ${colors.silver};
  border: none;
  border-radius: 3px;
  font-size: 14px;
  cursor: pointer;
  box-sizing: border-box;
`;

export const DefaultButton = styled.button`
  display: flex;
  width: ${props => props.width || 'auto'};
  height: ${props => props.height || '35px'};
  background-color: transparent;
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

// Estilização das bolinhas
export const StepIndicator = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 20px;
`;

export const Dot = styled.div`
  width: 47px;
  height: 4px;
  border-radius: 2px;
  background-color: ${({ active }) => active ? colors.orange : colors.silver};
  transition: background-color 0.3s ease;
`;

export const CargoModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const CargoModalContent = styled.div`
  width: 70%;
  height: 70vh;
  background: ${colors.darkGrayTwo};
  padding: 20px;
  border-radius: 3px;
  overflow-y: auto;

  /* Esconde a barra mas mantém rolagem */
  &::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE e Edge antigo */
`;


export const CargoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 15px 0;
`;

export const CargoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${colors.darkGray};
  padding: 8px 12px;
  border-radius: 6px;
  color: ${colors.silver};
  font-size: 14px;
`;

export const RemoveButton = styled.button`
  background-color: ${(props) => props.color || 'transparent'};
  padding: 10px;
  color: white;
  border: none;
  padding: 5px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;

`;

export const InputHora = styled.input.attrs({
  type: 'text',
  maxLength: 5, // sempre "HH:MM"
  placeholder: '00:00'
})`
  width: ${props => props.width || '100%'};
  margin-left: ${props => props.left || '0px'};
  height: 30px;
  padding-left: 10px;
  border: 1px solid ${colors.silver};
  font-size: 14px;
  margin-bottom: 10px;
  border-radius: 3px;
  background: ${colors.silver};
  color: ${colors.black};

  &::placeholder {
    color: ${colors.silver};
    opacity: 0.6;
  }
`;

export const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${colors.black};
    transition: 0.3s;
    border-radius: 34px;
  }

  span:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
  }

  input:checked + span {
    background-color: ${colors.orange};
  }

  input:checked + span:before {
    transform: translateX(18px);
  }
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
  margin-top: 20px;

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    padding: 8px;
    text-align: left;
    border-bottom: 1px solid ${colors.darkGrayTwo};
    font-size: 13px;
  }

  th {
    background-color: ${colors.darkGray};
    color: ${colors.silver};
    font-weight: bold;
  }
`;
