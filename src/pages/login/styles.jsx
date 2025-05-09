import styled from "styled-components";
import { colors } from '../../theme'; // Lembrando de importar o tema para usar as cores

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background-color: ${colors.black};
`;

export const Input = styled.input`
  width: 300px;
  padding: 10px;
  border: 1px solid ${colors.silver};
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  font-size: 16px;
  box-sizing: border-box;
  height: 40px;
`;

export const Button = styled.button`
  width: 335px;
  background-color: ${(props) => props.color || 'transparent'};
  padding: 10px;
  color: ${colors.silver};
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  box-sizing: border-box;

  
  &:hover {
    background-color: ${'#eeb92d' || colors.orange};
  }
`;

export const LogoImg = styled.img`
  width: ${(props) => props.width || '350px'};
  height: auto;
  margin-left: ${(props) => props.left || '0px'};
  margin-bottom: ${(props) => props.bottom || '0px'};
  margin-right: ${(props) => props.right || '0px'};
  margin-top: ${(props) => props.top || '0px'};
`;

export const ButtonVisibility = styled.button`
  background-color: transparent; // Cor de fundo cinza claro para o botão de visibilidade
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border: none;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content:center;
  background-color: ${colors.silver};
  font-size: 25px;
`;