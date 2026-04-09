/**
 * Credenciais alinhadas ao prisma/seed.ts (weliv-api-lobocode).
 * O campo `login` é o mesmo enviado no payload POST /auth/login.
 */
export const SEED_DEMO_LOGINS = {
  admin: {
    login: 'admin@weliv.com',
    password: 'AdminWeliv123',
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
