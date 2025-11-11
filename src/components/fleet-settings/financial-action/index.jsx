// src/components/fleet-settings/financial/index.jsx
import React from 'react';
import {
  ModalAreaTotalDisplay,
  ModalAreaInfo,
  Topbar,
  TopbarHeader,
  TopbarLeft,
  TopbarRight,
  Brand,
  CompanyName,
  Divider,
  ContentArea,
  StatsGrid,
  StatCard,
  StatTitle,
  StatValue,
  ChartsGrid,
  ChartPanel,
  SectionTitle
} from './styles';

import { FaMoneyBillWave } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';

/**
 * Página principal do módulo Financeiro (Fleet Business)
 * @param {function} closeFinanceiro - função para fechar a página
 * @param {string} empresaId - ID da empresa
 * @param {string} empresaNome - Nome da empresa
 */
function FinanceiroClient({ closeFinanceiro, empresaId, empresaNome }) {
  return (
    <ModalAreaTotalDisplay onClick={closeFinanceiro}>
      <ModalAreaInfo onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <Topbar>
          <TopbarHeader>
            <TopbarLeft>
              <FaMoneyBillWave size={20} />
              <Brand>Financeiro</Brand>
              <CompanyName title={empresaNome}>• {empresaNome || '—'}</CompanyName>
            </TopbarLeft>

            <TopbarRight>
              <IoClose
                size={24}
                style={{ cursor: 'pointer' }}
                onClick={closeFinanceiro}
                title="Fechar"
              />
            </TopbarRight>
          </TopbarHeader>

          <Divider />
        </Topbar>

        {/* Conteúdo */}
        <ContentArea>
          {/* Resumo Financeiro */}
          <StatsGrid>
            <StatCard>
              <StatTitle>Receitas (mês)</StatTitle>
              <StatValue>R$ 0,00</StatValue>
            </StatCard>
            <StatCard>
              <StatTitle>Despesas (mês)</StatTitle>
              <StatValue>R$ 0,00</StatValue>
            </StatCard>
            <StatCard>
              <StatTitle>Saldo (mês)</StatTitle>
              <StatValue>R$ 0,00</StatValue>
            </StatCard>
            <StatCard>
              <StatTitle>Faturas em aberto</StatTitle>
              <StatValue>0</StatValue>
            </StatCard>
          </StatsGrid>

          {/* Painéis / Gráficos */}
          <ChartsGrid>
            <ChartPanel>
              <SectionTitle>Fluxo de caixa (últimos 6 meses)</SectionTitle>
              {/* placeholder para gráfico */}
            </ChartPanel>

            <ChartPanel>
              <SectionTitle>Despesas por categoria</SectionTitle>
              {/* placeholder para gráfico */}
            </ChartPanel>

            <ChartPanel>
              <SectionTitle>Receitas por origem</SectionTitle>
              {/* placeholder para gráfico */}
            </ChartPanel>

            <ChartPanel>
              <SectionTitle>Projeção de saldo</SectionTitle>
              {/* placeholder para gráfico */}
            </ChartPanel>
          </ChartsGrid>
        </ContentArea>
      </ModalAreaInfo>
    </ModalAreaTotalDisplay>
  );
}

export default FinanceiroClient;
