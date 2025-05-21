import React, { useState } from 'react';

// Bibliotecas:
import Swal from 'sweetalert2';

//Importação de components de Inputs:
import InputTelefone from '../../inputs/InputTelefone';
import InputCpf from '../../inputs/formatCPF';
import InputCNPJ from '../../inputs/InputCNPJ';

// Firebase:
import { db } from '../../../firebaseConnection';
import { ref, set, push } from 'firebase/database';

// Ícones:
import { FaWindowClose } from "react-icons/fa";
import { MdAddBox } from "react-icons/md";
import { LuSave } from "react-icons/lu";

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

const AddVeiculo = ({ closeModalAddVeiculos, empresaIdProp }) => {

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

  const salvarVeiculo = async () => {
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

    /*if (!cpfProprietario && !cnpjProprietario) {
      Swal.fire({
        icon: 'warning',
        title: 'CPF ou CNPJ obrigatório',
        text: 'Preencha ao menos o CPF ou o CNPJ do proprietário.',
        confirmButtonColor: '#f27474'
      });
      return;
    }*/

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
            <MdAddBox size={'30px'} color={colors.silver} />
            <TextDefault left={'10px'} color={colors.silver} weight={'bold'} size={'20px'}>Novo Veículo</TextDefault>
          </Box>

          <DefaultButton onClick={() => goBack()}>
            <FaWindowClose size={'30px'} color={colors.silver} />
          </DefaultButton>
        </Box>

        {/* Linha 1: Modelo / Marca / Placa */}
        <Box direction="row" justify="space-between" align="flex-start" bottomSpace="10px" width="97%">
          <Box flex={'1'} direction="column">
            <TextDefault size="12px" color={colors.silver} bottom="5px">Modelo</TextDefault>
            <Input value={modelo} onChange={e => setModelo(e.target.value)} placeholder="Ex: Onix 1.0" />
          </Box>

          <Box direction="column" flex={'1'} leftSpace={'30px'}>
            <TextDefault size="12px" color={colors.silver} bottom="5px">Marca</TextDefault>
            <Input value={marca} onChange={e => setMarca(e.target.value)} placeholder="Ex: Chevrolet" />
          </Box>

          <Box direction="column" flex={'0.6'} leftSpace={'30px'}>
            <TextDefault size="12px" color={colors.silver} bottom="5px">Placa</TextDefault>
            <Input value={placa} onChange={e => setPlaca(e.target.value.toUpperCase())} placeholder="ABC-1234" />
          </Box>

          <Box flex={'1'} direction="column" paddingLeft="20px" leftSpace={'10px'}>
            <TextDefault size="12px" color={colors.silver} bottom="5px">Licenciamento</TextDefault>
            <Input value={licenciamento} onChange={e => setLicenciamento(e.target.value)} placeholder="Ano do Licenciamento" />
          </Box>
        </Box>

        {/* Linha 2: Cor / Ano / Tipo / Renavam */}
        <Box direction="row" justify="space-between" align="flex-start" bottomSpace="10px" width="97%">
          <Box flex={'0.8'} direction="column">
            <TextDefault size="12px" color={colors.silver} bottom="5px">Chassi</TextDefault>
            <Input value={chassi} onChange={e => setChassi(e.target.value)} placeholder="Ex: Número do Chassi" />
          </Box>

          <Box flex={'0.5'} direction="column" paddingLeft="20px">
            <TextDefault size="12px" color={colors.silver} bottom="5px">Ano</TextDefault>
            <Input value={ano} onChange={e => setAno(e.target.value)} placeholder="Ex: 2020" />
          </Box>

          <Box flex={'0.8'} direction="column" paddingLeft="20px">
            <TextDefault size="12px" color={colors.silver} bottom="5px">Tipo</TextDefault>
            <select
              value={tipo}
              onChange={e => setTipo(e.target.value)}
              style={{
                height: '44px',
                borderRadius: '8px',
                border: `1px solid ${colors.silver}`,
                padding: '0 10px',
                backgroundColor: '#fff',
                color: colors.black,
                fontSize: '14px'
              }}
            >
              <option value="">Selecione o tipo de veículo</option>
              <option value="Carro de Passeio">Carro de Passeio</option>
              <option value="Utilitário">Utilitário</option>
              <option value="Van de Passageiros">Van de Passageiros</option>
              <option value="Van de Carga">Van de Carga</option>
              <option value="Moto / Motocicleta">Moto / Motocicleta</option>
              <option value="VUC – Veículo Urbano de Carga">VUC – Veículo Urbano de Carga</option>
              <option value="Caminhão 3/4">Caminhão 3/4</option>
              <option value="Caminhão Toco">Caminhão Toco</option>
              <option value="Caminhão Truck">Caminhão Truck</option>
              <option value="Cavalo Mecânico">Cavalo Mecânico</option>
              <option value="Carreta">Carreta</option>
              <option value="Bitrem">Bitrem</option>
              <option value="Rodotrem">Rodotrem</option>
              <option value="Micro-ônibus">Micro-ônibus</option>
              <option value="Ônibus">Ônibus</option>
              <option value="Caminhão-tanque">Caminhão-tanque</option>
              <option value="Outros">Outros</option>
            </select>
          </Box>


          <Box flex={'1'} direction="column" paddingLeft="10px">
            <TextDefault size="12px" color={colors.silver} bottom="5px">Renavam</TextDefault>
            <Input value={renavam} onChange={e => setRenavam(e.target.value)} placeholder="Número do Renavam" />
          </Box>
        </Box>

        {isTerceirizado && (
          <Box direction="row" justify="space-between" align="flex-start" bottomSpace="10px" width="97%">
            <Box flex={'1'} direction="column">
              <TextDefault size="12px" color={colors.silver} bottom="5px">Nome do proprietário</TextDefault>
              <Input value={nomeProprietario} onChange={e => setNomeProprietario(e.target.value)} placeholder="Nome completo" />
            </Box>

            <Box flex={'0.8'} direction="column" leftSpace="20px">
              <TextDefault size="12px" color={colors.silver} bottom="5px">CPF do proprietário</TextDefault>
              <InputCpf value={cpfProprietario} onChange={setCpfProprietario} placeholder="CPF" />
            </Box>

            <Box flex={'0.8'} direction="column" leftSpace="20px">
              <TextDefault size="12px" color={colors.silver} bottom="5px">CNPJ do proprietário (opcional)</TextDefault>
              <InputCNPJ value={cnpjProprietario} onChange={setCnpjProprietario} placeholder="CNPJ (se houver)" />
            </Box>

            <Box flex={'0.8'} direction="column" leftSpace="20px">
              <TextDefault size="12px" color={colors.silver} bottom="5px">Contato</TextDefault>
              <InputTelefone value={contatoProprietario} onChange={setContatoProprietario} placeholder="WhatsApp ou telefone" />
            </Box>
          </Box>
        )}


        {/* Linha 3: Cor / Ano / Tipo / Renavam */}
        <Box direction="row" align="center" topSpace="20px" bottomSpace="10px" width="97%">
          <input
            type="checkbox"
            checked={isTerceirizado}
            onChange={() => setIsTerceirizado(!isTerceirizado)}
          />
          <TextDefault left="10px" color={colors.silver} size="14px">
            Veículo terceirizado
          </TextDefault>
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

export default AddVeiculo;
