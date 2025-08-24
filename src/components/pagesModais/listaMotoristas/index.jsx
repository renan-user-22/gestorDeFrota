import React, { useState, useEffect } from 'react';

//Bibliotecas:
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

//ícones
import { MdAdd } from 'react-icons/md';
import { BsFillFileEarmarkExcelFill } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { SlOptionsVertical } from "react-icons/sl";
import { BiSolidUserCircle } from 'react-icons/bi';
import { MdEditSquare } from "react-icons/md";
import { FaFilePdf } from "react-icons/fa6";
import { GrUpdate } from "react-icons/gr";


//Importação de Modais Adjacentes: 
import AddMotorista from '../addMotorista';
import EditUser from '../editUser';
import EditCnhMotorista from '../editCnhValidadeMotorista';
import EditTelMotorista from '../editTelMotorista';
import EditSenhaMotorista from '../EditSenhaMotorista';


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
    CargoModalOverlay,
    CargoModalContent,
    RemoveButton,
    CargoItem
} from './styles';

const ListaMotoristas = ({ closeModalListMotorista, empresaId, empresaNome }) => {

    const [listaMotoristas, setListaMotoristas] = useState([]);
    const [motoristaExpandido, setMotoristaExpandido] = useState(null);
    const [modalDetalhes, setModalDetalhes] = useState(false);

    const [modalAddMotoristaForm, setModalAddMotoristaForm] = useState(false);
    const [modalEditMotoristaTel, setModalEditMotoristaTel] = useState(false);
    const [modalEditMotoristaCnh, setModalEditMotoristaCnh] = useState(false);
    const [modalEditMotoristaSenha, setModalEditMotoristaSenha] = useState(false);
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
        const motoristasRef = ref(db, `empresas/${empresaId}/usuarios`);

        onValue(motoristasRef, (snapshot) => {
            const data = snapshot.val();
            if (Array.isArray(data)) {
                setListaMotoristas(data.filter(u => u && u.nome)); // evita nulos
            } else {
                setListaMotoristas([]);
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

    const editarMotoristaSenha = (id, nome) => {
        const motorista = listaMotoristas.find((item) => item.id === id);
        setMotoristaSelecionado(motorista);
        setNomeMotorista(nome);
        setModalEditMotoristaSenha(true);
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
                            <BiSolidUserCircle size={'27px'} color={colors.silver} />
                            <TextDefault left={'10px'} color={colors.silver} weight={'bold'} size={'17px'}>
                                Usuários da empresa {empresaNome}
                            </TextDefault>
                        </Box>

                        <Button onClick={() => closeModalListMotorista()} color={'transparent'}>
                            <IoClose size={'30px'} color={colors.silver} />
                        </Button>
                    </Box>

                    <Box width={'95%'} height={'1px'} radius={'1px'} color={colors.silver} topSpace={'20px'} />

                    <Box direction={'row'} align={'center'} width={'95%'}>
                        <DefaultButton width="150px" onClick={() => setModalAddMotoristaForm(true)}>
                            <MdAdd size={'20px'} color={colors.silver} />
                            <TextDefault color={colors.silver} size={'14px'} left={'5px'}>
                                Novo Usuário
                            </TextDefault>
                        </DefaultButton>

                        <DefaultButton color={colors.orange} onClick={()=> mensageeeee()} right={'20px'}>
                            <FaFilePdf size={'20px'} color={colors.silver} />
                            <TextDefault color={colors.silver} size={'14px'} left={'5px'}>
                                Gerar Pdf
                            </TextDefault>
                        </DefaultButton>

                        <DefaultButton color={colors.orange} onClick={()=>mensageeeee()} right={'20px'}>
                            <BsFillFileEarmarkExcelFill size={'20px'} color={colors.silver} />
                            <TextDefault color={colors.silver} size={'14px'} left={'5px'}>
                                Gerar Excel
                            </TextDefault>
                        </DefaultButton>

                        <DefaultButton color={colors.orange} onClick={()=>mensageeeee()} right={'20px'}>
                            <GrUpdate size={'20px'} color={colors.silver} />
                            <TextDefault color={colors.silver} size={'14px'} left={'5px'}>
                                Atualizar Lista
                            </TextDefault>
                        </DefaultButton>
                    </Box>
                </Box>


                {listaMotoristas.length === 0 ? (
                    <TextDefault top="10px" color={colors.silver}>
                        Nenhum Usuário cadastrado.
                    </TextDefault>
                ) : (
                    <Box
                        direction="column"
                        width="100%"
                        topSpace="20px"
                        color={colors.black}
                        style={{ overflowX: 'auto' }}
                    >
                        <table
                            style={{
                                width: 'max-content',
                                minWidth: '100%',
                                borderCollapse: 'collapse',
                                color: colors.silver,
                                fontSize: '12px', // Fonte menor
                            }}
                        >
                            <thead>
                                <tr>
                                    {['Matrícula', 'Senha', 'Nome', 'Sobrenome', 'CPF', 'Telefone', 'Cargo', 'Status', 'Ações'].map((header) => (
                                        <th key={header} style={{ padding: '6px', textAlign: 'left', backgroundColor: colors.orange }}>
                                            <TextDefault size="12px" color={colors.silver}>{header}</TextDefault>
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {listaMotoristas.map((u) => (
                                    <tr key={u.matricula} style={{ borderBottom: `1px solid ${colors.darkGrayTwo}` }}>
                                        <td><TextDefault size="12px">{u.matricula}</TextDefault></td>
                                        <td><TextDefault size="12px">{u.senha}</TextDefault></td>
                                        <td><TextDefault size="12px">{u.nome}</TextDefault></td>
                                        <td><TextDefault size="12px">{u.sobrenome}</TextDefault></td>
                                        <td><TextDefault size="12px">{u.cpf}</TextDefault></td>
                                        <td><TextDefault size="12px">{u.contato}</TextDefault></td>
                                        <td><TextDefault size="12px">{u.cargoNome}</TextDefault></td>
                                        <td><TextDefault size="12px">{u.status}</TextDefault></td>
                                        <td style={{ display: "flex", gap: "8px", justifyContent: "flex-start" }}>
                                            {/* Botão 3 pontinhos para abrir modal de detalhes */}
                                            <Button
                                                width="25px"
                                                height="25px"
                                                top={'10px'}
                                                bottom={'10px'}
                                                color={colors.orange}
                                                onClick={() => {
                                                    setMotoristaSelecionado(u);
                                                    setModalDetalhes(true);
                                                }}
                                            >
                                                <SlOptionsVertical size={'17px'} color={colors.silver} />
                                            </Button>

                                            {/* Botão editar */}
                                            <Button
                                                width={'auto'}
                                                height={'auto'}
                                                top={'10px'}
                                                bottom={'10px'}
                                                color={colors.orange}
                                                onClick={() => editarMotoristaSenha(u.matricula, u.nome)}
                                            >
                                                <MdEditSquare size={'17px'} color={colors.silver} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </Box>
                )}

                {modalDetalhes && motoristaSelecionado && (
                    <CargoModalOverlay>
                        <CargoModalContent>

                            <Box
                                width={'100%'}
                                height={'65px'}
                                direction={'row'}
                                color={colors.black}
                                bottomSpace={'20px'}
                                align={'center'}
                                justify={'space-between'}
                            >

                                <TextDefault size="17px" left={'15px'} color={colors.silver}>
                                    Detalhes do Usuário {motoristaSelecionado.nome}
                                </TextDefault>

                                <RemoveButton onClick={() => setModalDetalhes(false)}>
                                    <IoClose size={'30px'} color={colors.silver} />
                                </RemoveButton>

                            </Box>

                            <Box direction="column" topSpace="20px" gap="10px">
                                <CargoItem>
                                    <TextDefault size="15px" color={colors.silver}>
                                        <b>E-mail:</b> {motoristaSelecionado.email}
                                    </TextDefault>
                                </CargoItem>

                                <CargoItem>
                                    <TextDefault size="15px" color={colors.silver}>
                                        <b>Tipo de Acesso:</b> {motoristaSelecionado.tipoAcesso}
                                    </TextDefault>
                                </CargoItem>

                                <CargoItem>
                                    <TextDefault size="15px" color={colors.silver}>
                                        <b>Carga horário:</b> {motoristaSelecionado.horarioEntrada} ás {motoristaSelecionado.horarioSaida}
                                    </TextDefault>
                                </CargoItem>

                                <CargoItem>
                                    <TextDefault size="15px" color={colors.silver}>
                                        <b>CNH Categoria:</b> {motoristaSelecionado.cnhCategoria || "Não registrado"}
                                    </TextDefault>
                                </CargoItem>

                                <CargoItem>
                                    <TextDefault size="15px" color={colors.silver}>
                                        <b>CNH Número:</b> {motoristaSelecionado.cnhNumero || "Não registrado"}
                                    </TextDefault>
                                </CargoItem>

                                <CargoItem>
                                    <TextDefault size="15px" color={colors.silver}>
                                        <b>CNH Validade:</b> {motoristaSelecionado.cnhValidade || "Não registrado"}
                                    </TextDefault>
                                </CargoItem>

                                <CargoItem>
                                    <TextDefault size="15px" color={colors.silver}>
                                        <b>1ª Habilitação:</b> {motoristaSelecionado.cnhPrimeiraHab || "Não registrado"}
                                    </TextDefault>
                                </CargoItem>

                                <CargoItem>
                                    <TextDefault size="15px" color={colors.silver}>
                                        <b>Obs CNH:</b> {motoristaSelecionado.cnhObs || "Não registrado"}
                                    </TextDefault>
                                </CargoItem>

                                <CargoItem>
                                    <TextDefault size="15px" color={colors.silver}>
                                        <b>Observações do usuário:</b> {motoristaSelecionado.obs || "Não registrado"}
                                    </TextDefault>
                                </CargoItem>

                            </Box>
                        </CargoModalContent>
                    </CargoModalOverlay>
                )}

                {modalAddMotoristaForm && (
                    <AddMotorista
                        closeModalAddMotorista={() => setModalAddMotoristaForm(false)}
                        empresaIdProp={empresaId}
                    />
                )}

                {modalEditMotoristaSenha && (
                    <EditUser
                        closeModalAddMotorista={() => setModalEditMotoristaSenha(false)}
                        empresaIdProp={empresaId}
                        usuarioIndex={motoristaSelecionado}   // índice do usuário
                        usuarioData={nomeMotorista}           // objeto com os dados do usuário
                    />
                )}

            </ModalAreaInfo>
        </ModalAreaTotalDisplay>
    );
}

export default ListaMotoristas;