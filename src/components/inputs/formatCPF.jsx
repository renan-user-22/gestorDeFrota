import React from 'react';
import styled from 'styled-components';
import { colors } from '../../theme';

const StyledInput = styled.input`
  width: ${props => props.width || '100%'};
  height: 30px;
  padding-left: 10px;
  border: 1px solid ${colors.silver};
  font-size: 14px;
  margin-bottom: 10px;
  border-radius: 3px;
`;

/**
 * Formata um CPF progressivamente:
 * - até 3 dígitos: “123”
 * - até 6 dígitos: “123.456”
 * - até 9 dígitos: “123.456.789”
 * - até 11 dígitos: “123.456.789-01”
 */
const formatCPF = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length <= 3) {
    return digits;
  }
  if (digits.length <= 6) {
    return `${digits.slice(0,3)}.${digits.slice(3)}`;
  }
  if (digits.length <= 9) {
    return `${digits.slice(0,3)}.${digits.slice(3,6)}.${digits.slice(6)}`;
  }
  return `${digits.slice(0,3)}.${digits.slice(3,6)}.${digits.slice(6,9)}-${digits.slice(9)}`;
};

const InputCPF = ({ value, onChange, placeholder = "000.000.000-00" }) => {
  const handleChange = e => {
    const formatted = formatCPF(e.target.value);
    onChange(formatted);
  };

  return (
    <StyledInput
      type="text"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      maxLength={14} // 11 dígitos + 3 de máscara
    />
  );
};

export default InputCPF;
