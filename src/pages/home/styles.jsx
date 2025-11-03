// src/pages/home/styles.jsx
import styled, { keyframes, css } from 'styled-components';
import { colors } from '../../theme';

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
  opacity: ${({ $visible }) => ($visible ? '1' : '0')};
  pointer-events: ${({ $visible }) => ($visible ? 'auto' : 'none')};
  transition: opacity 0.2s linear;
  z-index: ${({ $visible }) => ($visible ? '1' : '-1')};
`;

export const LogoImg = styled.img`
  width: ${(props) => props.$width || '350px'};
  height: auto;
  margin-left: ${(props) => props.$left || '0px'};
`;

export const ToggleMenuButton = styled.button`
  margin-left: 10px;
  margin-top: 20px;
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
`;

/* 🔒 Submenu inline desativado (evita empurrar layout) */
export const Submenu = styled.div`
  display: none;
`;

export const GroupButton = styled.button`
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  gap: 10px;
  height: 48px;
  padding: 0 16px;
  border: none;
  background: none;
  cursor: pointer;
  color: ${({ $active }) => ($active ? colors.orange : colors.silver)};
  font-weight: 600;
  letter-spacing: .2px;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 6px;
    bottom: 6px;
    width: 3px;
    border-radius: 2px;
    background: ${colors.orange};
    opacity: ${({ $open }) => ($open ? 1 : 0)};
  }

  svg { color: ${({ $open, $active }) => ($open || $active ? colors.orange : colors.silver)}; }
`;

export const ItemButton = styled.button`
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  gap: 10px;
  height: 44px;
  padding: 0 16px;
  border: none;
  background: none;
  cursor: pointer;
  color: ${({ $active }) => ($active ? colors.orange : colors.silver)};
  font-weight: ${({ $active }) => ($active ? 600 : 500)};

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 6px;
    bottom: 6px;
    width: 3px;
    border-radius: 2px;
    background: ${colors.orange};
    opacity: ${({ $active }) => ($active ? 1 : 0)};
  }

  svg {
    color: ${({ $active }) => ($active ? colors.orange : colors.silver)};
  }
`;

export const Separator = styled.div`
  height: 1px;
  width: calc(100% - 32px);
  margin: 8px 16px;
  background: ${({ $color }) => $color || colors.gray};
  border-radius: 2px;
`;

/* 🎞️ Animações */
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const animationByMode = ({ $animateMode }) => {
  if ($animateMode === 'fade') {
    return css`animation: ${fadeIn} 180ms ease-out both;`;
  }
  // default: slide
  return css`animation: ${slideIn} 220ms cubic-bezier(.2,.8,.2,1) both;`;
};

/* 🧭 Flyout com deslocamento dinâmico (colapsado: 80px, expandido: 300px) + animação */
export const Flyout = styled.div`
  position: absolute;
  left: ${({ $left }) => ($left != null ? `${$left}px` : '80px')};
  top: ${({ $top }) => $top || 0}px;
  min-width: 260px;
  background: ${colors.black};
  border: 1px solid ${colors.darkGrayTwo};
  border-radius: 10px;
  padding: 6px 8px;
  z-index: 1000;
  box-shadow: 0 6px 24px rgba(0,0,0,0.25);

  will-change: transform, opacity;
  ${animationByMode}

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
