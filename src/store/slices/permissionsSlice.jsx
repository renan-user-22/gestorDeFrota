import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // padrão: tudo TRUE, exceto Fleet IA e Multas (e Protect) = FALSE
  abastecimento: true,
  financeiro: true, 
  checklist: true,
  fleetIA: false,
  manutencao: true,
  contabilidade: true,
  multas: false,
  protect: false, // nova permissão acoplada a "multas"
  localizacao: true,
  juridico: true,
  cursos: true,
};

const permissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    setPermission: (state, { payload }) => {
      const { key, value } = payload; // ex: { key: 'checklist', value: true }
      if (!(key in state)) return;

      const val = Boolean(value);

      // Acoplamento Multas <-> Protect
      if (key === 'multas' || key === 'protect') {
        state.multas = val;
        state.protect = val;
        return;
      }

      state[key] = val;
    },

    togglePermission: (state, { payload }) => {
      if (!(payload in state)) return;

      // Acoplamento Multas <-> Protect
      if (payload === 'multas' || payload === 'protect') {
        const newVal = !state[payload];
        state.multas = newVal;
        state.protect = newVal;
        return;
      }

      state[payload] = !state[payload];
    },

    resetPermissions: () => initialState,
  },
});

export const { setPermission, togglePermission, resetPermissions } = permissionsSlice.actions;
export default permissionsSlice.reducer;
