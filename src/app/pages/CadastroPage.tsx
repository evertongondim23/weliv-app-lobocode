import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { WelivLogo } from '../components/WelivLogo';
import { AlertCircle, Mail, Lock, Eye, EyeOff, User, IdCard, LogIn } from 'lucide-react';
import { API_BASE_URL } from '../config/api';
import { requestPatientRegistration } from '../services/registerPatient.service';

const inputBorder = { borderColor: 'rgba(255, 165, 0, 0.25)' } as const;

export function CadastroPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== passwordConfirm) {
      setError('As senhas não coincidem.');
      return;
    }

    if (password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres.');
      return;
    }

    setIsLoading(true);
    const result = await requestPatientRegistration({
      email: email.trim(),
      name: name.trim(),
      cpf: cpf.trim(),
      login: login.trim(),
      password,
      passwordConfirm,
    });
    setIsLoading(false);

    if (result.ok) {
      navigate('/login', { replace: false, state: { registered: true } });
      return;
    }

    if (result.kind === 'network') {
      setError(
        `Não foi possível falar com ${API_BASE_URL} (rede, URL incorreta ou CORS).`,
      );
      return;
    }

    setError(
      result.message ??
      (result.kind === 'conflict'
        ? 'E-mail, login ou CPF já estão em uso.'
        : 'Não foi possível concluir o cadastro. Verifique os dados.'),
    );
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #FFF8E7 0%, #FFE5B4 45%, #cfeef7 100%)',
      }}
    >
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full opacity-35 blur-3xl"
        style={{ background: 'radial-gradient(circle, #FFA500 0%, transparent 70%)' }}
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-[440px] space-y-6">
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
                Novo por aqui
              </p>
              <CardDescription className="text-base leading-relaxed" style={{ color: '#6B5D53' }}>
                Preencha os dados abaixo para criar sua conta.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-6 sm:px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <Label htmlFor="name" className="text-[#4A3728] font-medium">
                  Nome completo
                </Label>
                <div className="relative">
                  <User
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6B5D53]/70"
                    aria-hidden
                  />
                  <Input
                    id="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    minLength={2}
                    disabled={isLoading}
                    className="h-11 border-2 bg-white pl-10"
                    style={inputBorder}
                    placeholder="Digite seu nome completo"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#4A3728] font-medium">
                  E-mail
                </Label>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6B5D53]/70"
                    aria-hidden
                  />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-11 border-2 bg-white pl-10"
                    style={inputBorder}
                    placeholder="exemplo@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login" className="text-[#4A3728] font-medium">
                  Login
                </Label>
                <div className="relative">
                  <LogIn
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6B5D53]/70"
                    aria-hidden
                  />
                  <Input
                    id="login"
                    type="text"
                    autoComplete="username"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    required
                    minLength={3}
                    disabled={isLoading}
                    className="h-11 border-2 bg-white pl-10"
                    style={inputBorder}
                    placeholder="Insira seu login"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf" className="text-[#4A3728] font-medium">
                  CPF
                </Label>
                <div className="relative">
                  <IdCard
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6B5D53]/70"
                    aria-hidden
                  />
                  <Input
                    id="cpf"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-11 border-2 bg-white pl-10"
                    style={inputBorder}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-password" className="text-[#4A3728] font-medium">
                  Senha
                </Label>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6B5D53]/70"
                    aria-hidden
                  />
                  <Input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    disabled={isLoading}
                    className="h-11 border-2 bg-white pl-10 pr-11"
                    style={inputBorder}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-[#6B5D53] hover:bg-[#FFF8E7]"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password-confirm" className="text-[#4A3728] font-medium">
                  Confirmar senha
                </Label>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6B5D53]/70"
                    aria-hidden
                  />
                  <Input
                    id="password-confirm"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    required
                    minLength={8}
                    disabled={isLoading}
                    className="h-11 border-2 bg-white pl-10"
                    style={inputBorder}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="h-12 w-full text-base font-semibold shadow-md mt-2"
                disabled={isLoading}
                style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}
              >
                {isLoading ? 'Criando conta…' : 'Criar conta'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm" style={{ color: '#6B5D53' }}>
              Já tem conta?{' '}
              <Link to="/login" className="font-medium text-[#FFA500] hover:underline">
                Entrar
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
