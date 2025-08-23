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
 * Formata uma string como data: DD/MM/AAAA
 * Exemplo:
 * - 1 → "1"
 * - 12 → "12"
 * - 123 → "12/3"
 * - 1234 → "12/34"
 * - 12345 → "12/34/5"
 * - 12345678 → "12/34/5678"
 */
const formatDate = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 8);

  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 4) {
    return `${digits.slice(0,2)}/${digits.slice(2)}`;
  }
  return `${digits.slice(0,2)}/${digits.slice(2,4)}/${digits.slice(4)}`;
};

const InputData = ({ value, onChange, placeholder = "DD/MM/AAAA" }) => {
  const handleChange = (e) => {
    const formatted = formatDate(e.target.value);
    onChange(formatted);
  };

  return (
    <StyledInput
      type="text"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      maxLength={10} // 8 dígitos + 2 barras
    />
  );
};

export default InputData;
