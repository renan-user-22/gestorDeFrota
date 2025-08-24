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
import Developer from '../../../images/dev.png'
import {
    Select,
    Input,
    Dev,
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

const AddMotorista = ({ closeModalAddMotorista, empresaIdProp, usuarioIndex, usuarioData }) => {

    const [cargos, setCargos] = useState([]);

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
        cnhObs: ''
    });

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleHoraChange = (field, value) => {
        let v = value.replace(/\D/g, '');
        if (v.length >= 3) v = v.slice(0, 2) + ':' + v.slice(2, 4);
        if (v.length > 5) v = v.slice(0, 5);
        handleChange(field, v);
    };

    const isMotorista = form.tipoAcesso === 'motorista';

    // 🔹 Salvar no Firebase
    const atualizarUsuario = async () => {
        if (!form.nome || !form.sobrenome || !form.cpf || !form.senha || !form.cargoNome || !form.contato || !form.status) {
            Swal.fire('Atenção', 'Preencha todos os campos obrigatórios.', 'warning');
            return;
        }

        try {
            await set(ref(db, `empresas/${empresaIdProp}/usuarios/${usuarioIndex}`), form);

            Swal.fire("Sucesso", "Usuário atualizado com sucesso!", "success");
            closeModalAddMotorista();
        } catch (err) {
            console.error("Erro ao atualizar usuário:", err);
            Swal.fire("Erro", "Não foi possível atualizar o usuário.", "error");
        }
    };


    useEffect(() => {
        if (usuarioData) {
            setForm({
                nome: usuarioData.nome || '',
                sobrenome: usuarioData.sobrenome || '',
                cpf: usuarioData.cpf || '',
                senha: usuarioData.senha || '',
                cargoNome: usuarioData.cargoNome || '',
                contato: usuarioData.contato || '',
                tipoAcesso: usuarioData.tipoAcesso || 'gestao',
                status: usuarioData.status || '',
                email: usuarioData.email || '',
                obs: usuarioData.obs || '',
                horarioEntrada: usuarioData.horarioEntrada || '',
                horarioSaida: usuarioData.horarioSaida || '',
                cnhNumero: usuarioData.cnhNumero || '',
                cnhValidade: usuarioData.cnhValidade || '',
                cnhCategoria: usuarioData.cnhCategoria || '',
                cnhPrimeiraHab: usuarioData.cnhPrimeiraHab || '',
                cnhObs: usuarioData.cnhObs || ''
            });
        }
    }, [usuarioData]);



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
                        <TextDefault left={'10px'} color={colors.silver} weight={'bold'} size={'20px'}>Editar informações do usuário </TextDefault>
                    </Box>

                    <DefaultButton onClick={closeModalAddMotorista}>
                        <IoClose size={'30px'} color={colors.silver} />
                    </DefaultButton>
                </Box>


               <Dev src={Developer} width={'40%'} />


            </ModalAreaInfo>
        </ModalAreaTotalDisplay>
    );
}

export default AddMotorista;