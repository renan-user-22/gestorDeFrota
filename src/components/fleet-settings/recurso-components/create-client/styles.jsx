import styled, { css } from 'styled-components';
import { colors } from '../../../../theme';

import InputDate from '../../../inputs/formatDate';
import InputDin from '../../../inputs/InputValorReais';
import InputCpf from '../../../inputs/formatCPF';
import InputTel from '../../../inputs/InputTelefone';

/* ===== Layout base do modal ===== */
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  max-width: 100%;
  height: 100vh;

  background-color: ${colors.darkGray};
  font-family: 'Octosquares Extra Light', sans-serif;

  overflow-y: auto;
  overflow-x: hidden;

`;


/* ===== Skin uniformizado para TODOS os inputs ===== */
const inputSkin = css`
  height: 40px; /* 🔥 ALTURA UNIFICADA */
  padding-left: 10px;
  color: ${colors.silver};
  background: ${colors.darkGrayTwo};
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 6px;
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

/* ===== Input padrão ===== */
export const Input = styled.input`
  width: ${({ width }) => width || 'auto'};
  ${inputSkin};
  height: 40px !important;       /* 🔥 altura igual a todos */
  line-height: 40px !important;   /* 🔥 corrige centralização */
`;

/* ===== Input de senha com toggle ===== */
export const PasswordWrapper = styled.div`
  width: ${({ width }) => width || 'auto'};
  position: relative;
  display: flex;
  align-items: center;
`;

export const PasswordInput = styled(Input)`
  width: 100%;
  padding-right: 40px; /* espaço pro ícone */
`;

export const TogglePasswordButton = styled.button`
  position: absolute;
  right: 10px;
  background: transparent;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  & svg {
    color: ${colors.orange};
    font-size: 18px;
  }
`;

/* ===== Input TEL DARK ===== */
export const InputTelDark = styled(({ className, ...props }) => (
  <div className={className}>
    <InputTel {...props} />
  </div>
))`
  width: ${({ width }) => width || 'auto'};
  display: flex;                 /* 🔥 resolve colagem */
  box-sizing: border-box;

  & input {
    ${inputSkin};
    width: 100%;
    height: 40px !important;
  }
`;

/* ===== Input CPF DARK ===== */
export const InputCpfDark = styled(({ className, ...props }) => (
  <div className={className}>
    <InputCpf {...props} />
  </div>
))`
  width: ${({ width }) => width || 'auto'};
  display: flex;                 /* 🔥 resolve colagem */
  box-sizing: border-box;

  & input {
    ${inputSkin};
    width: 100%;
    height: 40px !important;
  }
`;

/* ===== Input DATE DARK ===== */
export const InputDateDark = styled(({ className, ...props }) => (
  <div className={className}>
    <InputDate {...props} />
  </div>
))`
  width: ${({ width }) => width || 'auto'};
  display: flex;                 /* 🔥 resolve colagem */
  box-sizing: border-box;

  & input {
    ${inputSkin};
    width: 100%;
    height: 40px !important;
  }
`;

/* ===== Input VALOR (R$) DARK ===== */
export const InputValorDark = styled(({ className, ...props }) => (
  <div className={className}>
    <InputDin {...props} />
  </div>
))`
  width: ${({ width }) => width || 'auto'};
  display: flex;
  box-sizing: border-box;

  & input {
    ${inputSkin};
    width: 100%;
    height: 40px !important;
  }
`;


/* ===== Wrapper do botão de upload ===== */
export const UploadWrapper = styled.div`
  width: ${({ width }) => width || 'auto'};
  display: flex;
  align-items: stretch;   /* botão ocupa toda a altura */
`;

/* ===== Botão de upload de PDF ===== */
export const UploadButton = styled.button`
  width: 100%;            /* 🔥 ocupa toda a largura da coluna (20%) */
  height: 45px;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid ${colors.orange};
  background: transparent;
  color: ${colors.orange};
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;

  &:hover {
    background: ${colors.orange};
    color: #fff;
  }

  .upload-text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    line-height: 1.2;
  }

  .upload-label {
    font-size: 13px;
    font-weight: 500;
  }

  .upload-filename {
    font-size: 11px;
    color: rgba(255,255,255,.75);
  }
`;



