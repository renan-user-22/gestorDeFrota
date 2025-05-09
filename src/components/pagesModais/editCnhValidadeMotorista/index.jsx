import React, { useState, useEffect } from 'react';

//Bibliotecas:
import Swal from 'sweetalert2';

//Banco de dados conexões:
import { db } from '../../../firebaseConnection';
import { ref, update } from 'firebase/database';

//Importação de components de Inputs:
import InputDate from '../../inputs/formatDate';

//Icones: 
import { FaWindowClose } from "react-icons/fa";
import { FaIdCard } from "react-icons/fa";
import { LuSave } from "react-icons/lu";
import { TbCancel } from "react-icons/tb";


//Estilos:
import { Box, TextDefault } from '../../../stylesAppDefault';
import { colors } from '../../../theme';
import {
    ModalAreaTotalDisplay,
    ModalAreaInfo,
    Button,
    DefaultButton,
    Input
} from './styles';

const EditCnhValidadeMotorista = ({ nomeMotorista, closeModalCnhEditMotorista, empresaIdProp, motoristaSelecionado }) => {

    const [cnhValidade, setCnhValidade] = useState('');
    const [obs, setObs] = useState('');

    const updateMotoristaActioncnhValid = () => {
        if (!motoristaSelecionado) return;

        if (!cnhValidade) {
            Swal.fire({
                icon: 'warning',
                title: 'Campo obrigatório',
                text: 'Por favor, preencha a validade da CNH.',
            });
            return;
        }

        if (cnhValidade.length < 10) {
            Swal.fire({
                icon: 'warning',
                title: 'Data inválida',
                text: 'A validade da CNH deve estar no formato DD/MM/AAAA.',
            });
            return;
        }

        const pathRef = ref(db, `empresas/${empresaIdProp}/motoristas/${motoristaSelecionado.id}`);

        update(pathRef, { 
            cnhValidade: cnhValidade,
            observacao:obs 
        })
            .then(() => {
                console.log('Validade do motorista atualizada com sucesso');
                Swal.fire({
                    icon: 'success',
                    title: 'Atualização bem-sucedida!',
                    text: 'A validade da CNH foi atualizada com sucesso.',
                });
                closeModalCnhEditMotorista();
                setCnhValidade('');
                setObs('');
            })
            .catch((error) => {
                console.error('Erro ao atualizar Validade da CNH:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erro ao atualizar!',
                    text: 'Ocorreu um erro ao atualizar a validade da CNH. Tente novamente mais tarde.',
                });
            });
    };


    useEffect(() => {
        if (motoristaSelecionado?.cnhValidade) {
            setCnhValidade(motoristaSelecionado.cnhValidade);
        }
    }, [motoristaSelecionado]);


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
                        <FaIdCard size={'30px'} color={colors.silver} />
                        <TextDefault left={'10px'} color={colors.silver} weight={'bold'} size={'21px'}>CNH do sr(a). {nomeMotorista}</TextDefault>
                    </Box>


                    <DefaultButton onClick={() => closeModalCnhEditMotorista()}>
                        <FaWindowClose size={'30px'} color={colors.silver} />
                    </DefaultButton>
                </Box>

                <Box flex={'1'} direction="column" width={'40%'} topSpace={'50px'} bottomSpace={'50px'}>
                    <TextDefault size="12px" color={colors.silver} bottom="5px" >
                        Atualizar validade:
                    </TextDefault>
                    <InputDate
                        value={cnhValidade}  // Valor vindo do estado
                        onChange={setCnhValidade}  // Atualizando o estado
                        placeholder="00/00/0000"
                    />
                </Box>

                <Box flex={'1'} direction="column" width={'40%'} topSpace={'50px'} bottomSpace={'50px'}>
                    <TextDefault size="12px" color={colors.silver} bottom="5px" >
                        Atualizar Observações:
                    </TextDefault>
                    <Input
                        value={obs}  // Valor vindo do estado
                        onChange={(e) => setObs((e.target.value))}  // Atualizando o estado
                        placeholder="EAR"
                    />
                </Box>

                {/* Ações */}
                <Box direction="row" justify="flex-start" align="center" width="100%" topSpace="0px">

                    <Button onClick={() => closeModalCnhEditMotorista()} right={'10px'} color={colors.black}>
                        <TbCancel color={colors.silver} size={'20px'} />
                        <TextDefault color={colors.silver} left={'10px'}>
                            Cancelar
                        </TextDefault>
                    </Button>

                    <Button onClick={() => updateMotoristaActioncnhValid()} left={'10px'}>
                        <LuSave color={colors.silver} size={'20px'} />
                        <TextDefault color={colors.silver} left={'10px'}>
                            Atualizar validade
                        </TextDefault>
                    </Button>

                </Box>

            </ModalAreaInfo>
        </ModalAreaTotalDisplay>
    );
}

export default EditCnhValidadeMotorista;