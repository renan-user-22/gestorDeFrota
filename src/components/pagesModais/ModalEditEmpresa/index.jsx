import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { db } from '../../../firebaseConnection';
import { ref, update, get } from 'firebase/database';

// Inputs e ícones
import { FaWindowClose, FaIdCard } from "react-icons/fa";
import { LuSave } from "react-icons/lu";
import { TbCancel } from "react-icons/tb";
import { FaDeleteLeft } from "react-icons/fa6";

//inputs Mascaras: 
import InputTelefone from '../../inputs/InputTelefone';

// Estilos
import { Box, TextDefault } from '../../../stylesAppDefault';
import { colors } from '../../../theme';
import {
    ModalAreaTotalDisplay,
    ModalAreaInfo,
    ModalContentScroll,
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
    const [usuarios, setUsuarios] = useState([]);

    const handleUsuarioChange = (index, field, value) => {
        const updated = [...usuarios];
        updated[index][field] = field === 'nome'
            ? value.toLowerCase().replace(/\s/g, '')
            : value;
        setUsuarios(updated);
    };

    const handleAdicionarUsuario = () => {
        setUsuarios([...usuarios, { nome: '', senha: '', cargo: '', telefone: '' }]);
    };

    const handleRemoverUsuario = (index) => {
        if (usuarios.length === 1) return;
        const updated = usuarios.filter((_, i) => i !== index);
        setUsuarios(updated);
    };

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
                setUsuarios(data.usuarios || []);
            }
        };

        fetchEmpresaInfo();
    }, [empresaId]);

    const updateEmpresa = async () => {
        if (
            usuarios.some(
                (u) =>
                    !u.nome || !u.senha || !u.cargo || !u.telefone ||
                    /\s/.test(u.nome) || u.nome !== u.nome.toLowerCase()
            )
        ) {
            Swal.fire({
                icon: 'warning',
                title: 'Verifique os usuários',
                text: 'Todos os usuários devem ter nome, senha, cargo e telefone. Nomes devem ser minúsculos e sem espaços.',
                confirmButtonColor: '#f27474'
            });
            return;
        }

        try {
            await update(ref(db, `empresas/${empresaId}`), {
                responsavelEmpresa,
                telefoneEmpresa,
                responsavelFrota,
                telefoneFrota,
                address: { logradouro, numero, bairro, complemento },
                usuarios
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
                <ModalContentScroll>

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
                                Atualizar dados da Empresa {empresaNome}
                            </TextDefault>
                        </Box>

                        <DefaultButton onClick={closeModalEditEmpresa}>
                            <FaWindowClose size={'30px'} color={colors.silver} />
                        </DefaultButton>
                    </Box>

                    {/* Edição de Usuários */}
                    <Box direction="column" width="100%" topSpace="30px">
                        <TextDefault size="14px" color={colors.silver} weight="bold">Usuários</TextDefault>

                        <Box topSpace="10px">
                            <Button onClick={handleAdicionarUsuario}>
                                + Adicionar Usuário
                            </Button>
                        </Box>

                        {usuarios.map((usuario, index) => (
                            <Box key={index} direction="row" justify="space-between" align="center" bottomSpace="10px" width="100%" topSpace="10px">
                                <Box width="22%" direction="column">
                                    <TextDefault size="12px" color={colors.silver} bottom="5px">Usuário</TextDefault>
                                    <Input
                                        placeholder="Usuário"
                                        value={usuario.nome}
                                        onChange={(e) => handleUsuarioChange(index, 'nome', e.target.value)}
                                    />
                                </Box>

                                <Box width="22%" direction="column">
                                    <TextDefault size="12px" color={colors.silver} bottom="5px">Senha</TextDefault>
                                    <Input
                                        type="password"
                                        placeholder="Senha"
                                        value={usuario.senha}
                                        onChange={(e) => handleUsuarioChange(index, 'senha', e.target.value)}
                                    />
                                </Box>

                                <Box width="22%" direction="column">
                                    <TextDefault size="12px" color={colors.silver} bottom="5px">Cargo</TextDefault>
                                    <Input
                                        placeholder="Cargo"
                                        value={usuario.cargo}
                                        onChange={(e) => handleUsuarioChange(index, 'cargo', e.target.value)}
                                    />
                                </Box>

                                <Box width="22%" direction="column">
                                    <TextDefault size="12px" color={colors.silver} bottom="5px">Telefone</TextDefault>
                                    <InputTelefone
                                        value={usuario.telefone}
                                        onChange={(v) => handleUsuarioChange(index, 'telefone', v)}
                                    />
                                </Box>

                                {usuarios.length > 1 && (
                                    <Box direction="column" leftSpace="10px" justify="flex-end">
                                        <Button
                                            top={'10px'}
                                            color={colors.orange}
                                            onClick={() => handleRemoverUsuario(index)}
                                        >
                                            <FaDeleteLeft color={colors.silver} size={'20px'} />
                                            <TextDefault color={colors.silver} left={'10px'}>
                                                Remover
                                            </TextDefault>
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        ))}
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

                            <Box flex={'0.7'} direction="column" leftSpace={'30px'}>
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

                </ModalContentScroll>
            </ModalAreaInfo>
        </ModalAreaTotalDisplay>
    );
};

export default AreaModalEditEmpresa;
