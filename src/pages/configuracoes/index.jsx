import React, { useState, useEffect } from 'react';
import ModalAddEmpresa from '../../components/pagesModais/addEmpresa';
import ModalListaMotoristas from '../../components/pagesModais/listaMotoristas';
import ModalListaVeiculos from '../../components/pagesModaisVeiculos/ModalListaVeiculos';
import ModalEditEmpresa from '../../components/pagesModais/ModalEditEmpresa';
import ModalCheckList from '../../components/pagesModais/ModalCheckList';
import { db } from '../../firebaseConnection';
import { ref, onValue, remove } from 'firebase/database';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import { GoOrganization } from 'react-icons/go';
import { FaGear } from "react-icons/fa6";
import { FaWindowClose } from 'react-icons/fa';
import { MdEditSquare } from 'react-icons/md';
import { GoHeartFill } from "react-icons/go";
import { BiSolidUserCircle } from 'react-icons/bi';
import { FaTruckFront } from 'react-icons/fa6';
import { PiListBulletsFill } from 'react-icons/pi';
import { FaArrowUpRightDots } from 'react-icons/fa6';
import { FaFileInvoiceDollar } from 'react-icons/fa';
import { MdAdd } from 'react-icons/md';
import { IoIosArrowDown } from 'react-icons/io';
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