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
import { LuSave } from "react-icons/lu";
import { TbCancel } from "react-icons/tb";
import { PiPathBold } from "react-icons/pi";

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
    const [flagStatus, setFlagStatus] = useState('');

    // lê lista de empresas
    useEffect(() => {
        setPrazos(dadosMulta.prazos);
        setDataProtocolo(dadosMulta.dataProtocolo);
    }, []);

    useEffect(() => {
        setPrazos(dadosMulta.prazos);
        setDataProtocolo(dadosMulta.dataProtocolo);
        setFlagStatus(dadosMulta.flagStatus || ''); // Caso futuramente precise carregar
    }, []);

    const updateInfoStatusMulta = async () => {
        if (!status || !prazos || !flagStatus) {
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

            const valorMultaNumerico = Number(dadosMulta?.valorMulta);
            let valorPagoCalculado = 0;

            switch (status) {
                case 'Defesa_Previa':
                case 'Defesa_Previa_FICI':
                case 'Recurso_JARI':
                case 'Recurso_SETRAN':
                case 'NAIT_Aguardando_NPMT':
                case 'NPMT_Aguardando_Pagamento':
                case 'Multa_Anulada':
                    valorPagoCalculado = 0;
                    break;
                case 'Defesa_Previa_Condutor':
                case 'Pago':
                    valorPagoCalculado = valorMultaNumerico;
                    break;
                case 'Pago_20':
                case 'Pago_20_Recurso':
                    valorPagoCalculado = valorMultaNumerico * 0.8;
                    break;
                case 'Pago_40':
                    valorPagoCalculado = valorMultaNumerico * 0.6;
                    break;
                default:
                    valorPagoCalculado = 0;
                    break;
            }

            const updates = {
                status,
                prazos,
                dataProtocolo,
                valorPago: valorPagoCalculado,
                flagStatus // <-- Salva a Flag aqui
            };

            await update(ref(db, `empresas/${empresaId}/multas/${multaId}`), updates);

            Swal.fire({
                icon: 'success',
                title: 'Status e Flag atualizados com sucesso!',
            });

            closeModalEditStatud();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erro ao atualizar!',
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
                        <PiPathBold size={'30px'} color={colors.silver} />
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
                        <option value="Defesa_Previa">NAIT - Defesa Prévia</option>
                        <option value="Defesa_Previa_Condutor">NAIT - FICI</option>
                        <option value="Defesa_Previa_FICI">NAIT - Defesa Prévia + FICI</option>
                        <option value="Recurso_JARI">NPMT - Recurso à JARI</option>
                        <option value="Recurso_SETRAN">NPMT - Recurso ao SETRAN</option>
                        <option value="Pago">NPMT - Pago</option>
                        <option value="Pago_20">NPMT - Pago 20%</option>
                        <option value="Pago_40">NPMT - Pago 40%</option>
                        <option value="Pago_20_Recurso">NPMT - Pago 20% + Recurso</option>
                        <option value="NAIT_Aguardando_NPMT">NAIT - Aguardando NPMT</option>
                        <option value="NPMT_Aguardando_Pagamento">NPMT - Aguardando Pagamento</option>
                        <option value="Multa_Anulada">NPMT - AIT Anulado</option>
                    </select>
                </Box>

                <Box direction="column" flex="1" width={'39%'}>
                    <TextDefault size="12px" color={colors.silver} bottom="5px">Alterar Prazo Atual:</TextDefault>
                    <InputDate value={prazos} onChange={setPrazos} />
                </Box>

                <Box direction="column" flex="1" width={'39%'}>
                    <TextDefault top={'20px'} size="12px" color={colors.silver} bottom="5px">Alterar Protocolo Atual:</TextDefault>
                    <InputDate width={'70%'} value={dataProtocolo} onChange={setDataProtocolo} />
                </Box>

                <Box direction="column" flex="1" width={'39%'} topSpace={'20px'} bottomSpace={'20px'}>
                    <TextDefault size="12px" color={colors.silver} bottom="5px">Selecione Situação: </TextDefault>
                    <select
                        value={flagStatus}
                        onChange={(e) => setFlagStatus(e.target.value)}
                        style={{ height: '40px', width: '100%', borderRadius: '8px', padding: '5px' }}
                    >
                        <option value="">Selecione Situação</option>
                        <option value="Indeferido">🚫 Indeferido</option>
                        <option value="Deferido">✅ Deferido</option>
                        <option value="Pendente">⏳ Pendente / Em Andamento</option>
                    </select>
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