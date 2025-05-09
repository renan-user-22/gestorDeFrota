import React, { useState, useEffect } from 'react';
import { colors } from '../../theme';
import { TextDefault, Box } from '../../stylesAppDefault';
import { useMediaQuery } from 'react-responsive';
import {
  Container,
  PageTransition,
  LogoImg,
  Drawer,
  DrawerButton,
  IconDefaultButton,
} from './styles';

// Páginas (crie os componentes vazios/placeholder para cada uma)
import EmpresasPage from '../empresas';
import RelatoriosPage from '../relatorios';
import ConfiguracoesPage from '../configuracoes';
import MultasPage from '../multas';
import PessoaFisica from '../pessoaFisica';
import CheckListPage from '../CheckListPage';

// Ícones
import { GoOrganization } from 'react-icons/go';
import { FaChartBar, FaFileInvoiceDollar, FaClipboardCheck } from 'react-icons/fa';
import { IoSettingsSharp } from 'react-icons/io5';
import { MdPersonPin } from "react-icons/md";

import Logomarca from '../../images/logomarcaWhite.png';

const Home = () => {
  const isMobile = useMediaQuery({ maxWidth: 1100 });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // estados de página
  const [empresasAction, setEmpresasAction] = useState(false);
  const [relatoriosAction, setRelatoriosAction] = useState(false);
  const [multasAction, setMultasAction] = useState(false);
  const [checklistAction, setChecklistAction] = useState(false);
  const [pessoafisicaAction, setPessoafisicaAction] = useState(false);
  const [configuracoesAction, setConfiguracoesAction] = useState(false);

  

  useEffect(() => {
    const timer = setTimeout(() => {
      setRelatoriosAction(true)
    }, 500); // espera 0.5s, se quiser

    return () => clearTimeout(timer);
  }, []);


  const iconMap = {
    Empresas: GoOrganization,
    Relatórios: FaChartBar,
    Configurações: IoSettingsSharp,
    PessoaFisica: MdPersonPin,
    Multas: FaFileInvoiceDollar,
    CheckList: FaClipboardCheck,
  };

  const buttonData = [
    {
      titulo: 'Relatórios',
      descricao: 'Acessar relatórios financeiros e de desempenho',
      action: setRelatoriosAction,
    },
    {
      titulo: 'Empresas',
      descricao: 'Informações das frotas cadastradas',
      action: setEmpresasAction,
    },
    {
      titulo: 'CheckList',
      descricao: 'Informações das frotas cadastradas',
      action: setChecklistAction,
    },
    {
      titulo: 'PessoaFisica',
      descricao: 'Informações de CPFS não sei que mais',
      action: setPessoafisicaAction,
    },
    {
      titulo: 'Multas',
      descricao: 'Informações das frotas cadastradas',
      action: setMultasAction,
    },
    {
      titulo: 'Configurações',
      descricao: 'Ajustes de sistema e preferências',
      action: setConfiguracoesAction,
    },
  ];

  const toggleDrawer = () => {
    setIsDrawerOpen((o) => !o);
  };

  const handleButtonClick = (setter) => {
    setEmpresasAction(false);
    setRelatoriosAction(false);
    setConfiguracoesAction(false);
    setMultasAction(false);
    setPessoafisicaAction(false);
    setChecklistAction(false);
    setter(true);
    if (isMobile) setIsDrawerOpen(false);
  };


  return (
    <Container>
      {/* SIDEBAR */}
      <Box
        width={isMobile ? '100%' : '20%'}
        color={colors.black}
        height="100%"
      >
        {/* logo + drawer toggle no mobile */}
        <Box width={'100%'} height={'100px'} justify={'center'} align={'center'}>
          <LogoImg src={Logomarca} width={'95%'} height={'auto'} />
        </Box>

        {isMobile && (
          <DrawerButton onClick={toggleDrawer}>
            {isDrawerOpen ? 'Fechar Menu' : 'Abrir Menu'}
          </DrawerButton>
        )}
        <Drawer open={isDrawerOpen || !isMobile}>
          {buttonData.map(({ titulo, descricao, action }) => {
            const Icon = iconMap[titulo];
            return (
              <IconDefaultButton
                key={titulo}
                onClick={() => handleButtonClick(action)}
              >
                <Icon size={25} style={{ marginRight: '10px' }} color={colors.silver} />
                <Box direction="column" align="flex-start">
                  <TextDefault size="14px" weight="bold">
                    {titulo}
                  </TextDefault>
                  <TextDefault size="12px">{descricao}</TextDefault>
                </Box>
              </IconDefaultButton>
            );
          })}
        </Drawer>
      </Box>

      {/* CONTEÚDO */}
      <Box
        width={isMobile ? '100%' : '80%'}
        height={'100vh'}
        direction={'column'}
        style={{ overflowY: 'none', position: 'relative' }}
      >

        <PageTransition visible={empresasAction}>
          <EmpresasPage isMobile={isMobile} />
        </PageTransition>

        <PageTransition visible={relatoriosAction}>
          <RelatoriosPage isMobile={isMobile} />
        </PageTransition>

        <PageTransition visible={configuracoesAction}>
          <ConfiguracoesPage isMobile={isMobile} />
        </PageTransition>

        <PageTransition visible={pessoafisicaAction}>
          <PessoaFisica isMobile={isMobile} />
        </PageTransition>

        <PageTransition visible={multasAction}>
          <MultasPage isMobile={isMobile} />
        </PageTransition>

        <PageTransition visible={checklistAction}>
          <CheckListPage isMobile={isMobile} />
        </PageTransition>

      </Box>
    </Container>
  );
};

export default Home;
