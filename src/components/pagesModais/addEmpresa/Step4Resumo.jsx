import React from 'react';

// Firebase
import { db } from '../../../firebaseConnection';
import { ref, push, set } from 'firebase/database';

// Estilos
import Swal from 'sweetalert2';
import { colors } from '../../../theme';
import { Button } from './styles';
import { Box, TextDefault } from '../../../stylesAppDefault';

// Ícones
import { MdOutlineDataSaverOff } from "react-icons/md";
import { TbArrowBadgeLeftFilled } from "react-icons/tb";

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { prevStep, resetFlow } from '../../../store/slices/flowSlice';
import { resetCompany } from "../../../store/slices/companySlice";
import { resetPermissions } from "../../../store/slices/permissionsSlice";

const Step4 = ({ closeRegister }) => {
  const dispatch = useDispatch();

  // Dados vindos do Redux
  const company = useSelector((state) => state.company);
  const permissions = useSelector((state) => state.permissions);

  const handlePrev = () => {
    dispatch(prevStep());
  };

  const saveEmpresa = async () => {
    try {
      // 🔸 Atualizado: salva em "fleetBusiness"
      const empresaRef = push(ref(db, "fleetBusiness"));
      await set(empresaRef, {
        ...company,
        permissoes: permissions,
        criadoEm: new Date().toISOString(),
      });

      Swal.fire({
        icon: "success",
        title: "Empresa salva com sucesso!",
        confirmButtonColor: colors.orange,
      });

      // 🔹 Limpa Redux (sem users)
      dispatch(resetCompany());
      dispatch(resetPermissions());
      dispatch(resetFlow());

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

  // ===== Helpers de apresentação =====
  const Row = ({ label, value }) => (
    <Box
      direction="row"
      justify="space-between"
      align="center"
      width="95%"
      leftSpace="20px"
      bottomSpace="6px"
    >
      <TextDefault size="12px" color={colors.silver}>{label}</TextDefault>
      <TextDefault size="12px" color={colors.silver}><b>{value || '-'}</b></TextDefault>
    </Box>
  );

  const Section = ({ title, children }) => (
    <Box
      direction="column"
      width="100%"
      color={colors.darkGrayTwo}
      align="flex-start"
      paddingTop="14px"
      paddingBottom="10px"
    >
      <TextDefault size="14px" weight="bold" left="20px" bottom="12px" color={colors.silver}>
        {title}
      </TextDefault>
      <Box direction="column" width="100%" gap="4px">
        {children}
      </Box>
      {/* separador visual sutil */}
      <Box width="100%" height="1px" color={colors.darkGray} topSpace="12px" />
    </Box>
  );

  // Permissões: exibir todas (✅/❌) em ordem alfabética pelo rótulo legível
  const permissionLabels = {
    abastecimento: 'Abastecimento',
    checklist: 'CheckList',
    fleetIA: 'Fleet IA (Inteligência Artificial aplicada na sua frota)',
    manutencao: 'Área de Manutenção',
    contabilidade: 'Contabilidade',
    multas: 'Multas',
    protect: 'Protect (assinatura de multas)',
    localizacao: 'Logística (motoristas x veículos, localizações)',
    juridico: 'Jurídico',
    cursos: 'Cursos & Treinamentos',
  };

  const sortedPermissions = Object.keys(permissions)
    .map(k => ({ key: k, label: permissionLabels[k] || k, value: !!permissions[k] }))
    .sort((a, b) => a.label.localeCompare(b.label, 'pt-BR', { sensitivity: 'base' }));

  return (
    <Box direction="column" gap="15px" width="100%" topSpace={'20px'}>

      {/* Cabeçalho */}
      <Box width="100%" height={'auto'} align={'center'} justify={'space-between'}>
        <Box direction="column" gap="8px">
          <TextDefault size="17px" weight="bold" color={colors.silver}>
            Resumo
          </TextDefault>
          <TextDefault size="13px" color={colors.silver}>
            Revise antes de salvar a empresa <b>{company.nomeEmpresa || '-'}</b>
          </TextDefault>
        </Box>
      </Box>

      {/* ===== Extrato / Ficha ===== */}
      <Section title="Dados da Empresa">
        <Row label="Nome da Empresa" value={company.nomeEmpresa} />
        <Row label="CNPJ" value={company.cnpj} />
        <Row label="Telefone/WhatsApp" value={company.telefone} />
        <Row label="Categoria da empresa" value={company.tipo} />
        <Row label="Qtd. de veículos" value={company.qtdVeiculos} />
      </Section>

      <Section title="Endereço">
        <Row label="CEP" value={company.endereco?.cep} />
        <Row label="Logradouro" value={company.endereco?.logradouro} />
        <Row label="Número" value={company.endereco?.numero} />
        <Row label="Bairro" value={company.endereco?.bairro} />
        <Row label="Complemento" value={company.endereco?.complemento} />
        <Row label="Cidade" value={company.endereco?.cidade} />
      </Section>

      <Section title="Bases / Filiais">
        <Box direction="column" width="95%" leftSpace="20px" gap="4px">
          {company.bases && company.bases.length > 0 ? (
            company.bases.map((base, i) => (
              <TextDefault key={i} size="12px" color={colors.silver}>
                • {base}
              </TextDefault>
            ))
          ) : (
            <TextDefault size="12px" color={colors.silver}>Nenhuma base/filial cadastrada</TextDefault>
          )}
        </Box>
      </Section>

      <Section title="Permissões">
        <Box direction="column" width="95%" leftSpace="20px" gap="4px">
          {sortedPermissions.map(p => (
            <TextDefault key={p.key} size="12px" color={colors.silver}>
              {p.value ? '✅' : '❌'} {p.label}
            </TextDefault>
          ))}
        </Box>
      </Section>

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
