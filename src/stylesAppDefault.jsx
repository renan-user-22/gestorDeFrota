import styled, { keyframes, css } from 'styled-components';
import { colors } from './theme';

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
`;

export const Box = styled.div`
  display: flex;
  flex-wrap: ${props => props.wrap || 'nowrap'};
  gap: ${props => props.gap || '0px'};
  flex: ${props => props.flex};
  background-color: ${props => props.color};
  width: ${props => props.width};
  height: ${props => props.height};
  justify-content: ${props => props.justify};
  align-items: ${props => props.align};
  flex-direction: ${props => props.direction};
  margin-bottom: ${props => props.bottomSpace || '0px'};
  margin-top: ${props => props.topSpace || '0px'};
  margin-left: ${props => props.leftSpace || '0px'};
  border-radius: ${props => props.radius || '0px'};
  padding-left: ${props => props.paddingLeft || '0px'};
  padding-right: ${props => props.paddingRight || '0px'};
  padding-top: ${props => props.paddingTop || '0px'};
  padding-bottom: ${props => props.paddingBottom || '0px'};
`;

export const InfoBox = styled.div`
  overflow: hidden;
  width: 100%;
  max-height: ${({ open }) => open ? '500px' : '0'};
  opacity: ${({ open }) => open ? 1 : 0};
  transition: max-height 1s ease, opacity 1s ease;
  display: flex;
  flex-direction: column;
`;

export const TextDefault = styled.h1`
  text-align: ${props => props.align || 'right'};;
  font-size: ${props => props.size || '16px'};
  color: ${(props) => props.color || colors.silver};
  font-weight: ${props => props.weight || 'normal'};
  margin-left: ${props => props.left || '0px'};
  margin-right: ${props => props.right || '0px'};
  margin-top: ${props => props.top || '0px'};
  margin-bottom: ${props => props.bottom || '0px'};
  font-family: ${(props) => props.family || 'Octosquares Extra Light'};
`;
