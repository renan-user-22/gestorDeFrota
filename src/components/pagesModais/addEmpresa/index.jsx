// src/pages/empresas/addEmpresa/index.jsx
import React from 'react';
import { colors } from '../../../theme';
import { Box, TextDefault } from '../../../stylesAppDefault';

import { IoClose } from 'react-icons/io5';
import { IoMdAdd } from 'react-icons/io';

import {
  ModalAreaTotalDisplay,
  ModalAreaInfo,
  DefaultButton,
  StepIndicator,
  Dot,
} from './styles';

import { useSelector } from 'react-redux';
import Step1Empresa from './Step1Empresa';
// REMOVIDO: import Step2Usuarios from './Step2Usuarios';
import Step3Permissoes from './Step3Permissoes';
import Step4Resumo from './Step4Resumo';

const AddEmpresa = ({ closeModalAddEmpresa }) => {
  const { currentStep } = useSelector((state) => state.flow);

  // Agora só 3 passos: Empresa -> Permissões -> Resumo
  const steps = [
    <Step1Empresa />,
    <Step3Permissoes />,
    <Step4Resumo closeRegister={closeModalAddEmpresa} />,
  ];

  // Rede de segurança para manter o índice válido
  const total = steps.length;
  const safeStep = Math.min(Math.max(currentStep || 1, 1), total);

  return (
    <ModalAreaTotalDisplay>
      <ModalAreaInfo>
        <Box
          color={colors.black}
          width="100%"
          topSpace="10px"
          direction="column"
          align="center"
        >
          <Box
            width="95%"
            justify="space-between"
            align="center"
            paddingTop="10px"
            paddingLeft="20px"
            paddingRight="20px"
          >
            <Box direction="row" height="100%" align="center">
              <IoMdAdd size="20px" color={colors.silver} />
              <TextDefault color={colors.silver} weight="bold" size="20px" left="10px">
                Nova Empresa
              </TextDefault>
            </Box>

            <DefaultButton onClick={closeModalAddEmpresa}>
              <IoClose size="30px" color={colors.silver} />
            </DefaultButton>
          </Box>

          {/* Linha separadora */}
          <Box
            width="95%"
            height="1px"
            radius="1px"
            color={colors.silver}
            topSpace="10px"
            bottomSpace="30px"
          />

          {/* Indicador de Steps */}
          <Box direction="row" align="center" width="95%" bottomSpace="10px">
            <StepIndicator>
              {steps.map((_, index) => (
                <Dot key={index} $active={safeStep === index + 1} />
              ))}
            </StepIndicator>
          </Box>
        </Box>

        {/* Conteúdo do Step */}
        <div>{steps[safeStep - 1]}</div>
      </ModalAreaInfo>
    </ModalAreaTotalDisplay>
  );
};

export default AddEmpresa;
