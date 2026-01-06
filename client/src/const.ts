export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const APP_TITLE = import.meta.env.VITE_APP_TITLE || "App";

export const APP_LOGO =
  import.meta.env.VITE_APP_LOGO ||
  "https://placehold.co/128x128/E1E7EF/1F2937?text=App";

// OAuth removido - sistema usa autenticação simplificada
// Redireciona para a página inicial se houver erro de autenticação
export const getLoginUrl = () => {
  return window.location.origin;
};