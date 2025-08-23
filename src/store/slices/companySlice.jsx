import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  nomeEmpresa: '',
  cnpj: '',
  telefone: '',
  endereco: { logradouro: '', numero: '', bairro: '', complemento: '' },
  tipo: '', // Transportadora, Locadora, etc.
  cargos: [], // lista dinâmica [{ nome: '', acesso: '' }]
  extras: { site: '', email: '', status: '' }, // opcional + status
};

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setNomeEmpresa: (state, { payload }) => {
      state.nomeEmpresa = payload;
    },
    setCnpj: (state, { payload }) => {
      state.cnpj = payload;
    },
    setTelefone: (state, { payload }) => {
      state.telefone = payload;
    },
    setTipo: (state, { payload }) => {
      state.tipo = payload;
    },
    setEnderecoField: (state, { payload }) => {
      const { field, value } = payload; // logradouro | numero | bairro | complemento
      state.endereco[field] = value;
    },
    setExtraField: (state, { payload }) => {
      const { field, value } = payload; // site | email | status
      state.extras[field] = value;
    },
    addCargo: (state, { payload }) => {
      const { nome, acesso } = payload;
      if (
        nome &&
        acesso &&
        !state.cargos.some(
          (c) =>
            c.nome.toLowerCase() === nome.toLowerCase() &&
            c.acesso === acesso
        )
      ) {
        state.cargos.push({ nome, acesso });
      }
    },
    removeCargo: (state, { payload }) => {
      state.cargos = state.cargos.filter(
        (c) => !(c.nome === payload.nome && c.acesso === payload.acesso)
      );
    },
    resetCompany: () => initialState,
  },
});

export const {
  setNomeEmpresa,
  setCnpj,
  setTelefone,
  setTipo,
  setEnderecoField,
  setExtraField,
  addCargo,
  removeCargo,
  resetCompany,
} = companySlice.actions;

export default companySlice.reducer;
