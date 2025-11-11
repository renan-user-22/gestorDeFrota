// src/pages/empresas/index.jsx
import React, { useEffect, useState, useMemo, useRef } from 'react';

// Nova estrutura:
import ModalAddEmpresa from '../../components/fleet-settings/create-empresa';
import DashboardClient from '../../components/fleet-settings/dashboard-customer-action';
import FinanceiroClient from '../../components/fleet-settings/financial-action';
import UsersConfigs from '../../components/fleet-settings/users-actions/list-users';

// Antiga estrutura, porém está funcionando.
import ModalListaVeiculos from '../../components/pagesModaisVeiculos/ModalListaVeiculos';
import ModalEditEmpresa from '../../components/pagesModais/ModalEditEmpresa';
import ModalCheckList from '../../components/pagesModais/ModalCheckList';

import { db } from '../../firebaseConnection';
import { ref, onValue, remove, get } from 'firebase/database';

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import { GoOrganization, GoHeartFill } from 'react-icons/go';
import { MdAdd, MdEditSquare } from 'react-icons/md';
import { BiSolidUserCircle } from 'react-icons/bi';
import { FaTruckFront, FaArrowUpRightDots, FaTrash, FaTicket, FaMoneyBillWave } from 'react-icons/fa6';
import { PiListBulletsFill } from 'react-icons/pi';

import { TextDefault, Box, SwalCustomStyles } from '../../stylesAppDefault';
import { colors } from '../../theme';

import {
  Container,
  DefaultButton,
  Input,
  EmpresasTableWrapper,
  EmpresasTable,
  EmpresasThead,
  EmpresasTh,
  EmpresasIdTh,
  EmpresasTr,
  EmpresasTd,
  EmpresasIdTd,
  EmpresasActionsTd,
  AcoesWrap,
  AcaoBtn,
  EmptyState,
  EmptyLottieBox,
} from './styles';

import Lottie from 'lottie-react';
import EmptyCompaniesAnim from '../../components/lotties/empty-companies.json';

const swal = Swal.mixin({
  customClass: {
    popup: 'swal-custom-popup',
    title: 'swal-custom-title',
    htmlContainer: 'swal-custom-text',
    confirmButton: 'swal-custom-confirm',
    cancelButton: 'swal-custom-cancel',
  },
  buttonsStyling: false,
});

