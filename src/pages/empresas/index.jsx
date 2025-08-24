// Código completo atualizado do componente Empresas.jsx
// Todas as referências ao banco foram ajustadas para refletir a estrutura correta do Firebase.

import React, { useState, useEffect } from 'react';
import ModalAddEmpresa from '../../components/pagesModais/addEmpresa';
import ModalListaMotoristas from '../../components/pagesModais/listaMotoristas';
import ModalListaVeiculos from '../../components/pagesModaisVeiculos/ModalListaVeiculos';
import ModalEditEmpresa from '../../components/pagesModais/ModalEditEmpresa';
import ModalCheckList from '../../components/pagesModais/ModalCheckList';
import { db } from '../../firebaseConnection';
import { ref, onValue, remove } from 'firebase/database';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import { GoOrganization } from 'react-icons/go';
import { FaWindowClose } from 'react-icons/fa';
import { MdEditSquare } from 'react-icons/md';
import { GoHeartFill } from "react-icons/go";
import { BiSolidUserCircle } from 'react-icons/bi';
import { FaTruckFront } from 'react-icons/fa6';
import { PiListBulletsFill } from 'react-icons/pi';
import { FaArrowUpRightDots } from 'react-icons/fa6';
import { FaFileInvoiceDollar } from 'react-icons/fa';
import { MdAdd } from 'react-icons/md';
import { IoIosArrowDown } from 'react-icons/io';
import { TextDefault, Box, InfoBox } from '../../stylesAppDefault';
import { colors } from '../../theme';
import {
  Container,
  DefaultButton,
  Input,
  Button,
  ListaEmpresasWrapper,
  SwalCustomStyles
} from './styles';

