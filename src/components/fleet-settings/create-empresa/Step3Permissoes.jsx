import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { togglePermission } from '../../../store/slices/permissionsSlice';
import { nextStep, prevStep } from '../../../store/slices/flowSlice';

import { colors } from '../../../theme';
import { Box, TextDefault } from '../../../stylesAppDefault';
import { Button, Switch } from './styles';
import { TbArrowBadgeLeftFilled, TbArrowBadgeRightFilled } from "react-icons/tb";

const PERMISSIONS_META = [
  { key: 'abastecimento', label: 'Abastecimento' },
  { key: 'financeiro',   label: 'Financeiro' }, 
  { key: 'checklist', label: 'CheckList' },
  { key: 'fleetIA', label: 'Fleet IA (Inteligência Artificial aplicada na sua frota)' },
  { key: 'manutencao', label: 'Área de Manutenção' },
  { key: 'contabilidade', label: 'Contabilidade' },
  { key: 'multas', label: 'Multas' },
  { key: 'protect', label: 'Protect (assinatura de multas)' }, // NOVA OPÇÃO
  { key: 'localizacao', label: 'Logística (motoristas x veículos, localizações)' },
  { key: 'juridico', label: 'Jurídico' },
  { key: 'cursos', label: 'Cursos & Treinamentos' },
];

const Step3 = () => {
  const dispatch = useDispatch();
  const permissions = useSelector((state) => state.permissions);

  const handlePrev = () => dispatch(prevStep());

  const handleNext = () => {
    const hasPermission = Object.values(permissions).some((val) => val === true);
    if (hasPermission) {
      dispatch(nextStep());
    } else {
      alert("Selecione pelo menos uma permissão para continuar.");
    }
  };

  const renderPermission = (label, key) => (
    <Box
      key={key}
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

  // TRUE no topo em ordem alfabética pelo label (depois os FALSE, também ordenados)
  const sortedItems = [...PERMISSIONS_META]
    .map(item => ({ ...item, value: Boolean(permissions[item.key]) }))
    .sort((a, b) => {
      // true primeiro
      if (a.value !== b.value) return a.value ? -1 : 1;
      // ordem alfabética por label
      return a.label.localeCompare(b.label, 'pt-BR', { sensitivity: 'base' });
    });

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

      {sortedItems.map(({ label, key }) => renderPermission(label, key))}

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
