import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { WelivLogo } from '../components/WelivLogo';

export function NotFoundPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const homePath = user
    ? user.role === 'professional'
      ? '/professional/dashboard'
      : '/patient/dashboard'
    : '/login';

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 py-12 text-center">
      <div className="mb-6">
        <WelivLogo size="md" showText />
      </div>
      <p className="text-6xl font-bold tabular-nums" style={{ color: '#FFA500' }} aria-hidden>
        404
      </p>
      <h1 className="mt-4 text-xl font-semibold" style={{ color: '#4A3728' }}>
        Página não encontrada
      </h1>
      <p className="mt-2 text-sm max-w-md leading-relaxed" style={{ color: '#6B5D53' }}>
        O endereço não existe ou foi movido. Verifique o link ou volte ao início.
      </p>
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Button type="button" variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="size-4 mr-2" aria-hidden />
          Voltar
        </Button>
        <Button
          type="button"
          onClick={() => navigate(homePath)}
          className="text-white border-0 shadow-md shadow-orange-500/20"
          style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}
        >
          <Home className="size-4 mr-2" aria-hidden />
          {user ? 'Ir para o início' : 'Ir para o login'}
        </Button>
      </div>
    </div>
  );
}
