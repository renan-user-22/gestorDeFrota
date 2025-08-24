import React, { useState, useEffect } from 'react';

//Bibliotecas:
import Swal from 'sweetalert2';

//Banco de dados conexões:
import { db } from '../../../firebaseConnection';
import { ref, update } from 'firebase/database';


//Icones: 
import { IoClose } from "react-icons/io5";
import { IoMdNotifications } from "react-icons/io";


//Estilos:
import { Box, TextDefault } from '../../../stylesAppDefault';
import Developer from '../../../images/dev.png';
import { colors } from '../../../theme';
import {
  ModalAreaTotalDisplay,
  ListaEmpresasWrapper,
  ModalAreaInfo,
  Dev,
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
            color={colors.black}
            width={'100%'}
            height={'80px'}
            direction={'row'}
            bottomSpace={'10px'}
            align={'center'}
            justify={'space-between'}
          >
            <Box leftSpace={'20px'} justify={'center'} direction={'column'}>
              <Box>
                <IoMdNotifications size={'20px'} color={colors.silver} />
                <TextDefault left={'10px'} color={colors.silver} weight={'bold'} size={'17px'}>
                  Notificações
                </TextDefault>
              </Box>
              <TextDefault color={colors.silver} size={'13px'} top={'5px'}>
                Veículos com licenciamento pendente, CNH próximo do vencimento, Multas com Prazos próximos ao vencimento, a informação que deseja receber a notificação aparecerá aqui (Desenvolvido Sob Medida para a sua Frota)
              </TextDefault>
            </Box>

            <DefaultButton onClick={closeModal}>
              <IoClose size={'20px'} color={colors.silver} />
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

          <Dev src={Developer} width={'25%'} />


        </ListaEmpresasWrapper>
      </ModalAreaInfo>
    </ModalAreaTotalDisplay>
  );
};

export default Notifications;
