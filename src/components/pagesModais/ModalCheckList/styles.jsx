import styled, { keyframes, css } from 'styled-components';
import { colors } from '../../../theme'; // Lembrando de importar o tema para usar as cores

export const DefaultButton = styled.button`
  display: flex;
  background-color: transparent;
  align-items: center;
  height: auto;
  padding: 10px;
  margin-right: 20px;
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
  padding: 0; /* padding será no conteúdo interno */
  border-radius: 20px;
  width: 95%;
  height: 95%;
  overflow: hidden; /* evita scroll colado na borda */
  display: flex;
  flex-direction: column;
`;

export const ModalContentScroll = styled.div`
  padding: 30px;
  overflow-y: auto;
  flex: 1;

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
  height: 40px;
  padding-left: 10px;
  border: 1px solid ${colors.silver};
  font-size: 14px;
  margin-bottom: 10px;
  border-radius: 7px;
`;

export const Button = styled.button`
  display: flex;
  width: ${(props) => props.width || 'auto'};
  flex-direction: ${(props) => props.direction || 'row'};
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.color || colors.orange};
  padding: 10px;
  margin-top: ${(props) => props.top || '0px'};
  margin-right: ${(props) => props.right || '0px'};
  margin-left: ${(props) => props.left || '0px'};
  color: ${colors.silver};
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  box-sizing: border-box;
`;

export const ListaEmpresasWrapper = styled.div`
  width: 95%;
  margin-top: 20px;
  margin-bottom: 20px;
  overflow-y: auto;
  padding-right: 10px;

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

export const CheckboxStyled = styled.input.attrs({ type: 'checkbox' })`
  width: 25px;
  height: 25px;
  appearance: none;
  border: 2px solid #ccc;
  border-radius: 4px;
  background-color: ${colors.silver};
  cursor: pointer;
  transition: background-color 0.2s ease;
  position: relative;

  &:checked {
    background-color: #00cc66;
    border-color: #00cc66;
  }

  &:checked::after {
    content: '✔';
    color: white;
    font-size: 14px;
    position: absolute;
    top: 0px;
    left: 3px;
  }
`;
