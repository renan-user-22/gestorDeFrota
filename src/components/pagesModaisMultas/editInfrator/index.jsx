import React, { useState, useEffect } from 'react';

//Bibliotecas:
import Swal from 'sweetalert2';

//Banco de dados conexões:
import { db } from '../../../firebaseConnection';
import { ref, update, getDatabase, onValue } from 'firebase/database';

//Icones: 
import { FaWindowClose } from "react-icons/fa";
import { LuSave } from "react-icons/lu";
import { TbCancel } from "react-icons/tb";
import { MdAddBox } from "react-icons/md";

//Estilos:
import { Box, TextDefault } from '../../../stylesAppDefault';
import { colors } from '../../../theme';
import {
    ModalAreaTotalDisplay,
    ModalAreaInfo,
    Button,
    DefaultButton
} from './styles';

const EditInfrator = ({ closeModalEditInfrator, dadosMulta, empresaId, multaId }) => {

    const [motoristas, setMotoristas] = useState([]);
    const [selectedMotoristaId, setSelectedMotoristaId] = useState('');
    const [selectedMotorista, setSelectedMotorista] = useState(null);

    useEffect(() => {
        const db = getDatabase();
        const motoristasRef = ref(db, `empresas/${empresaId}/motoristas`);

        onValue(motoristasRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const lista = Object.entries(data).map(([id, info]) => ({
                    id,
                    ...info
                }));
                setMotoristas(lista);
            }
        });
    }, [empresaId]);

    const handleSelectChange = (e) => {
        const motoristaId = e.target.value;
        setSelectedMotoristaId(motoristaId);

        const motorista = motoristas.find(m => m.id === motoristaId);
        setSelectedMotorista(motorista);
    };

    const handleSalvarInfrator = async () => {
        if (!selectedMotorista) {
            Swal.fire({
                icon: 'warning',
                title: 'Atenção',
                text: 'Selecione um motorista',
            });
            return;
        }

        const db = getDatabase();
        const multaRef = ref(db, `empresas/${empresaId}/multas/${multaId}`);

        const dadosInfrator = {
            motoristaId: selectedMotorista.id,
            nomeMotorista: selectedMotorista.nome,
            cpfCondutor: selectedMotorista.cpf,
        };

        try {
            await update(multaRef, dadosInfrator);
            Swal.fire({
                icon: 'success',
                title: 'Sucesso',
                text: 'Infrator adicionado com sucesso!',
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Erro ao salvar infrator: ' + error.message,
            });
        }

        closeModalEditInfrator();
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
                        <MdAddBox size={'30px'} color={colors.silver} />
                        <TextDefault left={'10px'} color={colors.silver} weight={'bold'} size={'21px'}>Identificar Condutor infrator da placa: {dadosMulta?.placaVeiculo}</TextDefault>
                    </Box>

                    <DefaultButton onClick={() => closeModalEditInfrator()}>
                        <FaWindowClose size={'30px'} color={colors.silver} />
                    </DefaultButton>
                </Box>

                <Box flex={'1'} direction="column" width={'40%'} topSpace={'50px'} bottomSpace={'30px'}>

                    <TextDefault size="12px" color={colors.silver} bottom="5px">Selecione o condutor infrator:</TextDefault>
                    <select onChange={handleSelectChange} value={selectedMotoristaId} style={{ height: '40px', width: '100%', borderRadius: '8px', padding: '5px' }}>
                        <option value="">Selecione um motorista</option>
                        {motoristas.map((motorista) => (
                            <option key={motorista.id} value={motorista.id}>
                                {motorista.nome} - {motorista.cpf}
                            </option>
                        ))}
                    </select>
                </Box>

                {/* Ações */}
                <Box direction="row" justify="flex-start" align="center" width="100%" topSpace="0px">

                    <Button onClick={() => closeModalEditInfrator()} right={'10px'} color={colors.black}>
                        <TbCancel color={colors.silver} size={'20px'} />
                        <TextDefault color={colors.silver} left={'10px'}>
                            Cancelar
                        </TextDefault>
                    </Button>

                    <Button onClick={() => handleSalvarInfrator()} left={'10px'}>
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

export default EditInfrator;