const Empresas = () => {
  const [areaModalAddEmpresa, setAreaModalAddEmpresa] = useState(false);
  const [empresas, setEmpresas] = useState([]);
  const [openInfoById, setOpenInfoById] = useState({});
  const [termoBusca, setTermoBusca] = useState('');
  const [areaModalListMotoristaInfo, setAreaModalListMotoristaInfo] = useState(false);
  const [areaModalListVeiculosInfo, setAreaModalListVeiculosInfo] = useState(false);
  const [areaModalEditEmpresa, setAreaModalEditEmpresa] = useState(false);
  const [areaModalChecklist, setAreaModalChecklist] = useState(false);
  const [empresaSelecionada, setEmpresaSelecionada] = useState(null);

  const openModalAdd = () => setAreaModalAddEmpresa(true);
  const toggleInfoEmpresa = (id) => setOpenInfoById((prev) => ({ ...prev, [id]: !prev[id] }));

  const empresasFiltradas = Array.isArray(empresas)
    ? empresas.filter((empresa) => empresa.nomeEmpresa?.toLowerCase().includes(termoBusca?.toLowerCase() || ''))
    : [];

  const areaModalListMotoristas = (id, n) => {
    setEmpresaSelecionada({ id, nome: n });
    setAreaModalListMotoristaInfo(true);
    setAreaModalListVeiculosInfo(false);
    setAreaModalEditEmpresa(false);
  };

  const areaModaladdVeiculo = (id, n) => {
    setEmpresaSelecionada({ id, nome: n });
    setAreaModalListVeiculosInfo(true);
    setAreaModalListMotoristaInfo(false);
    setAreaModalEditEmpresa(false);
  };

  const areaModalEditEmpresaNext = (id, n) => {
    setEmpresaSelecionada({ id, nome: n });
    setAreaModalListVeiculosInfo(false);
    setAreaModalListMotoristaInfo(false);
    setAreaModalEditEmpresa(true);
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
      cancelButtonColor: colors.black
    });

    if (confirm.isConfirmed) {
      try {
        const empresaRef = ref(db, `empresas/${empresaId}`);
        await remove(empresaRef);
        Swal.fire('Excluído!', `A empresa "${empresaNome}" foi excluída com sucesso.`, 'success');
        setEmpresas((prev) => prev.filter((emp) => emp.id !== empresaId));
      } catch (error) {
        console.error('Erro ao excluir a empresa:', error);
        Swal.fire('Erro!', 'Ocorreu um erro ao tentar excluir a empresa. Tente novamente.', 'error');
      }
    }
  };

  useEffect(() => {
    const companiesRef = ref(db, 'empresas');
    return onValue(companiesRef, (snap) => {
      const raw = snap.val() || {};
      const list = Object.keys(raw).map((k) => ({ id: k, ...raw[k] }));
      setEmpresas(list);
    });
  }, []);

  return (
    <Container>
      <SwalCustomStyles />
      <Box color={colors.black} width={'95%'} topSpace={'10px'} direction={'column'} align={'center'}>
        <Box
          width={'95%'}
          justify={'space-between'}
          align={'center'}
          topSpace={'10px'}
          paddingTop={'10px'}
          paddingLeft={'20px'}
          paddingRight={'20px'}
        >
          <Box direction="row" align="center">
            <GoOrganization size={'27px'} color={colors.silver} />
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

        <Box direction={'row'} align={'center'} width={'95%'}>
          <DefaultButton width="150px" onClick={openModalAdd}>
            <MdAdd size={'20px'} color={colors.silver} />
            <TextDefault color={colors.silver} size={'14px'} left={'5px'}>
              Nova empresa
            </TextDefault>
          </DefaultButton>
        </Box>
      </Box>

      {empresas.length === 0 ? (
        <TextDefault left={'20px'} top={'20px'} color={colors.silver}>
          Nenhuma empresa cadastrada.
        </TextDefault>
      ) : (
        <ListaEmpresasWrapper>
          {empresasFiltradas.map((empresa, index) => (
            <Box
              key={index}
              width={'100%'}
              height={'auto'}
              topSpace={'10px'}
              direction={'row'}
              align={'center'}
              justify={'flex-start'}
              color={colors.black}
              onClick={() => toggleInfoEmpresa(empresa.id)}
              style={{ cursor: 'pointer' }}
            >
              <Box direction={'column'} flex={'1'} justify={'flex-start'} align={'flex-start'} topSpace={'10px'}>
                <Box direction={'row'} width={'100%'} >
                  <Box leftSpace={'10px'} direction={'column'} width={'100%'} justify={'flex-start'} align={'flex-start'} >
                    <TextDefault color={colors.silver} size={'18px'} weight={'bold'} bottom={'5px'}>
                      {empresa.nomeEmpresa}
                    </TextDefault>
                    <TextDefault color={colors.silver} size={'12px'} bottom={'5px'}>
                      CNPJ: {empresa.cnpj}
                    </TextDefault>
                    <TextDefault color={colors.silver} size={'12px'} bottom={'5px'}>
                      Categoria: {empresa.tipo}
                    </TextDefault>
                    <TextDefault color={colors.silver} size={'12px'} bottom={'20px'}>
                      Status: {empresa.extras?.status || 'Não informado'}
                    </TextDefault>

                  </Box>
                  <Box direction={'column'}>
                    <IoIosArrowDown
                      size={'30px'}
                      color={colors.orange}
                      style={{
                        marginRight: '20px',
                        transform: openInfoById[empresa.id] ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease'
                      }}
                    />
                  </Box>
                </Box>

                <AnimatePresence>
                  {openInfoById[empresa.id] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.6 }}
                      style={{ overflow: 'hidden', width: '100%' }}
                    >

                      <InfoBox direction={'column'} open={true}>
                        <Box
                          color={colors.orange}
                          direction={'row'}
                          width={'97%'} b
                          bottomSpace={'10px'}
                          justify={'center'}
                          radius={'50px'}
                          style={{ overflow: 'hidden' }}
                        >

                          <Button direction={'row'} color={colors.orange} onClick={() => { }} right={'20px'}>
                            <FaArrowUpRightDots size={'17px'} />
                            <TextDefault color={colors.silver} size={'10px'} left={'7px'}>
                              Dashboard
                            </TextDefault>
                          </Button>

                          <Button direction={'row'} color={colors.orange} onClick={() => areaModalEditEmpresaNext(empresa.id, empresa.nomeEmpresa)} right={'20px'}>
                            <MdEditSquare size={'17px'} />
                            <TextDefault color={colors.silver} size={'10px'} left={'7px'}>
                              Editar
                            </TextDefault>
                          </Button>

                          <Button direction={'row'} color={colors.orange} onClick={() => areaModalListMotoristas(empresa.id, empresa.nomeEmpresa)} right={'20px'}>
                            <BiSolidUserCircle size={'17px'} />
                            <TextDefault color={colors.silver} size={'10px'} left={'7px'}>
                              Usuários
                            </TextDefault>
                          </Button>

                          <Button direction={'row'} color={colors.orange} onClick={() => areaModaladdVeiculo(empresa.id, empresa.nomeEmpresa)} right={'20px'}>
                            <FaTruckFront size={'17px'} />
                            <TextDefault color={colors.silver} size={'10px'} left={'7px'}>
                              Veículos
                            </TextDefault>
                          </Button>

                          <Button direction={'row'} color={colors.orange} onClick={() => areaModaladdVeiculo(empresa.id, empresa.nomeEmpresa)} right={'20px'}>
                            <GoHeartFill size={'17px'} />
                            <TextDefault color={colors.silver} size={'10px'} left={'7px'}>
                              Meets
                            </TextDefault>
                          </Button>

                          <Button direction={'row'} color={colors.orange} onClick={() => abrirModalChecklist(empresa.id, empresa.nomeEmpresa)} right={'20px'}>
                            <PiListBulletsFill size={'17px'} />
                            <TextDefault color={colors.silver} size={'10px'} left={'7px'}>
                              CheckList
                            </TextDefault>
                          </Button>

                          

                          <Button direction={'row'} color={colors.orange} onClick={() => areaModalDeleteEmpresa(empresa.id, empresa.nomeEmpresa)} right={'20px'}>
                            <FaWindowClose size={'17px'} />
                            <TextDefault color={colors.silver} size={'10px'} left={'7px'}>
                              Excluir
                            </TextDefault>
                          </Button>
                        </Box>
                      </InfoBox>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            </Box>
          ))}
        </ListaEmpresasWrapper>
      )}

      {areaModalAddEmpresa && <ModalAddEmpresa closeModalAddEmpresa={() => setAreaModalAddEmpresa(false)} />}

      {areaModalEditEmpresa && empresaSelecionada && (
        <ModalEditEmpresa closeModalEditEmpresa={() => setAreaModalEditEmpresa(false)} empresaId={empresaSelecionada.id} empresaNome={empresaSelecionada.nome} />
      )}

      {areaModalListMotoristaInfo && empresaSelecionada && (
        <ModalListaMotoristas closeModalListMotorista={() => setAreaModalListMotoristaInfo(false)} empresaId={empresaSelecionada.id} empresaNome={empresaSelecionada.nome} />
      )}

      {areaModalListVeiculosInfo && empresaSelecionada && (
        <ModalListaVeiculos closeModalListVeiculos={() => setAreaModalListVeiculosInfo(false)} empresaId={empresaSelecionada.id} empresaNome={empresaSelecionada.nome} />
      )}

      {areaModalChecklist && empresaSelecionada && (
        <ModalCheckList closeModalChecklist={() => setAreaModalChecklist(false)} empresaId={empresaSelecionada.id} empresaNome={empresaSelecionada.nome} />
      )}
    </Container>
  );
};

export default Empresas;
