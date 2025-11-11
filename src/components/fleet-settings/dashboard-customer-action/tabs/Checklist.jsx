import React from 'react';
import { StatsGrid, StatCard, StatTitle, StatValue, ChartsGrid, ChartPanel, SectionTitle } from '../styles';

const Checklist = ({ empresaId }) => {
  return (
    <>
      <StatsGrid>
        <StatCard><StatTitle>Checklists no mês</StatTitle><StatValue>0</StatValue></StatCard>
        <StatCard><StatTitle>Itens aprovados</StatTitle><StatValue>0</StatValue></StatCard>
        <StatCard><StatTitle>Itens reprovados</StatTitle><StatValue>0</StatValue></StatCard>
        <StatCard><StatTitle>Manutenções geradas</StatTitle><StatValue>0</StatValue></StatCard>
      </StatsGrid>

      <ChartsGrid>
        <ChartPanel><SectionTitle>Aprovações vs Reprovações</SectionTitle></ChartPanel>
        <ChartPanel><SectionTitle>Top 5 itens críticos</SectionTitle></ChartPanel>
      </ChartsGrid>
    </>
  );
};

export default Checklist;
