import React from 'react';
import {
  StatsGrid, StatCard, StatTitle, StatValue,
  ChartsGrid, ChartPanel, SectionTitle
} from '../styles';

const Geral = ({ empresaId, empresaNome }) => {
  return (
    <>
      {/* Cards */}
      <StatsGrid>
        <StatCard>
          <StatTitle>Empresas</StatTitle>
          <StatValue>0</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Veículos</StatTitle>
          <StatValue>0</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Motoristas</StatTitle>
          <StatValue>0</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Multas</StatTitle>
          <StatValue>0</StatValue>
        </StatCard>
      </StatsGrid>

      {/* Grids de gráficos */}
      <ChartsGrid>
        <ChartPanel>
          <SectionTitle>Veículos por tipo:</SectionTitle>
          {/* placeholder do gráfico */}
        </ChartPanel>

        <ChartPanel>
          <SectionTitle>Licenciamento dos Veículos (Ano):</SectionTitle>
          {/* placeholder do gráfico */}
        </ChartPanel>

        <ChartPanel>
          <SectionTitle>Infrações por tipo (Gravíssima, Grave, Média, Leve):</SectionTitle>
          {/* placeholder do gráfico */}
        </ChartPanel>

        <ChartPanel>
          <SectionTitle>Multas por Status:</SectionTitle>
          {/* placeholder do gráfico */}
        </ChartPanel>
      </ChartsGrid>
    </>
  );
};

export default Geral;
