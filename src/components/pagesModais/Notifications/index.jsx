import React, { useState, useEffect } from 'react';

//Bibliotecas:
import Swal from 'sweetalert2';

//Banco de dados conexões:
import { db } from '../../../firebaseConnection';
import { ref, update } from 'firebase/database';

//Importação de components de Inputs:
import InputTelefone from '../../inputs/InputTelefone';

//Icones: 
import { FaWindowClose } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";


//Estilos:
import { Box, TextDefault } from '../../../stylesAppDefault';
import { colors } from '../../../theme';
import {
    ModalAreaTotalDisplay,
    ListaEmpresasWrapper,
    ModalAreaInfo,
    Button,
    DefaultButton
} from './styles';

const Notifications = ({ closeModalNotifications, notificacoes = [] }) => {
  const closeModal = () => {
    closeModalNotifications();
  };

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
              <IoMdNotifications size={'30px'} color={colors.silver} />
              <TextDefault left={'10px'} color={colors.silver} weight={'bold'} size={'21px'}>
                Notificações
              </TextDefault>
            </Box>

            <DefaultButton onClick={closeModal}>
              <FaWindowClose size={'30px'} color={colors.silver} />
            </DefaultButton>
          </Box>

          <Box direction={'column'} topSpace={'20px'} width={'100%'}>
            {notificacoes.length === 0 ? (
              <TextDefault color={colors.silver}>Nenhuma notificação no momento.</TextDefault>
            ) : (
              notificacoes.map((item, index) => (
                <Box
                  key={index}
                  color={colors.darkGrayTwo}
                  direction={'column'}
                  width={'95%'}
                  bottomSpace={'10px'}
                  paddingBottom={'10px'}
                  paddingTop={'10px'}
                  paddingLeft={'20px'}
                  radius={'7px'}
                >
                  {item.tipo === 'prazoMulta' ? (
                    <>
                      <TextDefault weight="bold" color={colors.silver}>
                        Multa com prazo próximo
                      </TextDefault>
                      <TextDefault color={colors.orange} weight="bold">
                        Prazo: {item.prazos} ({item.diasRestantes} dias restantes)
                      </TextDefault>
                      <TextDefault color={colors.silver}>
                        {item.numeroAIT} - {item.empresa}
                      </TextDefault>
                      <TextDefault color={colors.silver}>
                        Condutor: {item.nomeMotorista}
                      </TextDefault>
                      <TextDefault color={colors.silver}>
                        Status: {item.status}
                      </TextDefault>
                    </>
                  ) : (
                    <>
                      <TextDefault weight="bold" color={colors.silver}>
                        CNH com vencimento próximo
                      </TextDefault>
                      <TextDefault color={colors.orange} weight="bold">
                        Validade: {item.cnhValidade} ({item.diasRestantes} dias restantes)
                      </TextDefault>
                      <TextDefault color={colors.silver}>
                        Motorista: {item.nomeMotorista}
                      </TextDefault>
                      <TextDefault color={colors.silver}>
                        CPF: {item.cpf}
                      </TextDefault>
                      <TextDefault color={colors.silver}>
                        Empresa: {item.empresa}
                      </TextDefault>
                    </>
                  )}
                </Box>
              ))
            )}
          </Box>
        </ListaEmpresasWrapper>
      </ModalAreaInfo>
    </ModalAreaTotalDisplay>
  );
};

export default Notifications;
