import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { db } from '../../../firebaseConnection';
import { ref, update, get, set } from 'firebase/database';

// Inputs e ícones
import { FaWindowClose } from "react-icons/fa";
import { PiListBulletsFill } from "react-icons/pi";
import { LuSave } from "react-icons/lu";

//Componentes:
import checklistPorTipo from './checklistData';

//inputs Mascaras: 
//import InputTelefone from '../../inputs/InputTelefone';

// Estilos
import { Box, TextDefault } from '../../../stylesAppDefault';
import { colors } from '../../../theme';
import {
    ModalAreaTotalDisplay,
    ModalAreaInfo,
    ModalContentScroll,
    CheckboxStyled,
    Button,
    DefaultButton,
    Input
} from './styles';

const slugify = (str, tipo) =>
    `${tipo}-${str}`
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, '-')
        .replace(/--+/g, '-')
        .replace(/^-|-$/g, '');



const AreaModalCheckListEmpresa = ({ closeModalChecklist, empresaNome, empresaId }) => {

    const [tiposVeiculos, setTiposVeiculos] = useState([]);
    const [itensChecklist, setItensChecklist] = useState([]);

    const handleToggleChecklist = (tipo, itemIndex) => {
        setItensChecklist(prev => {
            return prev.map(entry =>
                entry.tipo === tipo && checklistAgrupado[tipo].indexOf(entry) === itemIndex
                    ? { ...entry, checked: !entry.checked }
                    : entry
            );
        });
    };

    const checklistAgrupado = itensChecklist.reduce((acc, curr) => {
        if (!acc[curr.tipo]) acc[curr.tipo] = [];
        acc[curr.tipo].push(curr);
        return acc;
    }, {});

    const handleSalvarChecklist = async () => {
        const payload = {};

        itensChecklist
            .filter(entry => entry.checked) // <-- salva apenas os flegados
            .forEach(entry => {
                const itemId = slugify(entry.item, entry.tipo);
                payload[itemId] = {
                    tipo: entry.tipo,
                    item: entry.item,
                    checked: true
                };
            });

        await set(ref(db, `empresas/${empresaId}/checklist`), payload);
        closeModalChecklist()
        Swal.fire({
            icon: 'success',
            title: 'Checklist salvo!',
            timer: 1500,
            showConfirmButton: false
        });
    };

    useEffect(() => {
        const fetchChecklist = async () => {
            try {
                const snap = await get(ref(db, `empresas/${empresaId}`));
                if (!snap.exists()) return;

                const dados = snap.val();
                const veiculos = dados.veiculos || {};
                const checklistSalvo = dados.checklist || {};

                const tiposNaEmpresa = [...new Set(Object.values(veiculos).map(v => v.tipo))];

                const novaLista = [];

                Object.entries(checklistPorTipo).forEach(([tipo, itens]) => {
                    itens.forEach(item => {
                        const itemId = slugify(item, tipo);

                        const itemSalvo = checklistSalvo[itemId];

                        novaLista.push({
                            tipo,
                            item,
                            checked: itemSalvo
                                ? itemSalvo.checked
                                : Object.keys(checklistSalvo).length === 0 && tiposNaEmpresa.includes(tipo)

                        });
                    });
                });

                setItensChecklist(novaLista);
            } catch (error) {
                console.error("Erro ao carregar checklist:", error);
            }
        };

        fetchChecklist();
    }, [empresaId]);


    return (
        <ModalAreaTotalDisplay>
            <ModalAreaInfo>
                <ModalContentScroll>

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
                            <PiListBulletsFill size={'30px'} color={colors.silver} />
                            <TextDefault left={'10px'} color={colors.silver} weight={'bold'} size={'21px'}>
                                Checklist da empresa: {empresaNome}
                            </TextDefault>
                        </Box>

                        <DefaultButton onClick={closeModalChecklist}>
                            <FaWindowClose size={'30px'} color={colors.silver} />
                        </DefaultButton>
                    </Box>

                    <Box direction={'row'} width={'100%'} justify={'flex-start'}>
                        <Button onClick={() => handleSalvarChecklist()}>
                            <LuSave color={colors.silver} size={'20px'} />
                            <TextDefault color={colors.silver} left={'10px'}>
                                Salvar Checklist
                            </TextDefault>
                        </Button>
                    </Box>



                    {Object.entries(checklistAgrupado).map(([tipo, itens]) => (
                        <Box key={tipo} direction="column" topSpace="20px" bottomSpace="10px">
                            <TextDefault size="20px" weight="bold" color={colors.silver} bottom="10px">
                                {tipo}:
                            </TextDefault>

                            {itens.map((entry, index) => (
                                <Box key={index} direction="row" align="center" bottomSpace="20px">
                                    <CheckboxStyled
                                        checked={entry.checked}
                                        onChange={() => handleToggleChecklist(entry.tipo, index)}
                                    />

                                    <TextDefault size="14px" color={colors.silver} left="10px">
                                        {entry.item}
                                    </TextDefault>
                                </Box>
                            ))}
                        </Box>
                    ))}

                </ModalContentScroll>
            </ModalAreaInfo>
        </ModalAreaTotalDisplay>
    );
};

export default AreaModalCheckListEmpresa;
