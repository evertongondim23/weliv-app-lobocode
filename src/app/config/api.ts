/** Base URL da API Nest (weliv-api-lobocode). Em dev: http://localhost:30100 */
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:30100'
).replace(/\/$/, '');
