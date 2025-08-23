// src/components/InputCNPJ.jsx
import React from 'react';
import styled from 'styled-components';
import { colors } from '../../theme'; // Lembrando de importar o tema para usar as cores

const StyledInput = styled.input`
   width:${props => props.width || '100%'};
    height: 30px;
    padding-left: 10px;
    border: 1px solid ${colors.silver};
    font-size: 14px;
    margin-bottom: 10px;
    border-radius:3px;
`;

/**
 * formata progressivamente uma string de dígitos em CNPJ:
 *  - até 2 dígitos: “12”
 *  - até 5 dígitos: “12.345”
 *  - até 8 dígitos: “12.345.678”
 *  - até 12 dígitos: “12.345.678/1234”
 *  - até 14 dígitos: “12.345.678/1234-56”
 */
const formatCNPJ = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 14);

  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 5) {
    return `${digits.slice(0,2)}.${digits.slice(2)}`;
  }
  if (digits.length <= 8) {
    return `${digits.slice(0,2)}.${digits.slice(2,5)}.${digits.slice(5)}`;
  }
  if (digits.length <= 12) {
    return `${digits.slice(0,2)}.${digits.slice(2,5)}.${digits.slice(5,8)}/${digits.slice(8)}`;
  }
  return `${digits.slice(0,2)}.${digits.slice(2,5)}.${digits.slice(5,8)}/${digits.slice(8,12)}-${digits.slice(12)}`;
};

const InputCNPJ = ({ value, onChange, placeholder = "00.000.000/0000-00" }) => {
  const handleChange = e => {
    const formatted = formatCNPJ(e.target.value);
    onChange(formatted);
  };

  return (
    <StyledInput
      type="text"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      maxLength={18}  // 14 dígitos + 4 caracteres de máscara
    />
  );
};

export default InputCNPJ;
