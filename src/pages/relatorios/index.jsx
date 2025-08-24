import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseConnection';
import { ref, onValue } from 'firebase/database';
import { motion, AnimatePresence } from 'framer-motion';
import { MdDashboard, MdLocalGasStation, MdChecklist, MdGavel } from 'react-icons/md';
import { IoMdNotifications } from "react-icons/io";
import { FaChartBar } from 'react-icons/fa';
import { TextDefault, Box } from '../../stylesAppDefault';
import { colors } from '../../theme';
import {
  Container,
  ListaEmpresasWrapper,
  TabButton,
  Underline,
  Dev,
  InfoGrid,
  InfoCard,
  ChartsWrapper,
  Button,
  DefaultButton
} from './styles';

//Importações de Modais:
import ModalNotifications from '../../components/pagesModais/Notifications';

//Tabs:
import DashboardGeral from './geral';
import DashboardAbastecimento from './abastecimento';
import DashboardChecklist from './checklist';
import DashboardMultas from './multas';

const tabs = [
  { key: "Geral", icon: <MdDashboard size={25} />, label: "Geral" },
  { key: "Abastecimento", icon: <MdLocalGasStation size={25} />, label: "Abastecimento" },
  { key: "Checklist", icon: <MdChecklist size={25} />, label: "Checklist" },
  { key: "Multas", icon: <MdGavel size={25} />, label: "Multas" }
];

const Dashboard = () => {

  const [activeTab, setActiveTab] = useState("Geral");
  const [empresas, setEmpresas] = useState({});
  const [notificacoesPrazos, setNotificacoesPrazos] = useState([]);

  //Ações de abrir e fechar Modais: 
  const [areaNotifications, setAreaNotifications] = useState(false);

  const openAreaNotifications = () => {
    setAreaNotifications(true);
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "Geral":
        return <DashboardGeral/>;
      case "Abastecimento":
        return <DashboardAbastecimento/>;
      case "Checklist":
        return <DashboardChecklist/>;
      case "Multas":
        return <DashboardMultas/>;
      default:
        return null;
    }
  };

  useEffect(() => {
    const listaEmpresas = Object.values(empresas);
    const hoje = new Date();
    const novasNotificacoes = [];

    listaEmpresas.forEach((empresa) => {
      const { multas = {}, motoristas = {} } = empresa;

      // Notificações de multas com prazos vencendo (10 dias)
      Object.values(multas).forEach((multa) => {
        const prazoParts = multa.prazos?.split('/');
        if (prazoParts?.length === 3) {
          const prazoDate = new Date(`${prazoParts[2]}-${prazoParts[1]}-${prazoParts[0]}`);
          const diffTime = prazoDate.getTime() - hoje.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays <= 10 && diffDays >= 0) {
            novasNotificacoes.push({
              tipo: 'prazoMulta',
              prazos: multa.prazos,
              diasRestantes: diffDays,
              numeroAIT: multa.numeroAIT,
              nomeMotorista: multa.nomeMotorista || 'Não identificado',
              status: multa.status,
              empresa: empresa.nome,
            });
          }
        }
      });

      // Notificações de CNH com validade vencendo (30 dias)
      Object.values(motoristas).forEach((motorista) => {
        const validadeParts = motorista.cnhValidade?.split('/');
        if (validadeParts?.length === 3) {
          const validadeDate = new Date(`${validadeParts[2]}-${validadeParts[1]}-${validadeParts[0]}`);
          const diffTime = validadeDate.getTime() - hoje.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays <= 30 && diffDays >= 0) {
            novasNotificacoes.push({
              tipo: 'validadeCNH',
              nomeMotorista: motorista.nome,
              cpf: motorista.cpf,
              telefone: motorista.telefone,
              cnhValidade: motorista.cnhValidade,
              diasRestantes: diffDays,
              empresa: empresa.nome,
            });
          }
        }
      });
    });

    setNotificacoesPrazos(novasNotificacoes);
  }, [empresas]);

  useEffect(() => {
    const empresasRef = ref(db, 'empresas');
    return onValue(empresasRef, snapshot => {
      const data = snapshot.val() || {};
      setEmpresas(data);
    });
  }, []);

  return (
    <Container>
      <ListaEmpresasWrapper>

        <Box
          width={'99%'}
          color={colors.black}
          direction="column"
          topSpace="10px"
          bottomSpace="10px"
          style={{ overflow: 'hidden' }}
        >
          {/* Header + Title */}
          <Box
            width="100%"
            height="60px"
            direction="row"
            align="center"
            paddingLeft="20px"
            paddingRight="20px"
            justify="space-between"
          >
            <Box direction="row" align="center">
              <FaChartBar size={27} color={colors.silver} />
              <TextDefault left={'10px'} color={colors.silver} weight="bold" size="17px">
                Dashboard
              </TextDefault>
            </Box>

            <DefaultButton onClick={openAreaNotifications} style={{ position: 'relative' }}>
              <IoMdNotifications size={'30px'} color={colors.silver} />
              {notificacoesPrazos.length > 0 && (
                <Box
                  style={{
                    position: 'absolute',
                    top: -5,
                    right: -5,
                    backgroundColor: 'red',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                  }}
                >
                  {notificacoesPrazos.length}
                </Box>
              )}
            </DefaultButton>
          </Box>

          {/* TabTop */}
          <Box
            width="100%"
            height="70px"
            direction="row"
            style={{ backgroundColor: colors.black }}
          >
            {tabs.map((tab) => (
              <TabButton
                key={tab.key}
                isActive={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.icon}
                <TextDefault
                  left="8px"
                  size="16px"
                  color={activeTab === tab.key ? colors.orange : colors.silver}
                >
                  {tab.label}
                </TextDefault>
                {activeTab === tab.key && <Underline />}
              </TabButton>

            ))}
          </Box>

        </Box>

        {/* Conteúdo com animação */}
        <Box
          color={colors.black}
          direction="column"
          paddingTop="15px"
          width="99%"
          height={'100vh'}
          style={{ overflowX: 'hidden' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', flex: '1' }} // impede quebra que causa scroll
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </Box>

        {areaNotifications && (
          <ModalNotifications
            closeModalNotifications={() => setAreaNotifications(false)}
            notificacoes={notificacoesPrazos}
          />
        )}

      </ListaEmpresasWrapper>
    </Container>
  );
}

export default Dashboard;