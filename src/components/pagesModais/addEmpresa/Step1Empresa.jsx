import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { colors } from '../../../theme';
import { IoMdAdd } from "react-icons/io";
import { TbArrowBadgeRightFilled } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import { TiThList } from "react-icons/ti";
import { Box, TextDefault } from '../../../stylesAppDefault';
import {
  Button,
  Input,
  Select,
  CargoModalOverlay,
  CargoModalContent,
  CargoList,
  CargoItem,
  RemoveButton,
  SwalCustomStyles,
  ListaEmpresasWrapper,
  Switch
} from './styles';

import InputCnpj from '../../inputs/InputCNPJ';
import InputTel from '../../inputs/InputTelefone';

import { nextStep } from '../../../store/slices/flowSlice';
import {
  setNomeEmpresa,
  setCnpj,
  setTelefone,
  setEnderecoField,
  addCargo,
  setTipo,
  setExtrasField,
  addBase,
  removeBase,
  removeCargo
} from '../../../store/slices/companySlice';


const Step1Empresa = () => {
  const dispatch = useDispatch();
  const company = useSelector(state => state.company);

  // Estados locais para novos cargos
  const [cargoNome, setCargoNome] = useState('');
  const [cargoAcesso, setCargoAcesso] = useState('acesso');

  // Campos adicionais
  const [statusEmpresa, setStatusEmpresa] = useState('');

  const [temBases, setTemBases] = useState(false);
  const [baseNome, setBaseNome] = useState('');
  const [showBaseModal, setShowBaseModal] = useState(false);

  // Status Modal lista de Cargos
  const [showCargoModal, setShowCargoModal] = useState(false);

  useEffect(() => {
    if (!company.bases.includes("Matriz")) {
      dispatch(addBase("Matriz"));
    }
    // depende só do dispatch para rodar uma vez
  }, [dispatch]);


  const handleAddBase = () => {
    if (!baseNome.trim()) return;
    dispatch(addBase(baseNome.trim()));
    setBaseNome('');
  };

  const handleAddCargo = () => {
    if (!cargoNome.trim()) {

      Swal.fire({
        title: `Atenção, Digite o nome do cargo! `,
        icon: 'warning',

        // Classes customizadas para título, texto e popup
        customClass: {
          popup: 'swal-custom-popup',
          title: 'swal-custom-title',
          htmlContainer: 'swal-custom-text',
          confirmButton: 'swal-custom-confirm',
          cancelButton: 'swal-custom-cancel',
        }
      });

      return;
    }
    dispatch(addCargo({ nome: cargoNome.trim(), acesso: cargoAcesso }));
    setCargoNome('');
    setCargoAcesso('acesso');
  };

  const handleNext = () => {
    // Validação
    if (!company.nomeEmpresa || !company.cnpj || !company.endereco.logradouro || !company.endereco.numero || !company.endereco.bairro) {
      Swal.fire({
        title: `Atenção,Preencha todos os campos obrigatórios.`,
        icon: 'warning',

        // Classes customizadas para título, texto e popup
        customClass: {
          popup: 'swal-custom-popup',
          title: 'swal-custom-title',
          htmlContainer: 'swal-custom-text',
          confirmButton: 'swal-custom-confirm',
          cancelButton: 'swal-custom-cancel',
        }
      });
      return;
    }

    if (company.cargos.length === 0) {
      Swal.fire({
        title: `Atenção, adicione ao menos um cargo.`,
        icon: 'warning',

        // Classes customizadas para título, texto e popup
        customClass: {
          popup: 'swal-custom-popup',
          title: 'swal-custom-title',
          htmlContainer: 'swal-custom-text',
          confirmButton: 'swal-custom-confirm',
          cancelButton: 'swal-custom-cancel',
        }
      });
      return;
    }

    if (!statusEmpresa) {
      Swal.fire({
        title: `Atenção,Informe o status da empresa.`,
        icon: 'warning',

        // Classes customizadas para título, texto e popup
        customClass: {
          popup: 'swal-custom-popup',
          title: 'swal-custom-title',
          htmlContainer: 'swal-custom-text',
          confirmButton: 'swal-custom-confirm',
          cancelButton: 'swal-custom-cancel',
        }
      });
      return;
    }


    dispatch(setExtrasField({ field: 'status', value: statusEmpresa })); // ajuste: era setExtraField

    // Avançar para próximo step
    dispatch(nextStep());
  };

  return (
    <Box direction="column" gap="15px" width="100%" topSpace={'20px'} >

      <SwalCustomStyles />

      <TextDefault size="17px" weight="bold" color={colors.silver}>
        Informações da Empresa
      </TextDefault>

      <Box
        direction={'column'}
        width={'100%'}
        height={'auto'}
        color={colors.darkGrayTwo}
        align={'center'}
        paddingTop={'20px'}
        paddingBottom={'10px'}
      >
        {/* Linha 1: Nome da Empresa / CNPJ */}
        <Box direction="row" justify="space-between" align="flex-start" bottomSpace="10px" width="95%">

          <Box flex={'2'} direction="column" rightSpace={'20px'}>
            <TextDefault size="12px" color={colors.silver} bottom="5px">
              Nome da Empresa
            </TextDefault>
            <Input
              placeholder="Nome da empresa"
              value={company.nomeEmpresa}
              onChange={(e) => dispatch(setNomeEmpresa(e.target.value))}
            />
          </Box>

          <Box direction="column" flex={'1'} rightSpace={'20px'}>
            <TextDefault size="12px" color={colors.silver} bottom="5px" left={'20px'}>
              CNPJ
            </TextDefault>
            <InputCnpj
              value={company.cnpj}
              onChange={(value) => dispatch(setCnpj(value))}
            />
            {/* Certifique-se que setCnpj está sendo passado corretamente */}
          </Box>

          <Box direction="column" flex={'1'}>
            <TextDefault size="12px" color={colors.silver} bottom="5px">
              Telefone/WhatsApp
            </TextDefault>
            <InputTel
              value={company.telefone}
              onChange={(value) => dispatch(setTelefone(value))}
            />

          </Box>
        </Box>
      </Box>

      <Box
        direction={'column'}
        width={'100%'}
        height={'auto'}
        color={colors.darkGrayTwo}
        align={'center'}
        paddingTop={'20px'}
        paddingBottom={'20px'}
      >
        {/* Linha 2: Endereço completo */}

        <Box direction="row" justify="space-between" align="center" width="95%">

          <Box flex={'1.5'} direction="column" rightSpace={'20px'} >
            <TextDefault size="12px" color={colors.silver} bottom="5px">Logradouro</TextDefault>
            <Input
              placeholder="Logradouro"
              value={company.endereco.logradouro}
              onChange={e => dispatch(setEnderecoField({ field: 'logradouro', value: e.target.value }))}
            />
          </Box>

          <Box flex={'0.5'} direction="column" rightSpace={'20px'} >
            <TextDefault size="12px" color={colors.silver} bottom="5px">Nº</TextDefault>
            <Input
              placeholder="Número"
              value={company.endereco.numero}
              onChange={e => dispatch(setEnderecoField({ field: 'numero', value: e.target.value }))}
            />
          </Box>

          <Box flex={'1'} direction="column" rightSpace={'20px'}>
            <TextDefault size="12px" color={colors.silver} bottom="5px">Bairro</TextDefault>
            <Input
              placeholder="Bairro"
              value={company.endereco.bairro}
              onChange={e => dispatch(setEnderecoField({ field: 'bairro', value: e.target.value }))}
            />
          </Box>

          <Box flex={'1'} direction="column" rightSpace={'20px'}>
            <TextDefault size="12px" color={colors.silver} bottom="5px">Complemento</TextDefault>
            <Input
              placeholder="Complemento"
              value={company.endereco.complemento}
              onChange={e => dispatch(setEnderecoField({ field: 'complemento', value: e.target.value }))}
            />
          </Box>

          {/* >>> Novo campo Cidade */}
          <Box flex={'1'} direction="column" >
            <TextDefault size="12px" color={colors.silver} bottom="5px">Cidade</TextDefault>
            <Input
              placeholder="Cidade"
              value={company.endereco.cidade}
              onChange={e => dispatch(setEnderecoField({ field: 'cidade', value: e.target.value }))}
            />
          </Box>
        </Box>

      </Box>

      <Box
        direction={'row'}
        width={'100%'}
        height={'auto'}
        gap={'15px'}
      >

        <Box
          direction={'column'}
          width={'40%'}
          height={'auto'}
          color={colors.darkGrayTwo}
          align={'center'}
          paddingTop={'20px'}
          paddingBottom={'10px'}
        >
          <Box direction="row" justify="space-between" align="center" bottomSpace="10px" width="95%">

            <Box flex={'1'} direction="column" rightSpace={'20px'}>
              <TextDefault size="12px" color={colors.silver} bottom="5px">
                Categoria da empresa
              </TextDefault>
              {/* Tipo de Empresa */}
              <Select
                value={company.tipo}
                onChange={e => dispatch(setTipo(e.target.value))}
              >
                <option value="">Selecione a categoria</option>
                <option value="Transportadora">Transportadora</option>
                <option value="Locadora de Veículos">Locadora de Veículos</option>
                <option value="Distribuidora">Distribuidora</option>
                <option value="Construção Civil">Construção Civil</option>
                <option value="Cooperativa de Transporte">Cooperativa de Transporte</option>
                <option value="Empresa de Logística">Empresa de Logística</option>
                <option value="Fretamento e Turismo">Fretamento e Turismo</option>
                <option value="Mineração">Mineração</option>
                <option value="Agronegócio">Agronegócio</option>
                <option value="Serviços Públicos">Serviços Públicos</option>
                <option value="Indústria">Indústria</option>
                <option value="Comércio Varejista e Atacadista">Comércio Varejista e Atacadista</option>
                <option value="Outra">Outra</option>
              </Select>

            </Box>

            <Box flex={'1'} direction="column" rightSpace={'20px'}>
              <TextDefault size="12px" color={colors.silver} bottom="5px">
                Status
              </TextDefault>
              {/* Status da Empresa */}
              <Select
                value={statusEmpresa}
                onChange={e => setStatusEmpresa(e.target.value)}
              >
                <option value="">Status da Empresa</option>
                <option value="Ativa">Ativa</option>
                <option value="Inadimplente">Inadimplente</option>
                <option value="Negociação">Negociação</option>
                <option value="Suspensa">Suspensa</option>
              </Select>
            </Box>

          </Box>

        </Box>


        <Box
          direction={'column'}
          width={'60%'}
          height={'auto'}
          color={colors.darkGrayTwo}
          align={'center'}
          paddingTop={'20px'}
          paddingBottom={'10px'}
        >
          <Box flex={'1'} direction="column" width={'95%'}>
            <TextDefault size="12px" color={colors.silver} bottom="5px">
              Cadastro de cargos
            </TextDefault>

            {/* Cargos */}
            <Box direction="row" justify={'flex-start'} gap={'10px'}>

              <Input
                width={'33.33%'}
                placeholder="Nome do Cargo"
                value={cargoNome}
                onChange={e => setCargoNome(e.target.value)}
              />

              <Select

                value={cargoAcesso}
                onChange={e => setCargoAcesso(e.target.value)}
              >
                <option value="acesso">Acesso</option>
                <option value="gestao">Gestor</option>
                <option value="motorista">Motorista</option>
              </Select>

              <Button onClick={handleAddCargo}>
                <IoMdAdd size={'20px'} color={colors.silver} />
                <TextDefault size="12px" color={colors.silver} left="10px">
                  Adicionar Cargo
                </TextDefault>
              </Button>

              {company.cargos.length > 0 && (
                <Button onClick={() => setShowCargoModal(true)} width={'25%'}>
                  <TiThList size={'20px'} color={colors.silver} />

                  <TextDefault size="12px" color={colors.silver} left="10px">
                    Cargos Adicionados
                  </TextDefault>
                </Button>
              )}

            </Box>
          </Box>

        </Box>

      </Box>

      <Box flex={'1'} direction="row" rightSpace={'20px'} align={'center'} height={'100%'}>
        <Switch>
          <input
            type="checkbox"
            checked={temBases}
            onChange={(e) => {
              const checked = e.target.checked;
              setTemBases(checked);

              if (!checked) {
                // Quando não possui filiais, cria automaticamente a "Matriz"
                dispatch(removeBase()); // limpa tudo antes
                dispatch(addBase("Matriz"));
              }
            }}
          />

          <span />
        </Switch>

        <TextDefault size="12px" color={colors.silver} left={'20px'}>Possui Bases / Filiais?</TextDefault>

      </Box>

      {temBases && (

        <Box
          direction={'column'}
          width={'100%'}
          height={'auto'}
          color={colors.darkGrayTwo}
          align={'center'}
          paddingTop={'20px'}
          paddingBottom={'20px'}
        >
          <Box direction="row" justify="flex-start" align="flex-start" width="95%">

            <Box flex={'5'} direction="column" >

              <TextDefault size="12px" color={colors.silver} bottom={'5px'}>Nome da Base / Filial</TextDefault>

              <Box direction="row" justify={'flex-start'} gap={'20px'}>
                <Input
                  width={'30%'}
                  placeholder="Nome da Base/Filial"
                  value={baseNome}
                  onChange={e => setBaseNome(e.target.value)}
                />
                <Button onClick={handleAddBase} width={'200px'}>
                  <IoMdAdd size={'20px'} color={colors.silver} />

                  <TextDefault size="12px" color={colors.silver} left="10px">
                    Adicionar Base / Filial
                  </TextDefault>
                </Button>

                {company.bases.length > 0 && (
                  <Button onClick={() => setShowBaseModal(true)} width={'200px'}>
                    <TiThList size={'20px'} color={colors.silver} />
                    <TextDefault size="12px" color={colors.silver} left="10px">
                      Bases Adicionadas
                    </TextDefault>
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Box>

      )}

      <Box
        direction={'column'}
        width={'100%'}
        height={'60px'}
        align={'flex-end'}
        justify={'center'}
        bottomSpace={'50px'}
      >
        {/* Botão Próximo */}
        <Button width={'200px'} color={colors.orange} onClick={handleNext}>

          <TextDefault size="15px" color={colors.silver} right={'10px'}>
            Próximo
          </TextDefault>

          <TbArrowBadgeRightFilled size={25} color={colors.silver} />
        </Button>
      </Box>

      {
        showCargoModal && (
          <CargoModalOverlay onClick={() => setShowCargoModal(false)}>
            <CargoModalContent onClick={(e) => e.stopPropagation()}>

              <Box
                width={'100%'}
                height={'65px'}
                direction={'row'}
                color={colors.black}
                bottomSpace={'20px'}
                align={'center'}
                justify={'space-between'}
              >

                <TextDefault left={'20px'} size="17px" weight="bold" color={colors.silver}>
                  Cargos Registrados
                </TextDefault>

                <RemoveButton onClick={() => setShowCargoModal(false)}>
                  <IoClose size={'30px'} color={colors.silver} />
                </RemoveButton>

              </Box>

              <CargoList>
                {company.cargos.length > 0 ? (
                  company.cargos.map((cargo, index) => (
                    <CargoItem key={index}>
                      <TextDefault size="13px" color={colors.silver}>
                        {cargo.nome} - {cargo.acesso}
                      </TextDefault>

                      <RemoveButton
                        onClick={() => dispatch(removeCargo(index))}
                      >
                        <IoClose size={'20px'} color={colors.silver} />
                      </RemoveButton>
                    </CargoItem>
                  ))
                ) : (
                  <TextDefault size="12px" color={colors.silver}>
                    Nenhum cargo registrado
                  </TextDefault>
                )}
              </CargoList>

            </CargoModalContent>
          </CargoModalOverlay>
        )
      }

      {/* >>> Modal de Bases Adicionadas */}
      {showBaseModal && (
        <CargoModalOverlay onClick={() => setShowBaseModal(false)}>
          <CargoModalContent onClick={(e) => e.stopPropagation()}>
            <Box width={'100%'} height={'65px'} direction={'row'} color={colors.black} bottomSpace={'20px'} align={'center'} justify={'space-between'}>
              <TextDefault left={'20px'} size="17px" weight="bold" color={colors.silver}>
                Bases / Filiais Registradas
              </TextDefault>

              <RemoveButton onClick={() => setShowBaseModal(false)}>
                <IoClose size={'30px'} color={colors.silver} />
              </RemoveButton>
            </Box>

            <CargoList>
              {company.bases.length > 0 ? (
                company.bases.map((base, index) => (
                  <CargoItem key={index}>
                    <TextDefault size="13px" color={colors.silver}>{base}</TextDefault>
                    <RemoveButton onClick={() => dispatch(removeBase(index))}>
                      <IoClose size={'20px'} color={colors.silver} />
                    </RemoveButton>
                  </CargoItem>
                ))
              ) : (
                <TextDefault size="12px" color={colors.silver}>Nenhuma base registrada</TextDefault>
              )}
            </CargoList>
          </CargoModalContent>
        </CargoModalOverlay>
      )}
    </Box >
  );
};

export default Step1Empresa;
