import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

// Firebase
import { db } from '../../../firebaseConnection';
import { ref, update } from 'firebase/database';

// Ícones
import { FaWindowClose, FaIdCard } from "react-icons/fa";
import { LuSave } from "react-icons/lu";
import { TbCancel } from "react-icons/tb";

// Inputs formatados
import InputCpf from '../../inputs/formatCPF';
import InputCNPJ from '../../inputs/InputCNPJ';
import InputTelefone from '../../inputs/InputTelefone';

// Estilo
import { Box, TextDefault } from '../../../stylesAppDefault';
import { colors } from '../../../theme';
import {
  ModalAreaTotalDisplay,
  ModalAreaInfo,
  Button,
  Input,
  DefaultButton
} from './styles';

const ModalAtualizarProprietario = ({
  closeModalAtualizarProprietario,
  empresaIdProp,
  veiculoSelecionado,
  veiculoModelo
}) => {

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [contato, setContato] = useState('');

  const updateProprietarioVeiculo = () => {
    if (!nome || !contato) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos obrigatórios',
        text: 'Por favor, preencha nome e contato do proprietário.',
      });
      return;
    }

    const pathRef = ref(db, `empresas/${empresaIdProp}/veiculos/${veiculoSelecionado.id}`);

    const proprietarioData = {
      nome,
      cpf: cpf || '',
      cnpj: cnpj || '',
      contato
    };

    update(pathRef, { proprietario: proprietarioData, terceirizado: true })
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Atualização bem-sucedida!',
          text: 'Os dados do proprietário foram atualizados com sucesso.',
        });
        closeModalAtualizarProprietario();
      })
      .catch((error) => {
        console.error('Erro ao atualizar proprietário:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro ao atualizar!',
          text: 'Ocorreu um erro ao atualizar o proprietário. Tente novamente mais tarde.',
        });
      });
  };

  useEffect(() => {
    if (veiculoSelecionado?.proprietario) {
      setNome(veiculoSelecionado.proprietario.nome || '');
      setCpf(veiculoSelecionado.proprietario.cpf || '');
      setCnpj(veiculoSelecionado.proprietario.cnpj || '');
      setContato(veiculoSelecionado.proprietario.contato || '');
    }
  }, [veiculoSelecionado]);

  return (
    <ModalAreaTotalDisplay>
      <ModalAreaInfo>

        {/* Header */}
        <Box
          width="100%"
          height="65px"
          radius="10px"
          direction="row"
          topSpace="10px"
          bottomSpace="10px"
          align="center"
          justify="space-between"
        >
          <Box>
            <FaIdCard size="30px" color={colors.silver} />
            <TextDefault left="10px" color={colors.silver} weight="bold" size="21px">
              Proprietário do {veiculoModelo}
            </TextDefault>
          </Box>

          <DefaultButton onClick={closeModalAtualizarProprietario}>
            <FaWindowClose size="30px" color={colors.silver} />
          </DefaultButton>
        </Box>

        {/* Body */}
        <Box flex="1" direction="column" width="100%" topSpace="20px" bottomSpace="20px">

          <Box direction="row" width="100%" bottomSpace="10px">
            <Box direction="column" flex={'1'}>
              <TextDefault size="12px" color={colors.silver} bottom="5px">Nome</TextDefault>
              <Input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome completo"
              />
            </Box>

            <Box direction="column" flex={'0.8'} leftSpace="20px">
              <TextDefault size="12px" color={colors.silver} bottom="5px">CPF</TextDefault>
              <InputCpf
                value={cpf}
                onChange={setCpf}
                placeholder="CPF"
              />
            </Box>

            <Box direction="column" flex={'0.8'} leftSpace="20px">
              <TextDefault size="12px" color={colors.silver} bottom="5px">CNPJ</TextDefault>
              <InputCNPJ
                value={cnpj}
                onChange={setCnpj}
                placeholder="CNPJ (opcional)"
              />
            </Box>

            <Box direction="column" flex={'0.8'} leftSpace="20px">
              <TextDefault size="12px" color={colors.silver} bottom="5px">Contato</TextDefault>
              <InputTelefone
                value={contato}
                onChange={setContato}
                placeholder="WhatsApp ou telefone"
              />
            </Box>
          </Box>

        </Box>

        {/* Footer Buttons */}
        <Box direction="row" justify="flex-start" align="center" width="100%" topSpace="0px">
          <Button onClick={closeModalAtualizarProprietario} right="10px" color={colors.black}>
            <TbCancel color={colors.silver} size="20px" />
            <TextDefault color={colors.silver} left="10px">
              Cancelar
            </TextDefault>
          </Button>

          <Button onClick={updateProprietarioVeiculo} left="10px">
            <LuSave color={colors.silver} size="20px" />
            <TextDefault color={colors.silver} left="10px">
              Atualizar Proprietário
            </TextDefault>
          </Button>
        </Box>

      </ModalAreaInfo>
    </ModalAreaTotalDisplay>
  );
};

export default ModalAtualizarProprietario;
