// components/fleet-settings/dashboard-customer/tabs/Financeiro.jsx
import React from 'react';
import {
  StatsGrid, StatCard, StatTitle, StatValue,
  ChartsGrid, ChartPanel, SectionTitle
} from '../styles';

const Financeiro = ({ empresaId, empresaNome }) => {
  return (
    <>
      {/* Cards de resumo financeiro */}
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

      {/* Painéis / gráficos */}
      <ChartsGrid>
        <ChartPanel>
          <SectionTitle>Fluxo de caixa (últimos 6 meses)</SectionTitle>
          {/* placeholder para gráfico de linha/área */}
        </ChartPanel>

        <ChartPanel>
          <SectionTitle>Despesas por categoria</SectionTitle>
          {/* placeholder para gráfico de pizza/barras */}
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
    </>
  );
};

export default Financeiro;