const Empresas = () => {
  const [areaModalAddEmpresa, setAreaModalAddEmpresa] = useState(false);
  const [empresas, setEmpresas] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState(null);

  const [areaModalListMotoristaInfo, setAreaModalListMotoristaInfo] = useState(false);
  const [areaModalListVeiculosInfo, setAreaModalListVeiculosInfo] = useState(false);
  const [areaModalEditEmpresa, setAreaModalEditEmpresa] = useState(false);
  const [areaModalChecklist, setAreaModalChecklist] = useState(false);

  // NOVO: flag para abrir o Dashboard
  const [areaDashboard, setAreaDashboard] = useState(false);
  const [areaFinanceiro, setAreaFinanceiro] = useState(false);

  // Mapa idEmpresa -> quantidade de veículos cadastrados
  const [veiculosCountMap, setVeiculosCountMap] = useState({});
  const refreshTimerRef = useRef(null);

  const openModalAdd = () => setAreaModalAddEmpresa(true);

  const empresasFiltradas = useMemo(() => (
    Array.isArray(empresas)
      ? empresas.filter((e) =>
        (e?.nomeEmpresa || '').toLowerCase().includes((termoBusca || '').toLowerCase())
      )
      : []
  ), [empresas, termoBusca]);

  const isEmptyDB = empresas.length === 0;

  const areaModalListMotoristas = (id, nome) => {
    setEmpresaSelecionada({ id, nome });
    setAreaModalListMotoristaInfo(true);
    setAreaModalListVeiculosInfo(false);
    setAreaModalEditEmpresa(false);
    setAreaModalChecklist(false);
    setAreaDashboard(false);
  };

  // ✅ NOVO: abrir Financeiro (segue o mesmo padrão do Dashboard)
  const abrirFinanceiro = (id, nome) => {
    setEmpresaSelecionada({ id, nome });
    setAreaFinanceiro(true);
    setAreaDashboard(false);
    setAreaModalListVeiculosInfo(false);
    setAreaModalListMotoristaInfo(false);
    setAreaModalEditEmpresa(false);
    setAreaModalChecklist(false);
  };


  const areaModaladdVeiculo = (id, nome) => {
    setEmpresaSelecionada({ id, nome });
    setAreaModalListVeiculosInfo(true);
    setAreaModalListMotoristaInfo(false);
    setAreaModalEditEmpresa(false);
    setAreaModalChecklist(false);
    setAreaDashboard(false);
  };

  const areaModalEditEmpresaNext = (id, nome) => {
    setEmpresaSelecionada({ id, nome });
    setAreaModalEditEmpresa(true);
    setAreaModalListVeiculosInfo(false);
    setAreaModalListMotoristaInfo(false);
    setAreaModalChecklist(false);
    setAreaDashboard(false);
  };

  const abrirModalChecklist = (id, nome) => {
    setEmpresaSelecionada({ id, nome });
    setAreaModalChecklist(true);
    setAreaModalListVeiculosInfo(false);
    setAreaModalListMotoristaInfo(false);
    setAreaModalEditEmpresa(false);
    setAreaDashboard(false);
  };

  // NOVO: abrir Dashboard (segue analogia dos demais módulos)
  const abrirDashboard = (id, nome) => {
    setEmpresaSelecionada({ id, nome });
    setAreaDashboard(true);
    // fecha outros modais para evitar sobreposição
    setAreaModalListVeiculosInfo(false);
    setAreaModalListMotoristaInfo(false);
    setAreaModalEditEmpresa(false);
    setAreaModalChecklist(false);
  };

  const areaModalDeleteEmpresa = async (empresaId, empresaNome) => {
    const confirm = await Swal.fire({
      title: `Deseja excluir a empresa "${empresaNome}"?`,
      text: 'Todos os dados associados (veículos, motoristas, multas, etc.) também serão removidos!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: colors.orange,
      cancelButtonColor: colors.black,
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        htmlContainer: 'swal-custom-text',
        confirmButton: 'swal-custom-confirm',
        cancelButton: 'swal-custom-cancel',
      },
    });

    if (confirm.isConfirmed) {
      try {
        const empresaRef = ref(db, `fleetBusiness/${empresaId}`);
        await remove(empresaRef);
        Swal.fire({
          title: 'Excluído!',
          text: `A empresa "${empresaNome}" foi excluída com sucesso.`,
          icon: 'success',
          confirmButtonColor: colors.orange,
        });
        setEmpresas((prev) => prev.filter((emp) => emp.id !== empresaId));
        setVeiculosCountMap((prev) => {
          const clone = { ...prev };
          delete clone[empresaId];
          return clone;
        });
      } catch (error) {
        Swal.fire({
          title: 'Erro!',
          text: 'Ocorreu um erro ao tentar excluir a empresa. Tente novamente.',
          icon: 'error',
          confirmButtonColor: colors.orange,
        });
      }
    }
  };

  // Listener principal das empresas
  useEffect(() => {
    const companiesRef = ref(db, 'fleetBusiness');
    const unsub = onValue(companiesRef, (snap) => {
      const raw = snap.val() || {};
      const list = Object.keys(raw).map((k) => ({ id: k, ...raw[k] }));
      setEmpresas(list);
    });
    return () => unsub();
  }, []);

  // Função para contar veículos por empresa (usa caminho fleetBusiness/<id>/veiculos)
  const fetchCountsOnce = async (list) => {
    const pairs = await Promise.all(
      list.map(async (emp) => {
        try {
          const snap = await get(ref(db, `fleetBusiness/${emp.id}/veiculos`));
          const val = snap.val() || {};
          const count = typeof val === 'object' ? Object.keys(val).length : 0;
          return [emp.id, count];
        } catch {
          return [emp.id, 0];
        }
      })
    );
    const map = {};
    pairs.forEach(([id, count]) => (map[id] = count));
    setVeiculosCountMap(map);
  };

  // Atualiza contadores sempre que a lista muda
  useEffect(() => {
    if (empresas.length === 0) {
      setVeiculosCountMap({});
      return;
    }
    fetchCountsOnce(empresas);
  }, [empresas]);

  // Olheiro: atualiza a cada 3 minutos
  useEffect(() => {
    if (empresas.length === 0) return;
    if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);

    refreshTimerRef.current = setInterval(() => {
      fetchCountsOnce(empresas);
    }, 3 * 60 * 1000); // 3 minutos

    return () => {
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
    };
  }, [empresas]);

  const shortId = (id = '') => String(id).slice(-6); // ID curto para coluna pequena
  const toInt = (v) => {
    const n = parseInt(`${v}`.replace(/\D/g, ''), 10);
    return Number.isFinite(n) ? n : 0;
  };

  return (
    <Container>
      <SwalCustomStyles />

      <Box color={colors.black} width={'95%'} topSpace={'10px'} direction={'column'} align={'center'}>
        <Box width={'95%'} justify={'space-between'} align={'center'} topSpace={'10px'} paddingTop={'10px'} paddingLeft={'20px'} paddingRight={'20px'}>
          <Box direction="row" align="center">
            <GoOrganization size={'26px'} color={colors.silver} />
            <TextDefault left={'10px'} color={colors.silver} weight={'bold'} size={'20px'}>
              Empresas Cadastradas
            </TextDefault>
          </Box>

          <Input
            type="text"
            placeholder="Buscar empresa..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />
        </Box>

        <Box width={'95%'} height={'1px'} radius={'1px'} color={colors.silver} topSpace={'20px'} />

        <Box direction={'row'} align={'center'} width={'95%'} style={{ gap: 10 }}>
          <DefaultButton onClick={openModalAdd}>
            <MdAdd size={'20px'} />
            <span style={{ marginLeft: 6 }}>Nova empresa</span>
          </DefaultButton>
        </Box>
      </Box>

      {isEmptyDB ? (
        <EmptyState>
          <EmptyLottieBox>
            <Lottie animationData={EmptyCompaniesAnim} loop autoplay style={{ width: '520px', maxWidth: '90vw' }} />
          </EmptyLottieBox>
        </EmptyState>
      ) : (
        <EmpresasTableWrapper>
          <EmpresasTable>
            <EmpresasThead>
              <tr>
                <EmpresasIdTh><span>ID</span></EmpresasIdTh>
                <EmpresasTh><span>Empresa</span></EmpresasTh>
                <EmpresasTh><span>CNPJ</span></EmpresasTh>
                <EmpresasTh><span>Categoria</span></EmpresasTh>
                <EmpresasTh><span>Qtd. Veículos</span></EmpresasTh>
                <EmpresasTh><span>Ações</span></EmpresasTh>
              </tr>
            </EmpresasThead>

            <tbody>
              {empresasFiltradas.map((empresa) => {
                const cadastrados = veiculosCountMap[empresa.id] || 0;
                const limite = toInt(empresa.qtdVeiculos);
                const textoQtd = `${cadastrados}/${limite}`;

                return (
                  <EmpresasTr key={empresa.id}>
                    <EmpresasIdTd title={empresa.id}>{shortId(empresa.id)}</EmpresasIdTd>
                    <EmpresasTd>{empresa.nomeEmpresa}</EmpresasTd>
                    <EmpresasTd>{empresa.cnpj}</EmpresasTd>
                    <EmpresasTd>{empresa.tipo}</EmpresasTd>
                    <EmpresasTd title={`Veículos: ${textoQtd}`}>{textoQtd}</EmpresasTd>

                    <EmpresasActionsTd>
                      <AcoesWrap>
                        {/* Dashboard */}
                        <AcaoBtn aria-label="Dashboard" onClick={() => abrirDashboard(empresa.id, empresa.nomeEmpresa)}>
                          <FaArrowUpRightDots />
                        </AcaoBtn>

                        {/* Financeiro - abre FinanceiroClient */}
                        <AcaoBtn aria-label="Financeiro" onClick={() => abrirFinanceiro(empresa.id, empresa.nomeEmpresa)}>
                          <FaMoneyBillWave />
                        </AcaoBtn>

                        <AcaoBtn aria-label="Editar" onClick={() => areaModalEditEmpresaNext(empresa.id, empresa.nomeEmpresa)}>
                          <MdEditSquare />
                        </AcaoBtn>

                        <AcaoBtn aria-label="Usuários" onClick={() => areaModalListMotoristas(empresa.id, empresa.nomeEmpresa)}>
                          <BiSolidUserCircle />
                        </AcaoBtn>

                        <AcaoBtn aria-label="Veículos" onClick={() => areaModaladdVeiculo(empresa.id, empresa.nomeEmpresa)}>
                          <FaTruckFront />
                        </AcaoBtn>

                        <AcaoBtn aria-label="Meets" onClick={() => Swal.fire('Em breve', 'Área de Meets em desenvolvimento.', 'info')}>
                          <GoHeartFill />
                        </AcaoBtn>

                        <AcaoBtn aria-label="CheckList" onClick={() => abrirModalChecklist(empresa.id, empresa.nomeEmpresa)}>
                          <PiListBulletsFill />
                        </AcaoBtn>

                        <AcaoBtn aria-label="Multas" onClick={() => Swal.fire('Em breve', 'Área de Multas em desenvolvimento.', 'info')}>
                          <FaTicket />
                        </AcaoBtn>

                        <AcaoBtn aria-label="Excluir" onClick={() => areaModalDeleteEmpresa(empresa.id, empresa.nomeEmpresa)}>
                          <FaTrash />
                        </AcaoBtn>
                      </AcoesWrap>
                    </EmpresasActionsTd>
                  </EmpresasTr>
                );
              })}
            </tbody>
          </EmpresasTable>
        </EmpresasTableWrapper>
      )}

      {/* Modais */}
      {areaModalAddEmpresa && <ModalAddEmpresa closeModalAddEmpresa={() => setAreaModalAddEmpresa(false)} />}
      {areaModalEditEmpresa && empresaSelecionada && (
        <ModalEditEmpresa
          closeModalEditEmpresa={() => setAreaModalEditEmpresa(false)}
          empresaId={empresaSelecionada.id}
          empresaNome={empresaSelecionada.nome}
        />
      )}
      {areaModalListMotoristaInfo && empresaSelecionada && (
        <UsersConfigs
          closeModalListMotorista={() => setAreaModalListMotoristaInfo(false)}
          empresaId={empresaSelecionada.id}
          empresaNome={empresaSelecionada.nome}
        />
      )}
      {areaModalListVeiculosInfo && empresaSelecionada && (
        <ModalListaVeiculos
          closeModalListVeiculos={() => setAreaModalListVeiculosInfo(false)}
          empresaId={empresaSelecionada.id}
          empresaNome={empresaSelecionada.nome}
        />
      )}
      {areaModalChecklist && empresaSelecionada && (
        <ModalCheckList
          closeModalChecklist={() => setAreaModalChecklist(false)}
          empresaId={empresaSelecionada.id}
          empresaNome={empresaSelecionada.nome}
        />
      )}

      {/* Dashboard */}
      {areaDashboard && empresaSelecionada && (
        <DashboardClient
          closeDashboard={() => setAreaDashboard(false)}
          empresaId={empresaSelecionada.id}
          empresaNome={empresaSelecionada.nome}
        />
      )}

      {/* ✅ Financeiro */}
      {areaFinanceiro && empresaSelecionada && (
        <FinanceiroClient
          closeFinanceiro={() => setAreaFinanceiro(false)}
          empresaId={empresaSelecionada.id}
          empresaNome={empresaSelecionada.nome}
        />
      )}
    </Container>
  );
};

export default Empresas;
