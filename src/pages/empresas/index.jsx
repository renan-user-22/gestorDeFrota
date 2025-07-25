import React, { useState, useEffect } from 'react';

//Importações de Modais: 
import ModalAddEmpresa from '../../components/pagesModais/addEmpresa';
import ModalListaMotoristas from '../../components/pagesModais/listaMotoristas';
import ModalListaVeiculos from '../../components/pagesModaisVeiculos/ModalListaVeiculos';
import ModalEditEmpresa from '../../components/pagesModais/ModalEditEmpresa';
import ModalCheckList from '../../components/pagesModais/ModalCheckList';

//Banco de dados conexões:
import { db } from '../../firebaseConnection';
import { ref, onValue, remove } from 'firebase/database';

//Bibliotecas:
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from "framer-motion";

//ícones
import { GoOrganization } from 'react-icons/go';
import { FaWindowClose } from "react-icons/fa";
import { MdEditSquare } from "react-icons/md";
import { BiSolidUserCircle } from "react-icons/bi";
import { FaTruckFront } from "react-icons/fa6";
import { PiSteeringWheelFill } from "react-icons/pi";
import { PiListBulletsFill } from "react-icons/pi";
import { FaArrowUpRightDots } from "react-icons/fa6";
import { MdAddBox } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

//Estilos: 
import { TextDefault, Box, InfoBox } from '../../stylesAppDefault';
import { colors } from '../../theme';
import {
  Container,
  DefaultButton,
  Input,
  Button,
  ListaEmpresasWrapper,
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

  const openModalAdd = () => {
    setAreaModalAddEmpresa(true);
  };

  const toggleInfoEmpresa = (id) => {
    setOpenInfoById(prev => ({ ...prev, [id]: !prev[id] }));
  }

  const empresasFiltradas = Array.isArray(empresas)
    ? empresas.filter(empresa =>
      empresa.nome?.toLowerCase().includes(termoBusca?.toLowerCase() || "")
    )
    : [];

  const areaModalListMotoristas = (id, n) => {
    setEmpresaSelecionada({ id, nome: n }); // ← crie esse state para guardar o ID e nome da empresa
    setAreaModalListMotoristaInfo(true);
    setAreaModalListVeiculosInfo(false);
    setAreaModalEditEmpresa(false);
  };

  const areaModaladdVeiculo = (id, n) => {
    setEmpresaSelecionada({ id, nome: n }); // ← crie esse state para guardar o ID e nome da empresa
    setAreaModalListVeiculosInfo(true);
    setAreaModalListMotoristaInfo(false);
    setAreaModalEditEmpresa(false);
  }

  const areaModalEditEmpresaNext = (id, n) => {
    setEmpresaSelecionada({ id, nome: n }); // ← crie esse state para guardar o ID e nome da empresa
    setAreaModalListVeiculosInfo(false);
    setAreaModalListMotoristaInfo(false);
    setAreaModalEditEmpresa(true);
  }

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
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    });

    if (confirm.isConfirmed) {
      try {
        const empresaRef = ref(db, `empresas/${empresaId}`);
        await remove(empresaRef);

        Swal.fire(
          'Excluído!',
          `A empresa "${empresaNome}" foi excluída com sucesso.`,
          'success'
        );

        // Atualiza a lista localmente sem precisar recarregar a página
        setEmpresas(prev => prev.filter(emp => emp.id !== empresaId));

      } catch (error) {
        console.error('Erro ao excluir a empresa:', error);
        Swal.fire(
          'Erro!',
          'Ocorreu um erro ao tentar excluir a empresa. Tente novamente.',
          'error'
        );
      }
    }
  };


  // lê lista de empresas
  useEffect(() => {
    const companiesRef = ref(db, 'empresas');
    return onValue(companiesRef, snap => {
      const raw = snap.val() || {};
      const list = Object.keys(raw).map(k => ({ id: k, ...raw[k] }));
      setEmpresas(list);
    });
  }, []);


  return (
    <Container>
      <Box
        width={'95%'}
        height={'65px'}
        radius={'10px'}
        direction={'row'}
        color={colors.black}
        topSpace={'10px'}
        bottomSpace={'20px'}
        align={'center'}
        justify={'space-between'}
      >
        <Box leftSpace={'20px'}>
          <GoOrganization size={'27px'} color={colors.silver} ma />
          <TextDefault left={'10px'} color={colors.silver} weight={'bold'} size={'20px'}>Empresas Cadastradas</TextDefault>
        </Box>

        <DefaultButton onClick={openModalAdd}>
          <MdAddBox size={'40px'} color={colors.orange} />
        </DefaultButton>
      </Box>

      <Box width={'95%'}>
        <Input
          type="text"
          placeholder="Buscar empresa pelo nome..."
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
        />
      </Box>

      {empresas.length === 0 ? (
        <TextDefault left={'20px'} top={'20px'} color={colors.silver}>Nenhuma empresa cadastrada.</TextDefault>
      ) : (
        <ListaEmpresasWrapper >
          {empresasFiltradas.map((empresa, index) => (

            <Box
              key={index}
              width={'99%'}
              height={'auto'}
              radius={'8px'}
              topSpace={'10px'}
              direction={'row'}
              align={'center'}
              justify={'flex-start'}
              paddingTop={'10px'}
              paddingLeft={'10px'}
              color={colors.darkGrayTwo}
              onClick={() => toggleInfoEmpresa(empresa.id)}
              style={{ cursor: 'pointer' }}
            >
              <Box direction={'column'} flex={'1'} justify={'flex-start'} align={'flex-start'}>
                <Box direction={'column'} width={'100%'} justify={'flex-start'} align={'flex-start'}>
                  <TextDefault color={colors.silver} size={'18px'} weight={'bold'} bottom={'5px'}>
                    {empresa.nome}
                  </TextDefault>
                  <TextDefault color={colors.silver} size={'12px'} bottom={'5px'}>
                    CNPJ: {empresa.cnpj}
                  </TextDefault>
                  <TextDefault color={colors.silver} size={'12px'} bottom={'20px'}>
                    Endereço: {empresa.address?.logradouro}, Nº {empresa.address?.numero}, {empresa.address?.bairro} - {empresa.address?.complemento}
                  </TextDefault>
                </Box>

                <AnimatePresence>
                  {openInfoById[empresa.id] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.6 }}
                      style={{ overflow: "hidden" }}
                    >
                      <InfoBox direction={'column'} open={true}>
                        
                        {Array.isArray(empresa.usuarios) && empresa.usuarios.length > 0 && (
                          <>
                            <TextDefault color={colors.silver} size={'12px'} bottom={'5px'} weight={'bold'}>
                              Usuários:
                            </TextDefault>

                            {empresa.usuarios.map((usuario, i) => (
                              <TextDefault
                                key={i}
                                color={colors.silver}
                                size={'12px'}
                                bottom={'8px'}
                              >
                                {i + 1}.<strong>{usuario.user}</strong> - Usuário: {usuario.nome} - Senha: {usuario.senha} - Cargo: {usuario.cargo} - Tel: {usuario.telefone}
                              </TextDefault>
                            ))}
                          </>
                        )}

                        <Box
                          direction={'row'}
                          width={'auto'}
                          bottomSpace={'5px'}
                          paddingTop={'5px'}
                          justify={'flex-start'}
                          paddingBottom={'5px'}
                        >
                          <Button direction={'column'} color={colors.darkGray} onClick={() => areaModalDeleteEmpresa(empresa.id, empresa.nome)} right={'20px'}>
                            <FaWindowClose size={'17px'} />
                            <TextDefault color={colors.silver} size={'10px'} top={'5px'}>
                              Excluir
                            </TextDefault>
                          </Button>

                          <Button direction={'column'} color={colors.orange} onClick={() => areaModalEditEmpresaNext(empresa.id, empresa.nome)} right={'20px'}>
                            <MdEditSquare size={'17px'} />
                            <TextDefault color={colors.silver} size={'10px'} top={'5px'}>
                              Editar
                            </TextDefault>
                          </Button>

                          <Button direction={'column'} color={colors.orange} onClick={() => areaModaladdVeiculo(empresa.id, empresa.nome)} right={'20px'}>
                            <FaTruckFront size={'17px'} />
                            <TextDefault color={colors.silver} size={'10px'} top={'5px'}>
                              Veículos
                            </TextDefault>
                          </Button>

                          <Button direction={'column'} color={colors.orange} onClick={() => areaModalListMotoristas(empresa.id, empresa.nome)} right={'20px'}>
                            <BiSolidUserCircle size={'17px'} />
                            <TextDefault color={colors.silver} size={'10px'} top={'5px'}>
                              Motoristas
                            </TextDefault>
                          </Button>

                          <Button direction={'column'} color={colors.orange} onClick={() => abrirModalChecklist(empresa.id, empresa.nome)} right={'20px'}>
                            <PiListBulletsFill size={'17px'} />
                            <TextDefault color={colors.silver} size={'10px'} top={'5px'}>
                              CheckList
                            </TextDefault>
                          </Button>

                          <Button direction={'column'} color={colors.orange} onClick={() => { }} right={'20px'}>
                            <FaArrowUpRightDots size={'17px'} />
                            <TextDefault color={colors.silver} size={'10px'} top={'5px'}>
                              Relatórios
                            </TextDefault>
                          </Button>

                        </Box>
                      </InfoBox>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>

              <Box direction={'column'} >
                <IoIosArrowDown
                  size={'30px'}
                  color={colors.orange}
                  style={{
                    marginRight: '10px',
                    transform: openInfoById[empresa.id] ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                  }}
                />
              </Box>

            </Box>
          ))}
        </ListaEmpresasWrapper>
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