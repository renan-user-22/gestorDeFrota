import React, { useState, useEffect } from 'react';

//Bibliotecas:
import Swal from 'sweetalert2';

//Banco de dados conexões:
import { db } from '../../../firebaseConnection';
import { ref, set, push } from 'firebase/database';

//Importação de components de Inputs:
import InputTelefone from '../../inputs/InputTelefone';
import InputCpf from '../../inputs/formatCPF';
import InputDate from '../../inputs/formatDate';

//Icones: 
import { FaWindowClose } from "react-icons/fa";
import { MdAddBox } from "react-icons/md";
import { LuSave } from "react-icons/lu";

//Estilos:
import { Box, TextDefault } from '../../../stylesAppDefault';
import { colors } from '../../../theme';
import {
    ModalAreaTotalDisplay,
    ModalAreaInfo,
    Input,
    Button,
    DefaultButton
} from './styles';

const AddMotorista = ({ closeModalAddMotorista, empresaIdProp }) => {

    const [cnhValidade, setCnhValidade] = useState('');
    const [telefoneMotorista, setTelefoneMotorista] = useState('');
    const [nomeMotorista, setNomeMotorista] = useState('');
    const [cnhMotorista, setCnhMotorista] = useState('');
    const [cnhCat, setCnhCat] = useState('');
    const [cnhDate, setCnhDate] = useState('');
    const [cpfMotorista, setCpfMotorista] = useState('');
    const [senha, setSenha] = useState('');
    const [obs, setObs] = useState('');

    const goBack = () => {
        closeModalAddMotorista()
    }

    const salvarMotorista = async () => {
        if (
            !nomeMotorista ||
            !cnhMotorista ||
            !cnhCat ||
            !cnhDate ||
            !cnhValidade ||
            !cpfMotorista
        ) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos obrigatórios',
                text: 'Por favor, preencha todos os campos obrigatórios.',
                confirmButtonColor: '#f27474'
            });
            return;
        }

        try {
            const motoristaRef = push(ref(db, `empresas/${empresaIdProp}/motoristas`));
            await set(motoristaRef, {
                nome: nomeMotorista,
                cpf: cpfMotorista,
                cnhCat: cnhCat,
                cnhDate: cnhDate,
                cnhValidade: cnhValidade,
                cnh: cnhMotorista,
                telefone: telefoneMotorista,
                senhaMotorista: senha,
                observacao: obs
            });

            Swal.fire({
                icon: 'success',
                title: 'Motorista cadastrado!',
                text: `${nomeMotorista} foi adicionado com sucesso.`,
                confirmButtonColor: '#3085d6'
            });

            closeModalAddMotorista();
            setNomeMotorista('');
            setCnhMotorista('');
            setTelefoneMotorista('');
            setCnhCat('');
            setCpfMotorista('');
            setCnhDate('');
            setCnhValidade('');
            setSenha('');
            setObs('');
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erro ao cadastrar',
                text: 'Não foi possível salvar o motorista. Tente novamente.',
                confirmButtonColor: '#d33'
            });
            console.error("Erro ao salvar motorista:", error);
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
                    bottomSpace={'20px'}
                    align={'center'}
                    justify={'space-between'}
                >
                    <Box leftSpace={'20px'}>
                        <MdAddBox size={'30px'} color={colors.silver} />
                        <TextDefault left={'10px'} color={colors.silver} weight={'bold'} size={'20px'}>Novo Motorista</TextDefault>
                    </Box>


                    <DefaultButton onClick={() => goBack()}>
                        <FaWindowClose size={'30px'} color={colors.silver} />
                    </DefaultButton>
                </Box>


                {/* Linha 1: Nome do motorista / CPF */}
                <Box direction="row" justify="space-between" align="flex-start" bottomSpace="10px" width="97%">
                    <Box flex={'1'} direction="column">
                        <TextDefault size="12px" color={colors.silver} bottom="5px">Nome</TextDefault>
                        <Input value={nomeMotorista} onChange={e => setNomeMotorista(e.target.value)} placeholder="Nome completo" />
                    </Box>

                    <Box direction="column" flex={'0.5'} leftSpace={'30px'}>
                        <TextDefault size="12px" color={colors.silver} bottom="5px">CPF</TextDefault>
                        <InputCpf value={cpfMotorista} onChange={setCpfMotorista} placeholder="000.000.000-00" />
                    </Box>

                    <Box flex={'0.5'} direction="column" leftSpace={'30px'}>
                        <TextDefault size="12px" color={colors.silver} bottom="5px">
                            Telefone/WhatsApp
                        </TextDefault>
                        <InputTelefone value={telefoneMotorista} onChange={setTelefoneMotorista} />
                    </Box>
                </Box>

                <Box direction="row" justify="space-between" align="center" bottomSpace="10px" width="97%">
                    <Box flex={'1.5'} direction="column">
                        <TextDefault size="12px" color={colors.silver} bottom="5px">CNH (NUMERO DE REGISTRO)</TextDefault>
                        <Input value={cnhMotorista} onChange={e => setCnhMotorista(e.target.value)} placeholder="Número da CNH" />
                    </Box>

                    <Box flex={'0.5'} direction="column" paddingLeft="20px">
                        <TextDefault size="12px" color={colors.silver} bottom="5px">CNH (Validade)</TextDefault>
                        <InputDate value={cnhValidade} onChange={setCnhValidade} placeholder="00/00/0000" />
                    </Box>

                    <Box flex={'1'} direction="column" paddingLeft="20px">
                        <TextDefault size="12px" color={colors.silver} bottom="5px">CNH (Categoria)</TextDefault>
                        <Input value={cnhCat} onChange={e => setCnhCat(e.target.value)} placeholder="A,B,C,D ou E" />
                    </Box>

                    <Box flex={'1'} direction="column" paddingLeft="20px">
                        <TextDefault size="12px" color={colors.silver} bottom="5px">CNH (Data 1ª Habilitação)</TextDefault>
                        <InputDate value={cnhDate} onChange={setCnhDate} placeholder="00/00/0000" />
                    </Box>
                </Box>

                {/* Linha 2: Senha */}
                <Box direction="row" justify="space-between" align="flex-start" bottomSpace="10px" width="70%">
                    
                    <Box flex={'1'} direction="column" >
                        <TextDefault size="12px" color={colors.silver} bottom="5px">Observação (CNH)</TextDefault>
                        <Input value={obs} onChange={e => setObs(e.target.value)} placeholder="EAR, Usa Oculos, etc..." />
                    </Box>

                    <Box flex={'1'} direction="column" leftSpace={'30px'}>
                        <TextDefault size="12px" color={colors.silver} bottom="5px">
                            Senha:
                        </TextDefault>
                        <Input
                            type="password"  // Definindo o campo como tipo "password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}  // Atualizando a senha
                            placeholder="Senha de acesso"
                        />
                    </Box>
                </Box>

                <Box direction="row" justify="space-between" topSpace="20px">
                    <Button onClick={() => salvarMotorista()}>
                        <LuSave color={colors.silver} size={'20px'} />
                        <TextDefault color={colors.silver} left={'10px'}>
                            Salvar
                        </TextDefault>
                    </Button>

                </Box>

            </ModalAreaInfo>
        </ModalAreaTotalDisplay>
    );
}

export default AddMotorista;