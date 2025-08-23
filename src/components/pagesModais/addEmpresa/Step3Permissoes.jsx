import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { togglePermission } from '../../../store/slices/permissionsSlice';
import { nextStep, prevStep } from '../../../store/slices/flowSlice';

import { colors } from '../../../theme';
import { Box, TextDefault } from '../../../stylesAppDefault';
import { Button, Switch } from './styles';
import { TbArrowBadgeLeftFilled, TbArrowBadgeRightFilled } from "react-icons/tb";

const Step3 = () => {
  const dispatch = useDispatch();
  const permissions = useSelector((state) => state.permissions);

  const handlePrev = () => {
    dispatch(prevStep());
  };

  const handleNext = () => {
    // Verifica se pelo menos uma permissão é true
    const hasPermission = Object.values(permissions).some((val) => val === true);
    if (hasPermission) {
      dispatch(nextStep());
    } else {
      alert("Selecione pelo menos uma permissão para continuar.");
    }
  };

  const renderPermission = (label, key) => (
    <Box
      direction={'column'}
      width={'100%'}
      height={'auto'}
      color={colors.darkGrayTwo}
      align={'center'}
      paddingTop={'20px'}
      paddingBottom={'10px'}
    >
      <Box direction="row" justify="space-between" align="center" bottomSpace="10px" width="94.5%">
        <TextDefault size="12px" color={colors.silver} bottom="5px">
          {label}
        </TextDefault>
        <Switch>
          <input
            type="checkbox"
            checked={permissions[key] || false}
            onChange={() => dispatch(togglePermission(key))}
          />
          <span />
        </Switch>
      </Box>
    </Box>
  );

  return (
    <Box direction="column" gap="15px" width="100%" topSpace={'20px'}>
      <Box width="100%" height={'auto'} align={'center'} justify={'space-between'}>
        <Box direction="column" gap="10px">
          <TextDefault size="17px" weight="bold" color={colors.silver}>
            Permissões da Empresa
          </TextDefault>
          <TextDefault size="13px" color={colors.silver}>
            Ajustar conforme o plano contratado
          </TextDefault>
        </Box>
      </Box>

      {renderPermission("Abastecimento", "abastecimento")}
      {renderPermission("CheckList", "checklist")}
      {renderPermission("Fleet IA (Inteligência Artificial aplicada na sua frota)", "fleetIA")}
      {renderPermission("Área de Manutenção", "manutencao")}
      {renderPermission("Contabilidade", "contabilidade")}
      {renderPermission("Multas", "multas")}
      {renderPermission("Logística (motoristas x veículos, localizações)", "localizacao")}
      {renderPermission("Jurídico", "juridico")}
      {renderPermission("Cursos & Treinamentos", "cursos")}

      {/* Rodapé de navegação */}
      <Box
        direction={'row'}
        width={'100%'}
        height={'60px'}
        align={'center'}
        justify={'flex-end'}
        gap={'15px'}
        bottomSpace={'50px'}
      >
        <Button width={'200px'} color={colors.orange} onClick={handlePrev}>
          <TbArrowBadgeLeftFilled size={25} color={colors.silver} />
          <TextDefault size="15px" color={colors.silver} left={'10px'}>Anterior</TextDefault>
        </Button>

        <Button width={'200px'} color={colors.orange} onClick={handleNext}>
          <TextDefault size="15px" color={colors.silver} right={'10px'}>Próximo</TextDefault>
          <TbArrowBadgeRightFilled size={25} color={colors.silver} />
        </Button>
      </Box>
    </Box>
  );
};

export default Step3;
