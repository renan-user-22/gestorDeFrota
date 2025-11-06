import styled, { createGlobalStyle, css } from 'styled-components';
import { colors } from '../../../theme';

import InputCnpj from '../../inputs/InputCNPJ';
import InputTel from '../../inputs/InputTelefone';

/* =========================================================
   Swal
   ========================================================= */
export const SwalCustomStyles = createGlobalStyle`
  .swal-custom-popup {
    background-color: ${colors.darkGrayTwo};
    font-family: 'Octosquares Extra Light';
    border-radius: 5px;
  }

  .swal-custom-title {
    font-size: 15px;
    color: ${colors.silver} !important;
  }

  .swal-custom-text {
    color: ${colors.silver};
    font-family: 'Octosquares Extra Light';
  }

  .swal-custom-confirm {
    background-color: ${colors.orange} !important;
    color: ${colors.silver} !important;
    font-family: 'Octosquares Extra Light';
    border-radius: 5px;
  }

  .swal-custom-cancel {
    background-color: ${colors.black} !important;
    color: ${colors.silver} !important;
    font-family: 'Octosquares Extra Light';
    border-radius: 5px;
  }

  .swal2-icon.swal2-warning {
    border-color: ${colors.orange} !important;
    color: ${colors.orange} !important;
  }
`;

/* =========================================================
   Containers e wrappers
   ========================================================= */
export const ListaEmpresasWrapper = styled.div`
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px;
  overflow-y: auto;
  height: 95%;

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

export const ModalAreaTotalDisplay = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
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
   Controles básicos
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
`;

export const Input = styled.input`
  width: ${({ $width, width }) => $width || width || 'auto'};
  margin-left: ${({ $left, left }) => $left || left || '0px'};
  margin-bottom: ${({ $bottom, bottom }) => $bottom || bottom || '0'};
  ${inputSkin}
`;

export const InputCnpjDark = styled(({ className, ...props }) => (
  <div className={className}>
    <InputCnpj {...props} />
  </div>
))`
  width: ${({ $width, width }) => $width || width || 'auto'};
  margin-left: ${({ $left, left }) => $left || left || '0px'};
  margin-bottom: ${({ $bottom, bottom }) => $bottom || bottom || '0'};

  & input {
    ${inputSkin}
    width: 100%;
    height: ${({ $height, height }) => $height || height || '30px'};
  }
`;

export const InputTelDark = styled(({ className, ...props }) => (
  <div className={className}>
    <InputTel {...props} />
  </div>
))`
  width: ${({ $width, width }) => $width || width || 'auto'};
  margin-left: ${({ $left, left }) => $left || left || '0px'};
  margin-bottom: ${({ $bottom, bottom }) => $bottom || bottom || '0'};

  & input {
    ${inputSkin}
    width: 100%;
    height: ${({ $height, height }) => $height || height || '30px'};
  }
`;

export const Select = styled.select`
  width: ${({ $width, width }) => $width || width || 'auto'};
  height: ${({ $height, height }) => $height || height || '33px'};
  padding-left: 10px;
  padding-right: 10px;
  color: ${colors.silver};
  background: ${colors.darkGrayTwo};
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 3px;
  outline: none;
  transition: border-color .15s ease, box-shadow .15s ease;
  margin-bottom: ${({ $bottom, bottom }) => $bottom || bottom || '10px'};

  &:focus {
    border-color: ${colors.orange};
    box-shadow: 0 0 0 3px rgba(255, 153, 0, .15);
  }
`;

