import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { WelivLogo } from './WelivLogo';
import { 
  Home, 
  Search, 
  Calendar, 
  FileText, 
  Bell, 
  LogOut, 
  Menu, 
  Users,
  DollarSign,
  Settings,
  ClipboardList,
} from 'lucide-react';

interface NavItem {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  path: string;
  badge?: number;
}

export function Layout() {
  const { user, logout } = useAuth();
  const { notifications } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => n.userId === user?.id && !n.read).length;

  const patientNav: NavItem[] = [
    { icon: Home, label: 'Início', path: '/patient/dashboard' },
    { icon: Search, label: 'Buscar', path: '/patient/search' },
    { icon: Calendar, label: 'Consultas', path: '/patient/appointments' },
    { icon: FileText, label: 'Documentos', path: '/patient/documents' },
    { icon: Bell, label: 'Notificações', path: '/patient/notifications', badge: unreadCount },
  ];

  const professionalNav: NavItem[] = [
    { icon: Home, label: 'Painel', path: '/professional/dashboard' },
    { icon: Calendar, label: 'Agenda', path: '/professional/schedule' },
    { icon: Users, label: 'Pacientes', path: '/professional/patients' },
    { icon: ClipboardList, label: 'Prontuário', path: '/professional/medical-records' },
    { icon: DollarSign, label: 'Financeiro', path: '/professional/financial' },
    { icon: Settings, label: 'Configurações', path: '/professional/settings' },
  ];

  const navItems = user?.role === 'professional' ? professionalNav : patientNav;
  const bottomNavItems = user?.role === 'professional'
    ? navItems.filter((item) => item.path !== '/professional/settings')
    : navItems.filter(item => item.path !== '/patient/notifications');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavLink = ({ item, mobile = false }: { item: NavItem; mobile?: boolean }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;

    if (mobile) {
      return (
        <button
          type="button"
          className={`w-full min-h-[48px] flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 ${
            isActive 
              ? 'text-white shadow-md shadow-orange-500/20' 
              : 'text-[#4A3728] hover:bg-[#FFF8E7]/90 active:bg-[#FFE5B4]/50'
          }`}
          style={isActive ? { background: 'linear-gradient(135deg, #FFA500, #FF8C00)' } : {}}
          onClick={() => {
            navigate(item.path);
            setMobileMenuOpen(false);
          }}
        >
          <Icon className="size-[22px] shrink-0" strokeWidth={2.5} />
          <span className="font-medium text-[15px] leading-snug text-left">{item.label}</span>
          {item.badge && item.badge > 0 && (
            <Badge 
              variant="destructive" 
              className="ml-auto"
              style={isActive ? { background: 'white', color: '#FFA500' } : {}}
            >
              {item.badge}
            </Badge>
          )}
        </button>
      );
    }

    return (
      <Button
        variant={isActive ? 'default' : 'ghost'}
        className={mobile ? 'w-full justify-start' : ''}
        onClick={() => {
          navigate(item.path);
          if (mobile) setMobileMenuOpen(false);
        }}
      >
        <Icon className="size-4 mr-2" />
        {item.label}
        {item.badge && item.badge > 0 && (
          <Badge variant="destructive" className="ml-2">
            {item.badge}
          </Badge>
        )}
      </Button>
    );
  };

  return (
    <div className="min-h-screen" style={{ background: '#FAFAFA' }}>
      {/* Desktop Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <WelivLogo size="sm" showText={true} />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              {navItems.map(item => (
                <NavLink key={item.path} item={item} />
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold" style={{ color: '#4A3728' }}>{user?.name}</p>
                  <p className="text-xs capitalize" style={{ color: '#6B5D53' }}>
                    {user?.role === 'professional' ? 'Profissional' : 'Paciente'}
                  </p>
                </div>
                <Avatar className="border-2" style={{ borderColor: '#FFA500' }}>
                  <AvatarImage src={(user as any)?.avatar} alt={user?.name} />
                  <AvatarFallback style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)', color: 'white' }}>
                    {(user?.name ?? '')
                      .split(' ')
                      .filter(Boolean)
                      .map((n) => n[0])
                      .join('') || '?'}
                  </AvatarFallback>
                </Avatar>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="hidden md:inline-flex border-2 gap-2 shrink-0"
                style={{ borderColor: 'rgba(255, 165, 0, 0.28)', color: '#4A3728' }}
              >
                <LogOut className="size-4" />
                Sair
              </Button>

              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="Abrir menu"
                    className="lg:hidden h-11 w-11 min-h-[44px] min-w-[44px] rounded-xl border-2 border-[rgba(255,165,0,0.28)] bg-[#FFF8E7] text-[#4A3728] shadow-sm hover:bg-[#FFE5B4]/55 hover:border-[rgba(255,165,0,0.45)] active:scale-[0.98] transition-all"
                  >
                    <Menu className="size-5" strokeWidth={2.25} />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="gap-0 w-[min(20rem,calc(100vw-1rem))] max-w-none p-0 flex flex-col border-l-2 border-[rgba(255,165,0,0.18)] shadow-xl"
                >
                  <SheetHeader className="px-5 pt-8 pb-5 pr-14 border-b border-[rgba(74,55,40,0.08)] space-y-0 text-left">
                    <div className="flex items-center gap-3">
                      <WelivLogo size="sm" showText={false} className="gap-0" />
                      <SheetTitle
                        className="text-lg font-semibold tracking-tight"
                        style={{ color: '#4A3728' }}
                      >
                        Menu
                      </SheetTitle>
                    </div>
                  </SheetHeader>

                  <div className="flex flex-col flex-1 min-h-0 overflow-y-auto px-4 pb-6 pt-5 gap-6">
                    {/* User Info */}
                    <div
                      className="flex items-center gap-3.5 rounded-2xl px-4 py-4 border-2 bg-[#FFF8E7]/70"
                      style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
                    >
                      <Avatar className="size-12 shrink-0 border-2" style={{ borderColor: '#FFA500' }}>
                        <AvatarImage src={(user as any)?.avatar} alt={user?.name} />
                        <AvatarFallback style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)', color: 'white' }}>
                          {(user?.name ?? '')
                            .split(' ')
                            .filter(Boolean)
                            .map((n) => n[0])
                            .join('') || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <p className="font-semibold truncate" style={{ color: '#4A3728' }}>{user?.name}</p>
                        <p className="text-sm capitalize" style={{ color: '#6B5D53' }}>
                          {user?.role === 'professional' ? 'Profissional' : 'Paciente'}
                        </p>
                      </div>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-1.5 flex-1">
                      {navItems.map(item => (
                        <NavLink key={item.path} item={item} mobile />
                      ))}
                    </nav>

                    {/* Logout */}
                    <button
                      type="button"
                      className="w-full min-h-[48px] flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 text-[#4A3728] border-2 bg-white hover:bg-[#FFF8E7] active:bg-[#FFE5B4]/40 shadow-sm"
                      style={{ borderColor: 'rgba(255, 165, 0, 0.28)' }}
                      onClick={handleLogout}
                    >
                      <LogOut className="size-[22px] shrink-0" strokeWidth={2.25} />
                      <span>Sair</span>
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50 shadow-lg">
        <div className="flex items-center justify-around h-16">
          {bottomNavItems.map(item => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <button
                key={item.path}
                className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
                  isActive ? '' : ''
                }`}
                style={{ 
                  color: isActive ? '#FFA500' : '#6B5D53',
                }}
                onClick={() => navigate(item.path)}
              >
                <div className="relative">
                  <Icon className="size-5" strokeWidth={isActive ? 2.5 : 2} />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 text-white text-xs rounded-full size-4 flex items-center justify-center"
                          style={{ background: '#FFA500' }}>
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom padding for mobile navigation */}
      <div className="lg:hidden h-16" />
    </div>
  );
}