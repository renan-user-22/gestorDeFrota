import React, { useState } from 'react';
import { TextDefault, Box } from '../../../../stylesAppDefault';
import { colors } from '../../../../theme';
import Swal from 'sweetalert2';

import { db } from '../../../../firebaseConnection';
import { ref, push, set } from 'firebase/database';


// Ícones extras para Step 3
import { FiAlertTriangle, FiTruck } from 'react-icons/fi';

import {
    Container,
    Input,
    InputDateDark,
    InputCpfDark,
    InputTelDark,
    PasswordWrapper,
    PasswordInput,
    TogglePasswordButton,
    UploadWrapper,
    UploadButton,
    InputValorDark,
} from './styles';

import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FiUser, FiMapPin, FiCreditCard, FiFileText } from 'react-icons/fi';
import { MdClose } from 'react-icons/md';
import { FaPlus } from 'react-icons/fa';
import { FiChevronRight, FiUpload } from 'react-icons/fi';

const CreateCliente = ({ onClose }) => {

    const [step, setStep] = useState(1);
    const [showSenhaCliente, setShowSenhaCliente] = useState(false);
    const [formData, setFormData] = useState({
        // STEP 1
        nomeCompleto: '',
        cpf: '',
        telefone: '',
        senhaCliente: '',
        cep: '',
        rua: '',
        bairro: '',
        numero: '',
        complemento: '',
        cidade: '',
        estado: '',

        // STEP 2
        cnhNumero: '',
        cnhPrimeiraHab: '',
        cnhEmissao: '',
        cnhValidade: '',
        cnhCategoria: '',
        ufEmissor: '',
        cnhObservacoes: '',
        nomePai: '',
        nomeMae: '',
        municipioNascimento: '',
        ufNascimento: '',

        // 🔥 novo campo só pro nome do arquivo PDF
        cnhPdfNome: '',

        // STEP 3 — INFRAÇÃO + VEÍCULO
        // Infração
        numeroAIT: '',
        codigoOrgaoAutuador: '',
        orgaoAutuador: '',
        dataNotificacao: '',
        prazoDefesa: '',
        prazoIndicacaoCondutor: '',
        localInfracao: '',
        dataInfracao: '',
        horaInfracao: '',
        codigoMunicipio: '',
        municipioInfracao: '',
        ufInfracao: '',
        codigoInfracao: '',
        desdobramento: '',
        valorMulta: '',
        descricaoInfracao: '',
        numeroRenainf: '',

        // Veículo
        placaVeiculo: '',
        especieVeiculo: '',
        marcaModeloVersao: '',
        renavam: '',
        corPredominante: '',
        combustivel: '',
        anoFabricacao: '',
        anoModelo: '',
        municipioRegistro: '',
        ufRegistro: '',
        nomeProprietario: '',
        cpfCnpjProprietario: '',

        // PDFs Step 3
        multaPdfNome: '',
        crlvPdfNome: '',

        statusRecurso: '',
        valorServico: '',


    });
    const [cnhPdfFile, setCnhPdfFile] = useState(null);
    const [multaPdfFile, setMultaPdfFile] = useState(null);
    const [crlvPdfFile, setCrlvPdfFile] = useState(null);

    const [dateErrors, setDateErrors] = useState({
        cnhPrimeiraHab: '',
        cnhEmissao: '',
        cnhValidade: '',
    });

    // 🔍 Verifica se a data é válida no formato dd/mm/aaaa
    const validarData = (valor, campo) => {
        // se o campo estiver vazio, limpa o erro
        if (!valor) {
            setDateErrors(prev => ({ ...prev, [campo]: '' }));
            return;
        }

        // enquanto o usuário ainda está digitando (< 10 chars), não mostra erro
        if (valor.length < 10) {
            setDateErrors(prev => ({ ...prev, [campo]: '' }));
            return;
        }

        const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const match = valor.match(regex);

        if (!match) {
            setDateErrors(prev => ({ ...prev, [campo]: 'Formato inválido (dd/mm/aaaa)' }));
            return;
        }

        const dia = parseInt(match[1], 10);
        const mes = parseInt(match[2], 10);
        const ano = parseInt(match[3], 10);

        const dataValida =
            dia >= 1 && dia <= 31 &&
            mes >= 1 && mes <= 12 &&
            ano >= 1900 && ano <= 2100;

        if (!dataValida) {
            setDateErrors(prev => ({ ...prev, [campo]: 'Data inválida' }));
        } else {
            setDateErrors(prev => ({ ...prev, [campo]: '' }));
        }
    };

    const updateField = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const nextStep = () => {
        // =========================
        // 🔒 Validação do STEP 1
        // =========================
        if (step === 1) {
            const camposObrigatorios = [
                { key: 'nomeCompleto', label: 'Nome completo' },
                { key: 'cpf', label: 'CPF' },
                { key: 'telefone', label: 'Telefone' },
                { key: 'senhaCliente', label: 'Senha de acesso do cliente' },
                { key: 'cep', label: 'CEP' },
                { key: 'rua', label: 'Rua' },
                { key: 'numero', label: 'Número' },
                { key: 'bairro', label: 'Bairro' },
                { key: 'complemento', label: 'Complemento' },
                { key: 'cidade', label: 'Cidade' },
                { key: 'estado', label: 'UF' },
            ];

            const camposVazios = camposObrigatorios.filter(({ key }) => {
                const valor = formData[key];
                return !String(valor || '').trim();
            });

            if (camposVazios.length > 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Complete os dados do cliente',
                    html: 'Preencha todos os campos de <b>Dados Pessoais</b> e <b>Endereço</b> antes de continuar.',
                    confirmButtonText: 'Ok, entendi',
                    confirmButtonColor: colors.orange,
                    background: colors.darkGray,
                    color: colors.silver,
                });
                return; // ❌ não avança de step
            }
        }

        // =========================
        // 🔒 Validação do STEP 2
        // =========================
        if (step === 2) {
            const camposObrigatoriosStep2 = [
                { key: 'cnhNumero', label: 'Número da CNH' },
                { key: 'cnhPrimeiraHab', label: 'Primeira Habilitação' },
                { key: 'cnhEmissao', label: 'Emissão' },
                { key: 'cnhValidade', label: 'Validade' },
                { key: 'cnhCategoria', label: 'Categoria' },
                { key: 'ufEmissor', label: 'UF emissor' },
                { key: 'municipioNascimento', label: 'Município de nascimento' },
                { key: 'ufNascimento', label: 'UF de nascimento' },
            ];

            const camposVaziosStep2 = camposObrigatoriosStep2.filter(({ key }) => {
                const valor = formData[key];
                return !String(valor || '').trim();
            });

            if (camposVaziosStep2.length > 0) {
                const listaCampos = camposVaziosStep2
                    .map((c) => c.label)
                    .join(', ');

                Swal.fire({
                    icon: 'warning',
                    title: 'Complete os dados da CNH',
                    html: `Preencha os campos obrigatórios: <b>${listaCampos}</b>.`,
                    confirmButtonText: 'Ok, entendi',
                    confirmButtonColor: colors.orange,
                    background: colors.darkGray,
                    color: colors.silver,
                });
                return; // ❌ não avança pro step 3
            }

            // datas inválidas?
            if (
                dateErrors.cnhPrimeiraHab ||
                dateErrors.cnhEmissao ||
                dateErrors.cnhValidade
            ) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Datas inválidas',
                    text: 'Corrija as datas da CNH antes de avançar.',
                    confirmButtonColor: colors.orange,
                    background: colors.darkGray,
                    color: colors.silver,
                });
                return; // ❌ não avança
            }
        }

        // =========================
        // ✅ Se passou pelas validações, avança
        // =========================
        setStep((prev) => prev + 1);
    };

    const prevStep = () => setStep((prev) => prev - 1);

    const MAX_PDF_SIZE = 5 * 1024 * 1024; // 5 MB

    const handleCnhPdfChange = (event) => {
        const file = event.target.files && event.target.files[0];
        if (!file) return;

        // valida tipo
        const isPdf =
            file.type === 'application/pdf' ||
            file.name.toLowerCase().endsWith('.pdf');

        if (!isPdf) {
            Swal.fire({
                icon: 'warning',
                title: 'Arquivo inválido',
                text: 'Selecione um arquivo no formato PDF.',
                confirmButtonColor: colors.orange,
                background: colors.darkGray,
                color: colors.silver,
            });
            event.target.value = '';
            return;
        }

        // valida tamanho
        if (file.size > MAX_PDF_SIZE) {
            Swal.fire({
                icon: 'warning',
                title: 'Arquivo muito grande',
                text: 'O PDF da CNH deve ter no máximo 5 MB.',
                confirmButtonColor: colors.orange,
                background: colors.darkGray,
                color: colors.silver,
            });
            event.target.value = '';
            return;
        }

        // se passou nas validações, guarda
        setCnhPdfFile(file);
        updateField('cnhPdfNome', file.name);
    };

    const handleMultaPdfChange = (event) => {
        const file = event.target.files && event.target.files[0];
        if (!file) return;

        const isPdf =
            file.type === 'application/pdf' ||
            file.name.toLowerCase().endsWith('.pdf');

        if (!isPdf) {
            Swal.fire({
                icon: 'warning',
                title: 'Arquivo inválido',
                text: 'Selecione um arquivo de multa em PDF.',
                confirmButtonColor: colors.orange,
                background: colors.darkGray,
                color: colors.silver,
            });
            event.target.value = '';
            return;
        }

        if (file.size > MAX_PDF_SIZE) {
            Swal.fire({
                icon: 'warning',
                title: 'Arquivo muito grande',
                text: 'O PDF da multa deve ter no máximo 5 MB.',
                confirmButtonColor: colors.orange,
                background: colors.darkGray,
                color: colors.silver,
            });
            event.target.value = '';
            return;
        }

        // ✅ Só guarda o arquivo e o nome, sem leitura
        setMultaPdfFile(file);
        updateField('multaPdfNome', file.name);
    };


    const handleCrlvPdfChange = (event) => {
        const file = event.target.files && event.target.files[0];
        if (!file) return;

        const isPdf =
            file.type === 'application/pdf' ||
            file.name.toLowerCase().endsWith('.pdf');

        if (!isPdf) {
            Swal.fire({
                icon: 'warning',
                title: 'Arquivo inválido',
                text: 'Selecione um CRLV em PDF.',
                confirmButtonColor: colors.orange,
                background: colors.darkGray,
                color: colors.silver,
            });
            event.target.value = '';
            return;
        }

        if (file.size > MAX_PDF_SIZE) {
            Swal.fire({
                icon: 'warning',
                title: 'Arquivo muito grande',
                text: 'O PDF do CRLV deve ter no máximo 5 MB.',
                confirmButtonColor: colors.orange,
                background: colors.darkGray,
                color: colors.silver,
            });
            event.target.value = '';
            return;
        }

        // ✅ Só guarda o arquivo e o nome, sem leitura
        setCrlvPdfFile(file);
        updateField('crlvPdfNome', file.name);
    };

    // 🔽 AQUI: NOVA FUNÇÃO PARA SALVAR NO REALTIME DB
    const handleSave = async () => {
        try {
            // Loading bonitinho
            Swal.fire({
                title: 'Salvando cliente...',
                html: 'Aguarde enquanto os dados são enviados.',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                },
                background: colors.darkGray,
                color: colors.silver,
            });

            // Nó onde você quer salvar no Realtime
            // Ajusta "recursoClientes" pro nome que quiser
            const clientesRef = ref(db, 'fleetRecurso');
            const novoClienteRef = push(clientesRef);

            await set(novoClienteRef, {
                ...formData,
                createdAt: new Date().toISOString(),
            });

            Swal.fire({
                icon: 'success',
                title: 'Cliente salvo com sucesso!',
                text: 'Os dados foram armazenados no Realtime Database.',
                confirmButtonColor: colors.orange,
                background: colors.darkGray,
                color: colors.silver,
            }).then(() => {
                if (onClose) onClose(); // fecha o modal/tela
            });

        } catch (error) {
            console.error('Erro ao salvar cliente:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro ao salvar',
                text: 'Ocorreu um erro ao salvar os dados. Tente novamente.',
                confirmButtonColor: colors.orange,
                background: colors.darkGray,
                color: colors.silver,
            });
        }
    };

    return (
        <Container>

            {/* =====================================
                HEADER ESTILO "NOVA EMPRESA"
            ====================================== */}
            <Box
                color={colors.black}
                width="94%"
                topSpace={'15px'}
                paddingTop="15px"
                paddingBottom="25px"
                direction="column"
                align="center"
                paddingLeft="20px"
                paddingRight="20px"
                bottomSpace="25px"
            >
                <Box
                    direction="row"
                    justify="space-between"
                    align="center"
                    width="100%"
                    style={{ padding: "12px 20px" }}
                >
                    <Box direction="row" align="center" style={{ gap: 10 }}>
                        <FaPlus color="#fff" size={14} />
                        <TextDefault size="18px" weight="bold" color={colors.silver}>
                            Novo Cliente - Fleet Recurso
                        </TextDefault>
                    </Box>

                    <MdClose
                        size={22}
                        color="#fff"
                        style={{ cursor: "pointer" }}
                        onClick={onClose}
                    />
                </Box>

                {/* Linha separadora */}
                <div style={{
                    width: "100%",
                    height: "1px",
                    backgroundColor: colors.silver,
                    opacity: 0.4,
                    marginBottom: "35px"
                }} />


                {/* =====================================
                        NAV DE STEPS — BARRAS FINAS
                    ====================================== */}
                <Box
                    direction="row"
                    justify="flex-start"
                    align="center"
                    width="100%"
                    style={{ gap: 10, paddingLeft: 20, marginBottom: 10 }}
                >
                    {/* Step 1 */}
                    <div style={{
                        height: "4px",
                        width: "40px",
                        borderRadius: "10px",
                        backgroundColor: step === 1 ? colors.orange : "#fff",
                        opacity: step === 1 ? 1 : 0.5,
                        transition: "0.3s"
                    }} />

                    {/* Step 2 */}
                    <div style={{
                        height: "4px",
                        width: "40px",
                        borderRadius: "10px",
                        backgroundColor: step === 2 ? colors.orange : "#fff",
                        opacity: step === 2 ? 1 : 0.5,
                        transition: "0.3s"
                    }} />

                    {/* Step 3 */}
                    <div style={{
                        height: "4px",
                        width: "40px",
                        borderRadius: "10px",
                        backgroundColor: step === 3 ? colors.orange : "#fff",
                        opacity: step === 3 ? 1 : 0.5,
                        transition: "0.3s"
                    }} />
                </Box>

            </Box>

            {/* =====================================
                ÁREA DOS STEPS (TELA COMPLETA)
            ====================================== */}
            <Box
                direction="column"
                width="100%"
                style={{
                    overflowY: "auto",
                    overflowX: "hidden",   // 🔒 garante sem scroll horizontal
                    padding: "0 25px",
                    boxSizing: "border-box",
                    gap: 25,
                }}
            >

                {/* =====================================
                    STEP 1 — DADOS PESSOAIS + ENDEREÇO
                ====================================== */}
                {step === 1 && (
                    <>
                        <Box direction="row" align="center" style={{ gap: 8, marginBottom: 4 }}>
                            <FiUser size={16} color={colors.silver} />
                            <TextDefault size="16px" weight="bold">
                                Dados Pessoais
                            </TextDefault>
                        </Box>

                        <Box direction="row" style={{ gap: 10 }}>
                            <Input
                                placeholder="Nome completo"
                                value={formData.nomeCompleto}
                                onChange={(e) => updateField("nomeCompleto", e.target.value)}
                                width="50%"
                            />

                            <InputCpfDark
                                placeholder="CPF"
                                value={formData.cpf}
                                onChange={(valor) => updateField("cpf", valor)}
                                width="25%"
                            />

                            <InputTelDark
                                placeholder="Telefone"
                                value={formData.telefone}
                                onChange={(valor) => updateField("telefone", valor)}
                                width="25%"
                            />

                        </Box>

                        <PasswordWrapper width="40%">
                            <PasswordInput
                                placeholder="Senha de acesso do cliente"
                                type={showSenhaCliente ? "text" : "password"}
                                value={formData.senhaCliente}
                                onChange={(e) => updateField("senhaCliente", e.target.value)}
                            />

                            <TogglePasswordButton
                                type="button"
                                onClick={() => setShowSenhaCliente((prev) => !prev)}
                            >
                                {showSenhaCliente ? <FiEyeOff /> : <FiEye />}
                            </TogglePasswordButton>
                        </PasswordWrapper>

                        <Box direction="row" align="center" style={{ gap: 8, marginTop: 10, marginBottom: 4 }}>
                            <FiMapPin size={16} color={colors.silver} />
                            <TextDefault size="16px" weight="bold">
                                Endereço
                            </TextDefault>
                        </Box>

                        {/* CEP | Rua | Número | Bairro */}
                        <Box direction="row" style={{ gap: 10 }}>
                            <Input
                                placeholder="CEP"
                                value={formData.cep}
                                onChange={async (e) => {
                                    const valorDigitado = e.target.value;
                                    const cep = valorDigitado.replace(/\D/g, ''); // só números

                                    // mantém o que o usuário digitou no state
                                    updateField('cep', valorDigitado);

                                    // quando tiver 8 dígitos, chama o ViaCEP
                                    if (cep.length === 8) {
                                        try {
                                            const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                                            const data = await res.json();

                                            if (!data.erro) {
                                                updateField('rua', data.logradouro || '');
                                                updateField('bairro', data.bairro || '');
                                                updateField('cidade', data.localidade || '');
                                                updateField('estado', data.uf || '');
                                            }
                                        } catch (err) {
                                            console.error('Erro ao consultar CEP:', err);
                                        }
                                    }
                                }}
                                width="20%"
                            />

                            <Input
                                placeholder="Rua"
                                value={formData.rua}
                                onChange={e => updateField('rua', e.target.value)}
                                width="40%"
                            />

                            <Input
                                placeholder="Número"
                                value={formData.numero}
                                onChange={e => updateField('numero', e.target.value)}
                                width="15%"
                            />

                            <Input
                                placeholder="Bairro"
                                value={formData.bairro}
                                onChange={e => updateField('bairro', e.target.value)}
                                width="25%"
                            />
                        </Box>

                        <Box direction="row" style={{ gap: 10 }}>
                            <Input
                                placeholder="Complemento"
                                value={formData.complemento}
                                onChange={(e) => updateField("complemento", e.target.value)}
                                width="40%"
                            />

                            <Input
                                placeholder="Cidade"
                                value={formData.cidade}
                                onChange={(e) => updateField("cidade", e.target.value)}
                                width="45%"
                            />

                            <Input
                                placeholder="UF"
                                value={formData.estado}
                                onChange={(e) => updateField("estado", e.target.value)}
                                width="15%"
                            />
                        </Box>
                    </>
                )}

                {/* =====================================
                    STEP 2 — CNH + COMPLEMENTOS
                ====================================== */}
                {step === 2 && (
                    <>
                        {/* Título Dados da CNH com ícone */}
                        <Box direction="row" align="center" style={{ gap: 8, marginBottom: 4 }}>
                            <FiCreditCard size={16} color={colors.silver} />
                            <TextDefault size="16px" weight="bold">
                                Dados da CNH
                            </TextDefault>
                        </Box>

                        {/* 1ª linha – Número, Primeira Hab., Emissão, Categoria, UF */}
                        <Box direction="row" style={{ gap: 10 }}>
                            <Input
                                placeholder="Número da CNH"
                                value={formData.cnhNumero}
                                onChange={(e) => updateField("cnhNumero", e.target.value)}
                                width="35%"
                            />

                            <Box direction="column" style={{ gap: 4, width: "25%" }}>
                                <InputDateDark
                                    placeholder="Primeira Hab."
                                    value={formData.cnhPrimeiraHab}
                                    onChange={(valor) => {
                                        updateField('cnhPrimeiraHab', valor);
                                        validarData(valor, 'cnhPrimeiraHab');
                                    }}
                                    width="100%"
                                />
                                {dateErrors.cnhPrimeiraHab && (
                                    <TextDefault size="12px" color={colors.yellow500}>
                                        {dateErrors.cnhPrimeiraHab}
                                    </TextDefault>
                                )}
                            </Box>

                            {/* Emissão + aviso */}
                            <Box direction="column" style={{ gap: 4, width: "20%" }}>
                                <InputDateDark
                                    placeholder="Emissão"
                                    value={formData.cnhEmissao}
                                    onChange={(valor) => {
                                        updateField('cnhEmissao', valor);
                                        validarData(valor, 'cnhEmissao');
                                    }}
                                    width="100%"
                                />
                                {dateErrors.cnhEmissao && (
                                    <TextDefault size="12px" color={colors.yellow500}>
                                        {dateErrors.cnhEmissao}
                                    </TextDefault>
                                )}
                            </Box>

                            <Input
                                placeholder="Categoria"
                                value={formData.cnhCategoria}
                                onChange={(e) => updateField("cnhCategoria", e.target.value)}
                                width="10%"
                            />

                            <Input
                                placeholder="UF"
                                value={formData.ufEmissor}
                                onChange={(e) => updateField("ufEmissor", e.target.value)}
                                width="10%"
                            />
                        </Box>

                        {/* 2ª linha – Validade + Observações + Upload PDF */}
                        <Box direction="row" style={{ gap: 10 }}>
                            {/* Validade + aviso */}
                            <Box direction="column" style={{ gap: 4, width: "30%" }}>
                                <InputDateDark
                                    placeholder="Validade"
                                    value={formData.cnhValidade}
                                    onChange={(valor) => {
                                        updateField('cnhValidade', valor);
                                        validarData(valor, 'cnhValidade');
                                    }}
                                    width="100%"
                                />
                                {dateErrors.cnhValidade && (
                                    <TextDefault size="12px" color={colors.yellow500}>
                                        {dateErrors.cnhValidade}
                                    </TextDefault>
                                )}
                            </Box>

                            {/* Observações da CNH */}
                            <Input
                                placeholder="Observações da CNH"
                                value={formData.cnhObservacoes}
                                onChange={(e) => updateField("cnhObservacoes", e.target.value)}
                                width="50%"
                            />

                            {/* Botão de upload ocupando a coluna inteira */}
                            <UploadWrapper width="20%">
                                {/* input real, oculto */}
                                <input
                                    id="cnhPdfInput"
                                    type="file"
                                    accept="application/pdf"
                                    style={{ display: 'none' }}
                                    onChange={handleCnhPdfChange}
                                />

                                <UploadButton
                                    type="button"
                                    onClick={() => {
                                        const input = document.getElementById('cnhPdfInput');
                                        if (input) input.click();
                                    }}
                                >
                                    <FiUpload />

                                    <div className="upload-text">
                                        <span className="upload-label">CNH PDF</span>

                                        {formData.cnhPdfNome ? (
                                            <span className="upload-filename">
                                                Arquivo selecionado: {formData.cnhPdfNome}
                                            </span>
                                        ) : (
                                            <span className="upload-filename">
                                                Nenhum arquivo selecionado
                                            </span>
                                        )}
                                    </div>
                                </UploadButton>
                            </UploadWrapper>
                        </Box>

                        {/* Complementos da CNH (mantém como está) */}
                        <Box
                            direction="row"
                            align="center"
                            style={{ gap: 8, marginTop: 10, marginBottom: 4 }}
                        >
                            <FiFileText size={16} color={colors.silver} />
                            <TextDefault size="16px" weight="bold">
                                Complementos da CNH
                            </TextDefault>
                        </Box>

                        <Box direction="row" style={{ gap: 10 }}>
                            <Input
                                placeholder="Nome do Pai"
                                value={formData.nomePai}
                                onChange={(e) => updateField("nomePai", e.target.value)}
                                width="50%"
                            />

                            <Input
                                placeholder="Nome da Mãe"
                                value={formData.nomeMae}
                                onChange={(e) => updateField("nomeMae", e.target.value)}
                                width="50%"
                            />
                        </Box>

                        <Box direction="row" style={{ gap: 10 }}>
                            <Input
                                placeholder="Município de nascimento"
                                value={formData.municipioNascimento}
                                onChange={(e) => updateField("municipioNascimento", e.target.value)}
                                width="75%"
                            />

                            <Input
                                placeholder="UF"
                                value={formData.ufNascimento}
                                onChange={(e) => updateField("ufNascimento", e.target.value)}
                                width="25%"
                            />
                        </Box>
                    </>
                )}

                {/* =====================================
                    STEP 3 — INFRAÇÃO + VEÍCULO
                ====================================== */}
                {step === 3 && (
                    <>
                        {/* ===================== DADOS DA INFRAÇÃO ===================== */}
                        <Box direction="row" align="center" style={{ gap: 8, marginBottom: 4 }}>
                            <FiAlertTriangle size={16} color={colors.silver} />
                            <TextDefault size="16px" weight="bold">
                                Dados da Infração
                            </TextDefault>
                        </Box>

                        {/* Linha 1: AIT, código órgão, órgão, valor */}
                        <Box direction="row" style={{ gap: 10 }}>
                            <Input
                                placeholder="Número do AIT"
                                value={formData.numeroAIT}
                                onChange={(e) => updateField('numeroAIT', e.target.value)}
                                width="20%"
                            />

                            <Input
                                placeholder="Cód. órgão autuador"
                                value={formData.codigoOrgaoAutuador}
                                onChange={(e) => updateField('codigoOrgaoAutuador', e.target.value)}
                                width="15%"
                            />

                            <Input
                                placeholder="Órgão autuador"
                                value={formData.orgaoAutuador}
                                onChange={(e) => updateField('orgaoAutuador', e.target.value)}
                                width="35%"
                            />

                            <Input
                                placeholder="Valor da multa"
                                value={formData.valorMulta}
                                onChange={(e) => updateField('valorMulta', e.target.value)}
                                width="30%"
                            />
                        </Box>

                        {/* Linha 2: data/hora/local */}
                        <Box direction="row" style={{ gap: 10 }}>
                            <InputDateDark
                                placeholder="Data da infração"
                                value={formData.dataInfracao}
                                onChange={(valor) => updateField('dataInfracao', valor)}
                                width="20%"
                            />

                            <Input
                                placeholder="Hora"
                                value={formData.horaInfracao}
                                onChange={(e) => updateField('horaInfracao', e.target.value)}
                                width="15%"
                            />

                            <Input
                                placeholder="Município da infração"
                                value={formData.municipioInfracao}
                                onChange={(e) => updateField('municipioInfracao', e.target.value)}
                                width="35%"
                            />

                            <Input
                                placeholder="UF"
                                value={formData.ufInfracao}
                                onChange={(e) => updateField('ufInfracao', e.target.value)}
                                width="10%"
                            />

                            <Input
                                placeholder="Cód. município"
                                value={formData.codigoMunicipio}
                                onChange={(e) => updateField('codigoMunicipio', e.target.value)}
                                width="20%"
                            />
                        </Box>

                        {/* Linha 3: local + RENAINF */}
                        <Box direction="row" style={{ gap: 10 }}>
                            <Input
                                placeholder="Local da infração (rodovia, km, sentido...)"
                                value={formData.localInfracao}
                                onChange={(e) => updateField('localInfracao', e.target.value)}
                                width="70%"
                            />

                            <Input
                                placeholder="Número RENAINF"
                                value={formData.numeroRenainf}
                                onChange={(e) => updateField('numeroRenainf', e.target.value)}
                                width="30%"
                            />
                        </Box>

                        {/* Linha 4: código, desdobramento, datas de notificação/prazos */}
                        <Box direction="row" style={{ gap: 10 }}>
                            <Input
                                placeholder="Código da infração"
                                value={formData.codigoInfracao}
                                onChange={(e) => updateField('codigoInfracao', e.target.value)}
                                width="20%"
                            />

                            <Input
                                placeholder="Desdobramento"
                                value={formData.desdobramento}
                                onChange={(e) => updateField('desdobramento', e.target.value)}
                                width="15%"
                            />

                            <InputDateDark
                                placeholder="Data notificação"
                                value={formData.dataNotificacao}
                                onChange={(valor) => updateField('dataNotificacao', valor)}
                                width="20%"
                            />

                            <InputDateDark
                                placeholder="Prazo Defesa Prévia"
                                value={formData.prazoDefesa}
                                onChange={(valor) => updateField('prazoDefesa', valor)}
                                width="22.5%"
                            />

                            <InputDateDark
                                placeholder="Prazo indicação condutor"
                                value={formData.prazoIndicacaoCondutor}
                                onChange={(valor) => updateField('prazoIndicacaoCondutor', valor)}
                                width="22.5%"
                            />
                        </Box>

                        {/* Linha 5: descrição da infração + botão MULTA PDF */}
                        <Box direction="row" style={{ gap: 10 }}>
                            <Input
                                placeholder="Descrição da infração"
                                value={formData.descricaoInfracao}
                                onChange={(e) => updateField('descricaoInfracao', e.target.value)}
                                width="65%"
                            />

                            {/* Upload da multa (BETA) */}
                            <UploadWrapper width="35%">
                                <input
                                    id="multaPdfInput"
                                    type="file"
                                    accept="application/pdf"
                                    style={{ display: 'none' }}
                                    onChange={handleMultaPdfChange}
                                />

                                <UploadButton
                                    type="button"
                                    onClick={() => {
                                        const input = document.getElementById('multaPdfInput');
                                        if (input) input.click();
                                    }}
                                >
                                    <FiUpload />

                                    <div className="upload-text">
                                        <span className="upload-label">
                                            Multa PDF
                                        </span>

                                        {formData.multaPdfNome ? (
                                            <span className="upload-filename">
                                                {formData.multaPdfNome}
                                            </span>
                                        ) : (
                                            <span className="upload-filename">
                                                Nenhum arquivo selecionado
                                            </span>
                                        )}
                                    </div>
                                </UploadButton>
                            </UploadWrapper>
                        </Box>

                        {/* ===================== DADOS DO VEÍCULO ===================== */}
                        <Box
                            direction="row"
                            align="center"
                            style={{ gap: 8, marginTop: 20, marginBottom: 4 }}
                        >
                            <FiTruck size={16} color={colors.silver} />
                            <TextDefault size="16px" weight="bold">
                                Dados do Veículo
                            </TextDefault>
                        </Box>

                        {/* Linha 1: placa, RENAVAM, marca/modelo */}
                        <Box direction="row" style={{ gap: 10 }}>
                            <Input
                                placeholder="Placa"
                                value={formData.placaVeiculo}
                                onChange={(e) => updateField('placaVeiculo', e.target.value)}
                                width="20%"
                            />

                            <Input
                                placeholder="RENAVAM"
                                value={formData.renavam}
                                onChange={(e) => updateField('renavam', e.target.value)}
                                width="25%"
                            />

                            <Input
                                placeholder="Marca / Modelo / Versão"
                                value={formData.marcaModeloVersao}
                                onChange={(e) => updateField('marcaModeloVersao', e.target.value)}
                                width="55%"
                            />
                        </Box>

                        {/* Linha 2: espécie, cor, combustível, ano fab/modelo */}
                        <Box direction="row" style={{ gap: 10 }}>
                            <Input
                                placeholder="Espécie / Tipo"
                                value={formData.especieVeiculo}
                                onChange={(e) => updateField('especieVeiculo', e.target.value)}
                                width="20%"
                            />

                            <Input
                                placeholder="Cor predominante"
                                value={formData.corPredominante}
                                onChange={(e) => updateField('corPredominante', e.target.value)}
                                width="20%"
                            />

                            <Input
                                placeholder="Combustível"
                                value={formData.combustivel}
                                onChange={(e) => updateField('combustivel', e.target.value)}
                                width="20%"
                            />

                            <Input
                                placeholder="Ano fabricação"
                                value={formData.anoFabricacao}
                                onChange={(e) => updateField('anoFabricacao', e.target.value)}
                                width="20%"
                            />

                            <Input
                                placeholder="Ano modelo"
                                value={formData.anoModelo}
                                onChange={(e) => updateField('anoModelo', e.target.value)}
                                width="20%"
                            />
                        </Box>

                        {/* Linha 3: registro + proprietário */}
                        <Box direction="row" style={{ gap: 10 }}>
                            <Input
                                placeholder="Município de registro"
                                value={formData.municipioRegistro}
                                onChange={(e) => updateField('municipioRegistro', e.target.value)}
                                width="35%"
                            />

                            <Input
                                placeholder="UF"
                                value={formData.ufRegistro}
                                onChange={(e) => updateField('ufRegistro', e.target.value)}
                                width="10%"
                            />

                            <Input
                                placeholder="Nome do proprietário"
                                value={formData.nomeProprietario}
                                onChange={(e) => updateField('nomeProprietario', e.target.value)}
                                width="30%"
                            />

                            <Input
                                placeholder="CPF/CNPJ do proprietário"
                                value={formData.cpfCnpjProprietario}
                                onChange={(e) => updateField('cpfCnpjProprietario', e.target.value)}
                                width="25%"
                            />
                        </Box>

                        {/* Linha extra: Status inicial do recurso + Valor cobrado */}
                        <Box direction="row" style={{ gap: 10 }}>
                            <div style={{ width: '60%' }}>
                                <select
                                    value={formData.statusRecurso}
                                    onChange={(e) => updateField('statusRecurso', e.target.value)}
                                    style={{
                                        height: '40px',
                                        width: '100%',
                                        borderRadius: '6px',
                                        padding: '5px 10px',
                                        backgroundColor: colors.darkGrayTwo,
                                        border: '1px solid rgba(255,255,255,.08)',
                                        color: colors.silver,
                                        outline: 'none',
                                        fontFamily: 'Octosquares Extra Light, sans-serif',
                                        fontSize: '13px',
                                    }}
                                >
                                    <option value="">Selecione o status inicial</option>
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
                            </div>

                            <InputValorDark
                                placeholder="Valor cobrado pelo serviço (R$)"
                                value={formData.valorServico}
                                onChange={(valor) => updateField('valorServico', valor)}
                                width="40%"
                            />
                        </Box>


                        {/* Linha 4: botão CRLV PDF */}
                        <Box direction="row" style={{ gap: 10 }}>
                            <UploadWrapper width="40%">
                                <input
                                    id="crlvPdfInput"
                                    type="file"
                                    accept="application/pdf"
                                    style={{ display: 'none' }}
                                    onChange={handleCrlvPdfChange}
                                />

                                <UploadButton
                                    type="button"
                                    onClick={() => {
                                        const input = document.getElementById('crlvPdfInput');
                                        if (input) input.click();
                                    }}
                                >
                                    <FiUpload />

                                    <div className="upload-text">
                                        <span className="upload-label">
                                            CRLV (PDF)
                                        </span>

                                        {formData.crlvPdfNome ? (
                                            <span className="upload-filename">
                                                {formData.crlvPdfNome}
                                            </span>
                                        ) : (
                                            <span className="upload-filename">
                                                Nenhum arquivo selecionado
                                            </span>
                                        )}
                                    </div>
                                </UploadButton>
                            </UploadWrapper>
                        </Box>
                    </>
                )}

            </Box>

            <Box width="100%" height={'50px'}>

            </Box>

            {/* =====================================
                BOTÕES DE AÇÃO
            ====================================== */}
            <Box
                direction="row"
                justify="flex-start"
                width="100%"
                bottomSpace="20px"
                style={{
                    padding: "0 25px",
                    boxSizing: "border-box",
                }}
            >

                {step > 1 && (
                    <button
                        onClick={prevStep}
                        style={{
                            width: "120px",
                            height: "35px",
                            borderRadius: "6px",
                            border: "none",
                            backgroundColor: colors.darkGrayTwo,
                            color: colors.silver,
                            cursor: "pointer",
                        }}
                    >
                        Voltar
                    </button>
                )}

                {step < 3 && (
                    <button
                        onClick={nextStep}
                        style={{
                            minWidth: "160px",
                            height: "40px",
                            borderRadius: "6px",
                            border: "none",
                            backgroundColor: colors.orange,
                            color: "#fff",
                            cursor: "pointer",
                            marginLeft: "auto",

                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            fontSize: "15px",
                            fontWeight: "500",
                        }}
                    >
                        Próximo
                        <FiChevronRight />
                    </button>
                )}

                {step === 3 && (
                    <button
                        onClick={handleSave}
                        style={{
                            width: "120px",
                            height: "35px",
                            borderRadius: "6px",
                            border: "none",
                            backgroundColor: colors.orange,
                            color: "#fff",
                            cursor: "pointer",
                            marginLeft: "auto",
                        }}
                    >
                        Salvar
                    </button>
                )}

            </Box>

        </Container>
    );
};

export default CreateCliente;