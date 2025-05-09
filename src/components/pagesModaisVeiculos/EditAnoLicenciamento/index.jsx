import React, { useState, useEffect } from 'react';

// Bibliotecas:
import Swal from 'sweetalert2';

// Banco de dados conexões:
import { db } from '../../../firebaseConnection';
import { ref, update } from 'firebase/database';

// Ícones:
import { FaWindowClose, FaIdCard } from "react-icons/fa";
import { LuSave } from "react-icons/lu";
import { TbCancel } from "react-icons/tb";

// Estilos:
import { Box, TextDefault } from '../../../stylesAppDefault';
import { colors } from '../../../theme';
import {
    ModalAreaTotalDisplay,
    ModalAreaInfo,
    Button,
    Input,
    DefaultButton
} from './styles';

const EditAnoLicenciamento = ({ veiculoModelo, closeModalEditLicenciamento, empresaIdProp, veiculoSelecionado }) => {

    const [licenciamento, setAnoLicenciamento] = useState('');

    const updateMotoristaAnoLicenciamento = () => {
        if (!veiculoSelecionado) return;

        if (!licenciamento) {
            Swal.fire({
                icon: 'warning',
                title: 'Campo obrigatório',
                text: 'Por favor, preencha o ano do licenciamento.',
            });
            return;
        }

        if (licenciamento.length !== 4 || isNaN(licenciamento)) {
            Swal.fire({
                icon: 'warning',
                title: 'Ano inválido',
                text: 'O ano do licenciamento deve conter 4 dígitos.',
            });
            return;
        }

        const pathRef = ref(db, `empresas/${empresaIdProp}/veiculos/${veiculoSelecionado.id}`);

        update(pathRef, { licenciamento })
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Atualização bem-sucedida!',
                    text: 'O ano do licenciamento foi atualizado com sucesso.',
                });
                closeModalEditLicenciamento();
                setAnoLicenciamento('');
            })
            .catch((error) => {
                console.error('Erro ao atualizar o ano do licenciamento:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erro ao atualizar!',
                    text: 'Ocorreu um erro ao atualizar o ano do licenciamento. Tente novamente mais tarde.',
                });
            });
    };

    useEffect(() => {
        if (veiculoSelecionado?.anoLicenciamento) {
            setAnoLicenciamento(veiculoSelecionado.anoLicenciamento);
        }
    }, [veiculoSelecionado]);

    return (
        <ModalAreaTotalDisplay>
            <ModalAreaInfo>

                <Box
                    width="100%"
                    height="65px"
                    radius="10px"
                    direction="row"
                    topSpace="10px"
                    bottomSpace="10px"
                    align="center"
                    justify="space-between"
                >
                    <Box>
                        <FaIdCard size="30px" color={colors.silver} />
                        <TextDefault left="10px" color={colors.silver} weight="bold" size="21px">
                            Ano do Licenciamento do sr(a). {veiculoModelo}
                        </TextDefault>
                    </Box>

                    <DefaultButton onClick={closeModalEditLicenciamento}>
                        <FaWindowClose size="30px" color={colors.silver} />
                    </DefaultButton>
                </Box>

                <Box flex="1" direction="column" width="40%" topSpace="50px" bottomSpace="50px">
                    <TextDefault size="12px" color={colors.silver} bottom="5px">
                        Ano:
                    </TextDefault>
                    <Input
                        value={licenciamento}
                        onChange={(e) => setAnoLicenciamento(e.target.value)}
                        placeholder="Ex: 2025"
                    />
                </Box>

                <Box direction="row" justify="flex-start" align="center" width="100%" topSpace="0px">
                    <Button onClick={closeModalEditLicenciamento} right="10px" color={colors.black}>
                        <TbCancel color={colors.silver} size="20px" />
                        <TextDefault color={colors.silver} left="10px">
                            Cancelar
                        </TextDefault>
                    </Button>

                    <Button onClick={updateMotoristaAnoLicenciamento} left="10px">
                        <LuSave color={colors.silver} size="20px" />
                        <TextDefault color={colors.silver} left="10px">
                            Atualizar ano
                        </TextDefault>
                    </Button>
                </Box>

            </ModalAreaInfo>
        </ModalAreaTotalDisplay>
    );
};

export default EditAnoLicenciamento;
