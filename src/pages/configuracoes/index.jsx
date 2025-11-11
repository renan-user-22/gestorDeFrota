import React, { useState, useEffect } from 'react';
import { FaGear } from "react-icons/fa6";
import { TextDefault, Box, InfoBox } from '../../stylesAppDefault';
import { colors } from '../../theme';
import {
  Container,
  DefaultButton,
  Input,
  Button,
  ListaEmpresasWrapper,
  SwalCustomStyles,
  Dev
} from './styles';
import Developer from '../../images/dev.png'


const Configuracoes = () => {
  return (
    <Container>

      <Box color={colors.black} width={'95%'} height={'70px'} topSpace={'10px'} direction={'column'} align={'flex-start'} justify={'center'}>

        <Box direction="row" align="center" leftSpace={'15px'}>
          <FaGear size={'27px'} color={colors.silver} />
          <TextDefault left={'10px'} color={colors.silver} weight={'bold'} size={'20px'}>
            Configurações do sistema
          </TextDefault>
        </Box>


      </Box>

      <Dev src={Developer} width={'35%'} />

    </Container>
  );
}

export default Configuracoes;