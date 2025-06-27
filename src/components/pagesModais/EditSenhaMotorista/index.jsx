// EditSenhaMotorista.jsx
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { ref, update } from 'firebase/database';
import { db } from '../../../firebaseConnection';

import { Box, TextDefault } from '../../../stylesAppDefault';
import { colors } from '../../../theme';
import {
  ModalAreaTotalDisplay,
  ModalAreaInfo,
  Button,
  DefaultButton,
  Input
} from './styles';

import { FaWindowClose } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { LuSave } from "react-icons/lu";
import { TbCancel } from "react-icons/tb";

const EditSenhaMotorista = ({ nomeMotorista, closeModalSenhaEditMotorista, empresaIdProp, motoristaSelecionado }) => {

  const [novaSenha, setNovaSenha] = useState('');

  const atualizarSenha = () => {
    if (!novaSenha || novaSenha.length < 4) {
      Swal.fire({
        icon: 'warning',
        title: 'Senha inválida',
        text: 'A senha deve ter no mínimo 4 caracteres.',
      });
      return;
    }

    const motoristaRef = ref(db, `empresas/${empresaIdProp}/motoristas/${motoristaSelecionado.id}`);

    update(motoristaRef, { senhaMotorista: novaSenha })
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Senha atualizada com sucesso!',
        });
        closeModalSenhaEditMotorista();
        setNovaSenha('');
      })
      .catch((error) => {
        console.error('Erro ao atualizar senha:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Não foi possível atualizar a senha. Tente novamente.',
        });
      });
  };

  return (
    <ModalAreaTotalDisplay>
      <ModalAreaInfo>

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
            <RiLockPasswordFill size="30px" color={colors.silver} />
            <TextDefault left="10px" color={colors.silver} weight="bold" size="21px">
              Atualizar senha do(a) {nomeMotorista}
            </TextDefault>
          </Box>

          <DefaultButton onClick={closeModalSenhaEditMotorista}>
            <FaWindowClose size="30px" color={colors.silver} />
          </DefaultButton>
        </Box>

        <Box flex="1" direction="column" width="40%" topSpace="50px" bottomSpace="50px">
          <TextDefault size="12px" color={colors.silver} bottom="5px">
            Nova senha:
          </TextDefault>
          <Input
            type="text"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            placeholder="Digite a nova senha"
          />
        </Box>

        <Box direction="row" justify="flex-start" align="center" width="100%">
          <Button onClick={closeModalSenhaEditMotorista} right="10px" color={colors.black}>
            <TbCancel color={colors.silver} size="20px" />
            <TextDefault color={colors.silver} left="10px">
              Cancelar
            </TextDefault>
          </Button>

          <Button onClick={atualizarSenha} left="10px">
            <LuSave color={colors.silver} size="20px" />
            <TextDefault color={colors.silver} left="10px">
              Atualizar Senha
            </TextDefault>
          </Button>
        </Box>

      </ModalAreaInfo>
    </ModalAreaTotalDisplay>
  );
};

export default EditSenhaMotorista;
