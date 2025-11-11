import React from 'react';
import { StatsGrid, StatCard, StatTitle, StatValue, ChartsGrid, ChartPanel, SectionTitle } from '../styles';

const Multas = ({ empresaId }) => {
  return (
    <>
      <StatsGrid>
        <StatCard><StatTitle>Multas no mês</StatTitle><StatValue>0</StatValue></StatCard>
        <StatCard><StatTitle>Valor total</StatTitle><StatValue>R$ 0,00</StatValue></StatCard>
        <StatCard><StatTitle>Pagas</StatTitle><StatValue>0</StatValue></StatCard>
        <StatCard><StatTitle>Em recurso</StatTitle><StatValue>0</StatValue></StatCard>
      </StatsGrid>

      <ChartsGrid>
        <ChartPanel><SectionTitle>Multas por gravidade</SectionTitle></ChartPanel>
        <ChartPanel><SectionTitle>Status das multas</SectionTitle></ChartPanel>
      </ChartsGrid>
    </>
  );
};

export default Multas;
