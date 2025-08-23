import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { IoMdAdd } from "react-icons/io";
import { TiThList } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import { TbArrowBadgeLeftFilled, TbArrowBadgeRightFilled } from "react-icons/tb";
import { useDispatch, useSelector } from 'react-redux';
import { prevStep, nextStep } from '../../../store/slices/flowSlice';
import { colors } from '../../../theme';
import { Box, TextDefault } from '../../../stylesAppDefault';
import { addUser, removeUser, updateUserField } from '../../../store/slices/usersSlice';
import {
  Select,
  Input,
  Button,
  SwalCustomStyles,
  CargoList,
  CargoModalOverlay,
  CargoModalContent,
  RemoveButton,
  CargoItem,
  InputHora
} from './styles'; // ajuste conforme seu projeto

import InputData from '../../inputs/formatDate';
import InputTel from '../../inputs/InputTelefone';
import InputCpf from '../../inputs/formatCPF';

const Step2Usuarios = () => {
  const dispatch = useDispatch();

  const cargos = useSelector(state => state.company.cargos);
  const users = useSelector(state => state.users.list);

  // considere "válido" quem preencheu os campos mínimos
  const isValidUser = (u) =>
    u &&
    u.nome?.trim() &&
    u.cpf?.trim() &&
    u.cargoNome?.trim() &&
    u.status?.trim() &&
    u.senha?.trim() &&
    u.contato?.trim();

  const validUsers = Array.isArray(users) ? users.filter(isValidUser) : [];

  // Status Modal lista de Cargos
  const [showUserListModal, setShowUserListModal] = useState(false);

  const [form, setForm] = useState({
    nome: '',
    sobrenome: '',
    cpf: '',
    senha: '',
    cargoNome: '',
    contato: '',
    tipoAcesso: 'gestao',
    status: '',
    email: '',
    obs: '',
    cnhNumero: '',
    cnhValidade: '',
    cnhCategoria: '',
    cnhPrimeiraHab: '',
    cnhObs: ''
  });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));

    if (field === 'cargoNome') {
      const ref = cargos.find(c => c.nome === value);
      if (ref) {
        setForm(prev => ({ ...prev, tipoAcesso: ref.acesso }));
      }
    }
  };

  const handleAddUser = () => {
    // Verifica obrigatórios
    if (!form.nome || !form.sobrenome || !form.cpf || !form.senha ||
      !form.cargoNome || !form.contato || !form.status) {
      Swal.fire('Atenção', 'Preencha todos os campos obrigatórios.', 'warning');
      return;
    }

    // se motorista, validar CNH
    if (form.tipoAcesso === 'motorista' &&
      (!form.cnhNumero || !form.cnhValidade || !form.cnhCategoria || !form.cnhPrimeiraHab)) {
      Swal.fire('Atenção', 'Preencha todos os dados da CNH para motoristas.', 'warning');
      return;
    }

    // Se chegou aqui, então está válido → adiciona no Redux
    dispatch(addUser(form));

    Swal.fire('Sucesso', 'Usuário adicionado com sucesso!', 'success');

    // Resetar o form para novo cadastro
    setForm({
      nome: '',
      sobrenome: '',
      cpf: '',
      email: '',
      senha: '',
      cargoNome: '',
      tipoAcesso: '',
      contato: '',
      status: '',
      horarioEntrada: '',
      horarioSaida: '',
      cnhNumero: '',        // nome correto
      cnhValidade: '',
      cnhCategoria: '',
      cnhPrimeiraHab: '',
      cnhObs: '',           // não esquecer dele também
      obs: ''
    });

  };

  const handleNext = () => {
    // verificar se existe pelo menos 1 usuário válido
    if (!users.some(u => (u?.nome || '').trim().length > 0)) {
      Swal.fire('Atenção', 'Você precisa adicionar pelo menos 1 usuário.', 'warning');
      return;
    }

    // se passou na validação, vai para o próximo step
    dispatch(nextStep());
  };

  const handleHoraChange = (field, value) => {
    let v = value.replace(/\D/g, ''); // só números
    if (v.length >= 3) {
      v = v.slice(0, 2) + ':' + v.slice(2, 4);
    }
    if (v.length > 5) v = v.slice(0, 5);
    handleChange(field, v);
  };

  const handlePrev = () => dispatch(prevStep());

  const isMotorista = form.tipoAcesso === 'motorista';

  return (
    <Box direction="column" gap="15px" width="100%" topSpace={'20px'} >

      <SwalCustomStyles />

      <Box width="100%" height={'auto'} align={'center'} justify={'space-between'}>
        <Box direction="column" gap="10px">
          <TextDefault size="17px" weight="bold" color={colors.silver}>
            Cadastro de Usuários
          </TextDefault>

          <TextDefault size="13px" color={colors.silver}>
            Dados do Usuário
          </TextDefault>
        </Box>

        <Box>
          {validUsers.length > 0 && (
            <Button onClick={() => setShowUserListModal(true)}>
              <TiThList size={'20px'} color={colors.silver} />
              <TextDefault size="15px" color={colors.silver} left={'10px'}>
                Usuários adicionados
              </TextDefault>
            </Button>
          )}
        </Box>
      </Box>

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
        <Box direction="row" justify="space-between" align="flex-start" bottomSpace="10px" width="94.5%">
          <Box flex={'1'} direction="column">
            <TextDefault size="12px" color={colors.silver} bottom="5px">
              Nome
            </TextDefault>
            <Input placeholder="Nome *" value={form.nome} onChange={e => handleChange('nome', e.target.value)} />
          </Box>

          <Box flex={'1'} direction="column" leftSpace={'30px'}>
            <TextDefault size="12px" color={colors.silver} bottom="5px">
              Sobrenome
            </TextDefault>
            <Input placeholder="Sobrenome *" value={form.sobrenome} onChange={e => handleChange('sobrenome', e.target.value)} />
          </Box>

          <Box flex={'0.5'} direction="column" leftSpace={'30px'}>
            <TextDefault size="12px" color={colors.silver} bottom="5px">
              CPF
            </TextDefault>

            <InputCpf
              placeholder="CPF*"
              value={form.cpf}
              onChange={(val) => handleChange('cpf', val)}
            />
          </Box>
        </Box>

        <Box direction="row" justify="space-between" align="flex-start" bottomSpace="10px" width="94.5%">
          <Box flex={'1'} direction="column">
            <TextDefault size="12px" color={colors.silver} bottom="5px">
              E-mail
            </TextDefault>
            <Input placeholder="Email" value={form.email} onChange={e => handleChange('email', e.target.value)} />
          </Box>

          <Box flex={'1'} direction="column" leftSpace={'30px'}>
            <TextDefault size="12px" color={colors.silver} bottom="5px">
              Telefone/WhatsApp
            </TextDefault>

            <InputTel
              placeholder="Telefone/WhatsApp *"
              value={form.contato}
              onChange={(val) => handleChange('contato', val)}
            />
          </Box>

          <Box flex={'1'} direction="column" leftSpace={'30px'}>
            <TextDefault size="12px" color={colors.silver} bottom="5px">
              Status
            </TextDefault>
            {/* Status */}
            <Select value={form.status} onChange={e => handleChange('status', e.target.value)}>
              <option value="">Selecione o status</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="ferias">Férias</option>
              <option value="afastado">Afastado</option>
              <option value="demitido">Demitido</option>
            </Select>
          </Box>

          <Box flex={'1'} direction="column" leftSpace={'20px'}>
            <TextDefault size="12px" color={colors.silver} bottom="5px">
              Horário de trabalho
            </TextDefault>

            <Box direction="row" align="center">
              <InputHora
                value={form.horarioEntrada}
                onChange={(e) => handleHoraChange('horarioEntrada', e.target.value)}
              />
              <TextDefault size="12px" color={colors.silver} left="10px" right="10px">às</TextDefault>
              <InputHora
                value={form.horarioSaida}
                onChange={(e) => handleHoraChange('horarioSaida', e.target.value)}
              />
            </Box>
          </Box>
        </Box>

        <Box direction="row" justify="space-between" align="flex-start" bottomSpace="10px" width="94.5%">
          <Box flex={'1'} direction="column">
            <TextDefault size="12px" color={colors.silver} bottom="5px">
              Observações:
            </TextDefault>
            <Input
              placeholder="Usuário com deficiência ou outra observação"
              type="text"
              value={form.obs}
              onChange={e => handleChange('obs', e.target.value)}
            />
          </Box>

          <Box flex={'1'} direction="column" leftSpace={'35px'}>
            <TextDefault size="12px" color={colors.silver} bottom="5px">
              Cargo (acesso a plataforma)
            </TextDefault>

            {/* Cargo */}
            <Select value={form.cargoNome} onChange={e => handleChange('cargoNome', e.target.value)}>
              <option value="">Selecione o cargo</option>
              {cargos.map((c, i) => (
                <option key={i} value={c.nome}>
                  {c.nome} {c.acesso === 'motorista' ? '(Motorista)' : '(Gestão)'}
                </option>
              ))}
            </Select>
          </Box>

          <Box flex={'1'} direction="column" leftSpace={'20px'}>
            <TextDefault size="12px" color={colors.silver} bottom="5px">
              Senha de acesso
            </TextDefault>
            <Input placeholder="Senha *" type="password" value={form.senha} onChange={e => handleChange('senha', e.target.value)} />
          </Box>
        </Box>
      </Box>

      {/* Campos extras se motorista */}
      {isMotorista && (
        <>
          <TextDefault size="13px" color={colors.silver}>
            Dados da CNH
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
            <Box direction="row" justify="space-between" align="flex-start" bottomSpace="10px" width="94.5%">
              <Box flex={'1'} direction="column">
                <TextDefault size="12px" color={colors.silver} bottom="5px">
                  CNH - Número de Registro
                </TextDefault>
                <Input placeholder="CNH - Número de Registro" value={form.cnhNumero} onChange={e => handleChange('cnhNumero', e.target.value)} />
              </Box>

              <Box flex={'1'} direction="column" leftSpace={'30px'}>
                <TextDefault size="12px" color={colors.silver} bottom="5px">
                  CNH - Validade
                </TextDefault>
                <InputData placeholder="CNH - Validade" value={form.cnhValidade} onChange={(val) => handleChange('cnhValidade', val)} />
              </Box>

              <Box flex={'1'} direction="column" leftSpace={'30px'}>
                <TextDefault size="12px" color={colors.silver} bottom="5px">
                  CNH - Categoria
                </TextDefault>
                <Input placeholder="CNH - Categoria" value={form.cnhCategoria} onChange={e => handleChange('cnhCategoria', e.target.value)} />
              </Box>

              <Box flex={'1'} direction="column" leftSpace={'30px'}>
                <TextDefault size="12px" color={colors.silver} bottom="5px">
                  CNH - Data 1ª Habilitação
                </TextDefault>
                <InputData placeholder="CNH - Data 1ª Habilitação" value={form.cnhPrimeiraHab} onChange={(val) => handleChange('cnhPrimeiraHab', val)} />
              </Box>

              <Box flex={'1'} direction="column" leftSpace={'30px'}>
                <TextDefault size="12px" color={colors.silver} bottom="5px">
                  Observação CNH
                </TextDefault>
                <Input placeholder="Observação CNH" value={form.cnhObs} onChange={e => handleChange('cnhObs', e.target.value)} />
              </Box>

            </Box>
          </Box>
        </>
      )}

      <Box
        direction={'column'}
        width={'100%'}
        height={'60px'}
        align={'flex-start'}
        justify={'center'}
      >
        {/* Botão Próximo */}
        <Button width={'200px'} color={colors.orange} onClick={handleAddUser}>

          <IoMdAdd size={20} color={colors.silver} />

          <TextDefault size="15px" color={colors.silver} left={'10px'}>
            Adicionar Usuário
          </TextDefault>

        </Button>
      </Box>

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

      {showUserListModal && (
        <CargoModalOverlay onClick={() => setShowUserListModal(false)}>
          <CargoModalContent onClick={(e) => e.stopPropagation()}>

            {/* Cabeçalho */}
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
                Usuários adicionados
              </TextDefault>

              <RemoveButton onClick={() => setShowUserListModal(false)}>
                <IoClose size={'30px'} color={colors.silver} />
              </RemoveButton>
            </Box>

            {/* Lista de usuários */}
            <CargoList>
              {users && users.filter(u => u.nome && u.cpf).length > 0 ? (
                users
                  .filter(u => u.nome && u.cpf) // só mostra usuários válidos
                  .map((u, i) => (
                    <CargoItem key={i}>
                      <Box direction={'column'} width="100%">
                        <TextDefault size="13px" color={colors.silver} bottom={'6px'}>
                          <strong>Nome completo:</strong> {u.nome} {u.sobrenome}
                          &nbsp; | &nbsp; <strong>CPF:</strong> {u.cpf}
                          &nbsp; | &nbsp; <strong>Status:</strong> {u.status}
                        </TextDefault>

                        <TextDefault size="13px" color={colors.silver} bottom={'6px'}>
                          <strong>Cargo:</strong> {u.cargoNome}
                          &nbsp; | &nbsp; <strong>Tel.:</strong> {u.contato}
                          &nbsp; | &nbsp; <strong>E-mail:</strong> {u.email}
                        </TextDefault>

                        <TextDefault size="13px" weight={'bold'} color={colors.silver}>
                          Login: {u.matricula} &nbsp; | &nbsp; Senha: {u.senha}
                        </TextDefault>

                        {/* Mostrar CNH somente se motorista */}
                        {u.tipoAcesso === 'motorista' && (
                          <Box direction="column" >
                            {/* Linha separadora */}
                            <Box width={'95%'} height={'1px'} radius={'1px'} color={colors.silver} topSpace={'10px'} bottomSpace={'10px'} />

                            <TextDefault size="13px" color={colors.silver} bottom={'6px'}>
                              <strong>CNH:</strong> {u.cnhNumero} &nbsp; | &nbsp; <strong>Categoria:</strong> {u.cnhCategoria}
                            </TextDefault>
                            <TextDefault size="13px" color={colors.silver} bottom={'6px'}>
                              <strong>Validade:</strong> {u.cnhValidade} &nbsp; | &nbsp; <strong>1ª Habilitação:</strong> {u.cnhPrimeiraHab}
                            </TextDefault>
                            {u.cnhObs && (
                              <TextDefault size="13px" color={colors.silver} bottom={'6px'}>
                                <strong>Observação CNH:</strong> {u.cnhObs}
                              </TextDefault>
                            )}
                          </Box>
                        )}
                      </Box>

                      {/* Botão remover */}
                      <RemoveButton onClick={() => dispatch(removeUser(i))}>
                        <IoClose size={'20px'} color={colors.silver} />
                      </RemoveButton>
                    </CargoItem>
                  ))
              ) : (
                <TextDefault size="12px" color={colors.silver}>
                  Nenhum usuário adicionado
                </TextDefault>
              )}
            </CargoList>
          </CargoModalContent>
        </CargoModalOverlay>
      )}

    </Box>
  );
};
export default Step2Usuarios;
