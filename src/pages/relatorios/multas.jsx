import React from 'react';
import { colors } from '../../theme';
import { TextDefault, Box } from '../../stylesAppDefault';
import Developer from '../../images/dev.png';
import { Dev } from './styles';

const Multas = () => {
  return(
    <Box flex={'1'} justify={'center'} align={'center'} direction={'column'}>
        <Dev src={Developer} width={'35%'}/>

        <TextDefault size={'20px'} top={'20px'} color={colors.silver}>Processos, Defesas, Recursos e etc...</TextDefault>
        <TextDefault size={'15px'} top={'10px'} color={colors.silver}>Acompanhamos diariamente a placa dos veículos da sua Frota. Tecnologia + Profissionalismo = Econômia</TextDefault>
    </Box>
  );
}

export default Multas;