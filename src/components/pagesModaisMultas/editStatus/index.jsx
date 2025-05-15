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

const EditStatus = ({ closeModalEditStatud, dadosMulta, empresaId, multaId }) => {

    const [status, setStatus] = useState('');
    const [prazos, setPrazos] = useState('');
    const [dataProtocolo, setDataProtocolo] = useState('');

     // lê lista de empresas
      useEffect(() => {
       setPrazos(dadosMulta.prazos);
       setDataProtocolo(dadosMulta.dataProtocolo);
      }, []);

    const updateInfoStatusMulta = async () => {
        // Validação
        if (!status || !prazos ) {
            Swal.fire({
                icon: 'warning',
                title: 'Preencha todos os campos obrigatórios!',
            });
            return;
        }

        try {

            if (!empresaId || !multaId) {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro ao localizar empresa ou multa!',
                });
                return;
            }

            const updates = {
                status: status,
                prazos: prazos,
                dataProtocolo: dataProtocolo
            };

            await update(ref(db, `empresas/${empresaId}/multas/${multaId}`), updates);

            Swal.fire({
                icon: 'success',
                title: 'Status atualizado com sucesso!',
            });

            closeModalEditStatud();

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erro ao atualizar status!',
                text: error.message
            });
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
                    bottomSpace={'10px'}
                    align={'center'}
                    justify={'space-between'}
                >
                    <Box>
                        <FaSquarePhone size={'30px'} color={colors.silver} />
                        <TextDefault left={'10px'} color={colors.silver} weight={'bold'} size={'21px'}>Alterar Status da Multa da placa: {dadosMulta?.placaVeiculo}</TextDefault>
                    </Box>

                    <DefaultButton onClick={() => closeModalEditStatud()}>
                        <FaWindowClose size={'30px'} color={colors.silver} />
                    </DefaultButton>
                </Box>

                <Box flex={'1'} direction="column" width={'40%'} topSpace={'50px'} bottomSpace={'30px'}>
                    <TextDefault size={'20px'} color={colors.silver} bottom={'20px'}>Status Atual: {dadosMulta.status}</TextDefault>

                    <TextDefault size="12px" color={colors.silver} bottom="5px">Selecione um novo Status:</TextDefault>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ height: '40px', width: '100%', borderRadius: '8px', padding: '5px' }}>
                        <option value="">Selecione o status</option>
                        <option value="defesa_previa">NAIT - Defesa Prévia</option>
                        <option value="defesa_previa_condutor">NAIT - FICI</option>
                        <option value="defesa_previa_FICI">NAIT - Defesa Prévia + FICI</option>
                        <option value="recurso_jari">NPMT - Recurso à JARI</option>
                        <option value="recurso_setran">NPMT - Recurso ao SETRAN</option>
                        <option value="pago">NPMT - Pago</option>
                        <option value="pago_20">NPMT - Pago 20%</option>
                        <option value="pago_40">NPMT - Pago 40%</option>
                        <option value="pago_20_recurso">NPMT - Pago 20% + Recurso</option>
                        <option value="NAIT_aguardando_NPMT">NAIT - Aguardando NPMT</option>
                        <option value="NPMT_aguardando_pagamento">NPMT - Aguardando Pagamento</option>
                    </select>
                </Box>

                <Box direction="column" flex="1" width={'39%'}>
                    <TextDefault size="12px" color={colors.silver} bottom="5px">Alterar Prazo Atual</TextDefault>
                    <InputDate value={prazos} onChange={setPrazos} />
                </Box>

                <Box direction="column" flex="1" width={'39%'}>
                    <TextDefault top={'20px'} size="12px" color={colors.silver} bottom="5px">Alterar Protocolo Atual</TextDefault>
                    <InputDate width={'70%'} value={dataProtocolo} onChange={setDataProtocolo} />
                </Box>

                {/* Ações */}
                <Box direction="row" justify="flex-start" align="center" width="100%" topSpace="0px">

                    <Button onClick={() => closeModalEditStatud()} right={'10px'} color={colors.black}>
                        <TbCancel color={colors.silver} size={'20px'} />
                        <TextDefault color={colors.silver} left={'10px'}>
                            Cancelar
                        </TextDefault>
                    </Button>

                    <Button onClick={() => updateInfoStatusMulta()} left={'10px'}>
                        <LuSave color={colors.silver} size={'20px'} />
                        <TextDefault color={colors.silver} left={'10px'}>
                            Atualizar Status
                        </TextDefault>
                    </Button>

                </Box>

            </ModalAreaInfo>
        </ModalAreaTotalDisplay>
    );
}

export default EditStatus;