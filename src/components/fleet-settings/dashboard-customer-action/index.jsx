// components/fleet-settings/dashboard-customer/index.jsx
import React, { useState } from 'react';
import {
  ModalAreaTotalDisplay,
  ModalAreaInfo,
  Topbar,
  TopbarHeader,
  TopbarLeft,
  TopbarRight,
  Brand,
  CompanyName,   // ⬅️ NOVO
  Divider,
  Tabs,
  TabBtn,
  ContentArea
} from './styles';

import { LuLayoutDashboard } from 'react-icons/lu';
import { TbGridDots } from 'react-icons/tb';
import { FaGasPump, FaMoneyBillWave } from 'react-icons/fa6'; // ⬅️ NOVO ícone Financeiro
import { LuListChecks } from 'react-icons/lu';
import { FaGavel } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

import Geral from './tabs/Geral';
import Financeiro from './tabs/Financeiro';
import Abastecimento from './tabs/Abastecimento';
import Checklist from './tabs/Checklist';
import Multas from './tabs/Multas';

function DashboardClient({ closeDashboard, empresaId, empresaNome }) {
  const [tab, setTab] = useState('geral');

  const renderTab = () => {
    switch (tab) {
      case 'abastecimento': return <Abastecimento empresaId={empresaId} empresaNome={empresaNome} />;
      case 'financeiro': return <Financeiro empresaId={empresaId} empresaNome={empresaNome} />;
      case 'checklist': return <Checklist empresaId={empresaId} empresaNome={empresaNome} />;
      case 'multas': return <Multas empresaId={empresaId} empresaNome={empresaNome} />;
      default: return <Geral empresaId={empresaId} empresaNome={empresaNome} />;
    }
  };

  return (
    <ModalAreaTotalDisplay onClick={closeDashboard}>
      <ModalAreaInfo onClick={(e) => e.stopPropagation()}>
        <Topbar>
          <TopbarHeader>
            <TopbarLeft>
              <LuLayoutDashboard size={20} />
              <Brand>Dashboard</Brand>
              {/* ⬇️ Nome da empresa ao lado do título */}
              <CompanyName title={empresaNome}>• {empresaNome || '—'}</CompanyName>
            </TopbarLeft>
            <TopbarRight>
              <IoClose
                size={24}
                style={{ cursor: 'pointer' }}
                onClick={closeDashboard}
                title="Fechar"
              />
            </TopbarRight>
          </TopbarHeader>

          <Divider />

          <Tabs>
            <TabBtn $active={tab === 'geral'} onClick={() => setTab('geral')}>
              <TbGridDots size={18} />
              <span>Geral</span>
            </TabBtn>

            {/* ⬇️ Financeiro com ícone de dinheiro */}
            <TabBtn $active={tab === 'financeiro'} onClick={() => setTab('financeiro')}>
              <FaMoneyBillWave size={18} />
              <span>Financeiro</span>
            </TabBtn>

            <TabBtn $active={tab === 'abastecimento'} onClick={() => setTab('abastecimento')}>
              <FaGasPump size={18} />
              <span>Abastecimento</span>
            </TabBtn>

            <TabBtn $active={tab === 'checklist'} onClick={() => setTab('checklist')}>
              <LuListChecks size={18} />
              <span>Checklist</span>
            </TabBtn>

            <TabBtn $active={tab === 'multas'} onClick={() => setTab('multas')}>
              <FaGavel size={18} />
              <span>Multas</span>
            </TabBtn>
          </Tabs>
        </Topbar>

        <ContentArea>{renderTab()}</ContentArea>
      </ModalAreaInfo>
    </ModalAreaTotalDisplay>
  );
}

export default DashboardClient;
