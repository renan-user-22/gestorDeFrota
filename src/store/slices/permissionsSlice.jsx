import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  abastecimento: false,
  checklist: false,
  fleetIA: false,
  manutencao: false,
  contabilidade: false,
  multas: false,
  localizacao: false,
  juridico: false,
  cursos: false,
};

const permissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    setPermission: (state, { payload }) => {
      const { key, value } = payload; // ex: { key: 'checklist', value: true }
      if (key in state) state[key] = Boolean(value);
    },
    togglePermission: (state, { payload }) => {
      if (payload in state) state[payload] = !state[payload];
    },
    resetPermissions: () => initialState,
  },
});

export const { setPermission, togglePermission, resetPermissions } = permissionsSlice.actions;
export default permissionsSlice.reducer;
