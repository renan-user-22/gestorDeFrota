import React from 'react';
import { colors } from '../../theme';
import { TextDefault, Box } from '../../stylesAppDefault';
import Developer from '../../images/dev.png';
import { Dev } from './styles';

const Abastecimento = () => {
  return(
    <Box flex={'1'} justify={'center'} align={'center'} direction={'column'}>
        <Dev src={Developer} width={'35%'}/>

        <TextDefault size={'20px'} top={'20px'} color={colors.silver}>Informações personalizaveis para a sua frota</TextDefault>
    </Box>
  );
}

export default Abastecimento;