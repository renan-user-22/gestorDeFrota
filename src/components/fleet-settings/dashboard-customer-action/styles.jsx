import styled from 'styled-components';
import { colors } from '../../../theme';

/* Overlay modal full screen */
export const ModalAreaTotalDisplay = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(0,0,0,.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

/* Área interna do dashboard */
export const ModalAreaInfo = styled.div`
  background: ${colors.darkGray};
  width: 100%;
  height: 100vh;
  overflow: auto;

  &::-webkit-scrollbar { width: 6px; height: 6px; }
  &::-webkit-scrollbar-thumb { background: ${colors.orange}; border-radius: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
`;

/* Topbar / header preto com bordas arredondadas (como no print) */
export const Topbar = styled.div`
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: ${colors.black};
  border-radius: 10px;
  margin: 12px;
  padding: 10px 14px;
`;

export const CompanyName = styled.span`
  margin-left: 10px;
  color: ${colors.silver};
  font-size: 14px;
  opacity: .85;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 40vw;

  @media (max-width: 980px) {
    max-width: 50vw;
  }
`;

export const TopbarHeader = styled.div`
  display: grid;
  height: 100%;
  grid-template-columns: 1fr 40px;
  align-items: center;
  gap: 10px;
`;

export const TopbarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${colors.silver};
  font-weight: 700;
`;

export const Brand = styled.span`
  font-size: 16px;
`;

export const TopbarRight = styled.div`
  display: flex;
  justify-content: flex-end;
  color: ${colors.silver};
`;


/* Área principal */
export const ContentArea = styled.div`
  padding: 12px;
`;

/* ====== Utilitários comuns às abas ====== */
export const Panel = styled.div`
  background: ${colors.black};
  border-radius: 10px;
  padding: 16px;
`;

/* Grid dos cards de métricas (4 colunas no desktop) */
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  margin: 12px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

/* Card métrico */
export const StatCard = styled(Panel)`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 88px;
`;

export const StatTitle = styled.div`
  color: ${colors.silver};
  font-size: 13px;
`;

export const StatValue = styled.div`
  color: ${colors.silver};
  font-size: 26px;
  line-height: 1.15;
  font-weight: 700;
`;

/* Grid de gráficos (2 colunas) */
export const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin: 18px 12px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

export const ChartPanel = styled(Panel)`
  min-height: 260px;
`;

/* Título simples dentro dos painéis */
export const SectionTitle = styled.div`
  color: ${colors.silver};
  font-size: 14px;
  margin-bottom: 8px;
  font-weight: 600;
`;

export const Divider = styled.div`
  height: 2px;
  background: ${colors.darkGrayTwo};
  margin: 10px 0 8px;
  border-radius: 2px;
`;

export const Tabs = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  justify-content: space-around; /* espalha como no print */
  gap: 28px;
`;

export const TabBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: ${({ $active }) => ($active ? colors.orange : colors.silver)};
  border: none;
  cursor: pointer;
  font-size: 15px;
  padding: 6px 8px;
  border-radius: 8px;
  transition: color .15s ease, background .15s ease, transform .08s ease;
  &:hover { color: ${colors.orange}; background: rgba(255,255,255,0.04); }
  &:active { transform: scale(0.98); }
`;
