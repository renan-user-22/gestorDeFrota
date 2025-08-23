import styled, { keyframes } from 'styled-components';
import { colors } from '../../theme'; // Lembrando de importar o tema para usar as cores

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: ${colors.silver};
  overflow: hidden;
`;

export const PageTransition = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  opacity: ${({ visible }) => (visible ? '1' : '0')};
  pointer-events: ${({ visible }) => (visible ? 'auto' : 'none')};
  transition: opacity 0.5s ease;
  z-index: ${({ visible }) => (visible ? '1' : '-1')};
  animation: ${({ visible }) => (visible ? fadeIn : 'none')} 0.9s ease forwards;
`;

export const IconDefaultButton = styled.button`
  display: flex;
  width: 100%;
  background:none;
  align-items: center;
  height: 70px;
  padding-left: 30px;
  border: none;
  cursor: pointer;
  text-align: left;

  &:hover {
    background-color: ${colors.yellow}
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

export const ToggleMenuButton = styled.button`
  margin-left: 10px;
  margin-top: 30px;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1 ;
  transition: all 0.3s ease;

  svg {
    color: ${colors.black};
    font-size: 14px;
  }
`;
