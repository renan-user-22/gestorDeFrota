// src/pages/home/index.jsx
import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { colors } from '../../theme';
import { TextDefault, Box } from '../../stylesAppDefault';

import {
  Container,
  PageTransition,
  ToggleMenuButton,
  LogoImg,
  Submenu,
  Separator,
  GroupButton,
  ItemButton,
  Flyout,
} from './styles';

import EmpresasPage from '../empresas';
import RelatoriosPage from '../relatorios';
import ConfiguracoesPage from '../configuracoes';
import MultasPage from '../multas';
import Ia from '../ia';

import { FaFileInvoiceDollar, FaHandshake, FaShieldAlt } from 'react-icons/fa';
import { IoSettingsSharp, IoChevronDown, IoChevronUp, IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { LuBrainCircuit } from 'react-icons/lu';
import { MdSpaceDashboard } from 'react-icons/md';
import { RiSteering2Fill } from 'react-icons/ri';
import { TbBuildingSkyscraper, TbCurrencyDollar, TbGauge, TbUsers, TbBuilding } from 'react-icons/tb';

import Logomarca from '../../images/logomarcaWhite.png';
import IconLogo from '../../images/iconLogo.png';

const Home = () => {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [currentMenu, setCurrentMenu] = useState('Dashboard');
  const [pageKey, setPageKey] = useState({});
  const k = useCallback((name) => (pageKey[name] || 0), [pageKey]);
  const [openGroup, setOpenGroup] = useState(null);

  const isGroupOpen = useCallback((name) => openGroup === name, [openGroup]);
  const toggleGroup = useCallback((name) => setOpenGroup(prev => (prev === name ? null : name)), []);
  const handleNavigate = useCallback((key) => { setCurrentMenu(key); setPageKey(prev => ({ ...prev, [key]: (prev[key] || 0) + 1 })); setOpenGroup(null); }, []);
  const isActive = useCallback((key) => currentMenu === key, [currentMenu]);

  const groupIsActive = useCallback((name) => {
    if (name === 'Fleet Business') return ['FS: Dashboard', 'Empresas', 'Multas'].includes(currentMenu);
    if (name === 'Fleet One') return ['Drive: Dashboard', 'Motoristas', 'Drive: Multas', 'Parceiros'].includes(currentMenu);
    if (name === 'Fleet Protect') return ['Protect: Acompanhamento'].includes(currentMenu);
    if (name === 'Fleet Recurso') return ['Recurso: Clientes'].includes(currentMenu);
    if (name === 'Fleet Yard') return ['Yard: Pátios'].includes(currentMenu);
    return false;
  }, [currentMenu]);

  const iconMap = useMemo(() => ({
    Dashboard: MdSpaceDashboard,
    Financeiro: TbCurrencyDollar,
    'Fleet Ia': LuBrainCircuit,
    Configurações: IoSettingsSharp,

    'Fleet Bussines': TbBuildingSkyscraper, // mantém como está no projeto atual
    'Fleet One': RiSteering2Fill,
    'Fleet Protect': FaShieldAlt,
    'Fleet Recurso': FaFileInvoiceDollar,
    'Fleet Yard': TbBuilding,

    'FS: Dashboard': MdSpaceDashboard,
    Empresas: TbBuilding,
    Multas: FaFileInvoiceDollar,

    'Drive: Dashboard': TbGauge,
    Motoristas: TbUsers,
    'Drive: Multas': FaFileInvoiceDollar,
    Parceiros: FaHandshake,

    'Protect: Acompanhamento': FaShieldAlt,
    'Recurso: Clientes': TbUsers,
    'Yard: Pátios': TbBuilding,
  }), []);

  const fleetSolutionsItems = useMemo(() => ([
    { key: 'FS: Dashboard', label: 'Dashboard' },
    { key: 'Empresas', label: 'Empresas' },
    { key: 'Multas', label: 'Multas' },
  ]), []);

  const fleetDriveItems = useMemo(() => ([
    { key: 'Drive: Dashboard', label: 'Dashboard' },
    { key: 'Motoristas', label: 'Motoristas' },
    { key: 'Drive: Multas', label: 'Multas' },
    { key: 'Parceiros', label: 'Parceiros' },
  ]), []);

  const fleetProtectItems = useMemo(() => ([
    { key: 'Protect: Acompanhamento', label: 'Acompanhamento (CNH & Placas)' },
  ]), []);

  const fleetRecursoItems = useMemo(() => ([
    { key: 'Recurso: Clientes', label: 'Clientes' },
  ]), []);

  const fleetYardItems = useMemo(() => ([
    { key: 'Yard: Pátios', label: 'Pátios' },
  ]), []);

  const onGroupKeyDown = (e, name) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleGroup(name); }
    else if (e.key === 'ArrowRight') { if (!isGroupOpen(name)) toggleGroup(name); }
    else if (e.key === 'ArrowLeft') { if (isGroupOpen(name)) toggleGroup(name); }
  };
  const onItemKeyDown = (e, key) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleNavigate(key); } };

  const DrawerGroup = ({ title, open, onToggle, items }) => {
    const GroupIcon = iconMap[title] || MdSpaceDashboard;
    const btnRef = useRef(null);
    const [flyTop, setFlyTop] = useState(0);

    useEffect(() => {
      if (open && btnRef.current) {
        const rect = btnRef.current.getBoundingClientRect();
        setFlyTop(rect.top + window.scrollY);
      }
    }, [open, isMenuCollapsed]);

    // deslocamento lateral (colapsado = 80px, expandido = 300px)
    const flyLeft = isMenuCollapsed ? 80 : 300;

    const Header = (
      <Box direction="row" align="center" justify="flex-start" width="100%" bottomSpace="6px" style={{ padding: '6px 8px' }}>
        <GroupIcon size={18} />
        <TextDefault left="8px" weight="bold" color={colors.orange}>{title}</TextDefault>
      </Box>
    );

    return (
      <Box width="100%" direction="column" radius="none">
        <GroupButton
          ref={btnRef}
          $open={open}
          $active={groupIsActive(title)}
          onClick={onToggle}
          onKeyDown={(e) => onGroupKeyDown(e, title)}
          role="button"
          aria-expanded={open}
          aria-controls={`submenu-${title.replace(/\s/g, '')}`}
          tabIndex={0}
          style={{ justifyContent: isMenuCollapsed ? 'center' : 'flex-start', height: '60px' }}
        >
          <GroupIcon size={isMenuCollapsed ? 22 : 20} />
          {!isMenuCollapsed && (
            <Box direction="row" align="center" justify="space-between" width="100%">
              <TextDefault style={{ flex: 1, color: groupIsActive(title) ? colors.orange : colors.silver }}>{title}</TextDefault>
              {open ? (
                <IoChevronBack size={18} color={colors.orange} />
              ) : (
                <IoChevronForward size={18} color={colors.orange} />
              )}
            </Box>
          )}
        </GroupButton>

        {/* ❌ Submenu inline desativado */}
        <Submenu id={`submenu-${title.replace(/\s/g, '')}`} $open={false} />

        {/* ✅ Flyout lateral com animação (slide por padrão; 'fade' opcional) */}
        {open && (
          <Flyout
            $top={flyTop}
            $left={flyLeft}
            $animateMode="slide"   // <— mude para "fade" se preferir o fallback
            role="dialog"
            aria-label={`Submenu de ${title}`}
          >
            {Header}
            <Separator $color={colors.darkGrayTwo} />
            <Box direction="column">
              {items.map(({ key, label }) => {
                const Icon = iconMap[key] || MdSpaceDashboard;
                const active = isActive(key);
                return (
                  <ItemButton
                    key={`flyout-${key}`}
                    $active={active}
                    onClick={(e) => { e.stopPropagation(); handleNavigate(key); }}
                    onKeyDown={(e) => onItemKeyDown(e, key)}
                    tabIndex={0}
                    style={{ height: 44, gap: 8 }}
                  >
                    <Icon size={18} />
                    <TextDefault style={{ color: active ? colors.orange : colors.silver }}>{label}</TextDefault>
                  </ItemButton>
                );
              })}
            </Box>
          </Flyout>
        )}
      </Box>
    );
  };

  const DrawerStandalone = ({ keyName, label }) => {
    const Icon = iconMap[keyName] || MdSpaceDashboard;
    const active = isActive(keyName);
    return (
      <ItemButton
        $active={active}
        onClick={() => { setOpenGroup(null); handleNavigate(keyName); }}
        onKeyDown={(e) => { onItemKeyDown(e, keyName); if (e.key === 'Enter' || e.key === ' ') setOpenGroup(null); }}
        tabIndex={0}
        style={{ justifyContent: isMenuCollapsed ? 'center' : 'flex-start', height: '60px'}}
      >
        <Icon size={isMenuCollapsed ? 22 : 20} />
        {!isMenuCollapsed && <TextDefault style={{ color: active ? colors.orange : colors.silver }}>{label}</TextDefault>}
      </ItemButton>
    );
  };

  return (
    <Container>
      {/* SIDEBAR */}
      <Box
        style={{ width: isMenuCollapsed ? '80px' : '300px', transition: 'width 0.2s linear' }}
        direction="column"
        height="100%"
        radius="none"
        color={colors.black}
      >
        <Box width="100%" height="150px" justify="center" align="center">
          <LogoImg
            src={isMenuCollapsed ? IconLogo : Logomarca}
            $width={isMenuCollapsed ? '50%' : '90%'}
            $left={isMenuCollapsed ? '12px' : '0px'}
          />
        </Box>

        {/* Drawer — sem expansão vertical (scroll só da sidebar se necessário) */}
        <Box width="100%" height="100%" direction="column" radius="none" style={{ flexGrow: 1, overflowY: 'auto' }}>
          <DrawerStandalone keyName="Dashboard" label="Dashboard" />

          <Separator $color={colors.darkGrayTwo} />

          <DrawerGroup
            title="Fleet Business"
            open={isGroupOpen('Fleet Bussines')}
            onToggle={() => toggleGroup('Fleet Bussines')}
            items={fleetSolutionsItems}
          />

          <DrawerGroup
            title="Fleet One"
            open={isGroupOpen('Fleet One')}
            onToggle={() => toggleGroup('Fleet One')}
            items={fleetDriveItems}
          />

          <DrawerGroup
            title="Fleet Protect"
            open={isGroupOpen('Fleet Protect')}
            onToggle={() => toggleGroup('Fleet Protect')}
            items={fleetProtectItems}
          />

          <DrawerGroup
            title="Fleet Recurso"
            open={isGroupOpen('Fleet Recurso')}
            onToggle={() => toggleGroup('Fleet Recurso')}
            items={fleetRecursoItems}
          />

          <DrawerGroup
            title="Fleet Yard"
            open={isGroupOpen('Fleet Yard')}
            onToggle={() => toggleGroup('Fleet Yard')}
            items={fleetYardItems}
          />

          <Separator $color={colors.darkGrayTwo} />

          <DrawerStandalone keyName="Financeiro" label="Financeiro" />
          <DrawerStandalone keyName="Fleet Ia" label="Fleet Ia" />
          <DrawerStandalone keyName="Configurações" label="Configurações" />
        </Box>

        <Box width="100%" justify="flex-end" align="center">
          <ToggleMenuButton onClick={() => setIsMenuCollapsed(prev => !prev)}>
            {isMenuCollapsed ? <IoChevronForward size={26} color={colors.orange} /> : <IoChevronBack size={26} color={colors.orange} />}
          </ToggleMenuButton>
        </Box>
      </Box>

      {/* CONTEÚDO (inalterado) */}
      <Box style={{ flexGrow: 1 }} position="relative" direction="column" height="100vh">
        <PageTransition $visible={isActive('Empresas')} key={`Empresas-${k('Empresas')}`}>
          <EmpresasPage key={`Empresas-${k('Empresas')}`} />
        </PageTransition>

        <PageTransition $visible={isActive('FS: Dashboard')} key={`FS:Dashboard-${k('FS: Dashboard')}`}>
          <RelatoriosPage key={`FS:Dashboard-${k('FS: Dashboard')}`} />
        </PageTransition>

        <PageTransition $visible={isActive('Multas')} key={`Multas-${k('Multas')}`}>
          <MultasPage key={`Multas-${k('Multas')}`} />
        </PageTransition>

        <PageTransition $visible={isActive('Drive: Dashboard')} key={`DriveDash-${k('Drive: Dashboard')}`}>
          <Box width="100%" height="100%" justify="center" align="center" direction="column">
            <TextDefault size="22px" weight="bold" top="10px">Fleet Drive — Dashboard</TextDefault>
            <TextDefault top="10px">Em breve: visão geral do motorista.</TextDefault>
          </Box>
        </PageTransition>

        <PageTransition $visible={isActive('Motoristas')} key={`Motoristas-${k('Motoristas')}`}>
          <Box width="100%" height="100%" justify="center" align="center" direction="column">
            <TextDefault size="22px" weight="bold" top="10px">Fleet Drive — Motoristas</TextDefault>
            <TextDefault top="10px">Em breve: cadastro e gestão de motoristas.</TextDefault>
          </Box>
        </PageTransition>

        <PageTransition $visible={isActive('Drive: Multas')} key={`DriveMultas-${k('Drive: Multas')}`}>
          <Box width="100%" height="100%" justify="center" align="center" direction="column">
            <TextDefault size="22px" weight="bold" top="10px">Fleet Drive — Multas</TextDefault>
            <TextDefault top="10px">Em breve: gestão de multas para motoristas autônomos.</TextDefault>
          </Box>
        </PageTransition>

        <PageTransition $visible={isActive('Dashboard')} key={`Dashboard-${k('Dashboard')}`}>
          <Box width="100%" height="100%" justify="center" align="center" direction="column">
            <TextDefault size="22px" weight="bold" top="10px">Dashboard — Visão Geral</TextDefault>
            <TextDefault top="10px">Visão consolidada de toda a Fleet.</TextDefault>
          </Box>
        </PageTransition>

        <PageTransition $visible={isActive('Financeiro')} key={`Financeiro-${k('Financeiro')}`}>
          <Box width="100%" height="100%" justify="center" align="center" direction="column">
            <TextDefault size="22px" weight="bold" top="10px">Financeiro — Visão Geral</TextDefault>
            <TextDefault top="10px">Em breve: consolidação financeira.</TextDefault>
          </Box>
        </PageTransition>

        <PageTransition $visible={isActive('Configurações')} key={`Config-${k('Configurações')}`}>
          <ConfiguracoesPage />
        </PageTransition>

        <PageTransition $visible={isActive('Fleet Ia')} key={`IA-${k('Fleet Ia')}`}>
          <Ia />
        </PageTransition>

        <PageTransition $visible={isActive('Recurso: Clientes')} key={`RecursoClientes-${k('Recurso: Clientes')}`}>
          <Box width="100%" height="100%" justify="center" align="center" direction="column">
            <TextDefault size="22px" weight="bold" top="10px">Fleet Recurso — Clientes</TextDefault>
            <TextDefault top="10px">Em breve: cadastro/gestão de clientes do Recurso.</TextDefault>
          </Box>
        </PageTransition>

        <PageTransition $visible={isActive('Yard: Pátios')} key={`YardPatios-${k('Yard: Pátios')}`}>
          <Box width="100%" height="100%" justify="center" align="center" direction="column">
            <TextDefault size="22px" weight="bold" top="10px">Fleet Yard — Pátios</TextDefault>
            <TextDefault top="10px">Em breve: gestão de pátios e tempos de doca.</TextDefault>
          </Box>
        </PageTransition>

        <PageTransition $visible={isActive('Protect: Acompanhamento')} key={`ProtectAcompanhamento-${k('Protect: Acompanhamento')}`}>
          <Box width="100%" height="100%" justify="center" align="center" direction="column">
            <TextDefault size="22px" weight="bold" top="10px">Fleet Protect — Acompanhamento</TextDefault>
            <TextDefault top="10px">Monitoramento de CNH e Placas (add-on para clientes One/Business).</TextDefault>
          </Box>
        </PageTransition>
      </Box>
    </Container>
  );
};

export default Home;
