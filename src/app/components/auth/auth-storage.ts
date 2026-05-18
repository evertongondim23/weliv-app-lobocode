export const ACCESS_TOKEN_KEY = 'weliv_access_token';
export const REFRESH_TOKEN_KEY = 'weliv_refresh_token';
export const CURRENT_USER_KEY = 'currentUser';

export function clearAuthStorage(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
}
