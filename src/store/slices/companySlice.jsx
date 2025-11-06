import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  nomeEmpresa: '',
  cnpj: '',
  telefone: '',
  tipo: '',
  qtdVeiculos: '',
  endereco: {
    cep: '',
    logradouro: '',
    numero: '',
    bairro: '',
    complemento: '',
    cidade: '',
    // uf: '' // se desejar usar depois
  },
  extras: {},
  // IMPORTANTE: Matriz NÃO é base/filial → não entra aqui
  bases: [],
};

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setNomeEmpresa(state, action) {
      state.nomeEmpresa = action.payload || '';
    },
    setCnpj(state, action) {
      state.cnpj = action.payload || '';
    },
    setTelefone(state, action) {
      state.telefone = action.payload || '';
    },
    setTipo(state, action) {
      state.tipo = action.payload || '';
    },
    setQtdVeiculos(state, action) {
      // armazena como string numérica (mantém form simples; valida na gravação se precisar)
      state.qtdVeiculos = action.payload || '';
    },
    setEnderecoField(state, action) {
      const { field, value } = action.payload || {};
      if (!field) return;
      state.endereco[field] = value ?? '';
    },
    setExtrasField(state, action) {
      const { field, value } = action.payload || {};
      if (!field) return;
      state.extras[field] = value;
    },
    setBases(state, action) {
      const arr = Array.isArray(action.payload) ? action.payload : [];
      // Garante que "Matriz" não entre por engano
      state.bases = arr
        .map(b => String(b).trim())
        .filter(b => b && b.toLowerCase() !== 'matriz')
        // evita duplicatas mantendo a ordem
        .filter((b, i, self) => self.indexOf(b) === i);
    },
    addBase(state, action) {
      const base = String(action.payload || '').trim();
      if (!base) return;
      // Segurança: impede "Matriz" como base/filial
      if (base.toLowerCase() === 'matriz') return;
      if (!state.bases.includes(base)) state.bases.push(base);
    },
    removeBase(state, action) {
      const index = Number(action.payload);
      if (Number.isInteger(index) && index >= 0 && index < state.bases.length) {
        state.bases.splice(index, 1);
      }
    },
    resetCompany() {
      return { ...initialState };
    },
  },
});

export const {
  setNomeEmpresa,
  setCnpj,
  setTelefone,
  setTipo,
  setQtdVeiculos,
  setEnderecoField,
  setExtrasField,
  setBases,
  addBase,
  removeBase,
  resetCompany,
} = companySlice.actions;

export default companySlice.reducer;
