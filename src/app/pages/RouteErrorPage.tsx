import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router';
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../components/ui/button';
import { WelivLogo } from '../components/WelivLogo';

/**
 * errorElement para rotas — substitui o ecrã genérico do React Router
 * (“Unexpected Application Error”, 404 cru, etc.).
 */
export function RouteErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  let title = 'Algo correu mal';
  let description = 'Ocorreu um erro inesperado. Tente novamente ou volte ao início.';
  let status: number | undefined;

  if (isRouteErrorResponse(error)) {
    status = error.status;
    if (error.status === 404) {
      title = 'Página não encontrada';
      description = 'Este endereço não existe na aplicação.';
    } else {
      title = `Erro ${error.status}`;
      description = error.statusText || description;
    }
  } else if (error instanceof Error) {
    description = error.message;
  }

  return (
    <div
      className="min-h-[100dvh] flex flex-col items-center justify-center p-6"
      style={{
        background: 'linear-gradient(145deg, #FFF8E7 0%, #FFE5B4 45%, #cfeef7 100%)',
      }}
    >
      <div className="w-full max-w-md rounded-2xl border bg-white/95 p-8 shadow-xl shadow-orange-900/10 text-center space-y-5">
        <div className="flex justify-center">
          <WelivLogo size="md" showText />
        </div>
        <div className="flex justify-center">
          <span
            className="inline-flex size-14 items-center justify-center rounded-2xl"
            style={{ background: 'linear-gradient(135deg, #FFF8E7, #FFE5B4)' }}
          >
            <AlertTriangle className="size-7 text-[#FFA500]" aria-hidden />
          </span>
        </div>
        {status != null && (
          <p className="text-4xl font-bold tabular-nums" style={{ color: '#FFA500' }}>
            {status}
          </p>
        )}
        <div className="space-y-2">
          <h1 className="text-lg font-semibold" style={{ color: '#4A3728' }}>
            {title}
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: '#6B5D53' }}>
            {description}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="size-4 mr-2" aria-hidden />
            Voltar
          </Button>
          <Button
            type="button"
            onClick={() => navigate('/login', { replace: true })}
            className="text-white border-0"
            style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}
          >
            <Home className="size-4 mr-2" aria-hidden />
            Ir para o login
          </Button>
        </div>
      </div>
    </div>
  );
}
