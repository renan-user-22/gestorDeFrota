// src/pages/Recurso/index.jsx
import React, { useState, useEffect, useMemo } from 'react';

import Lottie from 'lottie-react';
import EmptyCompaniesAnim from '../../components/lotties/empty-companies.json';

import { FaFileInvoiceDollar, FaEye, FaTrashAlt, FaEdit, FaEyeSlash } from 'react-icons/fa';
import { MdAdd } from 'react-icons/md';

import { TextDefault, Box, SwalCustomStyles } from '../../stylesAppDefault';
import { colors } from '../../theme';

import {
    Container,
    Input,
    DefaultButton,
} from './styles';

import Swal from 'sweetalert2';

// Firebase Realtime DB
import { db } from '../../firebaseConnection';
import { ref, onValue, off, remove, update } from 'firebase/database';

// Componente de criar novo cliente
import NewCliente from '../../components/fleet-settings/recurso-components/create-client';

// Helper para deixar o label bonitinho
const formatLabel = (key) => {
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/_/g, ' ')
        .replace(/^./, (c) => c.toUpperCase());
};

const RecursoPage = () => {
    const [termoBusca, setTermoBusca] = useState('');
    const [modalAddVisible, setModalAddVisible] = useState(false);
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);

    // View
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [showSenha, setShowSenha] = useState(false);
    const [activeTab, setActiveTab] = useState(1); // 1..5

    // Edit
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    const openModalAdd = () => setModalAddVisible(true);
    const closeModalAdd = () => setModalAddVisible(false);

    // ==== CARREGAR CLIENTES DO REALTIME DB (fleetRecurso) ====
    useEffect(() => {
        const clientesRef = ref(db, 'fleetRecurso');

        const handleValue = (snapshot) => {
            const data = snapshot.val();

            if (data) {
                const lista = Object.entries(data).map(([id, value]) => ({
                    id,
                    ...(value || {}),
                }));

                // Ordena por createdAt desc, se existir
                lista.sort((a, b) => {
                    if (a.createdAt && b.createdAt) {
                        return String(b.createdAt).localeCompare(String(a.createdAt));
                    }
                    return 0;
                });

                setClientes(lista);
            } else {
                setClientes([]);
            }

            setLoading(false);
        };

        onValue(clientesRef, handleValue);

        return () => {
            off(clientesRef, 'value', handleValue);
        };
    }, []);

    // ==== FILTRO DE BUSCA ====
    const clientesFiltrados = useMemo(() => {
        const termo = termoBusca.trim().toLowerCase();
        if (!termo) return clientes;

        return clientes.filter((cliente) => {
            const nome = cliente.nomeCompleto || '';
            const cpf = cliente.cpf || '';
            const placa = cliente.placaVeiculo || '';
            const ait = cliente.numeroAIT || '';

            return (
                nome.toLowerCase().includes(termo) ||
                cpf.toLowerCase().includes(termo) ||
                placa.toLowerCase().includes(termo) ||
                ait.toLowerCase().includes(termo)
            );
        });
    }, [clientes, termoBusca]);

    // ==== AÇÃO: VER (olho) ====
    const handleView = (cliente) => {
        setSelectedCliente(cliente);
        setShowSenha(false);  // senha sempre começa oculta
        setActiveTab(1);      // começa na tab 1
        setViewModalOpen(true);
    };

    // ==== AÇÃO: EDITAR (lápis) ====
    const handleOpenEdit = (cliente) => {
        setEditingId(cliente.id);
        const { id, ...rest } = cliente;
        setEditFormData(rest || {});
        setEditModalOpen(true);
    };

    const handleEditChange = (key, value) => {
        setEditFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSaveEdit = async () => {
        if (!editingId) return;

        try {
            Swal.fire({
                title: 'Salvando alterações...',
                html: 'Aguarde enquanto os dados são atualizados.',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                },
                background: colors.darkGray,
                color: colors.silver,
            });

            const clienteRef = ref(db, `fleetRecurso/${editingId}`);
            await update(clienteRef, {
                ...editFormData,
                updatedAt: new Date().toISOString(),
            });

            Swal.fire({
                icon: 'success',
                title: 'Cliente atualizado!',
                text: 'Os dados foram atualizados com sucesso.',
                confirmButtonColor: colors.orange,
                background: colors.darkGray,
                color: colors.silver,
            });

            setEditModalOpen(false);
            setEditingId(null);
            setEditFormData({});
        } catch (error) {
            console.error('Erro ao editar cliente:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro ao salvar',
                text: 'Ocorreu um erro ao atualizar os dados. Tente novamente.',
                confirmButtonColor: colors.orange,
                background: colors.darkGray,
                color: colors.silver,
            });
        }
    };

    // ==== AÇÃO: EXCLUIR (lixeira) ====
    const handleDelete = async (cliente) => {
        const result = await Swal.fire({
            title: 'Excluir cliente?',
            text: `Tem certeza que deseja excluir o cliente "${cliente.nomeCompleto || ''}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, excluir',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#e74c3c',
            cancelButtonColor: colors.darkGrayTwo,
            background: colors.darkGray,
            color: colors.silver,
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            const clienteRef = ref(db, `fleetRecurso/${cliente.id}`);
            await remove(clienteRef);

            Swal.fire({
                icon: 'success',
                title: 'Cliente excluído',
                text: 'O registro foi removido com sucesso.',
                confirmButtonColor: colors.orange,
                background: colors.darkGray,
                color: colors.silver,
            });
        } catch (error) {
            console.error('Erro ao excluir cliente:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro ao excluir',
                text: 'Ocorreu um erro ao excluir o cliente. Tente novamente.',
                confirmButtonColor: colors.orange,
                background: colors.darkGray,
                color: colors.silver,
            });
        }
    };

    // ==== CAMPOS POR TAB NO MODAL DE VISUALIZAÇÃO ====
    const renderTabFields = () => {
        if (!selectedCliente) return null;
        const data = selectedCliente;

        // =========================
        // Helper para renderizar 1 campo
        // =========================
        const renderFieldBox = (key, colIndex = 0) => {
            if (!key) {
                // espaço vazio (placeholder) pra completar linha
                return (
                    <Box
                        width="32%"
                        direction="column"
                        align="flex-start"
                    />
                );
            }

            const value = data[key];
            const isSenhaField = key.toLowerCase().includes('senha');

            const rawValue =
                value === '' || value === null || value === undefined
                    ? '--'
                    : String(value);

            const displayValue =
                isSenhaField && !showSenha ? '••••••••' : rawValue;

            // alinhamento por coluna
            let align = 'flex-start';
            let textAlign = 'left';
            let justifyLabel = 'flex-start';

            if (colIndex === 1) {
                // coluna do meio
                align = 'center';
                justifyLabel = 'center';
            } else if (colIndex === 2) {
                // última coluna → direita
                align = 'flex-end';
                textAlign = 'right';
                justifyLabel = 'flex-end';
            }

            return (
                <Box
                    key={key}
                    width="32%"
                    direction="column"
                    align={align}
                    bottomSpace="8px"
                >
                    {/* Label + olho (se for senha) */}
                    <Box
                        width="100%"
                        direction="row"
                        align="center"
                        style={{
                            gap: 6,
                            marginBottom: 4,
                            justifyContent: justifyLabel,
                        }}
                    >
                        <TextDefault
                            color={colors.silver}
                            size="13px"
                            weight="bold"
                            style={{ textAlign }}
                        >
                            {formatLabel(key)}:
                        </TextDefault>

                        {isSenhaField && (
                            <button
                                type="button"
                                onClick={() => setShowSenha((prev) => !prev)}
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {showSenha ? (
                                    <FaEyeSlash size={14} color={colors.silver} />
                                ) : (
                                    <FaEye size={14} color={colors.silver} />
                                )}
                            </button>
                        )}
                    </Box>

                    {/* Valor */}
                    <TextDefault
                        color={colors.silver}
                        size="13px"
                        style={{
                            textAlign,
                            marginLeft: colIndex === 0 ? 2 : 0,
                        }}
                    >
                        {displayValue}
                    </TextDefault>
                </Box>
            );
        };

        // =========================
        // Tab 1 – Pessoais & Endereço (layout manual)
        // =========================
        const renderTab1 = () => (
            <Box
                width="100%"
                direction="column"
                style={{ marginTop: 10, gap: 10 }}
            >
                {/* Linha 1: Nome / CPF / Telefone */}
                <Box
                    width="100%"
                    direction="row"
                    justify="space-between"
                    style={{ gap: 16 }}
                >
                    {renderFieldBox('nomeCompleto', 0)}
                    {renderFieldBox('cpf', 1)}
                    {renderFieldBox('telefone', 2)}
                </Box>

                {/* Linha 2: Nome mãe / Nome pai / Município Nascimento */}
                <Box
                    width="100%"
                    direction="row"
                    justify="space-between"
                    style={{ gap: 16 }}
                >
                    {renderFieldBox('nomeMae', 0)}
                    {renderFieldBox('nomePai', 1)}
                    {renderFieldBox('municipioNascimento', 2)}
                </Box>

                {/* Linha 3: UF Nascimento / Rua / Número */}
                <Box
                    width="100%"
                    direction="row"
                    justify="space-between"
                    style={{ gap: 16 }}
                >
                    {renderFieldBox('ufNascimento', 0)}
                    {renderFieldBox('rua', 1)}
                    {renderFieldBox('numero', 2)}
                </Box>

                {/* Linha 4: Bairro / Complemento / Cep */}
                <Box
                    width="100%"
                    direction="row"
                    justify="space-between"
                    style={{ gap: 16 }}
                >
                    {renderFieldBox('bairro', 0)}
                    {renderFieldBox('complemento', 1)}
                    {renderFieldBox('cep', 2)}
                </Box>

                {/* Linha 5: Cidade / Estado / Município Registro */}
                <Box
                    width="100%"
                    direction="row"
                    justify="space-between"
                    style={{ gap: 16 }}
                >
                    {renderFieldBox('cidade', 0)}
                    {renderFieldBox('estado', 1)}
                    {renderFieldBox('municipioRegistro', 2)}
                </Box>

                {/* Linha 6: UF Registro / Senha Cliente / vazio */}
                <Box
                    width="100%"
                    direction="row"
                    justify="space-between"
                    style={{ gap: 16 }}
                >
                    {renderFieldBox('ufRegistro', 0)}
                    {renderFieldBox('senhaCliente', 1)}
                    {renderFieldBox(null, 2)} {/* slot vazio só pra manter grid */}
                </Box>
            </Box>
        );

        // =========================
        // Tabs 2..5 – grid genérico 3 colunas
        // =========================
        const tab2Fields = [
            'cnhNumero',
            'cnhCategoria',
            'cnhEmissao',
            'cnhValidade',
            'cnhPrimeiraHab',
            'ufEmissor',
            'cnhObservacoes',
            'cnhPdfNome',
        ];

        const tab3Fields = [
            'numeroAIT',
            'numeroRenainf',
            'codigoInfracao',
            'descricaoInfracao',
            'dataInfracao',
            'horaInfracao',
            'localInfracao',
            'municipioInfracao',
            'ufInfracao',
            'codigoOrgaoAutuador',
            'codigoMunicipio',
            'orgaoAutuador',
            'dataNotificacao',
            'prazoDefesa',
            'prazoIndicacaoCondutor',
            'desdobramento',
            'valorMulta',
        ];

        const tab4Fields = [
            'placaVeiculo',
            'renavam',
            'cpfCnpjProprietario',
            'nomeProprietario',
            'marcaModeloVersao',
            'especieVeiculo',
            'combustivel',
            'corPredominante',
            'anoFabricacao',
            'anoModelo',
            'municipioRegistro',
            'ufRegistro',
            'crlvPdfNome',
            'multaPdfNome',
        ];

        const tab5Fields = [
            'valorServico',
            'statusRecurso',
            'createdAt',
            'updatedAt',
        ];

        const makeGrid = (keys) => {
            const col1 = [];
            const col2 = [];
            const col3 = [];

            keys.forEach((key, index) => {
                const mod = index % 3;
                if (mod === 0) col1.push(key);
                else if (mod === 1) col2.push(key);
                else col3.push(key);
            });

            return (
                <Box
                    width="100%"
                    direction="row"
                    justify="space-between"
                    style={{ marginTop: 10 }}
                >
                    <Box width="32%" direction="column" align="flex-start">
                        {col1.map((key) => renderFieldBox(key, 0))}
                    </Box>
                    <Box width="32%" direction="column" align="center">
                        {col2.map((key) => renderFieldBox(key, 1))}
                    </Box>
                    <Box width="32%" direction="column" align="flex-end">
                        {col3.map((key) => renderFieldBox(key, 2))}
                    </Box>
                </Box>
            );
        };

        switch (activeTab) {
            case 1:
                return renderTab1();          // layout manual
            case 2:
                return makeGrid(tab2Fields); // CNH
            case 3:
                return makeGrid(tab3Fields); // Infração
            case 4:
                return makeGrid(tab4Fields); // Veículo
            case 5:
                return makeGrid(tab5Fields); // Financeiro & Status
            default:
                return null;
        }
    };



    return (
        <Container>
            <SwalCustomStyles />

            {/* ====== HEADER ====== */}
            <Box
                color={colors.black}
                width="97%"
                topSpace={'15px'}
                paddingTop="15px"
                paddingBottom="5px"
                direction="column"
                align="center"
            >
                <Box
                    width="95%"
                    justify="space-between"
                    align="center"
                    paddingLeft="20px"
                    paddingRight="20px"
                >
                    <Box direction="row" align="center">
                        <FaFileInvoiceDollar size="26px" color={colors.silver} />
                        <TextDefault left="10px" color={colors.silver} weight="bold" size="20px">
                            Fleet Recurso - Clientes Cadastrados
                        </TextDefault>
                    </Box>

                    <Input
                        type="text"
                        placeholder="Buscar por nome, CPF, placa ou Nº AIT..."
                        value={termoBusca}
                        onChange={(e) => setTermoBusca(e.target.value)}
                        style={{ width: '280px' }}
                    />
                </Box>

                <Box width="95%" height="1px" radius="1px" color={colors.silver} topSpace="15px" />

                <Box direction="row" align="center" width="95%" topSpace="10px" style={{ gap: 10 }}>
                    <DefaultButton onClick={openModalAdd}>
                        <MdAdd size="20px" />
                        <span style={{ marginLeft: 6 }}>Novo Cliente</span>
                    </DefaultButton>
                </Box>
            </Box>

            {/* ====== CONTEÚDO ====== */}
            <Box
                width="100%"
                height="100%"
                justify="flex-start"
                align="center"
                direction="column"
                topSpace="40px"
            >
                {loading ? (
                    <>
                        <Lottie
                            animationData={EmptyCompaniesAnim}
                            loop
                            style={{ width: 260, height: 260 }}
                        />
                        <TextDefault top="20px" color={colors.silver}>
                            Carregando clientes...
                        </TextDefault>
                    </>
                ) : clientesFiltrados.length === 0 ? (
                    <>
                        <Lottie
                            animationData={EmptyCompaniesAnim}
                            loop
                            style={{ width: 260, height: 260 }}
                        />
                        <TextDefault top="20px" color={colors.silver}>
                            Nenhum cliente cadastrado ainda.
                        </TextDefault>
                    </>
                ) : (
                    <Box width="97%" direction="column" align="center">
                        {/* Cabeçalho da tabela */}
                        <Box
                            color={colors.orange}
                            width="95%"
                            paddingTop="10px"
                            paddingBottom="10px"
                            direction="row"
                            align="center"
                            style={{
                                borderRadius: '8px 8px 0 0',
                                paddingLeft: 20,
                                paddingRight: 20,
                            }}
                        >
                            <Box width="25%">
                                <TextDefault color={colors.silver} weight="bold" size="14px">
                                    Nome
                                </TextDefault>
                            </Box>
                            <Box width="15%">
                                <TextDefault color={colors.silver} weight="bold" size="14px">
                                    CPF
                                </TextDefault>
                            </Box>
                            <Box width="18%">
                                <TextDefault color={colors.silver} weight="bold" size="14px">
                                    Telefone
                                </TextDefault>
                            </Box>
                            <Box width="12%">
                                <TextDefault color={colors.silver} weight="bold" size="14px">
                                    Placa
                                </TextDefault>
                            </Box>
                            <Box width="15%">
                                <TextDefault color={colors.silver} weight="bold" size="14px">
                                    Nº AIT
                                </TextDefault>
                            </Box>
                            <Box width="15%" style={{ textAlign: 'right' }}>
                                <TextDefault color={colors.silver} weight="bold" size="14px">
                                    Ações
                                </TextDefault>
                            </Box>
                        </Box>

                        {/* Linhas da tabela */}
                        {clientesFiltrados.map((cliente) => (
                            <Box
                                key={cliente.id}
                                color={colors.black}
                                width="95%"
                                paddingTop="10px"
                                paddingBottom="10px"
                                direction="row"
                                align="center"
                                style={{
                                    paddingLeft: 20,
                                    paddingRight: 20,
                                    borderBottom: `1px solid ${colors.darkGrayTwo}`,
                                }}
                            >
                                <Box width="25%">
                                    <TextDefault color={colors.silver} size="13px">
                                        {cliente.nomeCompleto || '--'}
                                    </TextDefault>
                                </Box>
                                <Box width="15%">
                                    <TextDefault color={colors.silver} size="13px">
                                        {cliente.cpf || '--'}
                                    </TextDefault>
                                </Box>
                                <Box width="18%">
                                    <TextDefault color={colors.silver} size="13px">
                                        {cliente.telefone || '--'}
                                    </TextDefault>
                                </Box>
                                <Box width="12%">
                                    <TextDefault color={colors.silver} size="13px">
                                        {cliente.placaVeiculo || '--'}
                                    </TextDefault>
                                </Box>
                                <Box width="15%">
                                    <TextDefault color={colors.silver} size="13px">
                                        {cliente.numeroAIT || '--'}
                                    </TextDefault>
                                </Box>

                                {/* Coluna de ações */}
                                <Box
                                    width="15%"
                                    direction="row"
                                    justify="flex-end"
                                    style={{ gap: 8 }}
                                >
                                    <button
                                        type="button"
                                        onClick={() => handleView(cliente)}
                                        style={{
                                            width: 30,
                                            height: 30,
                                            borderRadius: 6,
                                            border: 'none',
                                            backgroundColor: colors.darkGrayTwo,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <FaEye size={14} color={colors.silver} />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleOpenEdit(cliente)}
                                        style={{
                                            width: 30,
                                            height: 30,
                                            borderRadius: 6,
                                            border: 'none',
                                            backgroundColor: colors.darkGrayTwo,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <FaEdit size={14} color={colors.silver} />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleDelete(cliente)}
                                        style={{
                                            width: 30,
                                            height: 30,
                                            borderRadius: 6,
                                            border: 'none',
                                            backgroundColor: colors.darkGrayTwo,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <FaTrashAlt size={14} color={colors.silver} />
                                    </button>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>

            {/* ====== MODAL: NOVO CLIENTE ====== */}
            {modalAddVisible && (
                <Box
                    position="absolute"
                    width="100%"
                    height="100%"
                    justify="center"
                    align="center"
                    style={{
                        top: 0,
                        left: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        zIndex: 1000,
                    }}
                >
                    <Box
                        color={colors.darkGrayTwo}
                        radius="12px"
                        width="100%"
                        height="100vh"
                        padding="0px"
                        direction="column"
                        align="center"
                    >
                        <NewCliente onClose={closeModalAdd} />
                    </Box>
                </Box>
            )}

            {/* ====== MODAL: VER CLIENTE (olho) ====== */}
            {viewModalOpen && selectedCliente && (
                <Box
                    position="absolute"
                    width="100%"
                    height="100%"
                    justify="center"
                    align="center"
                    style={{
                        top: 0,
                        left: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        zIndex: 1001,
                    }}
                >
                    <Box
                        color={colors.darkGrayTwo} // header/topo preto
                        width="90%"
                        height="90vh"
                        padding="20px"
                        direction="column"
                        align="flex-start"
                        style={{ overflow: 'hidden' }}
                    >
                        {/* HEADER */}
                        <Box
                            width="100%"
                            radius="0px"
                            direction="row"
                            justify="space-between"
                            align="center"
                            color={colors.darkGray}
                            style={{ padding: '10px' }}
                        >
                            <TextDefault color={colors.silver} weight="bold" size="18px">
                                Detalhes do cliente
                            </TextDefault>
                            <button
                                type="button"
                                onClick={() => {
                                    setViewModalOpen(false);
                                    setSelectedCliente(null);
                                    setShowSenha(false);
                                    setActiveTab(1);
                                }}
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    color: colors.silver,
                                    fontSize: 18,
                                    cursor: 'pointer',
                                    marginRight: '30px'
                                }}
                            >
                                ✕
                            </button>
                        </Box>

                        {/* CAIXA DE CONTEÚDO (tabs + dados) */}
                        <Box
                            width="100%"
                            color={colors.darkGrayTwo} // gray700

                            radius="0px"
                            direction={'column'}
                            style={{
                                maxHeight: '100%',
                                overflowY: 'auto',
                            }}
                        >
                            {/* TAB TOP */}
                            <Box
                                width="100%"
                                direction="row"
                                style={{ marginBottom: 12 }}
                            >
                                {[
                                    { id: 1, label: 'Pessoais & Endereço' },
                                    { id: 2, label: 'CNH & Complementos' },
                                    { id: 3, label: 'Infração' },
                                    { id: 4, label: 'Veículo' },
                                    { id: 5, label: 'Financeiro & Status' },
                                ].map((tab) => {
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            onClick={() => setActiveTab(tab.id)}
                                            style={{
                                                flex: 1,
                                                position: 'relative',
                                                height: 46,
                                                border: 'none',
                                                backgroundColor: colors.darkGray, // fundo da tab
                                                color: colors.silver,
                                                fontFamily: 'Octosquares Extra Light',
                                                cursor: 'pointer',
                                                fontSize: 16,
                                                padding: '0 8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {tab.label}
                                            {isActive && (
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: 4,
                                                        left: '10%',
                                                        right: '10%',
                                                        height: 2,

                                                        backgroundColor: colors.orange, // marcador orange500
                                                    }}
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </Box>

                            <Box paddingLeft={'20px'} paddingRight={'20px'}>
                                {/* CONTEÚDO DA TAB */}
                                {renderTabFields()}
                            </Box>


                        </Box>
                    </Box>
                </Box>
            )}

            {/* ====== MODAL: EDITAR CLIENTE (lápis) ====== */}
            {editModalOpen && (
                <Box
                    position="absolute"
                    width="100%"
                    height="100%"
                    justify="center"
                    align="center"
                    style={{
                        top: 0,
                        left: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        zIndex: 1002,
                    }}
                >
                    <Box
                        color={colors.darkGrayTwo}
                        radius="12px"
                        width="90%"
                        height="90vh"
                        padding="20px"
                        direction="column"
                        align="flex-start"
                        style={{ overflow: 'hidden' }}
                    >
                        <Box
                            width="100%"
                            direction="row"
                            justify="space-between"
                            align="center"
                            bottomSpace="10px"
                        >
                            <TextDefault color={colors.silver} weight="bold" size="18px">
                                Editar cliente
                            </TextDefault>
                            <button
                                type="button"
                                onClick={() => {
                                    setEditModalOpen(false);
                                    setEditingId(null);
                                    setEditFormData({});
                                }}
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    color: colors.silver,
                                    fontSize: 18,
                                    cursor: 'pointer',
                                }}
                            >
                                ✕
                            </button>
                        </Box>

                        <Box
                            width="100%"
                            color={colors.black}
                            radius="8px"
                            padding="15px"
                            style={{
                                maxHeight: '100%',
                                overflowY: 'auto',
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                                gap: '12px 16px',
                            }}
                        >
                            {Object.entries(editFormData).map(([key, value]) => (
                                <Box
                                    key={key}
                                    width="100%"
                                    direction="column"
                                    align="flex-start"
                                    bottomSpace="4px"
                                >
                                    <TextDefault
                                        color={colors.silver}
                                        size="12px"
                                        weight="bold"
                                        bottom="4px"
                                    >
                                        {formatLabel(key)}
                                    </TextDefault>
                                    <Input
                                        value={
                                            value === null || value === undefined
                                                ? ''
                                                : String(value)
                                        }
                                        onChange={(e) =>
                                            handleEditChange(key, e.target.value)
                                        }
                                        style={{ width: '100%' }}
                                    />
                                </Box>
                            ))}
                        </Box>

                        <Box
                            width="100%"
                            direction="row"
                            justify="flex-end"
                            topSpace="10px"
                            style={{ gap: 10 }}
                        >
                            <button
                                type="button"
                                onClick={() => {
                                    setEditModalOpen(false);
                                    setEditingId(null);
                                    setEditFormData({});
                                }}
                                style={{
                                    width: 110,
                                    height: 35,
                                    borderRadius: 6,
                                    border: 'none',
                                    backgroundColor: colors.darkGrayTwo,
                                    color: colors.silver,
                                    cursor: 'pointer',
                                }}
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                onClick={handleSaveEdit}
                                style={{
                                    width: 140,
                                    height: 35,
                                    borderRadius: 6,
                                    border: 'none',
                                    backgroundColor: colors.orange,
                                    color: '#fff',
                                    cursor: 'pointer',
                                }}
                            >
                                Salvar alterações
                            </button>
                        </Box>
                    </Box>
                </Box>
            )}
        </Container>
    );
};

export default RecursoPage;
