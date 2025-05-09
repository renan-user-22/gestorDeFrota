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
import { FaSquarePhone } from "react-icons/fa6";
import { LuSave } from "react-icons/lu";
import { TbCancel } from "react-icons/tb";


//Estilos:
import { Box, TextDefault } from '../../../stylesAppDefault';
import { colors } from '../../../theme';
import {
    ModalAreaTotalDisplay,
    ModalAreaInfo,
    Button,
    DefaultButton
} from './styles';

const EditTelMotorista = ({ nomeMotorista, closeModalTelefoneEditMotorista, empresaIdProp, motoristaSelecionado }) => {

    const [telefoneMotorista, setTelefoneMotorista] = useState('');

    const updateMotoristaActionTelefone = () => {
        if (!motoristaSelecionado) return;

        if (!telefoneMotorista) {
            Swal.fire({
                icon: 'warning',
                title: 'Campo obrigatório',
                text: 'Por favor, preencha o telefone do motorista.',
            });
            return;
        }

        if (telefoneMotorista.replace(/\D/g, '').length < 10) {
            Swal.fire({
                icon: 'warning',
                title: 'Telefone inválido',
                text: 'O telefone deve conter pelo menos 10 dígitos (DDD + número).',
            });
            return;
        }

        const pathRef = ref(db, `empresas/${empresaIdProp}/motoristas/${motoristaSelecionado.id}`);

        update(pathRef, { telefone: telefoneMotorista })
            .then(() => {
                console.log('Telefone atualizado com sucesso!');
                Swal.fire({
                    icon: 'success',
                    title: 'Atualização bem-sucedida!',
                    text: 'O telefone do motorista foi atualizado com sucesso.',
                });
                closeModalTelefoneEditMotorista();
                setTelefoneMotorista('');
            })
            .catch((error) => {
                console.error('Erro ao atualizar telefone:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erro ao atualizar!',
                    text: 'Ocorreu um erro ao atualizar o telefone. Tente novamente mais tarde.',
                });
            });
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
                    bottomSpace={'10px'}
                    align={'center'}
                    justify={'space-between'}
                >
                    <Box>
                        <FaSquarePhone size={'30px'} color={colors.silver} />
                        <TextDefault left={'10px'} color={colors.silver} weight={'bold'} size={'21px'}>Atualizar nº telefone do sr(a). {nomeMotorista}</TextDefault>
                    </Box>

                    <DefaultButton onClick={() => closeModalTelefoneEditMotorista()}>
                        <FaWindowClose size={'30px'} color={colors.silver} />
                    </DefaultButton>
                </Box>

                <Box flex={'1'} direction="column" width={'40%'} topSpace={'50px'} bottomSpace={'50px'}>
                    <TextDefault size="12px" color={colors.silver} bottom="5px" >
                        Novo telefone do motorista:
                    </TextDefault>
                    <InputTelefone value={telefoneMotorista} onChange={setTelefoneMotorista} /> {/* Atualizando o telefone */}
                </Box>

                {/* Ações */}
                <Box direction="row" justify="flex-start" align="center" width="100%" topSpace="0px">

                    <Button onClick={() => closeModalTelefoneEditMotorista()} right={'10px'} color={colors.black}>
                        <TbCancel color={colors.silver} size={'20px'} />
                        <TextDefault color={colors.silver} left={'10px'}>
                            Cancelar
                        </TextDefault>
                    </Button>

                    <Button onClick={() => updateMotoristaActionTelefone()} left={'10px'}>
                        <LuSave color={colors.silver} size={'20px'} />
                        <TextDefault color={colors.silver} left={'10px'}>
                            Atualizar nº de telefone
                        </TextDefault>
                    </Button>

                </Box>

            </ModalAreaInfo>
        </ModalAreaTotalDisplay>
    );
}

export default EditTelMotorista;