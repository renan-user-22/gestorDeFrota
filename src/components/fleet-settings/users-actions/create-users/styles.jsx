// src/components/fleet-settings/pagesModais/listaMotoristas/create-users/styles.jsx
import styled from 'styled-components';
import { colors } from '../../../../theme';

export const ModalAreaTotalDisplay = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(0,0,0,.5);
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

  &::-webkit-scrollbar { width: 6px; height: 6px; }
  &::-webkit-scrollbar-thumb { background-color: #f63b2a; border-radius: 4px; }
  &::-webkit-scrollbar-track { background-color: transparent; }
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

export const InputHora = styled.input.attrs({
  type: 'text',
  maxLength: 5,
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

/* Revelação suave para o bloco de CNH quando cargo = motorista */
export const SmoothReveal = styled.div`
  overflow: hidden;
  max-height: ${({ open }) => (open ? '1000px' : '0')};
  opacity: ${({ open }) => (open ? 1 : 0)};
  transform: translateY(${({ open }) => (open ? '0' : '-6px')});
  transition: max-height .35s ease, opacity .25s ease, transform .25s ease;
`;
