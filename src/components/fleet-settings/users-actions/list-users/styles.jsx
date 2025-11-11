// src/components/fleet-settings/users-actions/list-users/styles.jsx
import styled, { createGlobalStyle, css } from 'styled-components';
import { colors } from '../../../../theme';
import { TextDefault as BaseText } from '../../../../stylesAppDefault';

/* ===== Mixin: Scrollbar bonito ===== */
const prettyScrollbar = css`
  scrollbar-width: thin;
  scrollbar-color: ${colors.orange} transparent;

  &::-webkit-scrollbar { width: 10px; }
  &::-webkit-scrollbar-track {
    background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, ${colors.darkGrayTwo}, ${colors.black});
    border-radius: 10px;
    border: 2px solid ${colors.black};
  }
  &::-webkit-scrollbar-thumb:hover {
    background: ${colors.orange};
    border-color: ${colors.black};
  }
`;

/* ===== SweetAlert + Detalhes ===== */
export const SweetAlertStyles = createGlobalStyle`
  .swal2-title,
  .swal2-html-container,
  .swal2-actions .swal2-confirm,
  .swal2-actions .swal2-cancel {
    color: ${colors.silver} !important;
    font-family: 'Octosquares Extra Light', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  }
  .swal2-actions .swal2-confirm { background-color: ${colors.orange} !important; border-radius: 6px !important; }
  .swal2-actions .swal2-cancel { background-color: ${colors.black} !important; border-radius: 6px !important; }
  .swal2-icon.swal2-warning { border-color: ${colors.orange} !important; color: ${colors.orange} !important; }

  .user-details { text-align: left; font-size: 13px; line-height: 1.4; color: ${colors.silver}; }
  .user-details .row { display: flex; justify-content: space-between; gap: 12px; margin: 6px 0; }
  .user-details .row strong { opacity: .85; }
`;

/* ===== Overlay ===== */
export const ModalAreaTotalDisplay = styled.div`
  position: absolute; inset: 0;
  background-color: rgba(0,0,0,.5);
  display: flex; justify-content: center; align-items: center;
  z-index: 999;
`;

export const ModalAreaInfo = styled.div`
  background-color: ${colors.darkGray};
  padding: 30px; width: 100%; height: 100vh; overflow-y: auto;
  ${prettyScrollbar};
`;

/* ===== Botões base ===== */
export const Button = styled.button`
  display: flex;
  width: ${(p) => p.$width || 'auto'};
  height: 33px;
  flex-direction: ${(p) => p.$direction || 'row'};
  justify-content: center;
  align-items: center;
  font-family: 'Octosquares Extra Light';
  background-color: ${(p) => p.$color || colors.orange};
  padding: 20px;
  margin: ${(p) => `${p.$top || '0px'} ${p.$right || '0px'} ${p.$bottom || '0px'} ${p.$left || '0px'}`};
  color: ${colors.silver};
  border: none; border-radius: 3px;
  font-size: 14px; cursor: pointer; box-sizing: border-box;
`;

export const DefaultButton = styled.button`
  display: flex;
  width: ${(p) => p.$width || '150px'};
  height: ${(p) => p.$height || '35px'};
  background-color: ${colors.orange};
  border-radius: 3px;
  margin: 15px ${(p) => p.$right || '20px'} 15px 0;
  align-items: center; justify-content: center;
  padding: 5px; border: none; cursor: pointer; color: ${colors.silver};
`;

/* ===== Tabela ===== */
export const TableWrapper = styled.div`
  overflow-x: auto; margin-top: 20px;
`;

export const Table = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: separate;
  border-spacing: 0;
`;

export const THead = styled.thead``;
export const TBody = styled.tbody``;
export const TR = styled.tr``;

export const HeaderText = styled(BaseText)`
  text-align: center; width: 100%; margin: 0;
`;
export const TableText = styled(BaseText)`
  text-align: center; width: 100%; margin: 0;
`;

export const TH = styled.th`
  height: 44px; /* antes era 44px */
  padding: 0 10px;
  background-color: ${colors.orange};
  border-bottom: 2px solid ${colors.orange};
  &:first-child { border-top-left-radius: 5px; }
  &:last-child  { border-top-right-radius: 5px; }
