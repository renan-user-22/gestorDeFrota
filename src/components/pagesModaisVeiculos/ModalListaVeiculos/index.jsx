import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { FaWindowClose } from "react-icons/fa";
import { BsCardHeading } from "react-icons/bs";
import { MdAddBox } from "react-icons/md";
import { FaChevronDown } from 'react-icons/fa';
import { FaTruckFront } from "react-icons/fa6";
import { FaFilePdf } from "react-icons/fa6";
import { TbStatusChange } from "react-icons/tb";
import { FaUserEdit } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

import { MdAdd } from 'react-icons/md';
import { BsFillFileEarmarkExcelFill } from "react-icons/bs";
import { GrUpdate } from "react-icons/gr";

import AddVeiculos from '../AddVeiculos';
import EditAnoLicenciamento from '../EditAnoLicenciamento';
import ModalAtualizarStatus from '../ModalAtualizarStatus';
import ModalAtualizarProprietario from '../ModalAtualizarProprietario';

import { db } from '../../../firebaseConnection';
import { ref, onValue, remove } from 'firebase/database';

import { Box, TextDefault } from '../../../stylesAppDefault';
import { colors } from '../../../theme';
import LogoImage from '../../../images/logomarca.png'
import {
    ModalAreaTotalDisplay,
    ModalAreaInfo,
    DefaultButton,
    Button,
    ListaScrollContainer
} from './styles';

