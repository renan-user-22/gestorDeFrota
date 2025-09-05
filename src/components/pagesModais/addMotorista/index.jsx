import React, { useState, useEffect } from 'react';

//Bibliotecas:
import Swal from 'sweetalert2';

//Banco de dados conexões:
import { db } from '../../../firebaseConnection';
import { ref, set, push, get } from 'firebase/database';

//Importação de components de Inputs:
import InputTel from '../../inputs/InputTelefone';
import InputCpf from '../../inputs/formatCPF';
import InputData from '../../inputs/formatDate';

//Icones: 
import { IoClose } from "react-icons/io5";
import { MdAddBox } from "react-icons/md";
import { LuSave } from "react-icons/lu";

//Estilos:
import { Box, TextDefault } from '../../../stylesAppDefault';
import { colors } from '../../../theme';
import {
    Select,
    Input,
    Button,
    ModalAreaTotalDisplay,
    ModalAreaInfo,
    DefaultButton,
    CargoList,
    CargoModalOverlay,
    CargoModalContent,
    RemoveButton,
    CargoItem,
    InputHora
} from './styles'; // ajuste conforme seu projeto

const AddMotorista = ({ closeModalAddMotorista, empresaIdProp }) => {

    const [cargos, setCargos] = useState([]);
    const [bases, setBases] = useState([]);


    const [form, setForm] = useState({
        nome: '',
        sobrenome: '',
        cpf: '',
        senha: '',
        cargoNome: '',
        contato: '',
        tipoAcesso: 'gestao',
        status: '',
        email: '',
        obs: '',
        horarioEntrada: '',
        horarioSaida: '',
        cnhNumero: '',
        cnhValidade: '',
        cnhCategoria: '',
        cnhPrimeiraHab: '',
        cnhObs: '',
        base: ''   // <-- nova chave
    });


    useEffect(() => {
        const fetchData = async () => {
            try {
                // Carregar cargos
                const snapCargos = await get(ref(db, `empresas/${empresaIdProp}/cargos`));
                if (snapCargos.exists()) {
                    const data = snapCargos.val();
                    const cargosArray = Array.isArray(data) ? data : Object.values(data);
                    setCargos(cargosArray);
                }

                // Carregar bases
                const snapBases = await get(ref(db, `empresas/${empresaIdProp}/bases`));
                if (snapBases.exists()) {
                    const basesArray = Array.isArray(snapBases.val())
                        ? snapBases.val()
                        : Object.values(snapBases.val());
                    setBases(basesArray);
                } else {
                    // fallback: sempre pelo menos "Matriz"
                    setBases(["Matriz"]);
                }
            } catch (err) {
                console.error("Erro ao carregar dados:", err);
            }
        };

        fetchData();
    }, [empresaIdProp]);



    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));

        if (field === 'cargoNome') {
            const cargoSel = cargos.find(c => c.nome === value);
            if (cargoSel) {
                setForm(prev => ({ ...prev, tipoAcesso: cargoSel.acesso }));
            }
        }

    };

    const handleHoraChange = (field, value) => {
        let v = value.replace(/\D/g, '');
        if (v.length >= 3) v = v.slice(0, 2) + ':' + v.slice(2, 4);
        if (v.length > 5) v = v.slice(0, 5);
        handleChange(field, v);
    };

    const isMotorista = form.tipoAcesso === 'motorista';

    // 🔹 Salvar no Firebase
    const salvarUsuario = async () => {
        if (!form.nome || !form.sobrenome || !form.cpf || !form.senha ||
            !form.cargoNome || !form.contato || !form.status) {
            Swal.fire('Atenção', 'Preencha todos os campos obrigatórios.', 'warning');
            return;
        }

        // se for motorista, validar CNH
        if (isMotorista && (!form.cnhNumero || !form.cnhValidade || !form.cnhCategoria || !form.cnhPrimeiraHab)) {
            Swal.fire('Atenção', 'Preencha todos os dados da CNH para motoristas.', 'warning');
            return;
        }

        try {
            const usuariosRef = ref(db, `empresas/${empresaIdProp}/usuarios`);
            const snap = await get(usuariosRef);

            let nextIndex = 0;
            if (snap.exists()) {
                const data = snap.val();
                nextIndex = Array.isArray(data) ? data.length : Object.keys(data).length;
            }

            await set(ref(db, `empresas/${empresaIdProp}/usuarios/${nextIndex}`), {
                ...form,
                matricula: Math.floor(1000000 + Math.random() * 9000000),
            });

            Swal.fire("Sucesso", "Usuário cadastrado com sucesso!", "success");
            closeModalAddMotorista();
        } catch (err) {
            console.error("Erro ao salvar usuário:", err);
            Swal.fire("Erro", "Não foi possível salvar o usuário.", "error");
        }
    };

    return (
        <ModalAreaTotalDisplay>
            <ModalAreaInfo>

                <Box
                    width={'100%'}
                    height={'65px'}
                    color={colors.black}
                    direction={'row'}
                    topSpace={'10px'}
                    bottomSpace={'20px'}
                    align={'center'}
                    justify={'space-between'}
                >
                    <Box leftSpace={'20px'}>
                        <MdAddBox size={'30px'} color={colors.silver} />
                        <TextDefault left={'10px'} color={colors.silver} weight={'bold'} size={'20px'}>Novo Usuário</TextDefault>
                    </Box>

                    <DefaultButton onClick={closeModalAddMotorista}>
                        <IoClose size={'30px'} color={colors.silver} />
                    </DefaultButton>
                </Box>


                <Box
                    direction={'column'}
                    width={'100%'}
                    height={'auto'}
                    color={colors.darkGrayTwo}
                    align={'center'}
                    paddingTop={'20px'}
                    paddingBottom={'10px'}
                >
                    {/* Linha 1: Nome da Empresa / CNPJ */}
                    <Box direction="row" justify="space-between" align="flex-start" bottomSpace="10px" width="94.5%">
                        <Box flex={'1'} direction="column">
                            <TextDefault size="12px" color={colors.silver} bottom="5px">
                                Nome
                            </TextDefault>
                            <Input placeholder="Nome *" value={form.nome} onChange={e => handleChange('nome', e.target.value)} />
                        </Box>

                        <Box flex={'1'} direction="column" leftSpace={'30px'}>
                            <TextDefault size="12px" color={colors.silver} bottom="5px">
                                Sobrenome
                            </TextDefault>
                            <Input placeholder="Sobrenome *" value={form.sobrenome} onChange={e => handleChange('sobrenome', e.target.value)} />
                        </Box>

                        <Box flex={'0.5'} direction="column" leftSpace={'30px'}>
                            <TextDefault size="12px" color={colors.silver} bottom="5px">
                                CPF
                            </TextDefault>

                            <InputCpf
                                placeholder="CPF*"
                                value={form.cpf}
                                onChange={(val) => handleChange('cpf', val)}
                            />
                        </Box>
                    </Box>

                    <Box direction="row" justify="space-between" align="flex-start" bottomSpace="10px" width="94.5%">
                        <Box flex={'1'} direction="column">
                            <TextDefault size="12px" color={colors.silver} bottom="5px">
                                E-mail
                            </TextDefault>
                            <Input placeholder="Email" value={form.email} onChange={e => handleChange('email', e.target.value)} />
                        </Box>

                        <Box flex={'1'} direction="column" leftSpace={'30px'}>
                            <TextDefault size="12px" color={colors.silver} bottom="5px">
                                Telefone/WhatsApp
                            </TextDefault>

                            <InputTel
                                placeholder="Telefone/WhatsApp *"
                                value={form.contato}
                                onChange={(val) => handleChange('contato', val)}
                            />
                        </Box>

                        <Box flex={'1'} direction="column" leftSpace={'30px'}>
                            <TextDefault size="12px" color={colors.silver} bottom="5px">
                                Status
                            </TextDefault>
                            {/* Status */}
                            <Select value={form.status} onChange={e => handleChange('status', e.target.value)}>
                                <option value="">Selecione o status</option>
                                <option value="ativo">Ativo</option>
                                <option value="inativo">Inativo</option>
                                <option value="ferias">Férias</option>
                                <option value="afastado">Afastado</option>
                                <option value="demitido">Demitido</option>
                            </Select>
                        </Box>

                        <Box flex={'1'} direction="column" leftSpace={'20px'}>
                            <TextDefault size="12px" color={colors.silver} bottom="5px">
                                Horário de trabalho
                            </TextDefault>

                            <Box direction="row" align="center">
                                <InputHora
                                    value={form.horarioEntrada}
                                    onChange={(e) => handleHoraChange('horarioEntrada', e.target.value)}
                                />
                                <TextDefault size="12px" color={colors.silver} left="10px" right="10px">às</TextDefault>
                                <InputHora
                                    value={form.horarioSaida}
                                    onChange={(e) => handleHoraChange('horarioSaida', e.target.value)}
                                />
                            </Box>
                        </Box>
                    </Box>

                    <Box direction="row" justify="space-between" align="flex-start" bottomSpace="10px" width="94.5%">
                        <Box flex={'1'} direction="column">
                            <TextDefault size="12px" color={colors.silver} bottom="5px">
                                Observações:
                            </TextDefault>
                            <Input
                                placeholder="Usuário com deficiência ou outra observação"
                                type="text"
                                value={form.obs}
                                onChange={e => handleChange('obs', e.target.value)}
                            />
                        </Box>

                        <Box flex={'1'} direction="column" leftSpace={'35px'}>
                            <TextDefault size="12px" color={colors.silver} bottom="5px">
                                Cargo (acesso a plataforma)
                            </TextDefault>
                            <Select value={form.cargoNome} onChange={e => handleChange('cargoNome', e.target.value)}>
                                <option value="">Selecione o cargo</option>
                                {cargos.map((c, i) => (
                                    <option key={i} value={c.nome}>
                                        {c.nome} {c.acesso === 'motorista' ? '(Motorista)' : '(Gestão)'}
                                    </option>
                                ))}
                            </Select>
                        </Box>

                        <Box flex={'1'} direction="column" leftSpace={'20px'}>
                            <TextDefault size="12px" color={colors.silver} bottom="5px">
                                Base / Filial
                            </TextDefault>
                            <Select
                                value={form.base}
                                onChange={e => handleChange('base', e.target.value)}
                            >
                                {bases.map((b, i) => (
                                    <option key={i} value={b}>{b}</option>
                                ))}
                            </Select>
                        </Box>


                        <Box flex={'1'} direction="column" leftSpace={'20px'}>
                            <TextDefault size="12px" color={colors.silver} bottom="5px">
                                Senha de acesso
                            </TextDefault>
                            <Input placeholder="Senha *" type="password" value={form.senha} onChange={e => handleChange('senha', e.target.value)} />
                        </Box>
                    </Box>
                </Box>

                {/* Campos extras se motorista */}
                {isMotorista && (
                    <>
                        <TextDefault size="13px" color={colors.silver}>
                            Dados da CNH
                        </TextDefault>
                        <Box
                            direction={'column'}
                            width={'100%'}
                            height={'auto'}
                            color={colors.darkGrayTwo}
                            align={'center'}
                            paddingTop={'20px'}
                            paddingBottom={'10px'}
                        >
                            {/* Linha 1: Nome da Empresa / CNPJ */}
                            <Box direction="row" justify="space-between" align="flex-start" bottomSpace="10px" width="94.5%">
                                <Box flex={'1'} direction="column">
                                    <TextDefault size="12px" color={colors.silver} bottom="5px">
                                        CNH - Número de Registro
                                    </TextDefault>
                                    <Input placeholder="CNH - Número de Registro" value={form.cnhNumero} onChange={e => handleChange('cnhNumero', e.target.value)} />
                                </Box>

                                <Box flex={'1'} direction="column" leftSpace={'30px'}>
                                    <TextDefault size="12px" color={colors.silver} bottom="5px">
                                        CNH - Validade
                                    </TextDefault>
                                    <InputData placeholder="CNH - Validade" value={form.cnhValidade} onChange={(val) => handleChange('cnhValidade', val)} />
                                </Box>

                                <Box flex={'1'} direction="column" leftSpace={'30px'}>
                                    <TextDefault size="12px" color={colors.silver} bottom="5px">
                                        CNH - Categoria
                                    </TextDefault>
                                    <Input placeholder="CNH - Categoria" value={form.cnhCategoria} onChange={e => handleChange('cnhCategoria', e.target.value)} />
                                </Box>

                                <Box flex={'1'} direction="column" leftSpace={'30px'}>
                                    <TextDefault size="12px" color={colors.silver} bottom="5px">
                                        CNH - Data 1ª Habilitação
                                    </TextDefault>
                                    <InputData placeholder="CNH - Data 1ª Habilitação" value={form.cnhPrimeiraHab} onChange={(val) => handleChange('cnhPrimeiraHab', val)} />
                                </Box>

                                <Box flex={'1'} direction="column" leftSpace={'30px'}>
                                    <TextDefault size="12px" color={colors.silver} bottom="5px">
                                        Observação CNH
                                    </TextDefault>
                                    <Input placeholder="Observação CNH" value={form.cnhObs} onChange={e => handleChange('cnhObs', e.target.value)} />
                                </Box>

                            </Box>
                        </Box>
                    </>
                )}


                <Box direction="row" justify="space-between" topSpace="20px">
                    <Button onClick={() => salvarUsuario()}>
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