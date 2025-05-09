import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { db } from '../../../firebaseConnection';
import { ref, update, get } from 'firebase/database';

// Inputs e ícones
import { FaWindowClose, FaIdCard } from "react-icons/fa";
import { LuSave } from "react-icons/lu";
import { TbCancel } from "react-icons/tb";

//inputs Mascaras: 
import InputTelefone from '../../inputs/InputTelefone';

// Estilos
import { Box, TextDefault } from '../../../stylesAppDefault';
import { colors } from '../../../theme';
import {
    ModalAreaTotalDisplay,
    ModalAreaInfo,
    Button,
    DefaultButton,
    Input
} from './styles';

const AreaModalEditEmpresa = ({ closeModalEditEmpresa, empresaNome, empresaId }) => {
    const [responsavelEmpresa, setResponsavelEmpresa] = useState('');
    const [telefoneEmpresa, setTelefoneEmpresa] = useState('');
    const [responsavelFrota, setResponsavelFrota] = useState('');
    const [telefoneFrota, setTelefoneFrota] = useState('');
    const [logradouro, setLogradouro] = useState('');
    const [numero, setNumero] = useState('');
    const [bairro, setBairro] = useState('');
    const [complemento, setComplemento] = useState('');

    useEffect(() => {
        const fetchEmpresaInfo = async () => {
            const empresaRef = ref(db, `empresas/${empresaId}`);
            const snapshot = await get(empresaRef);

            if (snapshot.exists()) {
                const data = snapshot.val();
                setResponsavelEmpresa(data.responsavelEmpresa || '');
                setTelefoneEmpresa(data.telefoneEmpresa || '');
                setResponsavelFrota(data.responsavelFrota || '');
                setTelefoneFrota(data.telefoneFrota || '');
                setLogradouro(data.address?.logradouro || '');
                setNumero(data.address?.numero || '');
                setBairro(data.address?.bairro || '');
                setComplemento(data.address?.complemento || '');
            }
        };

        fetchEmpresaInfo();
    }, [empresaId]);

    const updateEmpresa = async () => {
        try {
            await update(ref(db, `empresas/${empresaId}`), {
                responsavelEmpresa,
                telefoneEmpresa,
                responsavelFrota,
                telefoneFrota,
                address: {
                    logradouro,
                    numero,
                    bairro,
                    complemento
                }
            });

            Swal.fire({
                icon: 'success',
                title: 'Empresa atualizada com sucesso!',
                timer: 2000,
                showConfirmButton: false
            });

            closeModalEditEmpresa();

        } catch (error) {
            console.error("Erro ao atualizar empresa:", error);
            Swal.fire({
                icon: 'error',
                title: 'Erro ao atualizar empresa',
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
                        <FaIdCard size={'30px'} color={colors.silver} />
                        <TextDefault left={'10px'} color={colors.silver} weight={'bold'} size={'21px'}>
                            Atualizar Empresa {empresaNome}
                        </TextDefault>
                    </Box>

                    <DefaultButton onClick={closeModalEditEmpresa}>
                        <FaWindowClose size={'30px'} color={colors.silver} />
                    </DefaultButton>
                </Box>

                {/* Responsáveis */}
                <Box direction="column" width="100%" gap="10px" topSpace="30px">

                    <Box direction="row" justify="space-between" width="100%">
                        <Box width="48%" direction="column">
                            <TextDefault size="12px" color={colors.silver} bottom="5px">Responsável da Empresa</TextDefault>
                            <Input value={responsavelEmpresa} onChange={e => setResponsavelEmpresa(e.target.value)} />
                        </Box>

                        <Box width="48%" direction="column">
                            <TextDefault size="12px" color={colors.silver} bottom="5px">Contato da Empresa</TextDefault>
                            <InputTelefone value={telefoneEmpresa} onChange={setTelefoneEmpresa} />
                        </Box>
                    </Box>

                    <Box direction="row" justify="space-between" width="100%">
                        <Box width="48%" direction="column">
                            <TextDefault size="12px" color={colors.silver} bottom="5px">Responsável da Frota</TextDefault>
                            <Input value={responsavelFrota} onChange={e => setResponsavelFrota(e.target.value)} />
                        </Box>

                        <Box width="48%" direction="column">
                            <TextDefault size="12px" color={colors.silver} bottom="5px">Contato da Frota</TextDefault>
                            <InputTelefone value={telefoneFrota} onChange={setTelefoneFrota} />
                        </Box>
                    </Box>

                </Box>

                {/* Endereço */}
                <Box direction="column" width="100%" gap="10px" topSpace="20px">
                    <TextDefault size="14px" color={colors.silver} weight="bold">Endereço</TextDefault>

                    <Box direction="row" justify="space-between" width="100%">
                        <Box flex={'1'} direction="column">
                            <TextDefault size="12px" color={colors.silver} bottom="5px">Logradouro</TextDefault>
                            <Input placeholder="Logradouro" value={logradouro} onChange={e => setLogradouro(e.target.value)} />
                        </Box>

                        <Box flex={'0.3'} direction="column" leftSpace={'30px'}>
                            <TextDefault size="12px" color={colors.silver} bottom="5px">Nº</TextDefault>
                            <Input placeholder="Número" value={numero} onChange={e => setNumero(e.target.value)} />
                        </Box>
                    </Box>

                    <Box direction="row" justify="space-between" width="100%">
                        <Box flex={'1'} direction="column" >
                            <TextDefault size="12px" color={colors.silver} bottom="5px">Bairro</TextDefault>
                            <Input placeholder="Bairro" value={bairro} onChange={e => setBairro(e.target.value)} />
                        </Box>

                        <Box flex={'0.7'} direction="column"  leftSpace={'30px'}>
                            <TextDefault size="12px" color={colors.silver} bottom="5px">Complemento</TextDefault>
                            <Input placeholder="Complemento" value={complemento} onChange={e => setComplemento(e.target.value)} />
                        </Box>
                    </Box>
                </Box>



                {/* Botões de ação */}
                <Box direction="row" justify="flex-start" align="center" width="100%" topSpace="30px">

                    <Button onClick={closeModalEditEmpresa} right={'10px'} color={colors.black}>
                        <TbCancel color={colors.silver} size={'20px'} />
                        <TextDefault color={colors.silver} left={'10px'}>
                            Cancelar
                        </TextDefault>
                    </Button>

                    <Button onClick={updateEmpresa} left={'10px'}>
                        <LuSave color={colors.silver} size={'20px'} />
                        <TextDefault color={colors.silver} left={'10px'}>
                            Atualizar Informações
                        </TextDefault>
                    </Button>

                </Box>

            </ModalAreaInfo>
        </ModalAreaTotalDisplay>
    );
};

export default AreaModalEditEmpresa;
