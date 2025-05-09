import React, { useState } from 'react';

//Bibliotecas:
import Swal from 'sweetalert2';

//ícones:
import { GoOrganization } from 'react-icons/go';
import { LuSave } from "react-icons/lu";
import { TbCancel } from "react-icons/tb";
import { FaWindowClose } from "react-icons/fa";

//Banco de dados conexões:
import { db } from '../../../firebaseConnection';
import { ref, onValue, push, set, getDatabase, remove, update } from 'firebase/database';

//Importação de components de Inputs:
import InputTelefone from '../../inputs/InputTelefone';
import InputCNPJ from '../../inputs/InputCNPJ';

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
    const [responsavelEmpresa, setResponsavelEmpresa] = useState('');
    const [telefoneEmpresa, setTelefoneEmpresa] = useState('');
    const [responsavelFrota, setResponsavelFrota] = useState('');
    const [telefoneFrota, setTelefoneFrota] = useState('');
    const [senha, setSenha] = useState('');

    const handleSalvarEmpresa = async () => {
        // Validação dos campos
        if (
            !nomeEmpresa ||
            !cnpj ||
            !senha ||
            !logradouro ||
            !numero ||
            !bairro ||
            !complemento ||
            !responsavelEmpresa ||
            !telefoneEmpresa ||
            !responsavelFrota ||
            !telefoneFrota
        ) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos obrigatórios',
                text: 'Preencha todos os campos para continuar.',
                confirmButtonColor: '#f27474'
            });
            return;
        }

        const newCompany = {
            nome: nomeEmpresa,
            cnpj,
            senha,
            address: { logradouro, numero, bairro, complemento },
            responsavelEmpresa,
            telefoneEmpresa,
            responsavelFrota,
            telefoneFrota,
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

            // Limpa formulário
            setNomeEmpresa('');
            setCnpj('');
            setSenha('');
            setLogradouro('');
            setNumero('');
            setBairro('');
            setComplemento('');
            setResponsavelEmpresa('');
            setTelefoneEmpresa('');
            setResponsavelFrota('');
            setTelefoneFrota('');
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

                    <Box direction="column" flex={'1'}>
                        <TextDefault size="12px" color={colors.silver} bottom="5px" left={'20px'}>
                            CNPJ
                        </TextDefault>
                        <InputCNPJ value={cnpj} onChange={setCnpj} /> {/* Certifique-se que setCnpj está sendo passado corretamente */}
                    </Box>
                </Box>

                {/* Linha 3: Endereço completo */}
                <Box direction="row" justify="space-between" align="center" bottomSpace="10px" width="96.5%">
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

                <Box direction="row" justify="space-between" align="flex-start" bottomSpace="10px" width="94.5%">

                    <Box flex={'2'} direction="column">
                        <TextDefault size="12px" color={colors.silver} bottom="5px">
                            Responsável da Empresa
                        </TextDefault>
                        <Input placeholder="Responsável da Empresa" value={responsavelEmpresa} onChange={e => setResponsavelEmpresa(e.target.value)} />
                    </Box>

                    <Box flex={'1'} direction="column" leftSpace={'30px'}>
                        <TextDefault size="12px" color={colors.silver} bottom="5px">
                            Telefone do Responsável da Empresa
                        </TextDefault>
                        <InputTelefone value={telefoneEmpresa} onChange={setTelefoneEmpresa} /> {/* Atualizando o telefone */}
                    </Box>
                </Box>

                {/* Linha 4: Responsável da Frota / Telefone Frota */}
                <Box direction="row" justify="space-between" align="flex-start" bottomSpace="10px" width="94.5%">
                    <Box flex={'2'} direction="column">
                        <TextDefault size="12px" color={colors.silver} bottom="5px">
                            Responsável da Frota
                        </TextDefault>
                        <Input placeholder="Responsável da Frota" value={responsavelFrota} onChange={e => setResponsavelFrota(e.target.value)} />
                    </Box>

                    <Box flex={'1'} direction="column" leftSpace={'30px'}>
                        <TextDefault size="12px" color={colors.silver} bottom="5px" >
                            Telefone do Responsável da Frota
                        </TextDefault>
                        <InputTelefone value={telefoneFrota} onChange={setTelefoneFrota} /> {/* Atualizando o telefone */}
                    </Box>
                </Box>

                {/* Linha 2: Senha */}
                <Box direction="row" justify="space-between" align="flex-start" bottomSpace="10px" width="40%">
                    <Box flex={'1'} direction="column">
                        <TextDefault size="12px" color={colors.silver} bottom="5px">
                            Senha
                        </TextDefault>
                        <Input
                            type="password"  // Definindo o campo como tipo "password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}  // Atualizando a senha
                            placeholder="Digite a senha"
                        />
                    </Box>
                </Box>

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
                            Adicionar
                        </TextDefault>
                    </Button>
                </Box>
            </ModalAreaInfo>
        </ModalAreaTotalDisplay>

    );
}

export default AddEmpresa;