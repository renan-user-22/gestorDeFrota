// src/pages/empresas/index.jsx
import React, { useEffect, useState, useMemo } from 'react';

import ModalAddEmpresa from '../../components/pagesModais/addEmpresa';
import ModalListaMotoristas from '../../components/pagesModais/listaMotoristas';
import ModalListaVeiculos from '../../components/pagesModaisVeiculos/ModalListaVeiculos';
import ModalEditEmpresa from '../../components/pagesModais/ModalEditEmpresa';
import ModalCheckList from '../../components/pagesModais/ModalCheckList';

import { db } from '../../firebaseConnection';
import { ref, onValue, remove } from 'firebase/database';

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
  EmpresasIdTh,        // ⬅️ NOVO
  EmpresasTr,
  EmpresasTd,
  EmpresasIdTd,        // ⬅️ NOVO
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
  };

  const areaModaladdVeiculo = (id, nome) => {
    setEmpresaSelecionada({ id, nome });
    setAreaModalListVeiculosInfo(true);
    setAreaModalListMotoristaInfo(false);
    setAreaModalEditEmpresa(false);
    setAreaModalChecklist(false);
  };

  const areaModalEditEmpresaNext = (id, nome) => {
    setEmpresaSelecionada({ id, nome });
    setAreaModalEditEmpresa(true);
    setAreaModalListVeiculosInfo(false);
    setAreaModalListMotoristaInfo(false);
    setAreaModalChecklist(false);
  };

  const abrirModalChecklist = (id, nome) => {
    setEmpresaSelecionada({ id, nome });
    setAreaModalChecklist(true);
    setAreaModalListVeiculosInfo(false);
    setAreaModalListMotoristaInfo(false);
    setAreaModalEditEmpresa(false);
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

  useEffect(() => {
    const companiesRef = ref(db, 'fleetBusiness');
    return onValue(companiesRef, (snap) => {
      const raw = snap.val() || {};
      const list = Object.keys(raw).map((k) => ({ id: k, ...raw[k] }));
      setEmpresas(list);
    });
  }, []);

  const shortId = (id = '') => String(id).slice(-6); // ID curto para coluna pequena

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
                <EmpresasIdTh>
                  <span>ID</span>
                </EmpresasIdTh>

                <EmpresasTh>
                  <span>Empresa</span>
                </EmpresasTh>

                <EmpresasTh>
                  <span>CNPJ</span>
                </EmpresasTh>

                <EmpresasTh>
                  <span>Categoria</span>
                </EmpresasTh>

                <EmpresasTh>
                  <span>Qtd. Veículos</span>
                </EmpresasTh>

                <EmpresasTh>
                  <span>Ações</span>
                </EmpresasTh>
              </tr>
            </EmpresasThead>

            <tbody>
              {empresasFiltradas.map((empresa) => (
                <EmpresasTr key={empresa.id}>
                  <EmpresasIdTd title={empresa.id}>{shortId(empresa.id)}</EmpresasIdTd>
                  <EmpresasTd>{empresa.nomeEmpresa}</EmpresasTd>
                  <EmpresasTd>{empresa.cnpj}</EmpresasTd>
                  <EmpresasTd>{empresa.tipo}</EmpresasTd>
                  <EmpresasTd>{empresa.qtdVeiculos}</EmpresasTd>

                  <EmpresasActionsTd>
                    <AcoesWrap>
                      <AcaoBtn aria-label="Dashboard" onClick={() => Swal.fire('Em breve', 'Dashboard da empresa em desenvolvimento.', 'info')}>
                        <FaArrowUpRightDots />
                      </AcaoBtn>
                      <AcaoBtn aria-label="Financeiro" onClick={() => Swal.fire('Em breve', 'Área Financeira da frota em desenvolvimento.', 'info')}>
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
              ))}
            </tbody>
          </EmpresasTable>
        </EmpresasTableWrapper>
      )}

      {areaModalAddEmpresa && (
        <ModalAddEmpresa closeModalAddEmpresa={() => setAreaModalAddEmpresa(false)} />
      )}

      {areaModalEditEmpresa && empresaSelecionada && (
        <ModalEditEmpresa
          closeModalEditEmpresa={() => setAreaModalEditEmpresa(false)}
          empresaId={empresaSelecionada.id}
          empresaNome={empresaSelecionada.nome}
        />
      )}

      {areaModalListMotoristaInfo && empresaSelecionada && (
        <ModalListaMotoristas
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
    </Container>
  );
};

export default Empresas;
