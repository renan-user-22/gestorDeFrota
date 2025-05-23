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
import Ia from '../ia';
import CheckListPage from '../CheckListPage';

// Ícones
import { GoOrganization } from 'react-icons/go';
import { FaChartBar, FaFileInvoiceDollar, FaClipboardCheck } from 'react-icons/fa';
import { IoSettingsSharp } from 'react-icons/io5';
import { LuBrainCircuit } from "react-icons/lu";
import { HiMiniUser } from "react-icons/hi2";

import Logomarca from '../../images/logomarcaWhite.png';

const Home = () => {
  const isMobile = useMediaQuery({ maxWidth: 1100 });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // estados de página
  const [empresasAction, setEmpresasAction] = useState(false);
  //const [pessoaFisica, setPessoaFisica] = useState(false);
  const [relatoriosAction, setRelatoriosAction] = useState(false);
  const [multasAction, setMultasAction] = useState(false);
  const [checklistAction, setChecklistAction] = useState(false);
  const [iaAction, setIaAction] = useState(false);
  const [configuracoesAction, setConfiguracoesAction] = useState(false);



  useEffect(() => {
    const timer = setTimeout(() => {
      setRelatoriosAction(true)
    }, 500); // espera 0.5s, se quiser

    return () => clearTimeout(timer);
  }, []);


  const iconMap = {
    Empresas: GoOrganization,
    Dashboard: FaChartBar,
    Configurações: IoSettingsSharp,
    Multas: FaFileInvoiceDollar,
    CheckList: FaClipboardCheck,
    'Fleet IA': LuBrainCircuit, // ou outro ícone mais representativo
    //'Pessoa Física': HiMiniUser, // ou outro ícone mais representativo
  };

  const buttonData = [
    {
      titulo: 'Dashboard',
      descricao: 'Acompanhe tudo em tempo real sobre a sua empresa',
      action: setRelatoriosAction,
    },
    {
      titulo: 'Empresas',
      descricao: 'Cadastre, edite e gerencie suas empresas parceiras',
      action: setEmpresasAction,
    },
    /*{
      titulo: 'Pessoa Física',
      descricao: 'Cadastre, edite e gerencie suas empresas parceiras',
      action: setPessoaFisica,
    },*/
    {
      titulo: 'Multas',
      descricao: 'Gerencie e visualize as multas das frotas cadastradas',
      action: setMultasAction,
    },
    {
      titulo: 'Fleet IA',
      descricao: 'Utilize a inteligência artificial para pesquisas e automações',
      action: setIaAction,
    },
    {
      titulo: 'Configurações',
      descricao: 'Ajustes de sistema e preferências de usuário',
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
    setIaAction(false);
    //setPessoaFisica(false);
    setChecklistAction(false);
    setter(true);
    if (isMobile) setIsDrawerOpen(false);
  };


  return (
    <Container>
      {/* SIDEBAR */}
      <Box
        width={isMobile ? '100%' : '15%'}
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
                </Box>
              </IconDefaultButton>
            );
          })}
        </Drawer>
      </Box>

      {/* CONTEÚDO */}
      <Box
        width={isMobile ? '100%' : '90%'}
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

        <PageTransition visible={iaAction}>
          <Ia isMobile={isMobile} />
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
