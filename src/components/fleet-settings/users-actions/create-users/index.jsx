import React, { useState, useEffect } from 'react';

import Swal from "sweetalert2";

// Banco de dados (Firebase Realtime Database - SDK modular)
import { db } from '../../../../firebaseConnection';
import { ref, set, get } from 'firebase/database';

// Inputs customizados
import InputTel from '../../../inputs/InputTelefone';
import InputCpf from '../../../inputs/formatCPF';
import InputData from '../../../inputs/formatDate';

// Ícones
import { IoClose } from "react-icons/io5";
import { MdAddBox } from "react-icons/md";
import { LuSave } from "react-icons/lu";

// Estilos e tema
import { Box, TextDefault, SwalCustomStyles } from '../../../../stylesAppDefault';
import { colors } from '../../../../theme';
import {
    Select,
    Input,
    Button,
    ModalAreaTotalDisplay,
    ModalAreaInfo,
    DefaultButton,
    InputHora,
    InputDarkWrapper
} from './styles';

const CreateUsers = ({ closeModalAddMotorista, empresaIdProp, empresaNome: empresaNomeProp }) => {
    const [cargos, setCargos] = useState([]);
    const [bases, setBases] = useState([]);

    // Estado do formulário (nome completo, sem sobrenome)
    const [form, setForm] = useState({
        nome: '', // nome completo
        cpf: '',
        email: '',
        contato: '',
        status: '',
        horarioEntrada: '',
        horarioSaida: '',
        obs: '',
        base: '',
        senha: '',

        cargoId: '',
        cargoNome: '',
        tipoAcesso: '',  // 'motorista' | 'gestor'

        cnhNumero: '',
        cnhValidade: '',
        cnhCategoria: '',
        cnhPrimeiraHab: '',
        cnhObs: ''
    });

    // 🔥 Estado de erros específicos de data/horário
    const [errors, setErrors] = useState({
        horarioEntrada: '',
        horarioSaida: '',
        cnhValidade: '',
        cnhPrimeiraHab: ''
    });

    // Helpers de validação
    const validarHora = (value) => {
        if (!value) return ''; // vazio não acusa erro aqui (obrigatoriedade é checada em outro ponto)
        const regex = /^([01]\d|2[0-3]):[0-5]\d$/;
        if (!regex.test(value)) return 'Horário inválido.';
        return '';
    };

    const validarData = (value) => {
        if (!value) return '';
        const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
        if (!match) return 'Data inválida.';

        const dia = parseInt(match[1], 10);
        const mes = parseInt(match[2], 10) - 1; // Date usa 0-11
        const ano = parseInt(match[3], 10);

        const date = new Date(ano, mes, dia);
        if (
            date.getFullYear() !== ano ||
            date.getMonth() !== mes ||
            date.getDate() !== dia
        ) {
            return 'Data inválida.';
        }

        return '';
    };

    // Carregar cargos e bases
    useEffect(() => {
        if (!empresaIdProp) return;

        const fetchData = async () => {
            try {
                const snapCargos = await get(ref(db, `fleetBusiness/${empresaIdProp}/cargos`));
                if (snapCargos.exists()) {
                    const obj = snapCargos.val() || {};
                    const arr = Object.keys(obj).map((k) => ({ id: k, ...obj[k] }));
                    setCargos(arr);
                } else {
                    setCargos([]);
                }

                const snapBases = await get(ref(db, `fleetBusiness/${empresaIdProp}/bases`));
                if (snapBases.exists()) {
                    const raw = snapBases.val();
                    const arr = Array.isArray(raw) ? raw : Object.values(raw || {});
                    setBases(arr.length ? arr : ['Matriz']);
                } else {
                    setBases(['Matriz']);
                }

            } catch (err) {
                console.error('Erro ao carregar cargos/bases:', err);
                setCargos([]);
                setBases(['Matriz']);
            }
        };

        fetchData();
    }, [empresaIdProp]);

    // Atualização de campos
    const handleChange = (field, value) => {
        if (field === 'cargoId') {
            const cargoSel = cargos.find(c => c.id === value);
            if (cargoSel) {
                setForm(prev => ({
                    ...prev,
                    cargoId: cargoSel.id,
                    cargoNome: cargoSel.nome || '',
                    tipoAcesso: cargoSel.tipoAcesso === 'gestor' ? 'gestor' : 'motorista'
                }));
                return;
            } else {
                setForm(prev => ({ ...prev, cargoId: '', cargoNome: '', tipoAcesso: '' }));
                return;
            }
        }

        setForm(prev => ({ ...prev, [field]: value }));
    };

    // Máscara HH:MM + validação
    const handleHoraChange = (field, value) => {
        let v = String(value).replace(/\D/g, '');
        if (v.length >= 3) v = v.slice(0, 2) + ':' + v.slice(2, 4);
        if (v.length > 5) v = v.slice(0, 5);

        handleChange(field, v);

        const msg = validarHora(v);
        setErrors(prev => ({ ...prev, [field]: msg }));
    };

    // Handler para datas (InputData) + validação
    const handleDateChange = (field, value) => {
        handleChange(field, value);
        const msg = validarData(value);
        setErrors(prev => ({ ...prev, [field]: msg }));
    };

    const isMotorista = form.tipoAcesso === 'motorista';
    const isGestao = form.tipoAcesso === 'gestor';

    // Geração da matrícula
    const gerarMatriculaUnica = async (empresaId) => {
        const usersRef = ref(db, `fleetBusiness/${empresaId}/users`);
        const snap = await get(usersRef);

        const usadas = new Set();
        if (snap.exists()) {
            const data = snap.val();
            const arr = Array.isArray(data) ? data : Object.values(data || {});
            arr.forEach((u) => {
                if (u && typeof u.matricula === 'string') usadas.add(u.matricula);
                if (u && typeof u.matricula === 'number') usadas.add(String(u.matricula));
            });
        }

        let tentativa = 0;
        while (true) {
            const m = String(Math.floor(100000 + Math.random() * 900000));
            if (!usadas.has(m)) return m;
            tentativa++;
            if (tentativa > 50) {
                const m2 = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
                if (!usadas.has(m2)) return m2;
            }
        }
    };

    // Salvar usuário
    const salvarUsuario = async () => {
        // Validação — nome completo (mínimo 2 palavras)
        const nomeValido = form.nome.trim().split(/\s+/).length >= 2;
        if (!nomeValido) {
            Swal.fire({
                icon: 'warning',
                title: 'Atenção',
                text: 'Digite o nome completo com pelo menos duas palavras.',
                customClass: {
                    popup: 'swal-custom-popup',
                    title: 'swal-custom-title',
                    htmlContainer: 'swal-custom-text',
                    confirmButton: 'swal-custom-confirm'
                }
            });
            return;
        }

        // Revalida datas/horários antes de salvar
        const newErrors = {
            horarioEntrada: validarHora(form.horarioEntrada),
            horarioSaida: validarHora(form.horarioSaida),
            cnhValidade: isMotorista ? validarData(form.cnhValidade) : '',
            cnhPrimeiraHab: isMotorista ? validarData(form.cnhPrimeiraHab) : ''
        };
        setErrors(prev => ({ ...prev, ...newErrors }));

        const hasError = Object.values(newErrors).some(msg => msg);
        if (hasError) {
            Swal.fire({
                icon: 'warning',
                title: 'Atenção',
                text: 'Corrija os campos de data/horário inválidos.',
                customClass: {
                    popup: 'swal-custom-popup',
                    title: 'swal-custom-title',
                    htmlContainer: 'swal-custom-text',
                    confirmButton: 'swal-custom-confirm'
                }
            });
            return;
        }

        // Validações mínimas
        if (!form.nome || !form.cpf || !form.senha || !form.cargoId || !form.status) {
            Swal.fire({
                icon: 'warning',
                title: 'Atenção',
                text: 'Preencha os campos obrigatórios.',
                customClass: {
                    popup: 'swal-custom-popup',
                    title: 'swal-custom-title',
                    htmlContainer: 'swal-custom-text',
                    confirmButton: 'swal-custom-confirm'
                }
            });
            return;
        }

        if (isMotorista && (!form.cnhNumero || !form.cnhValidade || !form.cnhCategoria || !form.cnhPrimeiraHab)) {
            Swal.fire({
                icon: 'warning',
                title: 'Atenção',
                text: 'Preencha os dados da CNH para motoristas.',
                customClass: {
                    popup: 'swal-custom-popup',
                    title: 'swal-custom-title',
                    htmlContainer: 'swal-custom-text',
                    confirmButton: 'swal-custom-confirm'
                }
            });
            return;
        }

        try {
            const usersRef = ref(db, `fleetBusiness/${empresaIdProp}/users`);
            const snap = await get(usersRef);

            let nextIndex = 0;
            if (snap.exists()) {
                const data = snap.val();
                nextIndex = Array.isArray(data) ? data.length : Object.keys(data).length;
            }

            const matricula = await gerarMatriculaUnica(empresaIdProp);

            await set(ref(db, `fleetBusiness/${empresaIdProp}/users/${nextIndex}`), {
                matricula,
                nome: form.nome,
                cpf: form.cpf,
                email: form.email || '',
                contato: form.contato || '',
                status: form.status || 'ativo',
                horarioEntrada: form.horarioEntrada || '',
                horarioSaida: form.horarioSaida || '',
                obs: form.obs || '',
                base: form.base || 'Matriz',
                senha: form.senha,

                cargoId: form.cargoId,

                cnhNumero: isMotorista ? form.cnhNumero : '',
                cnhValidade: isMotorista ? form.cnhValidade : '',
                cnhCategoria: isMotorista ? form.cnhCategoria : '',
                cnhPrimeiraHab: isMotorista ? form.cnhPrimeiraHab : '',
                cnhObs: isMotorista ? form.cnhObs : '',
                criadoEm: new Date().toISOString()
            });

            Swal.fire({
                icon: 'success',
                title: 'Sucesso',
                text: 'Usuário cadastrado com sucesso.',
                customClass: {
                    popup: 'swal-custom-popup',
                    title: 'swal-custom-title',
                    htmlContainer: 'swal-custom-text',
                    confirmButton: 'swal-custom-confirm'
                }
            });
            closeModalAddMotorista();

        } catch (err) {
            console.error('Erro ao salvar usuário:', err);
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Não foi possível salvar o usuário.',
                customClass: {
                    popup: 'swal-custom-popup',
                    title: 'swal-custom-title',
                    htmlContainer: 'swal-custom-text',
                    confirmButton: 'swal-custom-confirm'
                }
            });
        }
    };

    return (
        <ModalAreaTotalDisplay>

            <SwalCustomStyles />

            <ModalAreaInfo>

                {/* HEADER */}
                <Box
                    width="100%"
                    height="65px"
                    color={colors.black}
                    direction="row"
                    topSpace="10px"
                    bottomSpace="20px"
                    align="center"
                    justify="space-between"
                >
                    <Box leftSpace="20px">
                        <MdAddBox size="30px" color={colors.silver} />
                        <TextDefault left="10px" color={colors.silver} weight="bold" size="20px">
                            Novo Usuário — {empresaNomeProp || 'Empresa'}
                        </TextDefault>
                    </Box>

                    <DefaultButton onClick={closeModalAddMotorista}>
                        <IoClose size="30px" color={colors.silver} />
                    </DefaultButton>
                </Box>

                {/* FORM */}
                <Box
                    direction="column"
                    width="100%"
                    height="auto"
                    color={colors.darkGrayTwo}
                    align="center"
                    paddingTop="20px"
                    paddingBottom="10px"
                >

                    {/* CAMPO DE CARGO */}
                    <Box
                        direction="row"
                        justify="flex-start"
                        align="flex-start"
                        bottomSpace="20px"
                        width="94.5%"
                    >
                        <Box direction="column" width="260px">
                            <TextDefault size="12px" color={colors.silver} bottom="5px">
                                Cargo (acesso à plataforma)
                            </TextDefault>

                            <Select
                                name="cargoId"
                                value={form.cargoId}
                                onChange={e => handleChange('cargoId', e.target.value)}
                            >
                                <option value="">Selecione o cargo</option>
                                {cargos.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.nome} {c.tipoAcesso === 'motorista' ? '(Motorista)' : '(Gestão)'}
                                    </option>
                                ))}
                            </Select>
                        </Box>
                    </Box>

                    {(isGestao || isMotorista) && (
                        <>

                            {/* LINHA 1 — NOME COMPLETO + CPF */}
                            <Box
                                direction="row"
                                justify="space-between"
                                align="flex-start"
                                bottomSpace="10px"
                                width="94.5%"
                            >

                                <Box flex="2" direction="column">
                                    <TextDefault size="12px" color={colors.silver} bottom="5px">
                                        Nome completo
                                    </TextDefault>

                                    <Input
                                        name="nome"
                                        placeholder="Nome completo *"
                                        value={form.nome}
                                        onChange={e => handleChange('nome', e.target.value)}
                                    />
                                </Box>

                                <Box flex="0.8" direction="column" leftSpace="30px">
                                    <TextDefault size="12px" color={colors.silver} bottom="5px">
                                        CPF
                                    </TextDefault>

                                    <InputDarkWrapper>
                                        <InputCpf
                                            name="cpf"
                                            placeholder="CPF *"
                                            value={form.cpf}
                                            onChange={(val) => handleChange('cpf', val)}
                                        />
                                    </InputDarkWrapper>

                                </Box>

                            </Box>

                            {/* LINHA DE CNH — Somente Motorista */}
                            {isMotorista && (
                                <Box
                                    direction="row"
                                    justify="space-between"
                                    align="flex-start"
                                    bottomSpace="10px"
                                    width="94.5%"
                                >

                                    <Box flex="1" direction="column">
                                        <TextDefault size="12px" color={colors.silver} bottom="5px">
                                            CNH - Número de Registro
                                        </TextDefault>
                                        <Input
                                            name="cnhNumero"
                                            placeholder="CNH - Número de Registro"
                                            value={form.cnhNumero}
                                            onChange={e => handleChange('cnhNumero', e.target.value)}
                                        />
                                    </Box>

                                    <Box flex="1" direction="column" leftSpace="30px">
                                        <TextDefault size="12px" color={colors.silver} bottom="5px">
                                            CNH - Validade
                                        </TextDefault>
                                        <InputDarkWrapper>
                                            <InputData
                                                name="cnhValidade"
                                                placeholder="CNH - Validade"
                                                value={form.cnhValidade}
                                                onChange={(val) => handleDateChange('cnhValidade', val)}
                                            />
                                        </InputDarkWrapper>
                                        {errors.cnhValidade && (
                                            <TextDefault
                                                size="11px"
                                                color="#EEBE2C"
                                                weight={'bold'}
                                            >
                                                {errors.cnhValidade}
                                            </TextDefault>
                                        )}
                                    </Box>

                                    <Box flex="1" direction="column" leftSpace="30px">
                                        <TextDefault size="12px" color={colors.silver} bottom="5px">
                                            CNH - Categoria
                                        </TextDefault>
                                        <Input
                                            name="cnhCategoria"
                                            placeholder="CNH - Categoria"
                                            value={form.cnhCategoria}
                                            onChange={e => handleChange('cnhCategoria', e.target.value)}
                                        />
                                    </Box>

                                    <Box flex="1" direction="column" leftSpace="30px">
                                        <TextDefault size="12px" color={colors.silver} bottom="5px">
                                            CNH - Data 1ª Habilitação
                                        </TextDefault>
                                        <InputDarkWrapper>
                                            <InputData
                                                name="cnhPrimeiraHab"
                                                placeholder="CNH - Data 1ª Habilitação"
                                                value={form.cnhPrimeiraHab}
                                                onChange={(val) => handleDateChange('cnhPrimeiraHab', val)}
                                            />
                                        </InputDarkWrapper>
                                        {errors.cnhPrimeiraHab && (
                                            <TextDefault
                                                size="11px"
                                                color="#EEBE2C"
                                                weight={'bold'}
                                            >
                                                {errors.cnhPrimeiraHab}
                                            </TextDefault>
                                        )}
                                    </Box>

                                    <Box flex="1" direction="column" leftSpace="30px">
                                        <TextDefault size="12px" color={colors.silver} bottom="5px">
                                            Observação CNH
                                        </TextDefault>
                                        <Input
                                            name="cnhObs"
                                            placeholder="Observação CNH"
                                            value={form.cnhObs}
                                            onChange={e => handleChange('cnhObs', e.target.value)}
                                        />
                                    </Box>

                                </Box>
                            )}

                            {/* Linha: Email / Telefone / Status / Horário */}
                            <Box
                                direction="row"
                                justify="space-between"
                                align="flex-start"
                                bottomSpace="10px"
                                width="94.5%"
                            >
                                <Box flex="1" direction="column">
                                    <TextDefault size="12px" color={colors.silver} bottom="5px">
                                        E-mail
                                    </TextDefault>
                                    <Input
                                        name="email"
                                        placeholder="Email"
                                        value={form.email}
                                        onChange={e => handleChange('email', e.target.value)}
                                    />
                                </Box>

                                <Box flex="1" direction="column" leftSpace="30px">
                                    <TextDefault size="12px" color={colors.silver} bottom="5px">
                                        Telefone/WhatsApp
                                    </TextDefault>
                                    <InputDarkWrapper>
                                        <InputTel
                                            name="contato"
                                            placeholder="Telefone/WhatsApp *"
                                            value={form.contato}
                                            onChange={(val) => handleChange('contato', val)}
                                        />
                                    </InputDarkWrapper>

                                </Box>

                                <Box flex="1" direction="column" leftSpace="30px">
                                    <TextDefault size="12px" color={colors.silver} bottom="5px">
                                        Status
                                    </TextDefault>
                                    <Select
                                        name="status"
                                        value={form.status}
                                        onChange={e => handleChange('status', e.target.value)}
                                    >
                                        <option value="">Selecione o status</option>
                                        <option value="ativo">Ativo</option>
                                        <option value="inativo">Inativo</option>
                                        <option value="ferias">Férias</option>
                                        <option value="afastado">Afastado</option>
                                        <option value="demitido">Demitido</option>
                                    </Select>
                                </Box>

                                <Box flex="1" direction="column" leftSpace="20px">
                                    <TextDefault size="12px" color={colors.silver} bottom="5px">
                                        Horário de trabalho
                                    </TextDefault>

                                    <Box direction="row" align="flex-start">

                                        {/* Entrada */}
                                        <Box direction="column">
                                            <InputHora
                                                name="horarioEntrada"
                                                placeholder="07:00"
                                                value={form.horarioEntrada}
                                                onChange={(e) => handleHoraChange('horarioEntrada', e.target.value)}
                                            />

                                            {errors.horarioEntrada && (
                                                <TextDefault
                                                    size="11px"
                                                    color="#EEBE2C"   // amarelo (mantém o que você já usou)
                                                    top="4px"
                                                    bottom="4px"
                                                    weight="bold"
                                                >
                                                    {errors.horarioEntrada}
                                                </TextDefault>
                                            )}
                                        </Box>

                                        {/* "às" centralizado entre os campos */}
                                        <TextDefault
                                            size="12px"
                                            color={colors.silver}
                                            left="25px"
                                            right="15px"
                                            top="8px"
                                        >
                                            às
                                        </TextDefault>

                                        {/* Saída */}
                                        <Box direction="column">
                                            <InputHora
                                                name="horarioSaida"
                                                placeholder="18:00"
                                                value={form.horarioSaida}
                                                onChange={(e) => handleHoraChange('horarioSaida', e.target.value)}
                                            />

                                            {errors.horarioSaida && (
                                                <TextDefault
                                                    size="11px"
                                                    color="#EEBE2C"   // amarelo
                                                    top="4px"
                                                    bottom="4px"
                                                    weight="bold"
                                                >
                                                    {errors.horarioSaida}
                                                </TextDefault>
                                            )}
                                        </Box>

                                    </Box>
                                </Box>


                            </Box>

                            {/* Linha: Observações / Base / Senha */}
                            <Box
                                direction="row"
                                justify="space-between"
                                align="flex-start"
                                bottomSpace="10px"
                                width="94.5%"
                            >

                                <Box flex="1" direction="column">
                                    <TextDefault size="12px" color={colors.silver} bottom="5px">
                                        Observações
                                    </TextDefault>
                                    <Input
                                        name="obs"
                                        placeholder="Usuário com deficiência ou outra observação"
                                        value={form.obs}
                                        onChange={e => handleChange('obs', e.target.value)}
                                    />
                                </Box>

                                <Box flex="1" direction="column" leftSpace="35px">
                                    <TextDefault size="12px" color={colors.silver} bottom="5px">
                                        Base / Filial
                                    </TextDefault>
                                    <Select
                                        name="base"
                                        value={form.base}
                                        onChange={e => handleChange('base', e.target.value)}
                                    >
                                        {bases.map((b, i) => (
                                            <option key={i} value={b}>{b}</option>
                                        ))}
                                    </Select>
                                </Box>

                                <Box flex="1" direction="column" leftSpace="20px">
                                    <TextDefault size="12px" color={colors.silver} bottom="5px">
                                        Senha de acesso
                                    </TextDefault>
                                    <Input
                                        name="senha"
                                        placeholder="Senha *"
                                        type="password"
                                        value={form.senha}
                                        onChange={e => handleChange('senha', e.target.value)}
                                    />
                                </Box>

                            </Box>

                        </>
                    )}
                </Box>

                {/* FOOTER */}
                <Box direction="row" justify="space-between" topSpace="20px">
                    <Button onClick={salvarUsuario}>
                        <LuSave color={colors.silver} size="20px" />
                        <TextDefault color={colors.silver} left="10px">
                            Salvar
                        </TextDefault>
                    </Button>
                </Box>

            </ModalAreaInfo>
        </ModalAreaTotalDisplay>
    );
};

export default CreateUsers;
