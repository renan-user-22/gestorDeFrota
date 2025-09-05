import React from 'react';
import styled from 'styled-components';
import { colors } from '../../theme'; // Lembrando de importar o tema para usar as cores

const StyledInput = styled.input`
  width:${props => props.width || 'auto'};
  height: 30px;
  padding-left: 10px;
  border: 1px solid ${colors.silver};
  font-size: 14px;
  margin-bottom: 10px;
  margin-left: ${props => props.left || '0px'};
  border-radius: 3px;
`;

const formatTelefone = (value) => {
  const digits = value.replace(/\D/g, '');

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
};

const InputTelefone = ({ value, onChange }) => {
  const handleChange = (e) => {
    const inputValue = e.target.value;
    const formatted = formatTelefone(inputValue);
    onChange(formatted);
  };

  return (
    <StyledInput
      type="text"
      value={value}
      onChange={handleChange}
      placeholder="(00) 00000-0000"
      maxLength={15}
    />
  );
};

export default InputTelefone;
