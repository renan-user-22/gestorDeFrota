import React from 'react';
import styled from 'styled-components';
import { colors } from '../../theme';

const StyledInput = styled.input`
  width: ${props => props.width || '100%'};
  height: 40px;
  padding-left: 10px;
  border: 1px solid ${colors.silver};
  font-size: 14px;
  margin-bottom: 10px;
  border-radius: 7px;
`;

/**
 * Formata um número para valor monetário em reais
 * Ex: "1234" => "R$ 12,34"
 */
const formatCurrency = (value) => {
  const numeric = value.replace(/\D/g, '');
  const float = (parseInt(numeric, 10) / 100).toFixed(2);

  // Adiciona pontos de milhar e vírgula para centavos
  return 'R$ ' + float.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const InputValorReais = ({ value, onChange, placeholder = "R$ 0,00" }) => {
  const handleChange = (e) => {
    const formatted = formatCurrency(e.target.value);
    onChange(formatted);
  };

  return (
    <StyledInput
      type="text"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
    />
  );
};

export default InputValorReais;
