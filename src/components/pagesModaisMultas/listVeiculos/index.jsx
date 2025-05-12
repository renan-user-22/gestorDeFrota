import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import ListMultasPage from '../listMultas';

import { FaWindowClose } from "react-icons/fa";
import { FaChevronDown } from 'react-icons/fa';
import { FaFilePdf } from "react-icons/fa6";
import { FaFileInvoiceDollar } from 'react-icons/fa';

import { db } from '../../../firebaseConnection';
import { ref, onValue } from 'firebase/database';

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

    const [modallistMultas, setModallistMultas] = useState(false);
    const [veiculoModelo, setVeiculoModelo] = useState('');
    const [veiculoSelecionado, setVeiculoSelecionado] = useState(null);

    const toggleExpandirVeiculo = (id) => {
        setVeiculoExpandido((prev) => (prev === id ? null : id));
    };

    const ListMultas = (id, modelo) => {
        const veiculo = listaVeiculos.find((item) => item.id === id);
        setVeiculoSelecionado(veiculo);
        setModallistMultas(true);
        setVeiculoModelo(modelo);
    }

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

            const headers = [['Modelo', 'Placa', 'Renavam', 'Chassi', 'Ano', 'Tipo', 'Último licenciamento']];
            const data = listaVeiculos.map((veiculo) => [
                veiculo.modelo,
                veiculo.placa,
                veiculo.renavam,
                veiculo.chassi,
                veiculo.ano,
                veiculo.tipo,
                veiculo.licenciamento,
            ]);

            autoTable(doc, {
                startY: 40,
                head: headers,
                body: data,
                styles: { fontSize: 8 },
                headStyles: { fillColor: [255, 102, 0] },
            });

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

    return (
        <ModalAreaTotalDisplay>
            <ModalAreaInfo>
                <Box width={'100%'} height={'65px'} radius={'10px'} direction={'row'} topSpace={'10px'} bottomSpace={'10px'} align={'center'} justify={'space-between'}>
                    <Box>

                        <FaFileInvoiceDollar size={'30px'} color={colors.silver} />
                        <TextDefault left={'10px'} color={colors.silver} weight={'bold'} size={'21px'}>
                            Gerenciamento de multas da empresa {empresaNome}
                        </TextDefault>
                    </Box>
                    <DefaultButton onClick={closeModalListVeiculos}>
                        <FaWindowClose size={'30px'} color={colors.silver} />
                    </DefaultButton>
                </Box>

                <Box>
                    <Button color={colors.orange} onClick={gerarPdfVeiculos} right={'20px'}>
                        <FaFilePdf size={'30px'} color={colors.silver} />
                    </Button>
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
                                width="98%"
                                radius="10px"
                                color={colors.silver}
                                paddingLeft="10px"
                                paddingTop="10px"
                                paddingBottom="10px"
                                topSpace="10px"
                                direction="column"
                                style={{ border: `1px solid ${colors.silver}` }}
                            >
                                <Box
                                    width="100%"
                                    justify="space-between"
                                    align="center"
                                    onClick={() => toggleExpandirVeiculo(veiculo.id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <Box direction="column">
                                        <TextDefault color={colors.black} weight="bold">
                                            Placa: {veiculo.placa}
                                        </TextDefault>
                                        <TextDefault color={colors.black} size="12px">
                                            Modelo: {veiculo.modelo}
                                        </TextDefault>
                                        <TextDefault color={colors.black} size="12px">
                                            Último licenciamento: {veiculo.licenciamento}
                                        </TextDefault>
                                    </Box>

                                    <FaChevronDown
                                        size={18}
                                        color={colors.orange}
                                        style={{
                                            marginRight: '10px',
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
                                                <TextDefault color={colors.black} size="12px">Ano: {veiculo.ano}</TextDefault>
                                                <TextDefault color={colors.black} size="12px">Tipo: {veiculo.tipo}</TextDefault>
                                                <TextDefault color={colors.black} size="12px">Renavam: {veiculo.renavam}</TextDefault>
                                                <TextDefault color={colors.black} size="12px">Chassi: {veiculo.chassi}</TextDefault>
                                            </Box>

                                            {veiculo.terceirizado && veiculo.proprietario && (
                                                <>
                                                    <TextDefault color={colors.black} size="12px" top={'10px'} weight={'bold'}>Proprietário:</TextDefault>
                                                    <TextDefault color={colors.black} size="12px">Nome: {veiculo.proprietario.nome}</TextDefault>
                                                    {veiculo.proprietario.cpf && <TextDefault color={colors.black} size="12px">CPF: {veiculo.proprietario.cpf}</TextDefault>}
                                                    {veiculo.proprietario.cnpj && <TextDefault color={colors.black} size="12px">CNPJ: {veiculo.proprietario.cnpj}</TextDefault>}
                                                    <TextDefault color={colors.black} size="12px">Contato: {veiculo.proprietario.contato}</TextDefault>
                                                </>
                                            )}

                                            <Box width="30%" topSpace="10px">


                                                <Button direction={'column'} color={colors.orange} onClick={() => ListMultas(veiculo.id, veiculo.modelo)}>
                                                    <FaFileInvoiceDollar size={'17px'} color={colors.silver} />
                                                    <TextDefault color={colors.silver} size={'10px'} top={'5px'}>
                                                        Multas
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

                {modallistMultas && veiculoSelecionado && (
                    <ListMultasPage
                        closeModalAddVeiculos={() => setModallistMultas(false)}
                        empresaIdProp={empresaId}
                        veiculoId={veiculoSelecionado.id}
                        veiculoModelo={veiculoModelo}
                    />
                )}


            </ModalAreaInfo>
        </ModalAreaTotalDisplay>
    );
};
export default ModalListaVeiculos;
