import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { colors } from '../../../theme';
import { Box, TextDefault } from '../../../stylesAppDefault';
import InputCnpj from '../../inputs/InputCNPJ';
import InputTel from '../../inputs/InputTelefone';

import { IoClose } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";

import {
    ModalAreaTotalDisplay,
    ModalAreaInfo,
    DefaultButton,
    StepIndicator,
    Dot
} from './styles';


import { useSelector } from 'react-redux';
import Step1Empresa from './Step1Empresa';
import Step2Usuarios from './Step2Usuarios';
import Step3Permissoes from './Step3Permissoes';
import Step4Resumo from './Step4Resumo';

const AddEmpresa = ({ closeModalAddEmpresa }) => {
    const { currentStep } = useSelector(state => state.flow);

    const steps = [
        <Step1Empresa />,
        <Step2Usuarios />,
        <Step3Permissoes />,
        <Step4Resumo closeRegister={closeModalAddEmpresa} />
    ];

    return (
        <ModalAreaTotalDisplay>
            <ModalAreaInfo>
                <Box
                    color={colors.black}
                    width={'100%'}
                    topSpace={'10px'}
                    direction={'column'}
                    align={'center'}
                >
                    <Box
                        width={'95%'}
                        justify={'space-between'} // título à esquerda e input à direita
                        align={'center'}
                        paddingTop={'10px'}
                        paddingLeft={'20px'}
                        paddingRight={'20px'}
                    >
                        <Box  direction={'row'} height={'100%'} align={'center'}>
                             <IoMdAdd size={'20px'} color={colors.silver} />
                            <TextDefault color={colors.silver} weight="bold" size={'20px'} left={'10px'}>
                                Nova Empresa
                            </TextDefault>
                        </Box>

                        <DefaultButton onClick={() => closeModalAddEmpresa()}>
                            <IoClose size={'30px'} color={colors.silver} />
                        </DefaultButton>


                    </Box>

                    {/* Linha separadora */}
                    <Box width={'95%'} height={'1px'} radius={'1px'} color={colors.silver} topSpace={'10px'} bottomSpace={'30px'} />

                    {/* Botão Nova empresa */}
                    <Box direction={'row'} align={'center'} width={'95%'} bottomSpace={'10px'}>
                        {/* Indicador de Steps */}
                        <StepIndicator>
                            {steps.map((_, index) => (
                                <Dot key={index} active={currentStep === index + 1} />
                            ))}
                        </StepIndicator>
                    </Box>
                </Box>

                {/* Conteúdo do Step */}
                <div>
                    {steps[currentStep - 1]}
                </div>
            </ModalAreaInfo>
        </ModalAreaTotalDisplay>
    );
};

export default AddEmpresa;
