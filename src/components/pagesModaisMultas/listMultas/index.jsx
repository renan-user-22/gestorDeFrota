import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import CreateMultaForm from '../createMulta';

import { FaWindowClose } from "react-icons/fa";
import { BsCardHeading } from "react-icons/bs";
import { MdAddBox } from "react-icons/md";
import { FaChevronDown } from 'react-icons/fa';
import { FaTruckFront } from "react-icons/fa6";
import { FaFilePdf } from "react-icons/fa6";

import { db } from '../../../firebaseConnection';
import { ref, onValue, remove } from 'firebase/database';

import { Box, TextDefault } from '../../../stylesAppDefault';
import { colors } from '../../../theme';
import LogoImage from '../../../images/logomarca.png'
import {
  ModalAreaTotalDisplay,
  ModalAreaInfo,
  DefaultButton,
  Button,
  ListaScrollContainer
} from './styles';

const ListMultasPage = ({ closeModalAddVeiculos, empresaIdProp, veiculoId, veiculoModelo }) => {

  const [listaMultas, setListaMultas] = useState([]);
  const [veiculoExpandido, setVeiculoExpandido] = useState(null);
  const [modalCreateMultaForm, setModalCreateMultaForm] = useState(false);


  const addMultasForm = () => {
    setModalCreateMultaForm(true);
  };

  const toggleExpandirVeiculo = (id) => {
    setVeiculoExpandido((prev) => (prev === id ? null : id));
  };

  const gerarPdfVeiculos = () => {
    alert("funciona!");
  }

  return (
    <ModalAreaTotalDisplay>
      <ModalAreaInfo>
        <Box width={'100%'} height={'65px'} radius={'10px'} direction={'row'} topSpace={'10px'} bottomSpace={'10px'} align={'center'} justify={'space-between'}>
          <Box>

            <FaTruckFront size={'30px'} color={colors.silver} />
            <TextDefault left={'10px'} color={colors.silver} weight={'bold'} size={'21px'}>
              Multa(s) do Veículo {veiculoModelo}
            </TextDefault>
          </Box>
          <DefaultButton onClick={closeModalAddVeiculos}>
            <FaWindowClose size={'30px'} color={colors.silver} />
          </DefaultButton>
        </Box>

        <Box>
          <Button color={colors.orange} onClick={() => addMultasForm()} right={'20px'}>
            <MdAddBox size={'30px'} color={colors.silver} />
          </Button>

          <Button color={colors.orange} onClick={gerarPdfVeiculos} right={'20px'}>
            <FaFilePdf size={'30px'} color={colors.silver} />
          </Button>
        </Box>

        <ListaScrollContainer>
          {listaMultas.length === 0 ? (
            <TextDefault top="10px" color={colors.silver}>
              Nenhuma multa cadastrada neste veículo.
            </TextDefault>
          ) : (
            listaMultas.map((veiculo) => (
              <Box
                key={veiculo.id}
                width="98%"
                radius="10px"
                color={colors.silver}
                paddingLeft="10px"
                paddingTop="10px"
                paddingBottom="10px"
                topSpace="10px"
                direction="column"
                style={{ border: `1px solid ${colors.silver}` }}
              >
                <Box
                  width="100%"
                  justify="space-between"
                  align="center"
                  onClick={() => toggleExpandirVeiculo(veiculo.id)}
                  style={{ cursor: 'pointer' }}
                >


                </Box>

                <AnimatePresence>

                </AnimatePresence>
              </Box>
            ))
          )}

        </ListaScrollContainer>


        {modalCreateMultaForm && (
          <CreateMultaForm
            closeModalAddVeiculos={() => setModalCreateMultaForm(false)}
            empresaIdProp={empresaIdProp}
          />
        )}


      </ModalAreaInfo>
    </ModalAreaTotalDisplay>
  );
};

export default ListMultasPage;
