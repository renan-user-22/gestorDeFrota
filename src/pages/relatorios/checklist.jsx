import React from 'react';
import { colors } from '../../theme';
import { TextDefault, Box } from '../../stylesAppDefault';
import Developer from '../../images/dev.png';
import { Dev } from './styles';

const CheckList = () => {
  return(
    <Box flex={'1'} justify={'center'} align={'center'} direction={'column'}>
        <Dev src={Developer} width={'35%'}/>

        <TextDefault size={'20px'} top={'20px'} color={colors.silver}>O Checklist exclusivo para a sua empresa</TextDefault>
        <TextDefault size={'15px'} top={'10px'} color={colors.silver}>O gasto da prevenção é muito menor que o gasto de correção</TextDefault>
    </Box>
  );
}

export default CheckList;