const ModalListaVeiculos = ({ closeModalListVeiculos, empresaId, empresaNome }) => {

    const [listaVeiculos, setListaVeiculos] = useState([]);
    const [veiculoExpandido, setVeiculoExpandido] = useState(null);

    const [modalAddVeiculosForm, setModalAddVeiculosForm] = useState(false);
    const [modalEditLicenciamentoVeiculo, setModalEditLicenciamentoVeiculo] = useState(false);
    const [modalAtualizarStatus, setModalAtualizarStatus] = useState(false);
    const [modalAtualizarProprietario, setModalAtualizarProprietario] = useState(false);



    const [veiculoSelecionado, setVeiculoSelecionado] = useState(null);
    const [veiculoModelo, setVeiculoModelo] = useState('');

    const editarLicenciamento = (id, modelo) => {
        const veiculo = listaVeiculos.find((item) => item.id === id);
        setVeiculoSelecionado(veiculo);
        setModalEditLicenciamentoVeiculo(true);
        setVeiculoModelo(modelo);
    };

    const editarStatus = (id, modelo) => {
        const veiculo = listaVeiculos.find((item) => item.id === id);
        setVeiculoSelecionado(veiculo);
        setModalAtualizarStatus(true);
        setVeiculoModelo(modelo);
    };

    const editarProprietario = (id, modelo) => {
        const veiculo = listaVeiculos.find((item) => item.id === id);
        setVeiculoSelecionado(veiculo);
        setModalAtualizarProprietario(true);
        setVeiculoModelo(modelo);
    };

    const toggleExpandirVeiculo = (id) => {
        setVeiculoExpandido((prev) => (prev === id ? null : id));
    };

    const gerarPdfVeiculos = () => {
        const doc = new jsPDF();
        const img = new Image();
        img.src = LogoImage;

        img.onload = () => {
            // Logo
            doc.addImage(img, 'PNG', 10, 10, 50, 15);

            // Nome da empresa (título)
            doc.setFontSize(14);
            doc.text(`Empresa: ${empresaNome}`, 10, 30);

            // Subtítulo mais discreto e alinhado
            doc.setFontSize(10);
            doc.text('Relação de Veículo(s) da Frota:', 10, 36);

            // Cabeçalhos da tabela
            const headers = [
                [
                    'Modelo',
                    'Placa',
                    'Renavam',
                    'Chassi',
                    'Ano',
                    'Tipo',
                    'Licenciamento',
                    'Status',
                    'Terceirizado'
                ]
            ];

            // Dados da tabela
            const data = listaVeiculos.map((veiculo) => [
                veiculo.modelo || '',
                veiculo.placa || '',
                veiculo.renavam || '',
                veiculo.chassi || '',
                veiculo.ano || '',
                veiculo.tipo || '',
                veiculo.licenciamento || '',
                veiculo.status || 'Não informado',
                veiculo.terceirizado ? 'Sim' : 'Não'
            ]);

            // Gerar tabela no PDF
            autoTable(doc, {
                startY: 40,
                head: headers,
                body: data,
                styles: { fontSize: 8 },
                headStyles: { fillColor: [255, 102, 0] },
            });

            // Salvar PDF
            doc.save(`Lista_Veiculos_${empresaNome}.pdf`);
        };
    };



    useEffect(() => {
        const veiculosRef = ref(db, `empresas/${empresaId}/veiculos`);
        onValue(veiculosRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const lista = Object.entries(data).map(([key, value]) => ({
                    id: key,
                    ...value
                }));
                setListaVeiculos(lista);
            } else {
                setListaVeiculos([]);
            }
        });
    }, [empresaId]);

    const excluirVeiculo = (veiculoId) => {
        Swal.fire({
            title: 'Tem certeza?',
            text: 'Deseja excluir este veículo?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: colors.orange,
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, excluir',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const veiculoRef = ref(db, `empresas/${empresaId}/veiculos/${veiculoId}`);
                remove(veiculoRef)
                    .then(() => {
                        Swal.fire('Excluído!', 'O veículo foi excluído com sucesso.', 'success');
                    })
                    .catch((error) => {
                        Swal.fire('Erro!', 'Não foi possível excluir o veículo.', 'error');
                        console.error('Erro ao excluir veículo:', error);
                    });
            }
        });
    };

    const mensageeeee = () => {
        alert("em desenvolvimento!");
    }

    return (
        <ModalAreaTotalDisplay>
            <ModalAreaInfo>

                <Box color={colors.black} width={'100%'} topSpace={'10px'} direction={'column'} align={'center'}>
                    <Box
                        width={'95%'}
                        justify={'space-between'}
                        align={'center'}
                        topSpace={'10px'}
                        paddingTop={'10px'}
                        paddingLeft={'20px'}
                        paddingRight={'20px'}
                    >
                        <Box direction="row" align="center">
                            <FaTruckFront size={'27px'} color={colors.silver} />
                            <TextDefault left={'10px'} color={colors.silver} weight={'bold'} size={'17px'}>
                               Veículo(s) da empresa {empresaNome}
                            </TextDefault>
                        </Box>

                        <Button onClick={() => closeModalListVeiculos()} color={'transparent'}>
                            <IoClose size={'30px'} color={colors.silver} />
                        </Button>
                    </Box>

                    <Box width={'95%'} height={'1px'} radius={'1px'} color={colors.silver} topSpace={'20px'} />

                    <Box direction={'row'} align={'center'} width={'95%'}>
                        <DefaultButton width="150px" onClick={() => setModalAddVeiculosForm(true)}>
                            <MdAdd size={'20px'} color={colors.silver} />
                            <TextDefault color={colors.silver} size={'14px'} left={'5px'}>
                                Cadastrar Veículo
                            </TextDefault>
                        </DefaultButton>

                        <DefaultButton color={colors.orange} onClick={() => mensageeeee()} right={'20px'}>
                            <FaFilePdf size={'20px'} color={colors.silver} />
                            <TextDefault color={colors.silver} size={'14px'} left={'5px'}>
                                Gerar Pdf
                            </TextDefault>
                        </DefaultButton>

                        <DefaultButton color={colors.orange} onClick={() => mensageeeee()} right={'20px'}>
                            <BsFillFileEarmarkExcelFill size={'20px'} color={colors.silver} />
                            <TextDefault color={colors.silver} size={'14px'} left={'5px'}>
                                Gerar Excel
                            </TextDefault>
                        </DefaultButton>

                        <DefaultButton color={colors.orange} onClick={() => mensageeeee()} right={'20px'}>
                            <GrUpdate size={'20px'} color={colors.silver} />
                            <TextDefault color={colors.silver} size={'14px'} left={'5px'}>
                                Atualizar Lista
                            </TextDefault>
                        </DefaultButton>
                    </Box>
                </Box>
               

                <ListaScrollContainer>
                    {listaVeiculos.length === 0 ? (
                        <TextDefault top="10px" color={colors.silver}>
                            Nenhum veículo cadastrado.
                        </TextDefault>
                    ) : (
                        listaVeiculos.map((veiculo) => (
                            <Box
                                key={veiculo.id}
                                width="100%"
                                radius="5px"
                                color={colors.black}
                                paddingLeft="10px"
                                paddingTop="10px"
                                paddingBottom="10px"
                                topSpace="10px"
                                direction="column"
                                style={{ border: `1px solid ${colors.black}` }}
                            >
                                <Box
                                    width="100%"
                                    justify="space-between"
                                    align="center"
                                    onClick={() => toggleExpandirVeiculo(veiculo.id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <Box direction="column">
                                        <TextDefault color={colors.silver} weight="bold">
                                            Placa: {veiculo.placa}
                                        </TextDefault>
                                        <TextDefault color={colors.silver} size="12px">
                                            Modelo: {veiculo.modelo}
                                        </TextDefault>
                                        <TextDefault color={colors.silver} size="12px">
                                            Último licenciamento: {veiculo.licenciamento}
                                        </TextDefault>
                                        <TextDefault color={colors.silver} size="12px">
                                            Status Operacional: <strong>{veiculo.status}</strong>
                                        </TextDefault>
                                    </Box>

                                    <FaChevronDown
                                        size={18}
                                        color={colors.orange}
                                        style={{
                                            marginRight: '30px',
                                            transform: veiculoExpandido === veiculo.id ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.3s ease',
                                        }}
                                    />
                                </Box>

                                <AnimatePresence>
                                    {veiculoExpandido === veiculo.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            style={{ overflow: 'hidden' }}
                                        >
                                            <Box direction="column" paddingTop="10px">
                                                <TextDefault color={colors.silver} size="12px">Ano: {veiculo.ano}</TextDefault>
                                                <TextDefault color={colors.silver} size="12px">Tipo: {veiculo.tipo}</TextDefault>
                                                <TextDefault color={colors.silver} size="12px">Renavam: {veiculo.renavam}</TextDefault>
                                                <TextDefault color={colors.silver} size="12px">Chassi: {veiculo.chassi}</TextDefault>
                                            </Box>

                                            {veiculo.terceirizado && veiculo.proprietario && (
                                                <>
                                                    <TextDefault color={colors.silver} size="12px" top={'10px'} weight={'bold'}>Proprietário:</TextDefault>
                                                    <TextDefault color={colors.silver} size="12px">Nome: {veiculo.proprietario.nome}</TextDefault>
                                                    {veiculo.proprietario.cpf && <TextDefault color={colors.silver} size="12px">CPF: {veiculo.proprietario.cpf}</TextDefault>}
                                                    {veiculo.proprietario.cnpj && <TextDefault color={colors.silver} size="12px">CNPJ: {veiculo.proprietario.cnpj}</TextDefault>}
                                                    <TextDefault color={colors.silver} size="12px">Contato: {veiculo.proprietario.contato}</TextDefault>
                                                </>
                                            )}

                                            <Box width="30%" topSpace="10px">

                                                <Button direction={'column'} color={colors.black} onClick={() => excluirVeiculo(veiculo.id)} right={'20px'}>
                                                    <FaWindowClose size={'19px'} />
                                                    <TextDefault color={colors.silver} size={'10px'} top={'5px'}>
                                                        Excluir
                                                    </TextDefault>
                                                </Button>

                                                <Button direction={'column'} color={colors.orange} onClick={() => editarLicenciamento(veiculo.id, veiculo.modelo)} right={'20px'}>
                                                    <BsCardHeading size={'19px'} />
                                                    <TextDefault color={colors.silver} size={'10px'} top={'5px'}>
                                                        Licenciamento
                                                    </TextDefault>
                                                </Button>

                                                <Button direction={'column'} color={colors.orange} onClick={() => editarStatus(veiculo.id, veiculo.modelo)} right={'20px'}>
                                                    <TbStatusChange size={'19px'} />
                                                    <TextDefault color={colors.silver} size={'10px'} top={'5px'}>
                                                        Status
                                                    </TextDefault>
                                                </Button>


                                                <Button direction={'column'} color={colors.orange} onClick={() => editarProprietario(veiculo.id, veiculo.modelo)} right={'20px'}>
                                                    <FaUserEdit size={'19px'} />
                                                    <TextDefault color={colors.silver} size={'10px'} top={'5px'}>
                                                        Proprietário
                                                    </TextDefault>
                                                </Button>


                                            </Box>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Box>
                        ))
                    )}

                </ListaScrollContainer>

                {modalAddVeiculosForm && (
                    <AddVeiculos
                        closeModalAddVeiculos={() => setModalAddVeiculosForm(false)}
                        empresaIdProp={empresaId}
                    />
                )}

                {modalEditLicenciamentoVeiculo && (
                    <EditAnoLicenciamento
                        closeModalEditLicenciamento={() => setModalEditLicenciamentoVeiculo(false)}
                        empresaIdProp={empresaId}
                        veiculoSelecionado={veiculoSelecionado}
                        veiculoModelo={veiculoModelo}
                    />
                )}

                {modalAtualizarStatus && (
                    <ModalAtualizarStatus
                        closeModalAtualizarStatus={() => setModalAtualizarStatus(false)}
                        empresaIdProp={empresaId}
                        veiculoSelecionado={veiculoSelecionado}
                        veiculoModelo={veiculoModelo}
                    />
                )}

                {modalAtualizarProprietario && (
                    <ModalAtualizarProprietario
                        closeModalAtualizarProprietario={() => setModalAtualizarProprietario(false)}
                        empresaIdProp={empresaId}
                        veiculoSelecionado={veiculoSelecionado}
                        veiculoModelo={veiculoModelo}
                    />
                )}


            </ModalAreaInfo>
        </ModalAreaTotalDisplay>
    );
};

export default ModalListaVeiculos;
