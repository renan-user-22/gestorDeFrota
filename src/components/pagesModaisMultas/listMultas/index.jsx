import React, { useState, useEffect } from 'react';

//Bibliotecas:
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from "framer-motion";
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

//Modais: 
import EditStatus from '../editStatus';
import EditInfrator from '../editInfrator';

//ícones
import { FaWindowClose } from "react-icons/fa";
import { MdAddBox } from "react-icons/md";
import { FaChevronDown } from 'react-icons/fa';
import { FaFileLines } from "react-icons/fa6";
import { PiPathBold } from "react-icons/pi";
import { FaFilePdf } from "react-icons/fa6";
import { MdNotificationImportant } from "react-icons/md";

//Banco de dados conexões:
import { db, app } from '../../../firebaseConnection';
import { ref, onValue, getDatabase, remove } from 'firebase/database';
import LogoImage from '../../../images/logomarca.png';

//Importações de estilos:
import { Box, TextDefault } from '../../../stylesAppDefault';
import { colors } from '../../../theme';
import {
  ModalAreaTotalDisplay,
  ModalAreaInfo,
  DefaultButton,
  Button,
  ListaEmpresasWrapper,
  Input,
} from './styles';

const ListaMotoristas = ({ closeModalListMultas, empresaId, empresaNome, empresaCpfCnpj }) => {

  const [multas, setMultas] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [multaExpandido, setMultaExpandido] = useState(null);
  const [tipoBusca, setTipoBusca] = useState('');
  const [multaIdState, setMultaIdState] = useState('');
  const [modalEditStatus, setModalEditStatus] = useState(false);
  const [modalEditCondutorInfrator, setModalEditCondutorInfrator] = useState(false);
  const [multaSelecionada, setMultaSelecionada] = useState(null);


  const toggleExpandirMotorista = (id) => {
    setMultaExpandido((prev) => (prev === id ? null : id));
  };

  const ExportPdfUnitary = (multa) => {
    const doc = new jsPDF();

    const img = new Image();
    img.src = LogoImage;

    img.onload = () => {
      // Logo no canto esquerdo (x=10, y=10)
      doc.addImage(img, 'PNG', 10, 10, 80, 20);

      // Título um pouco mais para baixo que a logo
      doc.setFontSize(15);
      doc.setTextColor(33, 37, 41);
      doc.text('RELATÓRIO DE MULTA', 15, 35);

      // Linha separadora logo abaixo do título
      doc.setDrawColor(200, 200, 200);
      doc.line(15, 40, 195, 40);

      // Começa o texto um pouco mais abaixo da linha, ex: 50 ou 55
      let startY = 55;

      const addField = (label, value) => {
        doc.setFont(undefined, 'bold');
        doc.text(`${label}:`, 15, startY);
        doc.setFont(undefined, 'normal');
        doc.text(`${value}`, 80, startY);
        startY += 10;
      };

      addField('Empresa', empresaNome);
      addField('Placa', multa.placaVeiculo);
      addField('Modelo', multa.modeloVeiculo);
      addField('Motorista', multa.nomeMotorista || 'Não identificado');
      addField('Status', multa.status);
      addField('Gravidade', multa.gravidade);
      addField('Pontos', multa.pontuacao);
      addField('Valor', `R$ ${multa.valorMulta}`);
      addField('Cidade', multa.cidade);
      addField('Endereço', multa.logradouro);
      addField('Infração no dia', multa.dataInfracao);
      addField('Data de Emissão', multa.dataEmissao);

      const dataCriacao = multa.criadoEm
        ? format(new Date(multa.criadoEm), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
        : 'Data inválida';

      addField('Criado em', dataCriacao);

      doc.save(`Multa_${multa.placaVeiculo}.pdf`);
    };
  };

  const geratePdfList = () => {
    const doc = new jsPDF({ orientation: 'landscape' });

    const title = `Relatório de Multas - ${empresaNome}`;

    const img = new Image();
    img.src = LogoImage;

    img.onload = () => {
      // Adiciona a imagem no topo do PDF
      doc.addImage(img, 'PNG', 14, 5, 60, 15); // (img, type, x, y, width, height)

      // Adiciona o título abaixo da imagem
      doc.setFontSize(14);
      doc.text(title, 80, 15);

      const data = multas.map((multa, index) => [
        index + 1,
        multa.placaVeiculo,
        multa.modeloVeiculo,
        multa.nomeMotorista || 'Não identificado',
        multa.status,
        multa.gravidade,
        multa.pontuacao,
        multa.valorMulta,
        multa.cidade,
        multa.logradouro,
        multa.dataInfracao,
        multa.dataEmissao,
        multa.criadoEm
          ? format(new Date(multa.criadoEm), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
          : 'Data inválida',
      ]);

      autoTable(doc, {
        head: [[
          '#',
          'Placa',
          'Veículo',
          'Motorista',
          'Status',
          'Gravidade',
          'Pts',
          'Valor',
          'Cidade',
          'Endereço',
          'Data Infração',
          'Data Emissão',
          'Criado em'
        ]],
        body: data,
        startY: 25,
        styles: {
          fontSize: 8,
        },
        headStyles: {
          fillColor: [255, 102, 0], // Laranja
          textColor: 255,
        },
      });

      doc.save(`Relatorio_Multas_${empresaNome}.pdf`);
    };
  };

  const deleteMulta = async (id) => {
    const confirm = await Swal.fire({
      title: 'Tem certeza?',
      text: 'Você deseja remover esta multa?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    });

    if (confirm.isConfirmed) {
      try {
        const database = getDatabase(app);
        await remove(ref(database, `empresas/${empresaId}/multas/${id}`));
        Swal.fire('Excluído!', 'A multa foi removida com sucesso.', 'success');

        // Atualiza a UI manualmente
        setMultas(prev => prev.filter(multa => multa.id !== id));

      } catch (error) {
        Swal.fire('Erro!', 'Não foi possível excluir a multa.', 'error');
        console.error('Erro ao excluir:', error);
      }
    }
  };

  const editStatus = (id) => {
    const encontrada = multas.find((item) => item.id === id);
    setMultaSelecionada(encontrada);
    setModalEditStatus(true);
    setModalEditCondutorInfrator(false);
    setMultaIdState(id);
  };

  const editCondutorInfrator = (id) => {
    const encontrada = multas.find((item) => item.id === id);
    setMultaSelecionada(encontrada);
    setModalEditCondutorInfrator(true);
    setModalEditStatus(false);
    setMultaIdState(id);
  }

  useEffect(() => {
    if (!empresaId) {
      Swal.fire('Erro', 'Erro ao localizar empresa ou multa!', 'error');
      return;
    }

    const db = getDatabase(app);
    const empresaRef = ref(db, `empresas/${empresaId}/multas`);

    onValue(empresaRef, (snapshot) => {
      const multasData = snapshot.val();
      const listaMultas = [];

      if (multasData) {
        Object.entries(multasData).forEach(([multaId, multa]) => {
          listaMultas.push({
            id: multaId,
            ...multa,
            empresa: empresaNome || 'Empresa não informada',
          });
        });
      }

      setMultas(listaMultas);
    });
  }, [empresaId, empresaNome]);

  return (
    <ModalAreaTotalDisplay>
      <ModalAreaInfo>
        <ListaEmpresasWrapper>
          <Box
            width={'100%'}
            height={'65px'}
            radius={'10px'}
            direction={'row'}

            topSpace={'10px'}
            bottomSpace={'10px'}
            align={'center'}
            justify={'space-between'}
          >
            <Box>
              <FaFileLines size={'30px'} color={colors.silver} />
              <TextDefault left={'10px'} color={colors.silver} weight={'bold'} size={'21px'}>Multas da Empresa {empresaNome}</TextDefault>
            </Box>

            <DefaultButton onClick={closeModalListMultas}>
              <FaWindowClose size={'30px'} color={colors.silver} />
            </DefaultButton>
          </Box>

          <Box align={'center'} justify={'flex-start'} height={'100px'} width={'98%'}>

            <Button color={colors.orange} onClick={geratePdfList} right={'20px'}>
              <FaFilePdf size={'30px'} color={colors.silver} />
            </Button>

            <Input
              type="text"
              placeholder="Buscar informações..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />

            <select
              value={tipoBusca}
              onChange={e => setTipoBusca(e.target.value)}
              style={{ height: '45px', width: '30%', borderRadius: '8px', padding: '5px', marginLeft: '10px' }}
            >
              <option value="">Tipo de pesquisa</option>
              <option value="Status">Status</option>
              <option value="Placa">Placa</option>
              <option value="Data">Data de registro</option>
            </select>

          </Box>

          {multas.length === 0 ? (
            <TextDefault top="10px" color={colors.silver}>
              Nenhuma multa registrada nesta empresa.
            </TextDefault>
          ) : (
            multas
              .filter((multa) => {
                if (!termoBusca || !tipoBusca) return true;

                const busca = termoBusca.toLowerCase();

                switch (tipoBusca) {
                  case 'Status':
                    return multa.status?.toLowerCase().includes(busca);
                  case 'Placa':
                    return multa.placaVeiculo?.toLowerCase().includes(busca);
                  case 'Data':
                    const dataFormatada = format(new Date(multa.criadoEm), "dd/MM/yyyy", { locale: ptBR }).toLowerCase();
                    return dataFormatada.includes(busca);
                  default:
                    return true;
                }
              })
              .map((multa) => (
                <Box
                  key={multa.id}
                  width="98%"
                  radius="10px"
                  color={colors.silver}
                  paddingLeft="10px"
                  paddingTop="10px"
                  paddingBottom="10px"
                  topSpace="10px"
                  direction="column"
                  style={{ border: `1px solid ${colors.silver}` }}
                >
                  <Box
                    width="100%"
                    justify="space-between"
                    align="center"
                    onClick={() => toggleExpandirMotorista(multa.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Box direction="column">
                      <TextDefault color={colors.black} weight="bold">
                        Placa: {multa.placaVeiculo}
                      </TextDefault>
                      <TextDefault color={colors.black} size="13px" weight="bold">
                        Veículo: {multa.modeloVeiculo} - Renavam: {multa.renavam}
                      </TextDefault>
                      <TextDefault color={colors.black} size="13px" weight="bold">
                        Proprietário: {multa.nomeProprietario} - CPF/CNPJ: {multa.cpfCnpjProprietario}
                      </TextDefault>
                      <TextDefault color={colors.orange} size="13px" weight="bold">
                        Status: {multa.status} - Prazo: {multa.prazos}
                      </TextDefault>
                    </Box>

                    <FaChevronDown
                      size={18}
                      color={colors.orange}
                      style={{
                        marginRight: '10px',
                        transform: multaExpandido === multa.id ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease',
                      }}
                    />
                  </Box>

                  <AnimatePresence>
                    {multaExpandido === multa.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Box direction="column" topSpace="10px">
                          <TextDefault color={colors.black} size="12px" bottom={'5px'} weight="bold">
                            DADOS:
                          </TextDefault>
                          <TextDefault color={colors.black} size="12px" bottom={'5px'}>
                            Número AIT: {multa.numeroAIT || 'Não informado'}
                          </TextDefault>
                          <TextDefault color={colors.black} size="12px" bottom={'5px'}>
                            Artigo: {multa.artigo}
                          </TextDefault>
                          <TextDefault color={colors.black} size="12px" bottom={'5px'}>
                            Motorista Infrator: {multa.nomeMotorista || 'Não indentificado'} - CPF: {multa.cpfCondutor || 'Não indentificado'}
                          </TextDefault>
                          <TextDefault color={colors.black} size="12px" bottom={'5px'}>
                            Data da Infração:{multa.dataInfracao} - Data de Emissão: {multa.dataEmissao}
                          </TextDefault>
                          <TextDefault color={colors.black} size="12px" bottom={'5px'}>
                            Protocolado Dia: {multa.dataProtocolo || 'Não informado'}
                          </TextDefault>
                          <TextDefault color={colors.black} size="12px" bottom={'5px'}>
                            Gravidade: {multa.gravidade} - {multa.pontuacao} Pontos
                          </TextDefault>
                          <TextDefault color={colors.black} size="12px" bottom={'5px'}>
                            Local da Infração: {multa.cidade}, {multa.logradouro} - {multa.numeroLocal}
                          </TextDefault>
                          <TextDefault color={colors.black} size="12px" bottom={'5px'}>
                            Órgão Autuador: {multa.orgaoAutuador}
                          </TextDefault>
                          <TextDefault color={'red'} size="12px" bottom={'5px'} weight={'bold'}>
                            Valor da Multa: {multa.valorMulta?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </TextDefault>
                          <TextDefault color={'blue'} size="12px" bottom={'5px'} weight={'bold'}>
                            Valor Pago ou Previsto: {multa.valorPago?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </TextDefault>
                          <TextDefault color={'green'} size="12px" bottom={'5px'} weight={'bold'}>
                            Economia Realizada ou Projetada: {
                              multa.valorMulta != null && multa.valorPago != null
                                ? (multa.valorMulta - multa.valorPago).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                : 'Não informado'
                            }
                          </TextDefault>

                          <TextDefault color={colors.black} size="12px" bottom={'5px'}>
                            Informações Adicionais: {multa.informacoesGerais || 'Não informado'}
                          </TextDefault>
                          <TextDefault color={colors.black} size="12px" bottom={'5px'}>
                            Registro no Sistema:  {multa.criadoEm ? format(new Date(multa.criadoEm), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) : 'Data inválida'}
                          </TextDefault>

                          <Box width="70%" topSpace="10px">

                            <Button width={'150px'} direction={'row'} color={colors.black} onClick={() => deleteMulta(multa.id)} right={'20px'}>
                              <FaWindowClose size={'17px'} />
                              <TextDefault color={colors.silver} size={'10px'} left={'7px'}>
                                Excluir
                              </TextDefault>
                            </Button>

                            <Button width={'150px'} direction={'row'} color={colors.orange} onClick={() => editStatus(multa.id, multa.placaVeiculo)} right={'20px'}>
                              <PiPathBold size={'17px'} />
                              <TextDefault color={colors.silver} size={'10px'} left={'7px'}>
                                Status
                              </TextDefault>
                            </Button>

                            <Button width={'150px'} direction={'row'} color={colors.orange} onClick={() => editCondutorInfrator(multa.id, multa.placaVeiculo)} right={'20px'}>
                              <MdAddBox size={'17px'} />
                              <TextDefault color={colors.silver} size={'10px'} left={'7px'}>
                                Adicionar Infrator
                              </TextDefault>
                            </Button>

                            <Button width={'150px'} direction={'row'} color={colors.orange} onClick={() => ExportPdfUnitary(multa)} right={'20px'}>
                              <FaFilePdf size={'17px'} />
                              <TextDefault color={colors.silver} size={'10px'} left={'7px'}>
                                Exportar pdf
                              </TextDefault>
                            </Button>

                          </Box>
                        </Box>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Box>
              ))
          )}

          {modalEditStatus && multaSelecionada && (
            <EditStatus
              closeModalEditStatud={() => {
                setModalEditStatus(false);
                setMultaSelecionada(null);
              }}
              empresaId={empresaId}
              multaId={multaIdState}
              dadosMulta={multaSelecionada}
            />
          )}

          {modalEditCondutorInfrator && multaSelecionada && (
            <EditInfrator
              closeModalEditInfrator={() => {
                setModalEditCondutorInfrator(false);
                setMultaSelecionada(null);
              }}
              empresaId={empresaId}
              multaId={multaIdState}
              dadosMulta={multaSelecionada}
            />
          )}


        </ListaEmpresasWrapper>
      </ModalAreaInfo>
    </ModalAreaTotalDisplay>
  );
}
export default ListaMotoristas;