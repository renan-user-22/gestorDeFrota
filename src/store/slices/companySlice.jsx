import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nomeEmpresa: "",
  cnpj: "",
  telefone: "",
  endereco: {
    logradouro: "",
    numero: "",
    bairro: "",
    complemento: "",
    cidade: ""
  },
  tipo: "",
  extras: {
    status: "",
    email: "",
    site: ""
  },
  cargos: [],
  permissoes: {
    abastecimento: false,
    checklist: false,
    contabilidade: false,
    cursos: false,
    fleetIA: false,
    juridico: false,
    localizacao: false,
    manutencao: false,
    multas: false,
  },
  bases: [] // <-- Novo campo
};

export const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setNomeEmpresa(state, action) {
      state.nomeEmpresa = action.payload;
    },
    setCnpj(state, action) {
      state.cnpj = action.payload;
    },
    setTelefone(state, action) {
      state.telefone = action.payload;
    },
    setEnderecoField(state, action) {
      const { field, value } = action.payload;
      state.endereco[field] = value;
    },
    setTipo(state, action) {
      state.tipo = action.payload;
    },
    setExtrasField(state, action) {
      const { field, value } = action.payload;
      state.extras[field] = value;
    },
    setCargos(state, action) {
      state.cargos = action.payload;
    },
    addCargo(state, action) {
      state.cargos.push(action.payload);
    },
    removeCargo(state, action) {
      state.cargos = state.cargos.filter((_, i) => i !== action.payload);
    },
    setPermissoes(state, action) {
      state.permissoes = { ...state.permissoes, ...action.payload };
    },
    // Novos reducers para bases
    setBases(state, action) {
      state.bases = action.payload;
    },
    addBase(state, action) {
      state.bases.push(action.payload);
    },
    removeBase(state, action) {
      state.bases = state.bases.filter((_, i) => i !== action.payload);
    },
    resetCompany(state) {
      return initialState;
    },
  },
});

export const {
  setNomeEmpresa,
  setCnpj,
  setTelefone,
  setEnderecoField,
  setTipo,
  setExtrasField,
  setCargos,
  addCargo,
  removeCargo,
  setPermissoes,
  setBases,
  addBase,
  removeBase,
  resetCompany,
} = companySlice.actions;

export default companySlice.reducer;
