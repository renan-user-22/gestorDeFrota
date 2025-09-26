// theme.js

// 1) Paleta (tokens base) — nomes objetivos, fáceis de escalar
const palette = {
  white:  '#FFFFFF',
  black:  '#000000',
  gray800:'#2C2C2C', // era darkGray
  gray700:'#444444', // era darkGrayTwo
  orange500:'#F63B2A', // era orange
  yellow500:'#EEBE2C', // era yellow
};

// 2) Tokens semânticos — "papéis" na interface
// Obs.: mantenha o mínimo necessário agora; amplie conforme surgirem necessidades.
const semantic = {
  brand: {
    primary: palette.orange500,
    onPrimary: palette.white,
  },
  accent: {
    warning: palette.yellow500,
  },
  text: {
    primary: palette.black,
    secondary: palette.gray700,
    inverse: palette.white,
  },
  surface: {
    canvas: palette.white,   // fundo geral (app)
    raised: '#F7F7F7',       // leve contraste p/ cartões (pode ajustar depois)
    border: '#E6E6E6',       // borda neutra (pode ajustar depois)
  },
  state: {
    success: '#22C55E',      // placeholder (pode trocar por paleta própria)
    info:    '#3B82F6',
    danger:  '#EF4444',
    warning: palette.yellow500,
  },
};

// 3) Export público recomendado
export const theme = {
  palette,
  color: semantic, // `theme.color.brand.primary`, `theme.color.text.primary`, etc.
};

// 4) Mapa de compatibilidade (LEGADO) — sem console.warn
// Use para migração gradual via find/replace, evitando quebrar o app.
export const colors = {
  // antigos -> novos
  orange:      palette.orange500,
  yellow:      palette.yellow500,
  black:       palette.black,
  darkGrayTwo: palette.gray700,
  darkGray:    palette.gray800,
  silver:      palette.white, // renomeado corretamente para "white"
};

export default theme;
