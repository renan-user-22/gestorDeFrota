import React from 'react';
import { StatsGrid, StatCard, StatTitle, StatValue, ChartsGrid, ChartPanel, SectionTitle } from '../styles';

const Abastecimento = ({ empresaId }) => {
  return (
    <>
      <StatsGrid>
        <StatCard><StatTitle>Litros no mês</StatTitle><StatValue>0</StatValue></StatCard>
        <StatCard><StatTitle>Custo total</StatTitle><StatValue>R$ 0,00</StatValue></StatCard>
        <StatCard><StatTitle>Média R$/L</StatTitle><StatValue>0,00</StatValue></StatCard>
        <StatCard><StatTitle>KM/L (média)</StatTitle><StatValue>0,0</StatValue></StatCard>
      </StatsGrid>

      <ChartsGrid>
        <ChartPanel><SectionTitle>Consumo por veículo</SectionTitle></ChartPanel>
        <ChartPanel><SectionTitle>Gasto por mês</SectionTitle></ChartPanel>
      </ChartsGrid>
    </>
  );
};

export default Abastecimento;
