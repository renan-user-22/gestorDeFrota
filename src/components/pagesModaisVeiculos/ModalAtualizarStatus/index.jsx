import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

// Firebase
import { db } from '../../../firebaseConnection';
import { ref, update } from 'firebase/database';

// Ícones
import { FaWindowClose, FaIdCard } from "react-icons/fa";
import { LuSave } from "react-icons/lu";
import { TbCancel } from "react-icons/tb";

// Estilo
import { Box, TextDefault } from '../../../stylesAppDefault';
import { colors } from '../../../theme';
import {
  ModalAreaTotalDisplay,
  ModalAreaInfo,
  Button,
  DefaultButton
} from './styles';

const ModalAtualizarStatus = ({
  closeModalAtualizarStatus,
  empresaIdProp,
  veiculoSelecionado,
  veiculoModelo
}) => {

  const [status, setStatus] = useState('');

  const updateStatusVeiculo = () => {
    if (!status) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo obrigatório',
        text: 'Por favor, selecione o status operacional.',
      });
      return;
    }

    const pathRef = ref(db, `empresas/${empresaIdProp}/veiculos/${veiculoSelecionado.id}`);

    update(pathRef, { status })
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Atualização bem-sucedida!',
          text: 'O status do veículo foi atualizado com sucesso.',
        });
        closeModalAtualizarStatus();
      })
      .catch((error) => {
        console.error('Erro ao atualizar o status:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro ao atualizar!',
          text: 'Ocorreu um erro ao atualizar o status. Tente novamente mais tarde.',
        });
      });
  };

  useEffect(() => {
    if (veiculoSelecionado?.status) {
      setStatus(veiculoSelecionado.status);
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
              Status Operacional do {veiculoModelo}
            </TextDefault>
          </Box>

          <DefaultButton onClick={closeModalAtualizarStatus}>
            <FaWindowClose size="30px" color={colors.silver} />
          </DefaultButton>
        </Box>

        {/* Body */}
        <Box flex="1" direction="column" width="40%" topSpace="50px" bottomSpace="50px">
          <TextDefault size="12px" color={colors.silver} bottom="5px">
            Status Operacional:
          </TextDefault>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
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
            <option value="">Selecione o status</option>
            <option value="Ativo">Ativo</option>
            <option value="Parado">Parado</option>
            <option value="Manutenção Preventiva">Manutenção Preventiva</option>
            <option value="Manutenção Corretiva">Manutenção Corretiva</option>
            <option value="Sinistrado">Sinistrado</option>
            <option value="Reserva">Reserva</option>
            <option value="Documentação Pendente">Documentação Pendente</option>
            <option value="Vendido / Desativado">Vendido / Desativado</option>
            <option value="Terceirizado Ativo">Terceirizado Ativo</option>
          </select>
        </Box>

        {/* Footer Buttons */}
        <Box direction="row" justify="flex-start" align="center" width="100%" topSpace="0px">
          <Button onClick={closeModalAtualizarStatus} right="10px" color={colors.black}>
            <TbCancel color={colors.silver} size="20px" />
            <TextDefault color={colors.silver} left="10px">
              Cancelar
            </TextDefault>
          </Button>

          <Button onClick={updateStatusVeiculo} left="10px">
            <LuSave color={colors.silver} size="20px" />
            <TextDefault color={colors.silver} left="10px">
              Atualizar Status
            </TextDefault>
          </Button>
        </Box>

      </ModalAreaInfo>
    </ModalAreaTotalDisplay>
  );
};

export default ModalAtualizarStatus;
