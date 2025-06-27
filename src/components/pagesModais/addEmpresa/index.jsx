import React, { useState } from 'react';

//Bibliotecas:
import Swal from 'sweetalert2';

//ícones:
import { GoOrganization } from 'react-icons/go';
import { LuSave } from "react-icons/lu";
import { TbCancel } from "react-icons/tb";
import { FaWindowClose } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";

//Banco de dados conexões:
import { db } from '../../../firebaseConnection';
import { ref, onValue, push, set, getDatabase, remove, update } from 'firebase/database';

//Importação de components de Inputs:
import InputTelefone from '../../inputs/InputTelefone';
import InputCNPJ from '../../inputs/InputCNPJ';
import InputCPF from '../../inputs/formatCPF';

//Importações de estilos:
import { Box, TextDefault } from '../../../stylesAppDefault';
import { colors } from '../../../theme';
import {
    ModalAreaTotalDisplay,
    ModalAreaInfo,
    Input,
    Button,
    DefaultButton,
} from './styles';

const AddEmpresa = ({ closeModalAddEmpresa }) => {

    const [nomeEmpresa, setNomeEmpresa] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [logradouro, setLogradouro] = useState('');
    const [numero, setNumero] = useState('');
    const [bairro, setBairro] = useState('');
    const [complemento, setComplemento] = useState('');

    const [usuarios, setUsuarios] = useState([
        { nome: '', user: '', senha: '', cargo: '', telefone: '' }
    ]);

    const handleUsuarioChange = (index, field, value) => {
        const updatedUsuarios = [...usuarios];
        updatedUsuarios[index][field] = value;
        setUsuarios(updatedUsuarios);
    };

    const handleAdicionarUsuario = () => {
        setUsuarios([...usuarios, { nome: '', user: '', senha: '', cargo: '', telefone: '' }]);
    };

    const handleRemoverUsuario = (index) => {
        if (usuarios.length === 1) return; // Impede remover o último usuário
        const updatedUsuarios = usuarios.filter((_, i) => i !== index);
        setUsuarios(updatedUsuarios);
    };

    const handleSalvarEmpresa = async () => {
        // Validação dos campos obrigatórios

        usuarios.some(
            (u) =>
                !u.nome ||
                !u.user ||
                !u.senha ||
                !u.cargo ||
                !u.telefone ||
                /\s/.test(u.nome) ||               // se contém espaço
                u.nome !== u.nome.toLowerCase()    // se tem letra maiúscula
        )

        if (
            !nomeEmpresa ||
            !cnpj ||
            !logradouro ||
            !numero ||
            !bairro ||
            !complemento ||
            usuarios.some(
                (u) => !u.nome || !u.senha || !u.cargo || !u.telefone || !u.user
            )
        ) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos obrigatórios',
                text: 'Preencha todos os campos da empresa e dos usuários para continuar.',
                confirmButtonColor: '#f27474'
            });
            return;
        }

        const newCompany = {
            nome: nomeEmpresa,
            cnpj,
            address: { logradouro, numero, bairro, complemento },
            usuarios, // novo array de usuários
            createdAt: Date.now()
        };

        try {
            await push(ref(db, 'empresas'), newCompany);

            Swal.fire({
                icon: 'success',
                title: 'Empresa criada com sucesso!',
                confirmButtonColor: '#ff7a00'
            });

            closeModalAddEmpresa();

            // Limpa o formulário
            setNomeEmpresa('');
            setCnpj('');
            setLogradouro('');
            setNumero('');
            setBairro('');
            setComplemento('');
            setUsuarios([{ nome: '', senha: '', cargo: '', telefone: '' }]);
        } catch (error) {
            console.error('Erro ao salvar empresa:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro ao salvar empresa',
                text: 'Ocorreu um erro ao tentar salvar a empresa. Tente novamente.',
                confirmButtonColor: '#f27474'
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
                        <GoOrganization size={'30px'} color={colors.silver} />
                        <TextDefault color={colors.silver} weight="bold" size="21px" bottom="20px" left={'10px'}>
                            Adicionar Empresa
                        </TextDefault>
                    </Box>


                    <DefaultButton onClick={() => closeModalAddEmpresa()}>
                        <FaWindowClose size={'30px'} color={colors.silver} />
                    </DefaultButton>
                </Box>


                {/* Linha 1: Nome da Empresa / CNPJ */}
                <Box direction="row" justify="space-between" align="flex-start" bottomSpace="10px" width="94.5%">
                    <Box flex={'1.5'} direction="column">
                        <TextDefault size="12px" color={colors.silver} bottom="5px">
                            Nome da Empresa
                        </TextDefault>
                        <Input
                            value={nomeEmpresa}  // Valor vindo do estado
                            onChange={(e) => setNomeEmpresa(e.target.value)}  // Atualizando o estado
                            placeholder="Nome da Empresa"
                        />
                    </Box>

                    <Box direction="column" flex={'1'} leftSpace={'30px'}>
                        <TextDefault size="12px" color={colors.silver} bottom="5px" left={'20px'}>
                            CNPJ
                        </TextDefault>
                        <InputCNPJ value={cnpj} onChange={setCnpj} /> {/* Certifique-se que setCnpj está sendo passado corretamente */}
                    </Box>
                </Box>

                {/* Linha 3: Endereço completo */}
                <Box direction="row" justify="space-between" align="center" bottomSpace="10px" width="94.5%">
                    <Box flex={'1.5'} direction="column">
                        <TextDefault size="12px" color={colors.silver} bottom="5px">
                            Logradouro
                        </TextDefault>
                        <Input placeholder="Ex.: Av. Rio Branco" value={logradouro} onChange={e => setLogradouro(e.target.value)} />
                    </Box>

                    <Box flex={'0.5'} direction="column" paddingLeft="20px">
                        <TextDefault size="12px" color={colors.silver} bottom="5px">
                            Nº
                        </TextDefault>
                        <Input placeholder="Nº" value={numero} onChange={e => setNumero(e.target.value)} />
                    </Box>

                    <Box flex={'1'} direction="column" paddingLeft="20px">
                        <TextDefault size="12px" color={colors.silver} bottom="5px">
                            Bairro
                        </TextDefault>
                        <Input placeholder="Bairro" value={bairro} onChange={e => setBairro(e.target.value)} />
                    </Box>

                    <Box flex={'1'} direction="column" paddingLeft="20px">
                        <TextDefault size="12px" color={colors.silver} bottom="5px">
                            Complemento
                        </TextDefault>
                        <Input placeholder="Complemento" value={complemento} onChange={e => setComplemento(e.target.value)} />
                    </Box>
                </Box>

                {/* Botão para adicionar novo usuário */}
                <Box width="94.5%" bottomSpace="10px">
                    <Button onClick={handleAdicionarUsuario}>
                        + Adicionar Usuário
                    </Button>
                </Box>

                {/* Bloco Dinâmico de Usuários */}
                {usuarios.map((usuario, index) => (
                    <Box key={index} direction="row" justify="space-between" align="center" bottomSpace="10px" width="94.5%">

                        <Box flex={'1.5'} direction="column" rightSpace="20px">
                            <TextDefault size="12px" color={colors.silver} bottom="5px">
                                Nome:
                            </TextDefault>
                            <Input
                                placeholder="Nome"
                                type="text"
                                value={usuario.user}
                                onChange={(e) => handleUsuarioChange(index, 'user', e.target.value)}
                            />
                        </Box>

                        <Box flex={'1'} direction="column">
                            <TextDefault size="12px" color={colors.silver} bottom="5px">
                                Usuário:
                            </TextDefault>
                            <Input
                                placeholder="CPF ou CNPJ"
                                value={usuario.nome}
                                onChange={(e) => {
                                    let input = e.target.value.replace(/\D/g, '');
                                    let tipo = '';
                                    let formatado = input;

                                    if (input.length <= 11) {
                                        // CPF
                                        tipo = 'Funcionário';
                                        formatado = input
                                            .replace(/^(\d{3})(\d)/, '$1.$2')
                                            .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
                                            .replace(/\.(\d{3})(\d)/, '.$1-$2');
                                    } else {
                                        // CNPJ
                                        tipo = 'Dono';
                                        formatado = input
                                            .replace(/^(\d{2})(\d)/, '$1.$2')
                                            .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
                                            .replace(/\.(\d{3})(\d)/, '.$1/$2')
                                            .replace(/(\d{4})(\d)/, '$1-$2');
                                    }

                                    handleUsuarioChange(index, 'nome', formatado);
                                    handleUsuarioChange(index, 'cargo', tipo);
                                }}
                                maxLength={18}
                            />

                        </Box>

                        <Box flex={'1'} direction="column" leftSpace="20px">
                            <TextDefault size="12px" color={colors.silver} bottom="5px">
                                Senha:
                            </TextDefault>
                            <Input
                                placeholder="Senha"
                                type="password"
                                value={usuario.senha}
                                onChange={(e) => handleUsuarioChange(index, 'senha', e.target.value)}
                            />
                        </Box>

                        <Box flex={'0.5'} direction="column" leftSpace="20px">
                            <TextDefault size="12px" color={colors.silver} bottom="5px">
                                Cargo:
                            </TextDefault>
                            <Input
                                placeholder="Cargo (Ex: Dono, Gestor...)"
                                value={usuario.cargo}
                                onChange={(e) => handleUsuarioChange(index, 'cargo', e.target.value)}
                            />
                        </Box>

                        <Box flex={'1'} direction="column" leftSpace="20px">
                            <TextDefault size="12px" color={colors.silver} bottom="5px">
                                Telefone:
                            </TextDefault>
                            <InputTelefone
                                value={usuario.telefone}
                                onChange={(value) => handleUsuarioChange(index, 'telefone', value)}
                            />
                        </Box>

                        {usuarios.length > 1 && (
                            <Box direction="column" leftSpace="20px" justify="flex-end">
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


                {/* Ações */}
                <Box direction="row" justify="flex-start" align="center" width="100%" topSpace="0px">
                    <Button onClick={() => closeModalAddEmpresa()} right={'10px'} color={colors.black}>
                        <TbCancel color={colors.silver} size={'20px'} />
                        <TextDefault color={colors.silver} left={'10px'}>
                            Cancelar
                        </TextDefault>
                    </Button>

                    <Button onClick={handleSalvarEmpresa}>
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

export default AddEmpresa;