import styled, { keyframes, css } from 'styled-components';
import { colors } from '../../theme'; // Lembrando de importar o tema para usar as cores

export const Container = styled.div`
  display: flex;
  flex:1;
  background-color: ${colors.darkGray};
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100vh;
  flex-direction: column;
`;

export const BoxLarge = styled.div`
  display: flex;
  flex: ${props => props.flex};
  background-color: ${props => props.color || colors.black};
  width: 90%;
  overflow-y: scroll;
  padding-left: 20px;
  padding-right: 20px;
  height: ${props => props.height};
  justify-content: ${props => props.justify};
  align-items: ${props => props.align};
  flex-direction: ${props => props.direction};
  border-radius: ${props => props.radius || '0px'};

  @media (max-width: 768px) {
    width:80%;
  }

&::-webkit-scrollbar {
  width: 6px;
  height: 6px;
};
&::-webkit-scrollbar-thumb {
  background-color: ${colors.four};
};

`;

export const Logo = styled.img`
  width: 90px;
  height: 90px;
  margin-left: 20px;
`;

export const IconIa = styled.img`
  width: 30px;
  height: 30px;
`;

export const BoxList = styled.div`
  display: flex;
  flex: ${props => props.flex};
  background-color: ${props => props.color};
  width: ${props => props.width};
  height: ${props => props.height};
  justify-content: ${props => props.justify};
  align-items: ${props => props.align};
  flex-direction: ${props => props.direction};
  border-radius: ${props => props.radius || '0px'};
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  };
  &::-webkit-scrollbar-thumb {
    background-color: ${colors.orange};
  };

`;

export const TextDefaultHeader = styled.h1`
  font-size: ${props => props.size || '15px'};
  color: ${colors.four};
  font-weight: ${props => props.weight || 'normal'};
  margin-top: ${props => props.top || '5px'};
  margin-bottom: ${props => props.bottom || '5px'};
  margin-left: 10px;
  margin-right: 20px;
`;

export const InputDefault = styled.input`
  width: 100%;
  padding: 5px;
  border-radius: 50%;
  background-color: transparent;
  color: ${colors.silver};
  border: none;
  border-radius: 5px;
  font-size: 17px;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-right: 20px;
  outline: none; /* Remove a borda ao focar */
`;

export const ButtonDefault = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.color || 'transparent'};
  border-radius: 10px;
  width: ${props => props.width || 'auto'};
  height: auto;
  margin-top: 10px;
  margin-bottom: 10px;
  border: none;
  cursor: pointer;
`;