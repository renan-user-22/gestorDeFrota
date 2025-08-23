import React, { useState, useEffect } from 'react';
import { colors } from '../../theme';
import { TextDefault, Box } from '../../stylesAppDefault';

import {
  Container,
  PageTransition,
  ToggleMenuButton,
  LogoImg,
  IconDefaultButton,
} from './styles';

import EmpresasPage from '../empresas';
import RelatoriosPage from '../relatorios';
import ConfiguracoesPage from '../configuracoes';
import MultasPage from '../multas';
import Ia from '../ia';
import CheckListPage from '../CheckListPage';

import { FaFileInvoiceDollar, FaClipboardCheck } from 'react-icons/fa';
import { IoSettingsSharp } from 'react-icons/io5';
import { LuBrainCircuit } from "react-icons/lu";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { MdSpaceDashboard } from "react-icons/md";
import { SiRustdesk } from "react-icons/si";

import Logomarca from '../../images/logomarcaWhite.png';
import IconLogo from '../../images/iconLogo.png';

const Home = () => {

  const [empresasAction, setEmpresasAction] = useState(false);
  const [relatoriosAction, setRelatoriosAction] = useState(false);
  const [multasAction, setMultasAction] = useState(false);
  const [checklistAction, setChecklistAction] = useState(false);
  const [iaAction, setIaAction] = useState(false);
  const [configuracoesAction, setConfiguracoesAction] = useState(false);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [currentMenu, setCurrentMenu] = useState('Dashboard');

  const handleButtonClick = (setter, name) => {
    setEmpresasAction(false);
    setRelatoriosAction(false);
    setConfiguracoesAction(false);
    setMultasAction(false);
    setIaAction(false);
    setChecklistAction(false);
    setter(true);
    setCurrentMenu(name);
  };

  const iconMap = {
    Empresas: SiRustdesk,
    Dashboard: MdSpaceDashboard,
    Configurações: IoSettingsSharp,
    Multas: FaFileInvoiceDollar,
    CheckList: FaClipboardCheck,
    'Fleet IA': LuBrainCircuit,
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setRelatoriosAction(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Container>
      {/* SIDEBAR FIXA */}
      <Box
        style={{
          width: isMenuCollapsed ? '80px' : '300px',
          transition: 'width 0.3s ease'
        }}
        direction={'column'}
        height={'100%'}
        radius={'none'}
        color={colors.black}
      >

        <Box
          width={'100%'}
          justify={'flex-end'}
          align={'center'}
        >
          <ToggleMenuButton onClick={() => setIsMenuCollapsed(prev => !prev)}>
            {isMenuCollapsed ? <IoIosArrowForward size={30} color={colors.orange} /> : <IoIosArrowBack size={30} color={colors.orange} />}
          </ToggleMenuButton>
        </Box>

        <Box
          width={'100%'}
          height={'200px'}
          justify={'center'}
          align={'center'}
        >
          <LogoImg
            src={isMenuCollapsed ? IconLogo : Logomarca}
            width={isMenuCollapsed ? '50%' : '90%'} // tamanho menor quando colapsado
            height={'auto'}
            left={isMenuCollapsed ? '12px' : '0px'}
            style={{
              transition: 'width 0.3s ease', // transição suave
            }}
          />
        </Box>

        <Box
          width={'100%'}
          height={'100%'}
          direction={'column'}
          radius={'none'}
        >
          {buttonData.map(({ titulo, action }) => {
            const Icon = iconMap[titulo];
            const isActive = currentMenu === titulo;

            return (
              <IconDefaultButton
                key={titulo}
                onClick={() => handleButtonClick(action, titulo)}
                style={{ color: isActive ? colors.orange : colors.silver }}
              >
                <Icon
                  size={isMenuCollapsed ? 32 : 25}
                  style={{
                    marginRight: isMenuCollapsed ? '0px' : '10px',
                    transition: 'all 0.3s ease',
                    color: isActive ? colors.orange : colors.silver
                  }}
                />
                {!isMenuCollapsed && (
                  <Box direction="column" align="flex-start">
                    <TextDefault style={{ color: isActive ? colors.orange : colors.silver }}>
                      {titulo}
                    </TextDefault>
                  </Box>
                )}
              </IconDefaultButton>
            );
          })}

        </Box>
      </Box>

      {/* CONTEÚDO */}
      <Box
        style={{
          flexGrow: 1,
          transition: 'all 0.3s ease',
        }}
        position={'relative'}
        direction={'column'}
        height={'100vh'}
      >
        <PageTransition visible={empresasAction}>
          <EmpresasPage />
        </PageTransition>
        <PageTransition visible={relatoriosAction}>
          <RelatoriosPage />
        </PageTransition>
        <PageTransition visible={configuracoesAction}>
          <ConfiguracoesPage />
        </PageTransition>
        <PageTransition visible={iaAction}>
          <Ia />
        </PageTransition>
        <PageTransition visible={multasAction}>
          <MultasPage />
        </PageTransition>
        <PageTransition visible={checklistAction}>
          <CheckListPage />
        </PageTransition>
      </Box>
    </Container>
  );
};

export default Home;
