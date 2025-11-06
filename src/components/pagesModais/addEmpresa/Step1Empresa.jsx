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
  InputCnpjDark,
  InputTelDark,
  Select,
  BaseModalOverlay,
  BaseModalContent,
  BaseList,
  BaseItem,
  RemoveButton,
  SwalCustomStyles,
  ListaEmpresasWrapper,
  Switch
} from './styles';

import { nextStep } from '../../../store/slices/flowSlice';
import {
  setNomeEmpresa,
  setCnpj,
  setTelefone,
  setEnderecoField,
  setTipo,
  setExtrasField,
  addBase,
  removeBase,
  setBases,
  setQtdVeiculos, // NOVO
} from '../../../store/slices/companySlice';

const Step1Empresa = () => {
  const dispatch = useDispatch();
  const company = useSelector(state => state.company);

  const [temBases, setTemBases] = useState(false);
  const [baseNome, setBaseNome] = useState('');
  const [showBaseModal, setShowBaseModal] = useState(false);

  useEffect(() => {
    // no-op (sem auto-add de "Matriz")
  }, []);

  const handleAddBase = () => {
    if (!baseNome.trim()) return;
    if (baseNome.trim().toLowerCase() === 'matriz') return; // segurança extra
    dispatch(addBase(baseNome.trim()));
    setBaseNome('');
  };

  const handleNext = () => {
    if (
      !company.nomeEmpresa ||
      !company.cnpj ||
      !company.endereco.logradouro ||
      !company.endereco.numero ||
      !company.endereco.bairro
    ) {
      Swal.fire({
        title: `Atenção,Preencha todos os campos obrigatórios.`,
        icon: 'warning',
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
    dispatch(nextStep());
  };

  // === CEP -> ViaCEP ===
  const fetchAddressByCep = async (rawCep) => {
    const cep = (rawCep || '').replace(/\D/g, '');
    if (cep.length !== 8) return;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();

      if (data?.erro) {
        Swal.fire({
          title: 'CEP não encontrado',
          text: 'Verifique o CEP informado.',
          icon: 'warning',
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

      if (data?.logradouro !== undefined)
        dispatch(setEnderecoField({ field: 'logradouro', value: data.logradouro || '' }));
      if (data?.bairro !== undefined)
        dispatch(setEnderecoField({ field: 'bairro', value: data.bairro || '' }));
      if (data?.localidade !== undefined)
        dispatch(setEnderecoField({ field: 'cidade', value: data.localidade || '' }));
    } catch (e) {
      Swal.fire({
        title: 'Falha ao buscar CEP',
        text: 'Não foi possível consultar o ViaCEP agora.',
        icon: 'error',
        customClass: {
          popup: 'swal-custom-popup',
          title: 'swal-custom-title',
          htmlContainer: 'swal-custom-text',
          confirmButton: 'swal-custom-confirm',
          cancelButton: 'swal-custom-cancel',
        }
      });
    }
  };

  const handleCepChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 8);
    dispatch(setEnderecoField({ field: 'cep', value }));
  };

  const handleCepBlurOrAuto = () => {
    const cep = company?.endereco?.cep || '';
    if ((cep || '').length === 8) fetchAddressByCep(cep);
  };

  // === Handler Qtd Veículos (apenas números, até 5 dígitos)
  const onChangeQtdVeiculos = (e) => {
    const onlyNums = (e.target.value || '').replace(/\D/g, '').slice(0, 5);
    dispatch(setQtdVeiculos(onlyNums));
  };

  return (
    <Box direction="column" gap="15px" width="100%" topSpace={'20px'}>
      <SwalCustomStyles />

      <TextDefault size="17px" weight="bold" color={colors.silver}>
        Informações da Empresa
      </TextDefault>

      {/* Linha 1: Nome / CNPJ / Telefone / Categoria / Qtd. Veículos */}
      <Box
        direction={'column'}
        width={'100%'}
        height={'auto'}
        color={colors.darkGrayTwo}
        align={'center'}
        paddingTop={'40px'}
        paddingBottom={'30px'}
      >
        <Box
          direction="row"
          justify="space-between"
          align="flex-start"
          bottomSpace="10px"
          width="95%"
          style={{ minWidth: 0 }} // garante que a linha não force overflow
        >
          {/* Nome da Empresa (≈2x) */}
          <Box flex={'2.2'} direction="column" rightSpace={'20px'} style={{ minWidth: 0 }}>
            <TextDefault size="12px" color={colors.silver} bottom="5px">
              Nome da Empresa
            </TextDefault>
            <Input
              placeholder="Nome da empresa"
              value={company.nomeEmpresa}
              onChange={(e) => dispatch(setNomeEmpresa(e.target.value))}
            />
          </Box>

          {/* CNPJ */}
          <Box direction="column" flex={'1'} rightSpace={'20px'} style={{ minWidth: 0 }}>
            <TextDefault size="12px" color={colors.silver} bottom="5px" left={'20px'}>
              CNPJ
            </TextDefault>
            <InputCnpjDark
              value={company.cnpj}
              onChange={(value) => dispatch(setCnpj(value))}
            />
          </Box>

          {/* Telefone */}
          <Box direction="column" flex={'1'} rightSpace={'20px'} style={{ minWidth: 0 }}>
            <TextDefault size="12px" color={colors.silver} bottom="5px">
              Telefone/WhatsApp
            </TextDefault>
            <InputTelDark
              value={company.telefone}
              onChange={(value) => dispatch(setTelefone(value))}
            />
          </Box>

          {/* Categoria */}
          <Box direction="column" flex={'1'} rightSpace={'20px'} style={{ minWidth: 0 }}>
            <TextDefault size="12px" color={colors.silver} bottom="5px">
              Categoria da empresa
            </TextDefault>
            <Select value={company.tipo} onChange={e => dispatch(setTipo(e.target.value))}>
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

          {/* Qtd. Veículos (menor, só números, máx 5) */}
          <Box direction="column" flex={'0.6'} style={{ minWidth: 0 }}>
            <TextDefault size="12px" color={colors.silver} bottom="5px">
              Qtd. Veículos
            </TextDefault>
            <Input
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="0"
              value={company.qtdVeiculos || ''}
              onChange={onChangeQtdVeiculos}
            />
          </Box>
        </Box>
      </Box>

      {/* Endereço */}
      <Box
        direction={'column'}
        width={'100%'}
        height={'auto'}
        color={colors.darkGrayTwo}
        align={'center'}
        paddingTop={'40px'}
        paddingBottom={'30px'}
      >
        <Box
          direction="row"
          justify="space-between"
          align="center"
          width="95%"
          style={{ minWidth: 0 }} // evita overflow em telas largas
        >
          {/* CEP */}
          <Box flex={'0.6'} direction="column" rightSpace={'20px'} style={{ minWidth: 0 }}>
            <TextDefault size="12px" color={colors.silver} bottom="5px">CEP</TextDefault>
            <Input
              placeholder="Somente números"
              value={company.endereco.cep || ''}
              onChange={handleCepChange}
              onBlur={handleCepBlurOrAuto}
              onKeyUp={(e) => {
                const v = (e.target.value || '').replace(/\D/g, '');
                if (v.length === 8) handleCepBlurOrAuto();
              }}
            />
          </Box>

          <Box flex={'1.5'} direction="column" rightSpace={'20px'} style={{ minWidth: 0 }}>
            <TextDefault size="12px" color={colors.silver} bottom="5px">Logradouro</TextDefault>
            <Input
              placeholder="Logradouro"
              value={company.endereco.logradouro}
              onChange={e => dispatch(setEnderecoField({ field: 'logradouro', value: e.target.value }))}
            />
          </Box>

          <Box flex={'0.5'} direction="column" rightSpace={'20px'} style={{ minWidth: 0 }}>
            <TextDefault size="12px" color={colors.silver} bottom="5px">Nº</TextDefault>
            <Input
              placeholder="Número"
              value={company.endereco.numero}
              onChange={e => dispatch(setEnderecoField({ field: 'numero', value: e.target.value }))}
            />
          </Box>

          <Box flex={'1'} direction="column" rightSpace={'20px'} style={{ minWidth: 0 }}>
            <TextDefault size="12px" color={colors.silver} bottom="5px">Bairro</TextDefault>
            <Input
              placeholder="Bairro"
              value={company.endereco.bairro}
              onChange={e => dispatch(setEnderecoField({ field: 'bairro', value: e.target.value }))}
            />
          </Box>

          <Box flex={'1'} direction="column" rightSpace={'20px'} style={{ minWidth: 0 }}>
            <TextDefault size="12px" color={colors.silver} bottom="5px">Complemento</TextDefault>
            <Input
              placeholder="Complemento"
              value={company.endereco.complemento}
              onChange={e => dispatch(setEnderecoField({ field: 'complemento', value: e.target.value }))}
            />
          </Box>

          <Box flex={'1'} direction="column" style={{ minWidth: 0 }}>
            <TextDefault size="12px" color={colors.silver} bottom="5px">Cidade</TextDefault>
            <Input
              placeholder="Cidade"
              value={company.endereco.cidade}
              onChange={e => dispatch(setEnderecoField({ field: 'cidade', value: e.target.value }))}
            />
          </Box>
        </Box>
      </Box>

      {/* Switch de Bases */}
      <Box flex={'1'} direction="row" rightSpace={'20px'} align={'center'} height={'100%'}>
        <Switch>
          <input
            type="checkbox"
            checked={temBases}
            onChange={(e) => {
              const checked = e.target.checked;
              setTemBases(checked);
              if (!checked) dispatch(setBases([]));
            }}
          />
          <span />
        </Switch>
        <TextDefault size="12px" color={colors.silver} left={'20px'}>Possui Bases / Filiais?</TextDefault>
      </Box>

      {/* Bases */}
      {temBases && (
        <Box direction={'column'} width={'100%'} height={'auto'} color={colors.darkGrayTwo} align={'center'} paddingTop={'40px'} paddingBottom={'30px'}>
          <Box direction="row" justify="flex-start" align="flex-start" width="95%">
            <Box flex={'5'} direction="column" style={{ minWidth: 0 }}>
              <TextDefault size="12px" color={colors.silver} bottom={'5px'}>Nome da Base / Filial</TextDefault>
              <Box direction="column" justify={'flex-start'} gap={'20px'}>
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

      {/* Ações */}
      <Box direction={'column'} width={'100%'} height={'60px'} align={'flex-end'} justify={'center'} bottomSpace={'50px'}>
        <Button width={'200px'} color={colors.orange} onClick={handleNext}>
          <TextDefault size="15px" color={colors.silver} right={'10px'}>
            Próximo
          </TextDefault>
          <TbArrowBadgeRightFilled size={25} color={colors.silver} />
        </Button>
      </Box>

      {/* Modal de Bases */}
      {showBaseModal && (
        <BaseModalOverlay onClick={() => setShowBaseModal(false)}>
          <BaseModalContent onClick={(e) => e.stopPropagation()}>
            <Box width={'100%'} height={'65px'} direction={'row'} color={colors.black} bottomSpace={'20px'} align={'center'} justify={'space-between'}>
              <TextDefault left={'20px'} size="17px" weight="bold" color={colors.silver}>
                Bases / Filiais Registradas
              </TextDefault>
              <RemoveButton onClick={() => setShowBaseModal(false)}>
                <IoClose size={'30px'} color={colors.silver} />
              </RemoveButton>
            </Box>

            <BaseList>
              {company.bases.length > 0 ? (
                company.bases.map((base, index) => (
                  <BaseItem key={index}>
                    <TextDefault size="13px" color={colors.silver}>{base}</TextDefault>
                    <RemoveButton onClick={() => dispatch(removeBase(index))}>
                      <IoClose size={'20px'} color={colors.silver} />
                    </RemoveButton>
                  </BaseItem>
                ))
              ) : (
                <TextDefault size="12px" color={colors.silver}>Nenhuma base registrada</TextDefault>
              )}
            </BaseList>
          </BaseModalContent>
        </BaseModalOverlay>
      )}
    </Box>
  );
};

export default Step1Empresa;
