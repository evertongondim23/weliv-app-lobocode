/**
 * Credenciais alinhadas ao prisma/seed.ts (weliv-api-lobocode).
 * O campo `login` é o mesmo enviado no body dos POST /auth/login,
 * /auth/login/profissional e /auth/login/admin (consoante o perfil).
 */
export const SEED_DEMO_LOGINS = {
  admin: {
    login: 'admin@weliv.com',
    password: 'AdminWeliv123',
  },
  /** Gestor de clínica — role ADMIN no seed da API. */
  clinic_admin: {
    login: 'gestorWeliv',
    password: 'GestorWeliv123',
  },
  professional: {
    login: 'ana.silva@clinica.com',
    password: 'AnaSilva123',
  },
  patient: {
    login: 'joao.santos@email.com',
    password: 'JoaoSantos123',
  },
} as const;
