import React, { useState, useEffect } from 'react';

// Bibliotecas:
import Swal from 'sweetalert2';
//import { differenceInCalendarDays, parse } from 'date-fns';

//Importação de components de Inputs:
import InputDate from '../../inputs/formatDate';
import InputDin from '../../inputs/InputValorReais';

// Firebase:
import { db } from '../../../firebaseConnection';
import { get, ref, set, child, update, onValue, push } from 'firebase/database';


// Ícones:
import { FaWindowClose } from "react-icons/fa";
import { LuSave } from "react-icons/lu";
import { FaFileInvoiceDollar } from 'react-icons/fa';

// Estilos:
import { Box, TextDefault } from '../../../stylesAppDefault';
import { colors } from '../../../theme';
import {
  ModalAreaTotalDisplay,
  ModalAreaInfo,
  Input,
  Button,
  DefaultButton,
  ListaEmpresasWrapper
} from './styles';

const CreateMultas = ({ closeModalAddMultas, empresaId, empresaNome, empresaCpfCnpj }) => {

  // Multa
  const [numeroAIT, setNumeroAIT] = useState('');
  const [orgaoAutuador, setOrgaoAutuador] = useState('');
  const [dataInfracao, setDataInfracao] = useState('');
  const [dataEmissao, setDataEmissao] = useState('');
  const [artigo, setArtigo] = useState('');
  const [gravidade, setGravidade] = useState('');
  const [pontuacao, setPontuacao] = useState(0);

  // Local da infração
  const [logradouro, setLogradouro] = useState('');
  const [numeroLocal, setNumeroLocal] = useState('');
  const [cidade, setCidade] = useState('');

  // Veículos e condutores
  const [veiculoSelecionado, setVeiculoSelecionado] = useState(null);
  const [listaVeiculos, setListaVeiculos] = useState([]);
  const [condutorSelecionado, setCondutorSelecionado] = useState(null);
  const [listaCondutores, setListaCondutores] = useState([]);
  const [cpfCondutor, setCpfCondutor] = useState('');

  // Proprietário (vindo do veículo)
  const [nomeProprietario, setNomeProprietario] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');

  const [prazos, setPrazos] = useState('');
  const [dataProtocolo, setDataProtocolo] = useState('');
  const [status, setStatus] = useState('');
  const [informacoesGerais, setInformacoesGerais] = useState('');
  const [valorMulta, setValorMulta] = useState('');
  const [valorPago, setValorPago] = useState('');

  //Buscando dados de veículos e condutores no Firebase:
  useEffect(() => {
    const veiculosRef = ref(db, `empresas/${empresaId}/veiculos`);
    const condutoresRef = ref(db, `empresas/${empresaId}/motoristas`);

    onValue(veiculosRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const veiculosArray = Object.entries(data).map(([key, value]) => ({ id: key, ...value }));
        setListaVeiculos(veiculosArray);
      }
    });

    onValue(condutoresRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const condutoresArray = Object.entries(data).map(([key, value]) => ({ id: key, ...value }));
        setListaCondutores(condutoresArray);
      }
    });
  }, [empresaId]);

  //Quando selecionar veículo, preencher proprietário:
  const handleSelecionarVeiculo = (veiculo) => {
    setVeiculoSelecionado(veiculo);
    if (veiculo?.proprietario) {
      setNomeProprietario(veiculo.proprietario.nome || '');
      setCpfCnpj(veiculo.proprietario.cpf || veiculo.proprietario.cnpj || '');
    } else {
      setNomeProprietario(empresaNome);
      setCpfCnpj('');
    }
  };

  const handleSelecionarMotorista = (condutor) => {
    setCondutorSelecionado(condutor);
    setCpfCondutor(condutor.cpf)
  }

  //Gravidade → Pontuação
  const gravidades = {
    Leve: 3,
    Média: 4,
    Grave: 5,
    'Gravíssima': 7
  };

  const handleGravidadeChange = (value) => {
    setGravidade(value);
    setPontuacao(gravidades[value] || 0);
  };

  //Voltar para a pagina anterior
  const goBack = () => {
    closeModalAddMultas();
  };

  const createregisterMultaaaaaa = async () => {
    if (!numeroAIT || !orgaoAutuador || !dataInfracao || !dataEmissao || !gravidade || !artigo) {
      Swal.fire({
        icon: 'warning',
        title: 'Preencha todos os campos obrigatórios!',
      });
      return;
    }

    // 🔄 Usando função segura para conversão de valor brasileiro
    const valorMultaNumerico = parseValorBrasileiro(valorMulta);

    if (isNaN(valorMultaNumerico)) {
      Swal.fire({
        icon: 'error',
        title: 'Valor da multa inválido!',
        text: 'Certifique-se de que o valor da multa está corretamente preenchido.',
      });
      return;
    }

    // 💰 Definindo valorPago com base no status
    let valorPagoCalculado = 0;

    switch (status) {
      case 'defesa_previa':
      case 'defesa_previa_FICI':
      case 'recurso_jari':
      case 'recurso_setran':
      case 'NAIT_aguardando_NPMT':
      case 'NPMT_aguardando_pagamento':
      case 'Multa_Anulada':
        valorPagoCalculado = 0;
        break;

      case 'defesa_previa_condutor':
      case 'pago':
        valorPagoCalculado = valorMultaNumerico;
        break;

      case 'pago_20':
      case 'pago_20_recurso':
        valorPagoCalculado = valorMultaNumerico * 0.8;
        break;

      case 'pago_40':
        valorPagoCalculado = valorMultaNumerico * 0.6;
        break;

      default:
        valorPagoCalculado = 0;
        break;
    }

    const novaMulta = {
      numeroAIT,
      orgaoAutuador,
      dataInfracao,
      dataEmissao,
      artigo,
      gravidade,
      pontuacao,

      // Local da infração
      logradouro,
      numeroLocal,
      cidade,

      // Veículo
      veiculoId: veiculoSelecionado?.id || '',
      placaVeiculo: veiculoSelecionado?.placa || '',
      modeloVeiculo: veiculoSelecionado?.modelo || '',
      renavam: veiculoSelecionado?.renavam || '',

      // Proprietário
      nomeProprietario,
      cpfCnpjProprietario: cpfCnpj || empresaCpfCnpj,

      // Condutor
      motoristaId: condutorSelecionado?.id || '',
      nomeMotorista: condutorSelecionado?.nome || '',
      cpfCondutor: condutorSelecionado?.cpf || '',

      // Outras informações
      prazos,
      dataProtocolo,
      status,
      informacoesGerais,
      valorMulta: valorMultaNumerico,
      valorPago: valorPagoCalculado,

      // Data do registro
      criadoEm: new Date().toISOString()
    };

    try {
      const multaRef = push(ref(db, `empresas/${empresaId}/multas`));
      await set(multaRef, novaMulta);

      Swal.fire({
        icon: 'success',
        title: 'Multa registrada com sucesso!',
      });

      closeModalAddMultas();
    } catch (error) {
      console.error('Erro ao registrar multa:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao registrar a multa',
        text: error.message,
      });
    }
  };

  const createregisterMulta = async () => {
    if (!numeroAIT || !orgaoAutuador || !dataInfracao || !dataEmissao || !gravidade || !artigo) {
      Swal.fire({
        icon: 'warning',
        title: 'Preencha todos os campos obrigatórios!',
      });
      return;
    }

    // Conversão do valor da multa para número
    const valorMultaNumerico = parseValorBrasileiro(valorMulta);

    if (isNaN(valorMultaNumerico) || valorMultaNumerico <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Valor da multa inválido!',
        text: 'Certifique-se de que o valor da multa está corretamente preenchido.',
      });
      return;
    }

    // 💰 Cálculo do valor pago com base no status
    let valorPagoCalculado = 0;

    switch (status) {
      case 'Pago':
        valorPagoCalculado = valorMultaNumerico;
        break;
      case 'Pago_20':
      case 'Pago_20_Recurso':
        valorPagoCalculado = valorMultaNumerico * 0.8;
        break;
      case 'Pago_40':
        valorPagoCalculado = valorMultaNumerico * 0.6;
        break;
      default:
        valorPagoCalculado = 0;
        break;
    }

    // 💸 Cálculo da economia
    const valorEconomia = valorMultaNumerico - valorPagoCalculado;

    // 📄 Objeto da multa
    const novaMulta = {
      numeroAIT,
      orgaoAutuador,
      dataInfracao,
      dataEmissao,
      artigo,
      gravidade,
      pontuacao,

      // Local da infração
      logradouro,
      numeroLocal,
      cidade,

      // Veículo
      veiculoId: veiculoSelecionado?.id || '',
      placaVeiculo: veiculoSelecionado?.placa || '',
      modeloVeiculo: veiculoSelecionado?.modelo || '',
      renavam: veiculoSelecionado?.renavam || '',

      // Proprietário
      nomeProprietario,
      cpfCnpjProprietario: cpfCnpj || empresaCpfCnpj,

      // Condutor
      motoristaId: condutorSelecionado?.id || '',
      nomeMotorista: condutorSelecionado?.nome || '',
      cpfCondutor: condutorSelecionado?.cpf || '',

      // Outras informações
      prazos,
      dataProtocolo,
      status,
      informacoesGerais,

      // Valores
      valorMulta: valorMultaNumerico,
      valorPago: valorPagoCalculado,
      valorEconomia: valorEconomia >= 0 ? valorEconomia : 0,

      // Data de criação
      criadoEm: new Date().toISOString(),
    };

    try {
      const multaRef = push(ref(db, `empresas/${empresaId}/multas`));
      await set(multaRef, novaMulta);

      Swal.fire({
        icon: 'success',
        title: 'Multa registrada com sucesso!',
      });

      closeModalAddMultas();
    } catch (error) {
      console.error('Erro ao registrar multa:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao registrar a multa',
        text: error.message,
      });
    }
  };



  function parseValorBrasileiro(valor) {
    if (!valor) return 0;
    const valorLimpo = valor
      .toString()
      .replace(/\./g, '')       // remove pontos (milhar)
      .replace(',', '.')        // troca vírgula decimal por ponto
      .replace(/[^\d.-]/g, ''); // remove tudo que não é número, ponto ou hífen
    return parseFloat(valorLimpo);
  }


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
            bottomSpace={'20px'}
            align={'center'}
            justify={'space-between'}
          >
            <Box leftSpace={'20px'}>
              <FaFileInvoiceDollar size={'30px'} color={colors.silver} />
              <TextDefault left={'10px'} color={colors.silver} weight={'bold'} size={'20px'}>Nova Multa da empresa {empresaNome}</TextDefault>
            </Box>

            <DefaultButton onClick={() => goBack()}>
              <FaWindowClose size={'30px'} color={colors.silver} />
            </DefaultButton>
          </Box>

          {/* Descrição */}
          <Box direction="row" justify="space-between" align="flex-start" bottomSpace="10px" width="97%">
            <Box direction="column" flex="1">
              <TextDefault size="12px" color={colors.silver} bottom="5px">Nº AIT</TextDefault>
              <Input value={numeroAIT} onChange={e => setNumeroAIT(e.target.value)} placeholder="Número da AIT" />
            </Box>

            <Box direction="column" flex="1" leftSpace="20px">
              <TextDefault size="12px" color={colors.silver} bottom="5px">Órgão autuador</TextDefault>
              <Input value={orgaoAutuador} onChange={e => setOrgaoAutuador(e.target.value)} placeholder="Órgão autuador" />
            </Box>

            <Box direction="column" flex="1" leftSpace="20px">
              <TextDefault size="12px" color={colors.silver} bottom="5px">Artigo</TextDefault>
              <Input value={artigo} onChange={e => setArtigo(e.target.value)} placeholder="Artigo do CTB" />
            </Box>
          </Box>

          {/* Descrição */}
          <Box direction="row" justify="space-between" align="flex-start" bottomSpace="10px" width="97%">
            <Box direction="column" flex="1">
              <TextDefault size="12px" color={colors.silver} bottom="5px">Data da infração</TextDefault>
              <InputDate value={dataInfracao} onChange={setDataInfracao} />
            </Box>

            <Box direction="column" flex="1" leftSpace="20px">
              <TextDefault size="12px" color={colors.silver} bottom="5px">Data de emissão</TextDefault>
              <InputDate value={dataEmissao} onChange={setDataEmissao} />
            </Box>

            <Box direction="column" flex="1" leftSpace="20px">
              <TextDefault size="12px" color={colors.silver} bottom="5px">Gravidade</TextDefault>
              <select
                value={gravidade}
                onChange={e => handleGravidadeChange(e.target.value)}
                style={{ height: '40px', borderRadius: '8px', padding: '5px' }}
              >
                <option value="">Selecione</option>
                <option value="Leve">Leve</option>
                <option value="Média">Média</option>
                <option value="Grave">Grave</option>
                <option value="Gravíssima">Gravíssima</option>
              </select>
            </Box>

            <Box direction="column" flex="0.5" leftSpace="20px">
              <TextDefault size="12px" color={colors.silver} bottom="5px">Pontuação</TextDefault>
              <Input value={pontuacao} disabled />
            </Box>
          </Box>

          {/* Descrição */}
          <Box direction="row" justify="space-between" align="flex-start" bottomSpace="10px" width="97%">
            <Box direction="column" flex="1">
              <TextDefault size="12px" color={colors.silver} bottom="5px">Valor da Multa (R$)</TextDefault>
              <InputDin
                value={valorMulta}
                onChange={setValorMulta}
                placeholder="Ex: 293.47"
              />
            </Box>

            <Box direction="column" flex="1" leftSpace="20px">
              <TextDefault size="12px" color={colors.silver} bottom="5px">Valor Pago | Previsão (R$)</TextDefault>
              <Input value={valorPago} disabled />
            </Box>
          </Box>

          {/* Descrição */}
          <Box direction="row" justify="space-between" align="flex-start" bottomSpace="10px" width="97%">
            <Box direction="column" flex="2">
              <TextDefault size="12px" color={colors.silver} bottom="5px">Logradouro da multa</TextDefault>
              <Input value={logradouro} onChange={e => setLogradouro(e.target.value)} placeholder="Rua / Avenida" />
            </Box>

            <Box direction="column" flex="0.5" leftSpace="20px">
              <TextDefault size="12px" color={colors.silver} bottom="5px">Número</TextDefault>
              <Input value={numeroLocal} onChange={e => setNumeroLocal(e.target.value)} placeholder="Número" />
            </Box>

            <Box direction="column" flex="1" leftSpace="20px">
              <TextDefault size="12px" color={colors.silver} bottom="5px">Cidade</TextDefault>
              <Input value={cidade} onChange={e => setCidade(e.target.value)} placeholder="Cidade" />
            </Box>
          </Box>

          {/* Descrição */}
          <Box direction="row" justify="space-between" align="flex-start" bottomSpace="10px" width="97%">
            <Box direction="column" flex="1">
              <TextDefault size="12px" color={colors.silver} bottom="5px">Veículo</TextDefault>
              <select
                value={veiculoSelecionado?.id || ''}
                onChange={e => {
                  const selected = listaVeiculos.find(v => v.id === e.target.value);
                  handleSelecionarVeiculo(selected);
                }}
                style={{ height: '40px', borderRadius: '8px', padding: '5px' }}
              >
                <option value="">Selecione</option>
                {listaVeiculos.map(veiculo => (
                  <option key={veiculo.id} value={veiculo.id}>
                    {veiculo.modelo} - {veiculo.placa}
                  </option>
                ))}
              </select>
            </Box>

            <Box direction="column" flex="1" leftSpace="20px">
              <TextDefault size="12px" color={colors.silver} bottom="5px">Nome do Condutor</TextDefault>
              <select
                value={condutorSelecionado?.id || ''}
                onChange={e => {
                  const condutor = listaCondutores.find(c => c.id === e.target.value);
                  handleSelecionarMotorista(condutor);
                }}
                style={{ height: '40px', borderRadius: '8px', padding: '5px' }}
              >
                <option value="">Indentifique o Infrator (Caso não seja o proprietário)</option>
                {listaCondutores.map(condutor => (
                  <option key={condutor.id} value={condutor.id}>
                    {condutor.nome}
                  </option>
                ))}
              </select>
            </Box>
          </Box>

          {/* Descrição */}
          <Box direction="row" justify="space-between" align="flex-start" bottomSpace="10px" width="97%">
            <Box direction="column" flex="1" width="95%">
              <TextDefault size="12px" color={colors.silver} bottom="5px">Proprietário</TextDefault>
              <Input value={nomeProprietario} disabled width="98%" />
            </Box>

            <Box direction="column" flex="1" leftSpace="20px" width="95%">
              <TextDefault size="12px" color={colors.silver} bottom="5px">CPF do Condutor</TextDefault>
              <Input value={cpfCondutor} disabled width="98%" />
            </Box>
          </Box>

          <Box direction="row" justify="space-between" align="flex-start" bottomSpace="10px" width="97%">
            <Box direction="column" flex="1">
              <TextDefault size="12px" color={colors.silver} bottom="5px">Status da multa</TextDefault>
              <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ height: '40px', width: '72%', borderRadius: '8px', padding: '5px' }}>
                <option value="">Selecione o status</option>
                <option value="Defesa_Previa">NAIT - Defesa Prévia</option>
                <option value="Defesa_Previa_Condutor">NAIT - FICI</option>
                <option value="Defesa_Previa_FICI">NAIT - Defesa Prévia + FICI</option>
                <option value="Recurso_JARI">NPMT - Recurso à JARI</option>
                <option value="Recurso_SETRAN">NPMT - Recurso ao SETRAN</option>
                <option value="Pago">NPMT - Pago</option>
                <option value="Pago_20">NPMT - Pago 20%</option>
                <option value="Pago_40">NPMT - Pago 40%</option>
                <option value="Pago_20_Recurso">NPMT - Pago 20% + Recurso</option>
                <option value="NAIT_Aguardando_NPMT">NAIT - Aguardando NPMT</option>
                <option value="NPMT_Aguardando_Pagamento">NPMT - Aguardando Pagamento</option>
                <option value="Multa_Anulada">NPMT - AIT Anulado</option>
              </select>

              <Box direction="column" flex="1" width={'70%'}>
                <TextDefault top={'20px'} size="12px" color={colors.silver} bottom="5px">Prazo</TextDefault>
                <InputDate value={prazos} onChange={setPrazos} />
              </Box>

              <Box direction="column" flex="1" width={'70%'}>
                <TextDefault top={'20px'} size="12px" color={colors.silver} bottom="5px">Protocolo</TextDefault>
                <InputDate width={'70%'} value={dataProtocolo} onChange={setDataProtocolo} />
              </Box>
            </Box>

            <Box direction="column" flex="1" width={'40%'}>
              {/* INFORMAÇÕES GERAIS */}
              <TextDefault size="12px" color={colors.silver} bottom="5px">Informações Gerais</TextDefault>
              <textarea
                value={informacoesGerais}
                onChange={(e) => setInformacoesGerais(e.target.value)}
                placeholder="Digite aqui qualquer informação adicional sobre a multa"
                rows={4}
                style={{
                  width: '98%', // largura fixa
                  height: '200px', // altura fixa
                  borderRadius: '10px',
                  padding: '10px',
                  resize: 'none', // impede redimensionamento manual, opcional
                  fontFamily: 'Octosquares Extra Light',
                  fontSize: '16px',
                }}
              />
            </Box>
          </Box>

          {/* Descrição*/}
          <Box direction="row" justify="space-between" topSpace="20px">
            <Button onClick={createregisterMulta}>
              <LuSave color={colors.silver} size={'20px'} />
              <TextDefault color={colors.silver} left={'10px'}>Salvar</TextDefault>
            </Button>
          </Box>
        </ListaEmpresasWrapper>

      </ModalAreaInfo>
    </ModalAreaTotalDisplay>
  );
};

export default CreateMultas;