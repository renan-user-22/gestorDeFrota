import React, { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import { db } from '../../../firebaseConnection';
import { ref, get, update } from 'firebase/database';

// Estilos e utilitários visuais
import { Box, TextDefault } from '../../../stylesAppDefault';
import { colors } from '../../../theme';
import {
  ModalAreaTotalDisplay,
  ModalAreaInfo,
  Button,
  DefaultButton,
  Input,
  Select,
  CargoModalOverlay,
  CargoModalContent,
  CargoList,
  CargoItem,
  RemoveButton,
  SwalCustomStyles,
} from './styles';

// Inputs com máscara (iguais aos usados na tela de adicionar)
import InputCnpj from '../../inputs/InputCNPJ';
import InputTel from '../../inputs/InputTelefone';

// Ícones
import { MdEditSquare } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import { TbCancel } from 'react-icons/tb';
import { LuSave } from 'react-icons/lu';
import { IoMdAdd } from 'react-icons/io';
import { TiThList } from 'react-icons/ti';

/**
 * Componente de Edição de Empresa
 * - Visual e hierarquia replicados do Step1Empresa (adicionar)
 * - Mantém finalidade de edição (carrega do Firebase e salva no mesmo nó)
 */
const AreaModalEditEmpresa = ({ closeModalEditEmpresa, empresaNome, empresaId }) => {
  // Campos principais (espelham Step1Empresa)
  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [telefone, setTelefone] = useState('');

  // Endereço
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [complemento, setComplemento] = useState('');

  // Categoria (tipo) e Status (em extras.status)
  const [tipo, setTipo] = useState('');
  const [statusEmpresa, setStatusEmpresa] = useState('');

  // Cargos
  const [cargos, setCargos] = useState([]); // [{ nome, acesso }]
  const [cargoNome, setCargoNome] = useState('');
  const [cargoAcesso, setCargoAcesso] = useState('acesso');
  const [showCargoModal, setShowCargoModal] = useState(false);

  // Guarda extras atuais para preservarmos chaves (email/site) ao atualizar apenas status
  const [extrasOriginais, setExtrasOriginais] = useState({});

  // Carregar dados da empresa
  useEffect(() => {
    const carregar = async () => {
      try {
        const snap = await get(ref(db, `empresas/${empresaId}`));
        if (!snap.exists()) return;
        const data = snap.val();

        setNomeEmpresa(data.nomeEmpresa || '');
        setCnpj(data.cnpj || '');
        setTelefone(data.telefone || '');

        setLogradouro(data.endereco?.logradouro || '');
        setNumero(data.endereco?.numero || '');
        setBairro(data.endereco?.bairro || '');
        setComplemento(data.endereco?.complemento || '');

        setTipo(data.tipo || '');
        setStatusEmpresa(data.extras?.status || '');
        setExtrasOriginais(data.extras || {});

        setCargos(Array.isArray(data.cargos) ? data.cargos : []);
      } catch (err) {
        console.error('Erro ao carregar empresa', err);
        Swal.fire({ icon: 'error', title: 'Falha ao carregar dados', text: String(err?.message || err) });
      }
    };
    carregar();
  }, [empresaId]);

  // Validação principal
  const validar = () => {
    if (!nomeEmpresa || !cnpj || !telefone || !logradouro || !numero || !bairro) {
      Swal.fire({
        title: 'Atenção, preencha os campos obrigatórios.',
        text: 'Nome, CNPJ, Telefone, Logradouro, Nº e Bairro são obrigatórios.',
        icon: 'warning',
        customClass: {
          popup: 'swal-custom-popup',
          title: 'swal-custom-title',
          htmlContainer: 'swal-custom-text',
          confirmButton: 'swal-custom-confirm',
        },
      });
      return false;
    }

    if (!statusEmpresa) {
      Swal.fire({
        title: 'Informe o status da empresa.',
        icon: 'warning',
        customClass: {
          popup: 'swal-custom-popup',
          title: 'swal-custom-title',
          htmlContainer: 'swal-custom-text',
          confirmButton: 'swal-custom-confirm',
        },
      });
      return false;
    }

    return true;
  };

  // Ações com cargos (mesma UX da tela de adicionar)
  const handleAddCargo = () => {
    if (!cargoNome.trim()) {
      Swal.fire({
        title: 'Digite o nome do cargo!',
        icon: 'warning',
        customClass: {
          popup: 'swal-custom-popup',
          title: 'swal-custom-title',
          htmlContainer: 'swal-custom-text',
          confirmButton: 'swal-custom-confirm',
        },
      });
      return;
    }
    setCargos(prev => [...prev, { nome: cargoNome.trim(), acesso: cargoAcesso }]);
    setCargoNome('');
    setCargoAcesso('acesso');
  };

  const handleRemoveCargo = (cargo) => {
    setCargos(prev => prev.filter(c => !(c.nome === cargo.nome && c.acesso === cargo.acesso)));
  };

  // Salvar alterações preservando chaves de extras
  const salvar = async () => {
    if (!validar()) return;

    try {
      const updates = {};
      const base = `empresas/${empresaId}`;

      updates[`${base}/nomeEmpresa`] = nomeEmpresa;
      updates[`${base}/cnpj`] = cnpj;
      updates[`${base}/telefone`] = telefone;

      updates[`${base}/endereco`] = {
        logradouro,
        numero,
        bairro,
        complemento: complemento || '',
      };

      if (tipo) updates[`${base}/tipo`] = tipo; else updates[`${base}/tipo`] = '';

      // Preserva email e site existentes, atualizando somente status
      const extrasAtualizados = { ...(extrasOriginais || {}) };
      extrasAtualizados.status = statusEmpresa;
      updates[`${base}/extras`] = extrasAtualizados;

      // Substitui a lista de cargos pela atual (edição explícita)
      updates[`${base}/cargos`] = cargos;

      await update(ref(db), updates);

      Swal.fire({
        icon: 'success',
        title: 'Empresa atualizada com sucesso!',
        timer: 1800,
        showConfirmButton: false,
      });

      closeModalEditEmpresa && closeModalEditEmpresa();
    } catch (error) {
      console.error('Erro ao atualizar empresa:', error);
      Swal.fire({ icon: 'error', title: 'Erro ao atualizar', text: String(error?.message || error) });
    }
  };

  // Opções de categoria e status (idênticas às do Step1Empresa)
  const opcoesTipo = useMemo(
    () => [
      '',
      'Transportadora',
      'Locadora de Veículos',
      'Distribuidora',
      'Construção Civil',
      'Cooperativa de Transporte',
      'Empresa de Logística',
      'Fretamento e Turismo',
      'Mineração',
      'Agronegócio',
      'Serviços Públicos',
      'Indústria',
      'Comércio Varejista e Atacadista',
      'Outra',
    ],
    []
  );

  const opcoesStatus = useMemo(
    () => ['', 'Ativa', 'Inadimplente', 'Negociação', 'Suspensa'],
    []
  );

  return (
    <ModalAreaTotalDisplay>
      <SwalCustomStyles />

      <ModalAreaInfo>
        {/* Cabeçalho */}
        <Box color={colors.black} width={'100%'} direction={'column'} align={'center'} topSpace={'10px'}>
          <Box width={'95%'} height={'70px'} justify={'space-between'} align={'center'}>
            <Box direction={'row'} height={'100%'} align={'center'}>
              <MdEditSquare size={20} color={colors.silver} />
              <TextDefault color={colors.silver} weight="bold" size={'17px'} left={'10px'}>
                Atualizar dados da Empresa {empresaNome}
              </TextDefault>
            </Box>

            <DefaultButton onClick={closeModalEditEmpresa}>
              <IoClose size={30} color={colors.silver} />
            </DefaultButton>
          </Box>
        </Box>

        {/* Bloco: Informações da Empresa (linha Nome/CNPJ/Telefone) */}
        <Box direction={'column'} width={'100%'} topSpace={'40px'} color={colors.darkGrayTwo} align={'center'} paddingTop={'20px'} paddingBottom={'10px'}>
          

          <Box direction="row" justify="space-between" align="flex-start" bottomSpace="10px" width="94.5%">
            <Box flex={'1.5'} direction="column">
              <TextDefault size="12px" color={colors.silver} bottom="5px">Nome da Empresa</TextDefault>
              <Input placeholder="Nome da empresa" value={nomeEmpresa} onChange={e => setNomeEmpresa(e.target.value)} />
            </Box>

            <Box direction="column" flex={'1'} leftSpace={'30px'}>
              <TextDefault size="12px" color={colors.silver} bottom="5px" left={'20px'}>CNPJ</TextDefault>
              <InputCnpj value={cnpj} onChange={setCnpj} />
            </Box>

            <Box direction="column" flex={'1'} leftSpace={'30px'}>
              <TextDefault size="12px" color={colors.silver} bottom="5px">Telefone/WhatsApp</TextDefault>
              <InputTel value={telefone} onChange={setTelefone} />
            </Box>
          </Box>
        </Box>

        {/* Bloco: Endereço */}
        <Box direction={'column'} width={'100%'} color={colors.darkGrayTwo} topSpace={'40px'} align={'center'} paddingTop={'20px'} paddingBottom={'10px'}>
          <Box direction="row" justify="space-between" align="center" bottomSpace="10px" width="94.5%">
            <Box flex={'1.5'} direction="column">
              <TextDefault size="12px" color={colors.silver} bottom="5px">Logradouro</TextDefault>
              <Input placeholder="Logradouro" value={logradouro} onChange={e => setLogradouro(e.target.value)} />
            </Box>

            <Box flex={'0.5'} direction="column" paddingLeft="20px">
              <TextDefault size="12px" color={colors.silver} bottom="5px">Nº</TextDefault>
              <Input placeholder="Número" value={numero} onChange={e => setNumero(e.target.value)} />
            </Box>

            <Box flex={'1'} direction="column" paddingLeft="20px">
              <TextDefault size="12px" color={colors.silver} bottom="5px">Bairro</TextDefault>
              <Input placeholder="Bairro" value={bairro} onChange={e => setBairro(e.target.value)} />
            </Box>

            <Box flex={'1'} direction="column" paddingLeft="20px">
              <TextDefault size="12px" color={colors.silver} bottom="5px">Complemento</TextDefault>
              <Input placeholder="Complemento" value={complemento} onChange={e => setComplemento(e.target.value)} />
            </Box>
          </Box>
        </Box>

        {/* Bloco: Categoria / Status / Cargos */}
        <Box direction={'column'} width={'100%'} color={colors.darkGrayTwo} topSpace={'40px'} align={'center'} paddingTop={'20px'} paddingBottom={'10px'}>
          <Box direction="row" justify="space-between" align="center" bottomSpace="10px" width="94.5%">
            {/* Categoria */}
            <Box flex={'1'} direction="column">
              <TextDefault size="12px" color={colors.silver} bottom="5px">Categoria da empresa</TextDefault>
              <Select value={tipo} onChange={e => setTipo(e.target.value)}>
                {opcoesTipo.map((opt, i) => (
                  <option key={i} value={opt}>{opt ? opt : 'Selecione a categoria'}</option>
                ))}
              </Select>
            </Box>

            {/* Status */}
            <Box flex={'1'} direction="column" leftSpace={'30px'}>
              <TextDefault size="12px" color={colors.silver} bottom="5px">Status</TextDefault>
              <Select value={statusEmpresa} onChange={e => setStatusEmpresa(e.target.value)}>
                {opcoesStatus.map((opt, i) => (
                  <option key={i} value={opt}>{opt ? opt : 'Status da Empresa'}</option>
                ))}
              </Select>
            </Box>

            {/* Cargos */}
            <Box flex={'2'} direction="column" leftSpace={'30px'}>
              <TextDefault size="12px" color={colors.silver} bottom="5px">Cadastro de cargos</TextDefault>
              <Box direction="row" gap="30px">
                <Input placeholder="Nome do Cargo" value={cargoNome} onChange={e => setCargoNome(e.target.value)} />
                <Select value={cargoAcesso} onChange={e => setCargoAcesso(e.target.value)}>
                  <option value="acesso">Acesso</option>
                  <option value="gestao">Gestor</option>
                  <option value="motorista">Motorista</option>
                </Select>
                <Button onClick={handleAddCargo}>
                  <IoMdAdd size={20} color={colors.silver} />
                </Button>
                {cargos?.length > 0 && (
                  <Button onClick={() => setShowCargoModal(true)}>
                    <TiThList size={20} color={colors.silver} />
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Ações */}
        <Box direction="row" justify="flex-end" align="center" width="100%" topSpace={'40px'} bottomSpace={'10px'}>
          <Button onClick={closeModalEditEmpresa} right={'10px'} color={colors.black}>
            <TbCancel size={20} color={colors.silver} />
            <TextDefault color={colors.silver} left={'10px'}>Cancelar</TextDefault>
          </Button>

          <Button onClick={salvar} left={'10px'}>
            <LuSave size={20} color={colors.silver} />
            <TextDefault color={colors.silver} left={'10px'}>Atualizar Informações</TextDefault>
          </Button>
        </Box>
      </ModalAreaInfo>

      {/* Modal de Lista/Remoção de Cargos */}
      {showCargoModal && (
        <CargoModalOverlay onClick={() => setShowCargoModal(false)}>
          <CargoModalContent onClick={(e) => e.stopPropagation()}>
            <Box width={'100%'} height={'65px'} direction={'row'} color={colors.black} bottomSpace={'20px'} align={'center'} justify={'space-between'}>
              <TextDefault left={'20px'} size="17px" weight="bold" color={colors.silver}>Cargos Registrados</TextDefault>
              <RemoveButton onClick={() => setShowCargoModal(false)}>
                <IoClose size={30} color={colors.silver} />
              </RemoveButton>
            </Box>

            <CargoList>
              {Array.isArray(cargos) && cargos.length > 0 ? (
                cargos.map((cargo, index) => (
                  <CargoItem key={`${cargo.nome}-${cargo.acesso}-${index}`}>
                    <TextDefault size="13px" color={colors.silver}>
                      Nome do Cargo: {cargo.nome} - Acesso a plataforma de {cargo.acesso}
                    </TextDefault>
                    <RemoveButton onClick={() => handleRemoveCargo(cargo)}>
                      <IoClose size={20} color={colors.silver} />
                    </RemoveButton>
                  </CargoItem>
                ))
              ) : (
                <TextDefault size="12px" color={colors.silver}>Nenhum cargo registrado</TextDefault>
              )}
            </CargoList>
          </CargoModalContent>
        </CargoModalOverlay>
      )}
    </ModalAreaTotalDisplay>
  );
};

export default AreaModalEditEmpresa;
