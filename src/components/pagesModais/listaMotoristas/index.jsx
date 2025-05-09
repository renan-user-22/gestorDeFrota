import React, { useState, useEffect } from 'react';

//Bibliotecas:
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

//ícones
import { FaWindowClose } from "react-icons/fa";
import { MdAddBox } from "react-icons/md";
import { FaChevronDown } from 'react-icons/fa';
import { PiSteeringWheelFill } from "react-icons/pi";
import { FaSquarePhone } from "react-icons/fa6";
import { FaIdCard } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa6";

//Importação de Modais Adjacentes: 
import AddMotorista from '../addMotorista';
import EditCnhMotorista from '../editCnhValidadeMotorista';
import EditTelMotorista from '../editTelMotorista';

//Banco de dados conexões:
import { db } from '../../../firebaseConnection';
import { ref, onValue, getDatabase, remove } from 'firebase/database';

//Importações de estilos:
import { Box, TextDefault } from '../../../stylesAppDefault';
import { colors } from '../../../theme';
import LogoImage from '../../../images/logomarca.png'
import {
    ModalAreaTotalDisplay,
    ModalAreaInfo,
    DefaultButton,
    Button,
} from './styles';

const ListaMotoristas = ({ closeModalListMotorista, empresaId, empresaNome }) => {

    const [listaMotoristas, setListaMotoristas] = useState([]);
    const [motoristaExpandido, setMotoristaExpandido] = useState(null);

    const [modalAddMotoristaForm, setModalAddMotoristaForm] = useState(false);
    const [modalEditMotoristaTel, setModalEditMotoristaTel] = useState(false);
    const [modalEditMotoristaCnh, setModalEditMotoristaCnh] = useState(false);
    const [motoristaSelecionado, setMotoristaSelecionado] = useState(null);
    const [nomeMotorista, setNomeMotorista] = useState('');

    const toggleExpandirMotorista = (id) => {
        setMotoristaExpandido((prev) => (prev === id ? null : id));
    };

    const geratePdfList = () => {
        const doc = new jsPDF();

        // Adicionar logo (verifique se o caminho está correto e a imagem está em base64 ou use um import direto como acima)
        const img = new Image();
        img.src = LogoImage;

        img.onload = () => {
            doc.addImage(img, 'PNG', 10, 10, 50, 15);

            // Nome da empresa
            doc.setFontSize(16);
            doc.text(`Empresa: ${empresaNome}`, 10, 30);

            // Cabeçalhos da tabela
            const headers = [
                ['Nome', 'CPF', 'Telefone', 'CNH', 'Validade CNH', 'Categoria CNH', 'Data 1ª Habilitação']
            ];

            // Dados da tabela
            const data = listaMotoristas.map((motorista) => [
                motorista.nome,
                motorista.cpf,
                motorista.telefone,
                motorista.cnh,
                motorista.cnhValidade,
                motorista.cnhCat,
                motorista.cnhDate
            ]);

            autoTable(doc, {
                startY: 40,
                head: headers,
                columnStyles: {
                    2: { cellWidth: 30 },
                    0: { cellWidth: 55 }, // Nome
                },
                body: data,
                styles: { fontSize: 8 },
                headStyles: { fillColor: [255, 102, 0] }, // cor laranja
            });

            doc.save(`Lista_Motoristas_${empresaNome}.pdf`);
        };
    };


    useEffect(() => {
        const db = getDatabase();
        const motoristasRef = ref(db, `empresas/${empresaId}/motoristas`);

        onValue(motoristasRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const lista = Object.entries(data).map(([key, value]) => ({
                    id: key,
                    ...value
                }));
                setListaMotoristas(lista);
            } else {
                setListaMotoristas([]); // Sem motoristas cadastrados
            }
        });
    }, []);


    const excluirMotorista = (motoristaId) => {
        Swal.fire({
            title: 'Tem certeza?',
            text: 'Deseja excluir este motorista?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: colors.orange,
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, excluir',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const motoristaRef = ref(db, `empresas/${empresaId}/motoristas/${motoristaId}`);
                remove(motoristaRef)
                    .then(() => {
                        Swal.fire('Excluído!', 'O motorista foi excluído com sucesso.', 'success');
                    })
                    .catch((error) => {
                        Swal.fire('Erro!', 'Não foi possível excluir o motorista.', 'error');
                        console.error('Erro ao excluir motorista:', error);
                    });
            }
        });
    };

    const editarMotoristaTel = (id, nome) => {
        const motorista = listaMotoristas.find((item) => item.id === id);
        setMotoristaSelecionado(motorista);
        setModalEditMotoristaTel(true);
        setNomeMotorista(nome);
    };

    const editarMotoristaCNH = (id, nome) => {
        const motorista = listaMotoristas.find((item) => item.id === id);
        setMotoristaSelecionado(motorista);
        setNomeMotorista(nome);
        setModalEditMotoristaCnh(true);
    }

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
                        <PiSteeringWheelFill size={'30px'} color={colors.silver} />
                        <TextDefault left={'10px'} color={colors.silver} weight={'bold'} size={'21px'}>Motorista(s) da empresa {empresaNome}</TextDefault>
                    </Box>


                    <DefaultButton onClick={() => closeModalListMotorista()}>
                        <FaWindowClose size={'30px'} color={colors.silver} />
                    </DefaultButton>
                </Box>

                <Box>
                    <Button color={colors.orange} onClick={() => setModalAddMotoristaForm(true)} right={'20px'}>
                        <MdAddBox size={'30px'} color={colors.silver} />
                    </Button>

                    <Button color={colors.orange} onClick={geratePdfList} right={'20px'}>
                        <FaFilePdf size={'30px'} color={colors.silver} />
                    </Button>

                </Box>

                {listaMotoristas.length === 0 ? (
                    <TextDefault top="10px" color={colors.silver}>
                        Nenhum motorista cadastrado.
                    </TextDefault>
                ) : (
                    listaMotoristas.map((motorista) => (
                        <Box
                            key={motorista.id}
                            width="100%"
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
                                onClick={() => toggleExpandirMotorista(motorista.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <Box direction="column">
                                    <TextDefault color={colors.black} weight="bold">
                                        {motorista.nome}
                                    </TextDefault>
                                    <TextDefault color={colors.black} size="12px">
                                        CPF: {motorista.cpf}
                                    </TextDefault>
                                    <TextDefault color={colors.black} size="12px">
                                        TELEFONE: {motorista.telefone}
                                    </TextDefault>
                                </Box>

                                <FaChevronDown
                                    size={18}
                                    color={colors.orange}
                                    style={{
                                        marginRight: '10px',
                                        transform: motoristaExpandido === motorista.id ? 'rotate(180deg)' : 'rotate(0deg)',
                                        transition: 'transform 0.3s ease',
                                    }}
                                />
                            </Box>

                            <AnimatePresence>
                                {motoristaExpandido === motorista.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Box direction="column" topSpace="10px">
                                            <TextDefault color={colors.black} size="12px" weight="bold">
                                                DADOS DA CNH:
                                            </TextDefault>
                                            <TextDefault color={colors.black} size="12px">
                                                Número de registro: {motorista.cnh}
                                            </TextDefault>
                                            <TextDefault color={colors.black} size="12px">
                                                Validade: {motorista.cnhValidade}
                                            </TextDefault>
                                            <TextDefault color={colors.black} size="12px">
                                                Categoria: {motorista.cnhCat}
                                            </TextDefault>
                                            <TextDefault color={colors.black} size="12px">
                                                Data 1ª Habilitação: {motorista.cnhDate}
                                            </TextDefault>
                                            <TextDefault color={colors.black} size="12px">
                                                Observações: {motorista.observacao ? motorista.observacao : 'Nenhuma'}
                                            </TextDefault>

                                            <Box width="30%" topSpace="10px">
                                                <Button color={colors.black} onClick={() => excluirMotorista(motorista.id)}>
                                                    <FaWindowClose size={'20px'} color={colors.silver} />
                                                </Button>

                                                <Button color={colors.orange} onClick={() => editarMotoristaTel(motorista.id, motorista.nome)} left={'10px'}>
                                                    <FaSquarePhone size={'20px'} color={colors.silver} />
                                                </Button>

                                                <Button color={colors.orange} onClick={() => editarMotoristaCNH(motorista.id, motorista.nome)} left={'10px'}>
                                                    <FaIdCard size={'20px'} color={colors.silver} />
                                                </Button>
                                            </Box>
                                        </Box>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Box>
                    ))
                )}

                {modalEditMotoristaTel && (
                    <EditTelMotorista
                        closeModalTelefoneEditMotorista={() => setModalEditMotoristaTel(false)}
                        empresaIdProp={empresaId}
                        motoristaSelecionado={motoristaSelecionado}
                        nomeMotorista={nomeMotorista}
                    />
                )}

                {modalEditMotoristaCnh && (
                    <EditCnhMotorista
                        closeModalCnhEditMotorista={() => setModalEditMotoristaCnh(false)}
                        empresaIdProp={empresaId}
                        motoristaSelecionado={motoristaSelecionado}
                        nomeMotorista={nomeMotorista}
                    />
                )}

                {modalAddMotoristaForm && (
                    <AddMotorista
                        closeModalAddMotorista={() => setModalAddMotoristaForm(false)}
                        empresaIdProp={empresaId}
                    />
                )}

            </ModalAreaInfo>
        </ModalAreaTotalDisplay>
    );
}

export default ListaMotoristas;