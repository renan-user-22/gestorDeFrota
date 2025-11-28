// src/components/fleet-settings/pagesModais/listaMotoristas/create-users/styles.jsx
import styled, { css } from 'styled-components';
import { colors } from '../../../../theme';

/* =========================================================
   Modal
   ========================================================= */
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

/* =========================================================
   Skin padrão para inputs
   ========================================================= */
const inputSkin = css`
  height: ${({ $height, height }) => $height || height || '30px'};
  padding-left: 10px;
  color: ${colors.silver};
  background: ${colors.darkGrayTwo};
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 5px;
  outline: none;
  transition: border-color .15s ease, box-shadow .15s ease;

  &::placeholder {
    color: rgba(255,255,255,.45);
  }

  &:focus {
    border-color: ${colors.orange};
    box-shadow: 0 0 0 3px rgba(255, 153, 0, .15);
  }

  &[disabled] {
    opacity: .6;
    cursor: not-allowed;
  }

  /* 🔥 Autofill corrigido */
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-text-fill-color: ${colors.silver} !important;
    caret-color: ${colors.silver} !important;

    box-shadow: 0 0 0px 1000px ${colors.darkGrayTwo} inset !important;
    -webkit-box-shadow: 0 0 0px 1000px ${colors.darkGrayTwo} inset !important;

    border: 1px solid rgba(255,255,255,.08) !important;
    background-clip: padding-box !important;
  }
`;



/* =========================================================
   Inputs
   ========================================================= */
export const Input = styled.input`
  width: ${({ $width, width }) => $width || width || '100%'};
  margin-left: ${({ $left, left }) => $left || left || '0px'};
  margin-bottom: ${({ $bottom, bottom }) => $bottom || bottom || '10px'};
  ${inputSkin}
`;

// Wrapper que deixa InputTel e InputCpf dark usando inputSkin
export const InputDarkWrapper = styled.div`
  input {
    ${inputSkin}
    width: 100%;
    margin-bottom: 10px;
  }

  /* Ajusta placeholder também */
  input::placeholder {
    color: rgba(255,255,255,.45);
  }
`;


export const Select = styled.select`
  width: ${({ $width, width }) => $width || width || '100%'};
  height: ${({ $height, height }) => $height || height || '33px'};
  margin-left: ${({ $left, left }) => $left || left || '0px'};
  margin-bottom: ${({ $bottom, bottom }) => $bottom || bottom || '10px'};
  padding-left: 10px;
  padding-right: 10px;
  color: ${colors.silver};
  background: ${colors.darkGrayTwo};
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 3px;
  outline: none;
  transition: border-color .15s ease, box-shadow .15s ease;

  &:focus {
    border-color: ${colors.orange};
    box-shadow: 0 0 0 3px rgba(255,153,0,.15);
  }
`;

export const InputHora = styled.input.attrs({
  type: 'text',
  maxLength: 5,
  placeholder: '00:00'
})`
  width: ${({ $width, width }) => $width || width || '100%'};
  margin-left: ${({ $left, left }) => $left || left || '0px'};
  margin-bottom: ${({ $bottom, bottom }) => $bottom || bottom || '10px'};
  ${inputSkin};
`;

/* =========================================================
   Botões
   ========================================================= */
export const Button = styled.button`
  display: flex;
  flex-direction: ${({ $direction, direction }) => $direction || direction || 'row'};
  justify-content: center;
  align-items: center;
  width: ${({ $width, width }) => $width || width || 'auto'};
  height: ${({ $height, height }) => $height || height || '33px'};
  background-color: ${({ $color, color }) => $color || color || colors.orange};
  color: ${colors.silver};
  padding: 10px;
  margin-top: ${({ $top, top }) => $top || top || '0px'};
  margin-bottom: ${({ $bottom, bottom }) => $bottom || bottom || '0px'};
  margin-right: ${({ $right, right }) => $right || right || '0px'};
  margin-left: ${({ $left, left }) => $left || left || '0px'};
  border: none;
  border-radius: 3px;
  font-size: 14px;
  cursor: pointer;
  box-sizing: border-box;
`;

export const DefaultButton = styled.button`
  display: flex;
  width: ${({ $width, width }) => $width || width || 'auto'};
  height: ${({ $height, height }) => $height || height || '35px'};
  background-color: transparent;
  border-radius: 5px;
  margin-top: 15px;
  margin-bottom: 15px;
  align-items: center;
  justify-content: center;
  padding: 5px;
  margin-right: ${({ $right, right }) => $right || right || '20px'};
  border: none;
  cursor: pointer;
`;

/* =========================================================
   Revelação suave para CNH (se você usar)
   ========================================================= */
export const SmoothReveal = styled.div`
  overflow: hidden;
  max-height: ${({ open }) => (open ? '1000px' : '0')};
  opacity: ${({ open }) => (open ? 1 : 0)};
  transform: translateY(${({ open }) => (open ? '0' : '-6px')});
  transition: max-height .35s ease, opacity .25s ease, transform .25s ease;
`;
