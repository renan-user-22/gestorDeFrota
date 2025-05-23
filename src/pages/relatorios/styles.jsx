import styled, { keyframes, css } from 'styled-components';
import { colors } from '../../theme'; // Lembrando de importar o tema para usar as cores

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
  padding: 30px;
  border-radius: 20px;
  width: 90%;
  height: 80%;
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
  width: ${(props) => props.width || '100%'};
  height: 60px;
  flex-direction: ${(props) => props.direction || 'row'};
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.color || colors.yellow};
  padding: 10px;
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
  display: flex;
  flex-direction: column;
  //justify-content: center;
  align-items: center;
  width: 99%;
  //margin-top: 20px;
  margin-bottom: 20px;
  overflow-y: auto;
  padding-right: 1px;

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

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  width: 97.5%;
  margin: 10px 0;
`;

export const InfoCard = styled.div`
  background-color: ${colors.silver};
  border-radius: 5px;
  padding: 15px;
  text-align: center;
`;

export const ChartsWrapper = styled.div`
  display: flex;
  flex: ${(props) => props.flex || 'none'};;
  flex-direction: column;
  background-color: ${colors.silver};
  border-radius: 5px;
  margin: 2px;
  padding: 15px;
  justify-content: flex-start;
  align-items: flex-start;
  width: ${(props) => props.width || 'auto'};
  height: ${(props) => props.height || 'auto'};
`;