export const Button = styled.button`
  display: flex;
  flex-direction: ${({ $direction, direction }) => $direction || direction || 'row'};
  justify-content: center;
  align-items: center;
  gap: ${({ $gap, gap }) => $gap || gap || '0'};
  width: ${({ $width, width }) => $width || width || 'auto'};
  height: ${({ $height, height }) => $height || height || '33px'};
  background-color: ${({ $color, color }) => $color || color || colors.orange};
  color: ${colors.silver};
  padding: 10px;
  margin-top: ${({ $top, top }) => $top || top || '0px'};
  margin-right: ${({ $right, right }) => $right || right || '0px'};
  margin-left: ${({ $left, left }) => $left || left || '0px'};
  margin-bottom: ${({ $bottom, bottom }) => $bottom || bottom || '0'};
  border: none;
  border-radius: 3px;
  font-size: 14px;
  cursor: pointer;
  box-sizing: border-box;
`;

export const DefaultButton = styled.button`
  display: flex;
  align-items: center;
  background-color: transparent;
  height: auto;
  padding: 10px;
  border: none;
  cursor: pointer;
`;

/* =========================================================
   Indicador de Steps
   ========================================================= */
export const StepIndicator = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 20px;
`;

export const Dot = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== '$active',
})`
  width: 47px;
  height: 4px;
  border-radius: 2px;
  background-color: ${({ $active }) => ($active ? colors.orange : colors.silver)};
  transition: background-color 0.3s ease;
`;

/* =========================================================
   Modais e listas (genéricos para Bases)
   ========================================================= */
export const BaseModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const BaseModalContent = styled.div`
  width: 70%;
  height: 70vh;
  background: ${colors.darkGrayTwo};
  padding: 20px;
  border-radius: 3px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

export const BaseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 15px 0;
`;

export const BaseItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${colors.darkGray};
  padding: 8px 12px;
  border-radius: 6px;
  color: ${colors.silver};
  font-size: 14px;
`;

export const RemoveButton = styled.button`
  background-color: ${({ $color, color }) => $color || color || 'transparent'};
  color: white;
  border: none;
  padding: 5px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
`;

/* =========================================================
   InputHora
   ========================================================= */
export const InputHora = styled.input.attrs({
  type: 'text',
  maxLength: 5,
  placeholder: '00:00'
})`
  width: ${({ $width, width }) => $width || width || '100%'};
  margin-left: ${({ $left, left }) => $left || left || '0px'};
  height: ${({ $height, height }) => $height || height || '30px'};
  padding-left: 10px;
  border: 1px solid ${colors.silver};
  font-size: 14px;
  margin-bottom: ${({ $bottom, bottom }) => $bottom || bottom || '10px'};
  border-radius: 3px;
  background: ${colors.silver};
  color: ${colors.black};

  &::placeholder {
    color: ${colors.silver};
    opacity: 0.6;
  }
`;

/* =========================================================
   Switch
   ========================================================= */
export const Switch = styled.label`
   position: relative;
   display: inline-block;
   width: ${({ $width, width }) => $width || width || '42px'};
   height: ${({ $height, height }) => $height || height || '24px'};
 
   input {
     position: absolute;
     opacity: 0;
     width: 0;
     height: 0;
     pointer-events: none;
   }
 
   span {
     position: absolute;
     inset: 0;
     border-radius: 999px;
     background-color: ${colors.darkGrayTwo};
     transition: background-color .25s ease;
     box-shadow: inset 0 0 0 1px rgba(255,255,255,.08);
   }
 
   span::before {
     content: '';
     position: absolute;
     top: 3px;
     left: 3px;
     width: calc(${({ $height, height }) => $height || height || '24px'} - 6px);
     height: calc(${({ $height, height }) => $height || height || '24px'} - 6px);
     border-radius: 50%;
     background-color: #fff;
     transition: transform .25s ease;
     will-change: transform;
   }
 
   input:checked + span {
     background-color: ${colors.orange};
   }
   input:checked + span::before {
     transform: translateX(calc(((${({ $width, width }) => $width || width || '42px'}) - (${({ $height, height }) => $height || height || '24px'})) ));
   }
 
   input:focus + span {
     outline: 2px solid ${colors.orange};
     outline-offset: 2px;
   }
 `;
