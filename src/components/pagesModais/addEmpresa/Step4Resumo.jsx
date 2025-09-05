import React from 'react';

// Firebase
import { db } from '../../../firebaseConnection';
import { ref, push, set } from 'firebase/database';

// Estilos
import Swal from 'sweetalert2';
import { colors } from '../../../theme';
import { Button } from './styles';
import { Box, TextDefault } from '../../../stylesAppDefault';

// Icones
import { MdOutlineDataSaverOff } from "react-icons/md";
import { TbArrowBadgeLeftFilled } from "react-icons/tb";

// Redux
import { prevStep } from '../../../store/slices/flowSlice';
import { useDispatch, useSelector } from 'react-redux';
import { resetCompany } from "../../../store/slices/companySlice";
import { resetUsers } from "../../../store/slices/usersSlice";
import { resetPermissions } from "../../../store/slices/permissionsSlice";
import { resetFlow } from "../../../store/slices/flowSlice";

const Step4 = ({ closeRegister }) => {
  const dispatch = useDispatch();

  // Dados vindos do Redux
  const company = useSelector((state) => state.company);
  const users = useSelector((state) => state.users.list);
  const permissions = useSelector((state) => state.permissions);

  const handlePrev = () => {
    dispatch(prevStep());
  };

  const saveEmpresa = async () => {
    try {
      const empresaRef = push(ref(db, "empresas")); // cria um nó novo com ID único
      await set(empresaRef, {
        ...company,
        usuarios: users,
        permissoes: permissions,
        criadoEm: new Date().toISOString(),
      });

      Swal.fire({
        icon: "success",
        title: "Empresa salva com sucesso!",
        confirmButtonColor: colors.orange,
      });

      // 🔹 Limpa os Redux
      dispatch(resetCompany());
      dispatch(resetUsers());
      dispatch(resetPermissions());
      dispatch(resetFlow()); // volta para o Step1, opcional

      // 🔹 Fecha modal/cadastro
      closeRegister();

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro ao salvar",
        text: error.message,
        confirmButtonColor: colors.orange,
      });
    }
  };

  return (
    <Box direction="column" gap="15px" width="100%" topSpace={'20px'}>

      <Box width="100%" height={'auto'} align={'center'} justify={'space-between'}>
        <Box direction="column" gap="10px">
          <TextDefault size="17px" weight="bold" color={colors.silver}>
            Resumo
          </TextDefault>
          <TextDefault size="13px" color={colors.silver}>
            Verifique as informações antes de salvar a empresa <b>{company.nomeEmpresa}</b>
          </TextDefault>
        </Box>
      </Box>

      {/* Dados da empresa */}
      <Box direction={'column'} width={'100%'} height={'auto'} color={colors.darkGrayTwo} align={'flex-start'} paddingTop={'20px'} paddingBottom={'10px'}>
        <TextDefault size="15px" weight="bold" left={'20px'} bottom={'20px'} color={colors.silver}>
          Dados da empresa:
        </TextDefault>
        <Box left={'30px'} direction="column" gap="5px">
          <TextDefault left={'20px'} size="12px" color={colors.silver}><b>Nome:</b> {company.nomeEmpresa}</TextDefault>
          <TextDefault left={'20px'} size="12px" color={colors.silver}><b>CNPJ:</b> {company.cnpj}</TextDefault>
          <TextDefault left={'20px'} size="12px" color={colors.silver}><b>Telefone:</b> {company.telefone}</TextDefault>
          <TextDefault left={'20px'} size="12px" color={colors.silver}><b>Tipo:</b> {company.tipo}</TextDefault>
          <TextDefault left={'20px'} size="12px" color={colors.silver}>
            <b>Endereço:</b> {company.endereco.logradouro}, {company.endereco.numero} - {company.endereco.bairro}
          </TextDefault>
          <TextDefault left={'20px'} size="12px" color={colors.silver}><b>Complemento:</b> {company.endereco.complemento}</TextDefault>
          <TextDefault left={'20px'} size="12px" color={colors.yellow}> <b>Status:</b> {company.extras.status}</TextDefault>
          {/* Cargos cadastrados */}
          <Box
            direction={'column'}
            width={'100%'}
            height={'auto'}
            color={colors.darkGrayTwo}
            align={'flex-start'}
            paddingTop={'20px'}
            paddingBottom={'10px'}
          >
            <TextDefault size="15px" weight="bold" left={'20px'} bottom={'20px'} color={colors.silver}>
              Cargos cadastrados:
            </TextDefault>
            <Box left={'30px'} direction="column" gap="5px">
              {company.cargos && company.cargos.length > 0 ? (
                company.cargos.map((cargo, index) => (
                  <TextDefault key={index} left={'20px'} size="12px" color={colors.silver}>
                    <b>{cargo.nome}</b> - {cargo.acesso}
                  </TextDefault>
                ))
              ) : (
                <TextDefault left={'20px'} size="12px" color={colors.silver}>
                  Nenhum cargo cadastrado
                </TextDefault>
              )}
            </Box>
          </Box>

          {/* Bases / Filiais cadastradas */}
          <Box
            direction={'column'}
            width={'100%'}
            height={'auto'}
            color={colors.darkGrayTwo}
            align={'flex-start'}
            paddingTop={'20px'}
            paddingBottom={'10px'}
          >
            <TextDefault size="15px" weight="bold" left={'20px'} bottom={'20px'} color={colors.silver}>
              Bases / Filiais cadastradas:
            </TextDefault>
            <Box left={'30px'} direction="column" gap="5px">
              {company.bases && company.bases.length > 0 ? (
                company.bases.map((base, index) => (
                  <TextDefault key={index} left={'20px'} size="12px" color={colors.silver}>
                    {base}
                  </TextDefault>
                ))
              ) : (
                <TextDefault left={'20px'} size="12px" color={colors.silver}>
                  Nenhuma base/filial cadastrada
                </TextDefault>
              )}
            </Box>
          </Box>

        </Box>
      </Box>

      {/* Usuários */}
      <Box
        direction={'column'}
        width={'100%'}
        height={'auto'}
        color={colors.darkGrayTwo}
        align={'flex-start'}
        paddingTop={'20px'}
        paddingBottom={'10px'}
      >
        <TextDefault size="15px" weight="bold" left={'20px'} bottom={'20px'} color={colors.silver}>
          Usuários cadastrados:
        </TextDefault>

        <Box direction="column" gap="15px" width={'100%'}>
          {users.length > 0 ? (
            users.map((u, i) => (
              <Box key={i} direction={'column'} width={'90%'} leftSpace={'20px'} gap="5px">
                <TextDefault size="12px" color={colors.silver}>
                  <b>Nome completo:</b> {u.nome} {u.sobrenome}
                </TextDefault>
                <TextDefault size="12px" color={colors.silver}>
                  <b>CPF:</b> {u.cpf}
                </TextDefault>
                <TextDefault size="12px" color={colors.silver}>
                  <b>Email:</b> {u.email}
                </TextDefault>
                <TextDefault size="12px" color={colors.silver}>
                  <b>Contato:</b> {u.contato}
                </TextDefault>

                <TextDefault size="12px" color={colors.silver}>
                  <b>Cargo:</b> {u.cargoNome}
                </TextDefault>
                <TextDefault size="12px" color={colors.silver}>
                  <b>Tipo de acesso:</b> {u.tipoAcesso}
                </TextDefault>
                <TextDefault size="12px" color={colors.silver}>
                  <b>Horário de trabalho:</b> {u.horarioEntrada} às {u.horarioSaida}
                </TextDefault>
                <TextDefault size="12px" color={colors.silver}>
                  <b>Status:</b> {u.status}
                </TextDefault>

                <TextDefault size="12px" color={colors.yellow}>
                  <b>Matrícula / Login:</b> {u.matricula} - <b>Senha:</b> {u.senha}
                </TextDefault>

                <TextDefault size="12px" color={colors.silver}>
                  <b>Observações do usuário:</b> {u.obs}
                </TextDefault>

                {/* Bloco da CNH - só aparece se tiver dados */}
                {(u.cnhNumero || u.cnhValidade || u.cnhCategoria || u.cnhPrimeiraHab || u.cnhObs) && (
                  <Box direction="column" gap="5px" topSpace="10px">
                    <TextDefault size="12px" weight="bold" color={colors.silver}>
                      Dados da CNH:
                    </TextDefault>
                    {u.cnhNumero && (
                      <TextDefault size="12px" color={colors.silver}>
                        <b>Número:</b> {u.cnhNumero}
                      </TextDefault>
                    )}
                    {u.cnhValidade && (
                      <TextDefault size="12px" color={colors.silver}>
                        <b>Validade:</b> {u.cnhValidade}
                      </TextDefault>
                    )}
                    {u.cnhCategoria && (
                      <TextDefault size="12px" color={colors.silver}>
                        <b>Categoria:</b> {u.cnhCategoria}
                      </TextDefault>
                    )}
                    {u.cnhPrimeiraHab && (
                      <TextDefault size="12px" color={colors.silver}>
                        <b>Primeira Habilitação:</b> {u.cnhPrimeiraHab}
                      </TextDefault>
                    )}
                    {u.cnhObs && (
                      <TextDefault size="12px" color={colors.silver}>
                        <b>Observações CNH:</b> {u.cnhObs}
                      </TextDefault>
                    )}
                  </Box>
                )}


                {/* Linha separadora */}
                <Box
                  leftSpace={'0px'}
                  width={'100%'}
                  height={'1px'}
                  radius={'1px'}
                  color={colors.silver}
                  topSpace={'15px'}
                  bottomSpace={'10px'}
                />
              </Box>
            ))
          ) : (
            <TextDefault size="12px" color={colors.silver}>
              Nenhum usuário cadastrado
            </TextDefault>
          )}
        </Box>
      </Box>


      {/* Permissões */}
      <Box direction={'column'} width={'100%'} height={'auto'} color={colors.darkGrayTwo} align={'flex-start'} paddingTop={'20px'} paddingBottom={'10px'}>
        <TextDefault size="15px" weight="bold" left={'20px'} bottom={'20px'} color={colors.silver}>
          Permissões do cliente:
        </TextDefault>
        <Box left={'30px'} direction="column" gap="5px">
          {Object.entries(permissions).map(([key, value]) => (
            <TextDefault left={'20px'} key={key} size="12px" color={colors.silver}>
              <b>{key}:</b> {value ? "✅ Ativado" : "❌ Desativado"}
            </TextDefault>
          ))}
        </Box>
      </Box>

      {/* Rodapé */}
      <Box direction={'row'} width={'100%'} height={'60px'} align={'center'} justify={'flex-end'} gap={'15px'} bottomSpace={'50px'}>
        <Button width={'200px'} color={colors.orange} onClick={handlePrev}>
          <TbArrowBadgeLeftFilled size={25} color={colors.silver} />
          <TextDefault size="15px" color={colors.silver} left={'10px'}>Anterior</TextDefault>
        </Button>

        <Button width={'200px'} color={colors.orange} onClick={saveEmpresa}>
          <TextDefault size="15px" color={colors.silver} right={'10px'}>Salvar</TextDefault>
          <MdOutlineDataSaverOff size={20} color={colors.silver} />
        </Button>
      </Box>
    </Box>
  );
};

export default Step4;
