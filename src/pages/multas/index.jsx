import React, { useState, useEffect } from 'react';

//Importações de Modais: 
import CreateMultasForm from '../../components/pagesModaisMultas/createMulta';
import ListMultas from '../../components/pagesModaisMultas/listMultas';

//Banco de dados conexões:
import { db } from '../../firebaseConnection';
import { ref, onValue } from 'firebase/database';

//Bibliotecas:
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from "framer-motion";

//ícones
import { GoOrganization } from 'react-icons/go';
import { FaFileInvoiceDollar } from 'react-icons/fa';
import { HiMiniUser } from "react-icons/hi2";
import { IoMdListBox } from "react-icons/io";
import { FaArrowUpRightDots } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";

//Estilos: 
import { TextDefault, Box, InfoBox } from '../../stylesAppDefault';
import { colors } from '../../theme';
import {
  Container,
  Input,
  Button,
  ListaEmpresasWrapper,
} from './styles';

const Multas = () => {

  const [empresas, setEmpresas] = useState([]);
  const [openInfoById, setOpenInfoById] = useState({});
  const [termoBusca, setTermoBusca] = useState('');

  const [areaModalListMotoristaInfo, setAreaModalListMotoristaInfo] = useState(false);
  const [areaModalFormAddMultas, setAreaModalFormAddMultas] = useState(false);
  const [areaModalEditEmpresa, setAreaModalEditEmpresa] = useState(false);
  const [empresaSelecionada, setEmpresaSelecionada] = useState(null);

  const toggleInfoEmpresa = (id) => {
    setOpenInfoById(prev => ({ ...prev, [id]: !prev[id] }));
  }

  const empresasFiltradas = Array.isArray(empresas)
    ? empresas.filter(empresa =>
      empresa.nome?.toLowerCase().includes(termoBusca?.toLowerCase() || "")
    )
    : [];

  const areaModaladdVeiculo = (id, n, cnpj) => {
    setEmpresaSelecionada({ id, nome: n, cnpj: cnpj }); // ← crie esse state para guardar o ID e nome da empresa
    setAreaModalFormAddMultas(true);
    setAreaModalListMotoristaInfo(false);
    setAreaModalEditEmpresa(false);
  }

  const areaModalListMultas = (id, n, cnpj) => {
    setEmpresaSelecionada({ id, nome: n, cnpj: cnpj }); // ← crie esse state para guardar o ID e nome da empresa
    setAreaModalFormAddMultas(false);
    setAreaModalListMotoristaInfo(true);
    setAreaModalEditEmpresa(false);
  }

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
          <FaFileInvoiceDollar size={'27px'} color={colors.silver} />
          <TextDefault left={'10px'} color={colors.silver} weight={'bold'} size={'20px'}>Gerenciamento de Multas</TextDefault>
        </Box>

        <Box leftSpace={'20px'}>

          <Button padding={'5px'} direction={'column'} color={colors.orange} onClick={() => areaModaladdVeiculo(empresa.id, empresa.nome)} right={'20px'}>
            <GoOrganization size={'17px'} />
            <TextDefault color={colors.silver} size={'10px'} top={'5px'}>
              P.J
            </TextDefault>
          </Button>

          <Button padding={'5px'} direction={'column'} color={colors.orange} onClick={() => areaModaladdVeiculo(empresa.id, empresa.nome)} right={'20px'}>
            <HiMiniUser size={'17px'} />
            <TextDefault color={colors.silver} size={'10px'} top={'5px'}>
              P.F
            </TextDefault>
          </Button>
        </Box>

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
              justify={'space-between'}
              paddingTop={'10px'}
              paddingLeft={'10px'}
              color={colors.silver}
              onClick={() => toggleInfoEmpresa(empresa.id)}
              style={{ cursor: 'pointer' }}
            >
              <Box direction={'column'} flex={'1'} >
                <Box direction={'column'} width={'100%'}>
                  <TextDefault color={colors.darkGray} size={'18px'} weight={'bold'} bottom={'5px'}>
                    {empresa.nome}
                  </TextDefault>
                  <TextDefault color={colors.darkGray} size={'12px'} bottom={'20px'}>
                    CNPJ: {empresa.cnpj}
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
                        <TextDefault color={colors.darkGray} size={'12px'} bottom={'5px'} weight={'bold'}>
                          DADOS:
                        </TextDefault>
                        <TextDefault color={colors.darkGray} size={'12px'} bottom={'10px'}>
                          Responsável da Empresa: {empresa.responsavelEmpresa} - Contato: {empresa.telefoneEmpresa}
                        </TextDefault>

                        <TextDefault color={colors.darkGray} size={'12px'} bottom={'10px'}>
                          Responsável da Frota: {empresa.responsavelFrota} - Contato: {empresa.telefoneFrota}
                        </TextDefault>

                        <TextDefault color={colors.darkGray} size={'12px'} bottom={'20px'}>
                          Endereço: {empresa.address?.logradouro}, Nº {empresa.address?.numero}, {empresa.address?.bairro} - {empresa.address?.complemento}
                        </TextDefault>

                        <Box
                          direction={'row'}
                          width={'auto'}
                          bottomSpace={'5px'}
                          paddingTop={'5px'}
                          justify={'flex-start'}
                          paddingBottom={'5px'}
                        >

                          <Button width={'100px'} direction={'column'} color={colors.orange} onClick={() => areaModaladdVeiculo(empresa.id, empresa.nome, empresa.cnpj)} right={'20px'}>
                            <IoMdListBox size={'17px'} />
                            <TextDefault color={colors.silver} size={'10px'} top={'5px'}>
                              Registrar
                            </TextDefault>
                          </Button>

                          <Button width={'100px'} direction={'column'} color={colors.orange} onClick={() => areaModalListMultas(empresa.id, empresa.nome)} right={'20px'}>
                            <FaFileInvoiceDollar size={'17px'} />
                            <TextDefault color={colors.silver} size={'10px'} top={'5px'}>
                              Exibir
                            </TextDefault>
                          </Button>

                        </Box>
                      </InfoBox>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>

              <Box direction={'column'}>
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

      {areaModalFormAddMultas && empresaSelecionada && (
        <CreateMultasForm
          closeModalAddMultas={() => setAreaModalFormAddMultas(false)}
          empresaId={empresaSelecionada.id}
          empresaNome={empresaSelecionada.nome}
          empresaCpfCnpj={empresaSelecionada.cnpj}
        />
      )}

      {areaModalListMotoristaInfo && empresaSelecionada && (
        <ListMultas
          closeModalListMultas={() => setAreaModalListMotoristaInfo(false)}
          empresaId={empresaSelecionada.id}
          empresaNome={empresaSelecionada.nome}
          empresaCpfCnpj={empresaSelecionada.cnpj}
        />
      )}

    </Container>
  );
};
export default Multas;