import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader } from '../components/ui/card';
import {
  AlertCircle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Heart,
  User,
  Stethoscope,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Calendar,
  FileText,
  Bell,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';
import { WelivLogo } from '../components/WelivLogo';
import { toast } from 'sonner';
import { API_BASE_URL } from '../config/api';
import { SEED_DEMO_LOGINS } from '../config/seed-logins';
import type { UserRole } from '../types';
import type { LoginPortal } from '../lib/auth-routes';
import { loginPathForPortal } from '../lib/auth-routes';

const inputBorder = { borderColor: 'rgba(255, 165, 0, 0.25)' } as const;

const PATIENT_HIGHLIGHTS = [
  { icon: Calendar, text: 'Agenda e consultas em um só lugar' },
  { icon: FileText, text: 'Documentos e histórico sempre à mão' },
  { icon: Bell, text: 'Lembretes para você não perder nada' },
];

const PROFESSIONAL_HIGHLIGHTS = [
  { icon: Calendar, text: 'Agenda e disponibilidade centralizadas' },
  { icon: Users, text: 'Pacientes e prontuário na mesma vista' },
  { icon: FileText, text: 'Documentação alinhada à sua prática' },
];

const ADMIN_HIGHLIGHTS = [
  { icon: ShieldCheck, text: 'Visão operacional e financeira' },
  { icon: Users, text: 'Utilizadores, unidades e permissões' },
  { icon: FileText, text: 'Auditoria e relatórios' },
];

const PORTAL_UI: Record<
  LoginPortal,
  {
    heroBadge: string;
    titleMain: string;
    titleAccent: string;
    heroSubtitle: string;
    cardEyebrow: string;
    cardDescription: string;
  }
> = {
  patient: {
    heroBadge: 'Cuidado com a sua saúde, em um só lugar',
    titleMain: 'Sua clínica,',
    titleAccent: 'organizada.',
    heroSubtitle:
      'Agendamentos, documentos e comunicação — tudo com a cara acolhedora do weliv.',
    cardEyebrow: 'Bem-vindo de volta',
    cardDescription:
      'Entre na sua conta para gerenciar consultas, documentos e sua agenda.',
  },
  professional: {
    heroBadge: 'Gestão da sua prática clínica',
    titleMain: 'Seu consultório,',
    titleAccent: 'no controle.',
    heroSubtitle: 'Agenda, pacientes e registros num único painel profissional.',
    cardEyebrow: 'Área do profissional',
    cardDescription: 'Acesse com as credenciais do seu perfil de saúde.',
  },
  admin: {
    heroBadge: 'Governança da plataforma',
    titleMain: 'Administração',
    titleAccent: 'weliv.',
    heroSubtitle: 'Métricas, utilizadores e parâmetros do sistema.',
    cardEyebrow: 'Acesso administrativo',
    cardDescription: 'Utilize uma conta com perfil de administrador.',
  },
};

function highlightsForPortal(portal: LoginPortal) {
  if (portal === 'professional') return PROFESSIONAL_HIGHLIGHTS;
  if (portal === 'admin') return ADMIN_HIGHLIGHTS;
  return PATIENT_HIGHLIGHTS;
}

const OTHER_PORTAL_LINKS: {
  id: LoginPortal;
  label: string;
  Icon: LucideIcon;
}[] = [
  { id: 'patient', label: 'Paciente', Icon: User },
  { id: 'professional', label: 'Profissional de saúde', Icon: Stethoscope },
  { id: 'admin', label: 'Administração', Icon: ShieldCheck },
];

/** Rótulos curtos para os botões inline (mesma largura). */
const PORTAL_LINK_SHORT_LABEL: Record<LoginPortal, string> = {
  patient: 'Paciente',
  professional: 'Profissional',
  admin: 'Admin',
};

type LoginPageProps = {
  portal: LoginPortal;
};

export function LoginPage({ portal }: LoginPageProps) {
  /** E-mail ou login — o mesmo valor vai no campo `login` do body enviado à API. */
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const ui = PORTAL_UI[portal];
  const highlights = highlightsForPortal(portal);

  useEffect(() => {
    const st = location.state as { registered?: boolean } | null;
    if (st?.registered) {
      toast.success('Conta criada. Faça login com seu e-mail ou login e senha.');
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  const getRedirectPath = (role: UserRole) => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'professional') return '/professional/dashboard';
    return '/patient/dashboard';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(
      {
        login: loginIdentifier.trim(),
        password,
      },
      portal,
    );

    setIsLoading(false);

    if (result.ok) {
      navigate(getRedirectPath(result.user.role));
    } else if (result.reason === 'NETWORK_ERROR') {
      setError(
        `Não foi possível falar com ${API_BASE_URL} (rede, URL incorreta ou CORS).`,
      );
    } else if (result.reason === 'WRONG_PORTAL') {
      setError(
        result.message ??
          'Este perfil não corresponde a este portal de entrada. Utilize o link correto.',
      );
    } else {
      setError('E-mail/login ou senha inválidos');
    }
  };

  /** Payload idêntico ao formulário: { login, password } como no seed. */
  const handleDemoLogin = async (loginValue: string, loginPassword: string) => {
    setError('');
    setIsLoading(true);
    setLoginIdentifier(loginValue);
    setPassword(loginPassword);
    const result = await login(
      { login: loginValue.trim(), password: loginPassword },
      portal,
    );
    setIsLoading(false);
    if (result.ok) {
      navigate(getRedirectPath(result.user.role));
    } else if (result.reason === 'NETWORK_ERROR') {
      setError(
        `Não foi possível falar com ${API_BASE_URL} (rede, URL ou CORS).`,
      );
    } else if (result.reason === 'WRONG_PORTAL') {
      setError(
        result.message ??
          'Este perfil não corresponde a este portal de entrada. Utilize o link correto.',
      );
    } else {
      setError('E-mail/login ou senha inválidos (confira o seed na API).');
    }
  };

  return (
    <div
      className="min-h-screen grid grid-cols-1 lg:grid-cols-2 relative overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #FFF8E7 0%, #FFE5B4 45%, #cfeef7 100%)',
      }}
    >
      {/* Decoração global — centrada na linha entre as duas metades */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full opacity-35 blur-3xl max-lg:hidden"
        style={{ background: 'radial-gradient(circle, #FFA500 0%, transparent 70%)' }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full opacity-35 blur-3xl"
        style={{ background: 'radial-gradient(circle, #FFC700 0%, transparent 70%)' }}
        aria-hidden
      />

      {/* Coluna esquerda — 50% no desktop */}
      <aside
        className="relative z-10 hidden lg:flex min-h-0 min-w-0 w-full flex-col justify-center items-center px-8 xl:px-12 py-12 border-r"
        style={{ borderColor: 'rgba(255, 165, 0, 0.15)' }}
      >
        <div
          className="absolute inset-0 opacity-[0.35] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 20% 30%, rgba(255, 165, 0, 0.25) 0%, transparent 55%)',
          }}
          aria-hidden
        />

        <div className="relative w-full max-w-lg mx-auto space-y-8">
          <div
            className="inline-flex items-center gap-2 rounded-full border-2 px-4 py-1.5 text-xs font-medium shadow-sm bg-white/90"
            style={{ borderColor: 'rgba(255, 165, 0, 0.3)', color: '#6B5D53' }}
          >
            <Sparkles className="size-3.5 text-[#FFA500]" aria-hidden />
            {ui.heroBadge}
          </div>

          <div className="space-y-4">
            <WelivLogo size="lg" showText />
            <h1 className="text-3xl xl:text-4xl font-bold leading-tight tracking-tight" style={{ color: '#4A3728' }}>
              {ui.titleMain}{' '}
              <span style={{ color: '#FFA500' }}>{ui.titleAccent}</span>
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: '#6B5D53' }}>
              {ui.heroSubtitle}
            </p>
          </div>

          <ul className="space-y-4">
            {highlights.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: 'linear-gradient(135deg, #FFF8E7, #FFE5B4)' }}
                >
                  <Icon className="size-4 text-[#FFA500]" aria-hidden />
                </span>
                <span className="text-[15px] leading-snug pt-1" style={{ color: '#4A3728' }}>
                  {text}
                </span>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 pt-2 text-sm" style={{ color: '#6B5D53' }}>
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" aria-hidden />
            <span>Ambiente de demonstração — explore sem riscos</span>
          </div>
        </div>
      </aside>

      {/* Coluna direita — 50% no desktop */}
      <main className="relative z-10 flex min-w-0 w-full flex-col items-center justify-center p-4 sm:p-6 lg:px-8 lg:py-12 min-h-[100dvh] lg:min-h-screen">
        {/* Selo mobile */}
        <div className="flex justify-center w-full max-w-[440px] mb-4 lg:hidden">
          <div
            className="inline-flex items-center gap-2 rounded-full border-2 px-4 py-1.5 text-xs font-medium shadow-sm"
            style={{
              borderColor: 'rgba(255, 165, 0, 0.3)',
              background: 'rgba(255, 255, 255, 0.85)',
              color: '#6B5D53',
            }}
          >
            <Sparkles className="size-3.5 text-[#FFA500]" aria-hidden />
            {ui.heroBadge}
          </div>
        </div>

        <div className="w-full max-w-[440px] space-y-6">
          <Card className="overflow-hidden border-0 shadow-2xl shadow-orange-900/10">
            <div
              className="h-1.5 w-full"
              style={{ background: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 55%, #FFC700 100%)' }}
            />

            <CardHeader className="space-y-4 pb-2 pt-8 text-center px-6 sm:px-8">
              <div className="flex justify-center">
                <WelivLogo size="md" showText />
              </div>
              <div className="space-y-1.5">
                <p
                  className="text-sm font-semibold uppercase tracking-wide"
                  style={{ color: '#FFA500' }}
                >
                  {ui.cardEyebrow}
                </p>
                <CardDescription className="text-base leading-relaxed" style={{ color: '#6B5D53' }}>
                  {ui.cardDescription}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="px-6 sm:px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <Alert
                    variant="destructive"
                    className="border-2"
                    style={{ borderColor: 'rgba(220, 38, 38, 0.35)' }}
                  >
                    <AlertCircle className="size-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="login" className="text-[#4A3728] font-medium">
                    E-mail ou login
                  </Label>
                  <div className="relative">
                    <Mail
                      className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6B5D53]/70"
                      aria-hidden
                    />
                    <Input
                      id="login"
                      type="text"
                      autoComplete="username"
                      placeholder="ex.: exemplo@email.com ou seu login"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      required
                      minLength={1}
                      disabled={isLoading}
                      className="h-11 border-2 bg-white pl-10 transition-shadow focus-visible:ring-[#FFA500]/30"
                      style={inputBorder}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Label htmlFor="password" className="text-[#4A3728] font-medium">
                      Senha
                    </Label>
                    <button
                      type="button"
                      className="text-xs font-medium text-[#FFA500] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFA500]/40 rounded"
                      onClick={() =>
                        toast.info('Recuperação de senha em breve', {
                          description: 'Use o acesso demo abaixo para testar o app.',
                        })
                      }
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock
                      className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6B5D53]/70"
                      aria-hidden
                    />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-11 border-2 bg-white pl-10 pr-11 transition-shadow focus-visible:ring-[#FFA500]/30"
                      style={inputBorder}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-[#6B5D53] hover:bg-[#FFF8E7] hover:text-[#4A3728] transition-colors"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="h-12 w-full text-base font-semibold shadow-md transition-transform active:scale-[0.99]"
                  disabled={isLoading}
                  style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}
                >
                  {isLoading ? 'Entrando…' : 'Entrar'}
                </Button>

                {portal === 'patient' && (
                  <p className="text-center text-sm pt-1" style={{ color: '#6B5D53' }}>
                    Ainda não tem conta?{' '}
                    <Link to="/cadastro" className="font-medium text-[#FFA500] hover:underline">
                      Criar conta
                    </Link>
                  </p>
                )}
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" style={{ borderColor: 'rgba(74, 55, 40, 0.12)' }} />
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-wider">
                  <span className="bg-white px-3 font-medium" style={{ color: '#6B5D53' }}>
                    Ou experimente agora
                  </span>
                </div>
              </div>

              {portal === 'patient' && (
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() =>
                    handleDemoLogin(
                      SEED_DEMO_LOGINS.patient.login,
                      SEED_DEMO_LOGINS.patient.password,
                    )
                  }
                  className="group flex w-full flex-col items-center gap-2 rounded-2xl border-2 bg-white p-4 text-center transition-all hover:shadow-md hover:border-[#FFA500]/50 disabled:opacity-60"
                  style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
                >
                  <div
                    className="flex size-11 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #FFF8E7, #FFE5B4)' }}
                  >
                    <User className="size-5 text-[#FFA500]" aria-hidden />
                  </div>
                  <span className="text-sm font-semibold" style={{ color: '#4A3728' }}>
                    Conta de demonstração
                  </span>
                  <span className="text-xs leading-tight" style={{ color: '#6B5D53' }}>
                    Carregar credenciais de teste e explorar o app
                  </span>
                </button>
              )}

              {portal === 'professional' && (
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() =>
                    handleDemoLogin(
                      SEED_DEMO_LOGINS.professional.login,
                      SEED_DEMO_LOGINS.professional.password,
                    )
                  }
                  className="group flex w-full flex-col items-center gap-2 rounded-2xl border-2 bg-white p-4 text-center transition-all hover:shadow-md hover:border-[#FFA500]/50 disabled:opacity-60"
                  style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
                >
                  <div
                    className="flex size-11 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #FFF8E7, #FFE5B4)' }}
                  >
                    <Stethoscope className="size-5 text-[#FFA500]" aria-hidden />
                  </div>
                  <span className="text-sm font-semibold" style={{ color: '#4A3728' }}>
                    Demonstração — profissional
                  </span>
                  <span className="text-xs leading-tight" style={{ color: '#6B5D53' }}>
                    Painel da clínica
                  </span>
                </button>
              )}

              {portal === 'admin' && (
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() =>
                    handleDemoLogin(
                      SEED_DEMO_LOGINS.admin.login,
                      SEED_DEMO_LOGINS.admin.password,
                    )
                  }
                  className="group flex w-full flex-col items-center gap-2 rounded-2xl border-2 bg-white p-4 text-center transition-all hover:shadow-md hover:border-[#FFA500]/50 disabled:opacity-60"
                  style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
                >
                  <div
                    className="flex size-11 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #FFF8E7, #FFE5B4)' }}
                  >
                    <ShieldCheck className="size-5 text-[#FFA500]" aria-hidden />
                  </div>
                  <span className="text-sm font-semibold" style={{ color: '#4A3728' }}>
                    Demonstração — administrador
                  </span>
                  <span className="text-xs leading-tight" style={{ color: '#6B5D53' }}>
                    Painel administrativo
                  </span>
                </button>
              )}

              <div className="mt-6">
                <p
                  className="mb-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.1em]"
                  style={{ color: '#4A3728' }}
                >
                  Outro tipo de acesso
                </p>
                <nav
                  className="flex w-full flex-row flex-nowrap gap-2"
                  aria-label="Outros portais de entrada"
                >
                  {OTHER_PORTAL_LINKS.filter((p) => p.id !== portal).map(
                    ({ id, label, Icon }) => (
                      <Link
                        key={id}
                        to={loginPathForPortal(id)}
                        title={label}
                        className="flex min-h-[48px] flex-1 basis-0 items-center justify-center gap-2 rounded-xl border-2 bg-transparent px-3 text-sm font-semibold outline-none transition-colors hover:border-[#FF8C00] hover:text-[#C45A00] focus-visible:ring-2 focus-visible:ring-[#FFA500]/50 focus-visible:ring-offset-2"
                        style={{
                          borderColor: 'rgba(255, 140, 0, 0.55)',
                          color: '#4A3728',
                        }}
                      >
                        <Icon
                          className="size-4 shrink-0 text-[#E07800]"
                          strokeWidth={2.25}
                          aria-hidden
                        />
                        <span className="truncate">{PORTAL_LINK_SHORT_LABEL[id]}</span>
                      </Link>
                    ),
                  )}
                </nav>
              </div>

              <p className="mt-6 text-center text-xs leading-relaxed" style={{ color: '#6B5D53' }}>
                Ao continuar, você concorda com os termos de uso da demonstração.
              </p>
            </CardContent>
          </Card>

          <p
            className="flex items-center justify-center gap-1.5 text-center text-xs px-2"
            style={{ color: '#6B5D53' }}
          >
            <Heart className="size-3.5 text-[#FFA500] shrink-0" aria-hidden />
            Feito para cuidar de você com carinho e segurança
          </p>
        </div>
      </main>
    </div>
  );
}