`;

export const TD = styled.td`
  height: 70px; /* antes era 44px */
  padding: 0 10px;
  border-bottom: 1px solid ${colors.darkGrayTwo};
`;


/* ===== Ações ===== */
/* usa prop transitória $danger para não vazar pro DOM */
export const Actions = styled.div`
  display: flex; gap: 8px; align-items: center; justify-content: center;
`;
export const IconButton = styled.button`
  width: 32px; height: 32px; border: 0; border-radius: 6px;
  display: grid; place-items: center;
  background: ${({ $danger }) => ($danger ? '#2b2b2b' : '#1f1f1f')};
  color: ${({ $danger }) => ($danger ? colors.orange : colors.silver)};
  cursor: pointer; transition: transform .1s ease, opacity .15s ease, background .2s ease; outline: none;
  &:hover { transform: translateY(-1px); opacity: .95; }
  &:active { transform: translateY(0); opacity: .9; }
`;

/* ===== Modal Cargos ===== */
export const Backdrop = styled.div`
  position: fixed; inset: 0; background-color: rgba(0,0,0,.5);
  display: flex; justify-content: center; align-items: center; z-index: 1001;
`;

export const CargoModal = styled.div`
  background: ${colors.darkGray};
  border-radius: 5px;
  width: min(580px, 95vw);
  max-height: 85vh;
  overflow-y: auto;
  padding: 16px 12px 16px 16px;
  box-shadow: 0 12px 36px rgba(0,0,0,.45);
  ${prettyScrollbar};
`;

export const ModalHeader = styled.div`
  display: grid; grid-template-columns: 1fr 40px; align-items: center; margin-bottom: 8px;
`;

export const CloseIconBtn = styled.button`
  background: transparent; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
`;

export const TabsBar = styled.div`
  display: flex; gap: 10px; background: ${colors.black}; border-radius: 10px; padding: 6px; margin-bottom: 10px;
`;

/* usa prop transitória $active */
export const TabButton = styled.button`
  flex: 1; height: 36px; border-radius: 8px; border: none; cursor: pointer;
  color: ${({ $active }) => ($active ? colors.orange : colors.silver)};
  background: ${({ $active }) => ($active ? 'rgba(255,255,255,0.06)' : 'transparent')};
  font-family: 'Octosquares Extra Light';
`;

export const Divider = styled.div`
  height: 2px; background: ${colors.darkGrayTwo}; border-radius: 2px; margin-bottom: 12px;
`;

export const FormGrid = styled.div` display: grid; gap: 10px; `;
export const Label = styled.label` color: ${colors.silver}; font-size: 13px; `;
export const TextInput = styled.input`
  background: ${colors.silver}; color: ${colors.black};
  border: 1px solid ${colors.darkGrayTwo}; border-radius: 8px;
  height: 34px; padding: 0 10px; font-size: 13px;
`;
export const SelectInput = styled.select`
  background: ${colors.silver}; color: ${colors.black};
  border: 1px solid ${colors.darkGrayTwo}; border-radius: 8px;
  height: 34px; padding: 0 10px; font-size: 13px;
`;
export const Option = styled.option``;

/* sem <div> pura */
export const FieldGroup = styled.div` display: grid; gap: 6px; `;

export const ButtonsRow = styled.div`
  display: flex; justify-content: flex-end; gap: 10px; margin-top: 12px;
`;
export const ButtonsRowStart = styled(ButtonsRow)`
  justify-content: flex-start;
`;

export const ScrollableList = styled.div`
  margin-top: 4px; max-height: 360px; overflow: auto; padding-right: 8px;
  ${prettyScrollbar};
`;

export const CargoRow = styled.div`
  display: grid; grid-template-columns: 1fr auto; gap: 10px; padding: 10px 0;
  border-bottom: 1px solid ${colors.darkGrayTwo};
`;

export const CargoMain = styled.div` display: grid; gap: 6px; `;
export const Muted = styled.span` color: ${colors.silver}; font-size: 12px; opacity: .8; `;
export const Inline = styled.div` display: inline-flex; align-items: center; justify-content: center; padding: 6px; `;
export const EditInlineButton = styled.button`
  background: transparent; border: none; cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center; padding: 6px;
`;
