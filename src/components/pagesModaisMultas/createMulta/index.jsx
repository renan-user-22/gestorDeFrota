import React, { useState } from 'react';

// Bibliotecas:
import Swal from 'sweetalert2';

//Importação de components de Inputs:
import InputTelefone from '../../inputs/InputTelefone';
import InputCpf from '../../inputs/formatCPF';
import InputCNPJ from '../../inputs/InputCNPJ';
import InputDate from '../../inputs/formatDate';

// Firebase:
import { db } from '../../../firebaseConnection';
import { ref, set, push } from 'firebase/database';

// Ícones:
import { FaWindowClose } from "react-icons/fa";
import { MdAddBox } from "react-icons/md";
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
  DefaultButton
} from './styles';

const CreateMultas = ({ closeModalAddVeiculos, empresaIdProp }) => {

  const [modelo, setModelo] = useState('');
  const [marca, setMarca] = useState('');
  const [placa, setPlaca] = useState('');
  const [chassi, setChassi] = useState('');
  const [ano, setAno] = useState('');
  const [renavam, setRenavam] = useState('');
  const [licenciamento, setLicenciamento] = useState('');
  const [tipo, setTipo] = useState('');

  const [isTerceirizado, setIsTerceirizado] = useState(false);
  const [nomeProprietario, setNomeProprietario] = useState('');
  const [cpfProprietario, setCpfProprietario] = useState('');
  const [cnpjProprietario, setCnpjProprietario] = useState('');
  const [contatoProprietario, setContatoProprietario] = useState('');



  const goBack = () => {
    closeModalAddVeiculos();
  };

  const salvarVeiculoooo = async () => {
    if (!modelo || !marca || !placa || !chassi || !ano || !renavam || !tipo || !licenciamento) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos obrigatórios',
        text: 'Por favor, preencha todos os campos obrigatórios.',
        confirmButtonColor: '#f27474'
      });
      return;
    }

    try {
      const veiculoRef = push(ref(db, `empresas/${empresaIdProp}/veiculos`));
      await set(veiculoRef, {
        modelo,
        marca,
        placa,
        licenciamento,
        chassi,
        ano,
        renavam,
        tipo
      });

      Swal.fire({
        icon: 'success',
        title: 'Veículo cadastrado!',
        text: `Veículo ${placa} adicionado com sucesso.`,
        confirmButtonColor: '#3085d6'
      });

      // Limpa campos e fecha modal
      setModelo('');
      setMarca('');
      setPlaca('');
      setChassi('');
      setAno('');
      setRenavam('');
      setLicenciamento('');
      setTipo('');
      closeModalAddVeiculos();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erro ao cadastrar',
        text: 'Não foi possível salvar o veículo. Tente novamente.',
        confirmButtonColor: '#d33'
      });
      console.error("Erro ao salvar veículo:", error);
    }
  };

  const salvarVeiculo = () => {
    alert("pegadinha do malandro heheee");
  }

  const salvarVeicudfdlo = async () => {
    // Verificações de campos obrigatórios
    if (!modelo || !marca || !placa || !chassi || !ano || !renavam || !tipo || !licenciamento) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos obrigatórios',
        text: 'Por favor, preencha todos os campos obrigatórios.',
        confirmButtonColor: '#f27474'
      });
      return;
    }

    // Validação extra se for terceirizado
    if (isTerceirizado) {
      if (!nomeProprietario || !contatoProprietario) {
        Swal.fire({
          icon: 'warning',
          title: 'Campos do proprietário',
          text: 'Preencha os campos de proprietário para veículos terceirizados (nome, CPF e contato).',
          confirmButtonColor: '#f27474'
        });
        return;
      }
    }

    if (!cpfProprietario && !cnpjProprietario) {
      Swal.fire({
        icon: 'warning',
        title: 'CPF ou CNPJ obrigatório',
        text: 'Preencha ao menos o CPF ou o CNPJ do proprietário.',
        confirmButtonColor: '#f27474'
      });
      return;
    }

    try {
      const veiculoRef = push(ref(db, `empresas/${empresaIdProp}/veiculos`));
      const veiculoData = {
        modelo,
        marca,
        placa,
        licenciamento,
        chassi,
        ano,
        renavam,
        tipo,
        terceirizado: isTerceirizado || false
      };

      // Adiciona dados do proprietário se for terceirizado
      if (isTerceirizado) {
        veiculoData.proprietario = {
          nome: nomeProprietario,
          cpf: cpfProprietario || '',
          cnpj: cnpjProprietario || '',
          contato: contatoProprietario
        };
      }

      await set(veiculoRef, veiculoData);

      Swal.fire({
        icon: 'success',
        title: 'Veículo cadastrado!',
        text: `Veículo ${placa} adicionado com sucesso.`,
        confirmButtonColor: '#3085d6'
      });

      // Limpa campos
      setModelo('');
      setMarca('');
      setPlaca('');
      setChassi('');
      setAno('');
      setRenavam('');
      setLicenciamento('');
      setTipo('');

      if (isTerceirizado) {
        setNomeProprietario('');
        setCpfProprietario('');
        setCnpjProprietario('');
        setContatoProprietario('');
        setIsTerceirizado(false);
      }

      closeModalAddVeiculos();

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erro ao cadastrar',
        text: 'Não foi possível salvar o veículo. Tente novamente.',
        confirmButtonColor: '#d33'
      });
      console.error("Erro ao salvar veículo:", error);
    }
  };



  return (
    <ModalAreaTotalDisplay>
      <ModalAreaInfo>

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
            <TextDefault left={'10px'} color={colors.silver} weight={'bold'} size={'20px'}>Nova Multa</TextDefault>
          </Box>

          <DefaultButton onClick={() => goBack()}>
            <FaWindowClose size={'30px'} color={colors.silver} />
          </DefaultButton>
        </Box>

        {/* Linha 1: Modelo / Marca / Placa */}
        <Box direction="row" justify="space-between" align="flex-start" bottomSpace="10px" width="97%">
          <Box flex={'1'} direction="column">
            <TextDefault size="12px" color={colors.silver} bottom="5px">Informações da multa</TextDefault>
            <Input value={modelo} onChange={e => setModelo(e.target.value)} placeholder="Informações da multa" />
          </Box>

          <Box direction="column" flex={'1'} leftSpace={'30px'}>
            <TextDefault size="12px" color={colors.silver} bottom="5px">Informações da multa</TextDefault>
            <Input value={marca} onChange={e => setMarca(e.target.value)} placeholder="Informações da multa" />
          </Box>

          <Box direction="column" flex={'0.6'} leftSpace={'30px'}>
            <TextDefault size="12px" color={colors.silver} bottom="5px">Informações da multa</TextDefault>
            <Input value={placa} onChange={e => setPlaca(e.target.value.toUpperCase())} placeholder="Informações da multa" />
          </Box>

          <Box flex={'1'} direction="column" paddingLeft="20px" leftSpace={'10px'}>
            <TextDefault size="12px" color={colors.silver} bottom="5px">Informações da multa</TextDefault>
            <Input value={licenciamento} onChange={e => setLicenciamento(e.target.value)} placeholder="Informações da multa" />
          </Box>
        </Box>

        {/* Linha 2: Cor / Ano / Tipo / Renavam */}
        <Box direction="row" justify="space-between" align="flex-start" bottomSpace="10px" width="97%">
          <Box flex={'0.8'} direction="column">
            <TextDefault size="12px" color={colors.silver} bottom="5px">Informações da multa</TextDefault>
            <Input value={chassi} onChange={e => setChassi(e.target.value)} placeholder="Informações da multa" />
          </Box>

          <Box flex={'0.5'} direction="column" paddingLeft="20px">
            <TextDefault size="12px" color={colors.silver} bottom="5px">Informações da multa</TextDefault>
            <Input value={ano} onChange={e => setAno(e.target.value)} placeholder="Informações da multa" />
          </Box>

          <Box flex={'0.8'} direction="column" paddingLeft="20px">
            <TextDefault size="12px" color={colors.silver} bottom="5px">Informações da multa</TextDefault>
            <Input value={tipo} onChange={e => setTipo(e.target.value)} placeholder="Informações da multa" />
          </Box>

          <Box flex={'1'} direction="column" paddingLeft="20px">
            <TextDefault size="12px" color={colors.silver} bottom="5px">Informações da multa</TextDefault>
            <Input value={renavam} onChange={e => setRenavam(e.target.value)} placeholder="Informações da multa" />
          </Box>
        </Box>


        <Box direction="row" justify="space-between" topSpace="20px">
          <Button onClick={salvarVeiculo}>
            <LuSave color={colors.silver} size={'20px'} />
            <TextDefault color={colors.silver} left={'10px'}>Salvar</TextDefault>
          </Button>
        </Box>

      </ModalAreaInfo>
    </ModalAreaTotalDisplay>
  );
};

export default CreateMultas;
