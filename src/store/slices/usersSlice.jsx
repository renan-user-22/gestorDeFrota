import { createSlice } from '@reduxjs/toolkit';

const genMatricula = (existing = []) => {
  let m;
  do {
    m = Math.floor(1000000 + Math.random() * 9000000); // 7 dígitos
  } while (existing.some(u => u.matricula === m));
  return m;
};

const initialUser = (existing) => ({
  matricula: genMatricula(existing),
  nome: '',
  sobrenome: '',
  cpf: '',
  email: '',
  senha: '',
  cargoNome: '',
  horarioEntrada: '',
  horarioSaida: '',
  contato: '',
  status: '',           // Ativo, Inativo, ...       // data
  tipoAcesso: 'gestao', // 'gestao' | 'motorista'
  // Campos CNH (aparecem quando tipoAcesso === 'motorista')
  cnhNumero: '',
  cnhValidade: '',
  cnhCategoria: '',
  cnhPrimeiraHab: '',
  cnhObs: '',
  // Observações gerais
  obs: '',
});

const initialState = {
  list: [],
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, { payload }) => {
      state.list.push({
        ...initialUser(state.list),
        ...payload, // aqui vem os dados preenchidos do form
      });
    },
    removeUser: (state, { payload }) => {
      state.list = state.list.filter((_, i) => i !== payload);
    },
    updateUserField: (state, { payload }) => {
      const { index, field, value } = payload;
      if (state.list[index]) state.list[index][field] = value;
    },
    resetUsers: () => ({
      list: [initialUser([])],
    }),
  },
});

export const { addUser, removeUser, updateUserField, resetUsers } = usersSlice.actions;
export default usersSlice.reducer;
