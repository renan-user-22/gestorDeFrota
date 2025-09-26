import styled, { createGlobalStyle } from 'styled-components';
import { colors } from '../../theme';

/* ===== Layout base da página ===== */
export const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  background-color: ${colors.darkGray};
  overflow: hidden;
  font-family: 'Octosquares Extra Light', sans-serif;
`;

/* Botão padrão com transient props */
export const DefaultButton = styled.button`
  display: inline-flex;
  width: ${p => p.$width || '150px'};
  height: ${p => p.$height || '35px'};
  background-color: ${colors.orange};
  color: ${colors.silver};
  border-radius: 6px;
  margin-top: 15px;
  margin-bottom: 15px;
  align-items: center;
  justify-content: center;
  padding: 5px 10px;
  margin-right: ${p => p.$right || '20px'};
  border: none;
  cursor: pointer;
  font-family: 'Octosquares Extra Light', sans-serif;
  transition: filter .2s ease, transform .08s ease;
  &:hover { filter: brightness(1.08); }
  &:active { transform: scale(0.98); }
`;

/* Input padrão com transient props */
export const Input = styled.input`
  width: ${p => p.$width || '260px'};
  background-color: ${colors.silver};
  margin-left: ${p => p.$left || '0px'};
  height: 32px;
  color: ${colors.black};
  padding: 0 10px;
  border: 1px solid ${colors.darkGrayTwo};
  font-size: 13px;
  border-radius: 6px;
  font-family: 'Octosquares Extra Light', sans-serif;
`;

/* ====== TABELA ====== */
export const EmpresasTableWrapper = styled.div`
  width: 95%;
  overflow-x: auto;
  border-radius: 5px;
  margin-top: 10px;
  padding-bottom: 20px;

  &::-webkit-scrollbar { height: 6px; width: 6px; }
  &::-webkit-scrollbar-thumb { background: ${colors.orange}; border-radius: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
`;

export const EmpresasTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: auto; /* <-- antes estava fixed */
  font-family: 'Octosquares Extra Light', sans-serif;
  color: ${colors.silver};
  font-size: 13px;
`;

export const EmpresasThead = styled.thead`
  background: ${colors.orange};
`;

export const EmpresasTh = styled.th`
  padding: 10px 12px;
  text-align: center;
  vertical-align: middle;
  border: none;
  font-weight: 700;
`;

export const EmpresasTr = styled.tr`
  background: ${colors.black};
  border-bottom: 1px solid ${colors.darkGrayTwo};
`;

export const EmpresasTd = styled.td`
  padding: 10px 12px;
  text-align: center;
  vertical-align: middle;
  border: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/* Coluna de ações: sem corte (overflow visível p/ tooltip) e mais larga */
export const EmpresasActionsTd = styled(EmpresasTd)`
  white-space: nowrap;
  min-width: 420px;
  width: 1%;
  text-align: center;
  overflow: visible;      /* <— importante para tooltip não ser cortado */
  position: relative;
`;

/* Wrapper dos botões */
export const AcoesWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center; /* alinhado à esquerda */
  gap: 10px;
  flex-wrap: nowrap;           /* <-- impede quebra */
  width: 100%;
`;
/* Botão de ação com tooltip custom (usa aria-label) */
export const AcaoBtn = styled.button`
  position: relative;
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${colors.orange};
  color: ${colors.silver};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform .08s ease, filter .2s ease;
  &:hover { filter: brightness(1.08); }
  &:active { transform: scale(0.97); }

  /* Tooltip */
  &::after {
    content: attr(aria-label);
    position: absolute;
    left: 50%;
    bottom: calc(100% + 8px);
    transform: translateX(-50%) translateY(4px);
    background: ${colors.black};
    color: ${colors.silver};
    padding: 6px 10px;
    border-radius: 6px;
    font-size: 12px;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity .15s ease, transform .15s ease;
    box-shadow: 0 6px 18px rgba(0,0,0,.35);
    z-index: 50;
  }

  /* setinha do tooltip */
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    bottom: calc(100% + 4px);
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: ${colors.black};
    opacity: 0;
    transition: opacity .15s ease;
    z-index: 49;
  }

  &:hover::after, &:focus-visible::after {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  &:hover::before, &:focus-visible::before {
    opacity: 1;
  }
`;
