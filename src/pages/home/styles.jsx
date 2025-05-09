import styled, { keyframes, css } from 'styled-components';
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
  width: 100vw;
  height: 100vh;
  background-color: ${colors.silver};
  overflow: hidden;
`;


export const PageTransitionnnn = styled.div`
  //position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: ${({ visible }) => (visible ? '1' : '0')};
  pointer-events: ${({ visible }) => (visible ? 'auto' : 'none')};
  transition: opacity 0.5s ease;
  z-index: 999;
  animation: ${({ visible }) => (visible ? fadeIn : 'none')} 0.9s ease forwards;
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


export const Drawer = styled.div`
  width: ${props => (props.isMobile ? '270px' : '20%')};
  margin-top: 100px;
  height: 100%;
  //background-color: ${colors.orange};
  position: fixed;
  top: 0;
  left: ${props => (props.open ? '0' : (props.isMobile ? '-270px' : '0'))};
  transition: left 0.3s ease;
`;

export const DrawerButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;
  padding: 20px;
  background-color: transparent;
  border: none;
  border-bottom: 1px solid ${colors.orange};
  cursor: pointer;
`;

export const IconDefaultButton = styled.button`
  display: flex;
  width: 100%;
  background-color: #ccc;
  align-items: center;
  height: 70px;
  padding: 10px;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  //margin-bottom: 20px;

  &:hover {
    background-color: rgba(0,0,0,0.05);
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