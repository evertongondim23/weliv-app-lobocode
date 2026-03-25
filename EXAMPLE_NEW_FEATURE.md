# 📝 Exemplo: Criando uma Nova Feature do Zero

Este guia mostra como criar uma nova funcionalidade seguindo o padrão de componentes Weliv.

## 🎯 Objetivo: Criar uma Página de "Meu Perfil"

Vamos criar uma página onde o usuário pode ver e editar seu perfil.

---

## Passo 1: Planejar os Componentes

**O que vamos precisar:**
- Header de boas-vindas (✅ `WelcomeCard`)
- Card de informações pessoais (➕ novo componente `ProfileInfoCard`)
- Card de estatísticas (✅ `StatCard`)
- Seção de configurações (✅ `SectionCard`)
- Botão de ação (✅ `ActionButton`)

---

## Passo 2: Criar Componente Novo (se necessário)

Se precisar de um componente novo que será reutilizado:

```tsx
// /src/app/components/common/ProfileInfoCard.tsx
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Edit } from 'lucide-react';

interface ProfileInfoCardProps {
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  onEdit: () => void;
}

export function ProfileInfoCard({ 
  name, 
  email, 
  phone, 
  avatar,
  onEdit 
}: ProfileInfoCardProps) {
  return (
    <Card className="border-0 shadow-md overflow-hidden">
      <div 
        className="h-2 w-full" 
        style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }} 
      />
      <CardContent className="pt-6">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="size-20 border-2" style={{ borderColor: '#FFA500' }}>
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback 
              style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)', color: 'white' }}
            >
              {name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-1" style={{ color: '#4A3728' }}>
              {name}
            </h3>
            <p className="text-sm" style={{ color: '#6B5D53' }}>
              Paciente
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <InfoRow label="Email" value={email} />
          <InfoRow label="Telefone" value={phone} />
        </div>

        <Button 
          className="w-full"
          onClick={onEdit}
          style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}
        >
          <Edit className="size-4 mr-2" />
          Editar Perfil
        </Button>
      </CardContent>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b" 
         style={{ borderColor: 'rgba(255, 165, 0, 0.1)' }}>
      <span className="text-sm font-medium" style={{ color: '#6B5D53' }}>
        {label}
      </span>
      <span className="text-sm font-semibold" style={{ color: '#4A3728' }}>
        {value}
      </span>
    </div>
  );
}
```

**Adicionar ao index.ts:**
```tsx
// /src/app/components/common/index.ts
export { ProfileInfoCard } from './ProfileInfoCard';
```

---

## Passo 3: Criar a Página

```tsx
// /src/app/pages/patient/PatientProfile.tsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { User, Award, Calendar, FileText } from 'lucide-react';
import { 
  WelcomeCard, 
  ProfileInfoCard,
  StatCard,
  SectionCard,
  ActionButton
} from '../../components/common';

export function PatientProfile() {
  const { user } = useAuth();
  const { appointments, documents } = useData();
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Calcular estatísticas
  const myAppointments = appointments.filter(apt => apt.patientId === user?.id);
  const completedAppointments = myAppointments.filter(apt => apt.status === 'completed');
  const myDocuments = documents.filter(doc => doc.patientId === user?.id);

  const stats = [
    {
      title: 'Consultas Realizadas',
      value: completedAppointments.length,
      description: 'Total histórico',
      icon: Calendar,
      gradient: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)',
    },
    {
      title: 'Documentos',
      value: myDocuments.length,
      description: 'Exames e receitas',
      icon: FileText,
      gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    },
    {
      title: 'Avaliações',
      value: '4.8',
      description: 'Média geral',
      icon: Award,
      gradient: 'linear-gradient(135deg, #FFC700 0%, #FF8C00 100%)',
    },
  ];

  const preferences = [
    { 
      icon: Calendar, 
      label: 'Minhas Preferências de Consulta', 
      onClick: () => {} 
    },
    { 
      icon: FileText, 
      label: 'Histórico Médico Completo', 
      onClick: () => {} 
    },
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <WelcomeCard
        icon={User}
        title="Meu Perfil"
        subtitle="Gerencie suas informações pessoais"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda - Info do Perfil */}
        <div className="lg:col-span-1">
          <ProfileInfoCard
            name={user?.name || ''}
            email={user?.email || ''}
            phone="+55 11 99999-9999"
            avatar={(user as any)?.avatar}
            onEdit={() => setShowEditDialog(true)}
          />
        </div>

        {/* Coluna Direita - Estatísticas e Ações */}
        <div className="lg:col-span-2 space-y-6">
          {/* Estatísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                description={stat.description}
                icon={stat.icon}
                gradient={stat.gradient}
              />
            ))}
          </div>

          {/* Ações Rápidas */}
          <SectionCard
            title="Configurações"
            description="Personalize sua experiência"
          >
            <div className="space-y-3">
              {preferences.map((pref, index) => (
                <ActionButton
                  key={index}
                  icon={pref.icon}
                  label={pref.label}
                  onClick={pref.onClick}
                  fullWidth
                />
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
```

---

## Passo 4: Adicionar Rota

```tsx
// /src/app/routes.tsx
import { PatientProfile } from './pages/patient/PatientProfile';

// Adicionar na configuração de rotas:
{
  path: "profile",
  Component: PatientProfile,
}
```

---

## Passo 5: Adicionar ao Menu de Navegação

```tsx
// /src/app/components/Layout.tsx
const patientNav = [
  // ... rotas existentes
  { icon: User, label: 'Perfil', path: '/patient/profile' },
];
```

---

## 📊 Resultado Final

Agora você tem:
- ✅ Nova página de perfil totalmente funcional
- ✅ Componente reutilizável `ProfileInfoCard`
- ✅ Integração com navegação
- ✅ Design consistente com o resto do app
- ✅ Totalmente responsivo

---

## 🎨 Customizações Comuns

### Adicionar Dialog de Edição

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

// No componente:
const [showEditDialog, setShowEditDialog] = useState(false);

<Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle style={{ color: '#4A3728' }}>
        Editar Perfil
      </DialogTitle>
    </DialogHeader>
    
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input 
          id="name" 
          defaultValue={user?.name}
          className="border-2"
          style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email"
          defaultValue={user?.email}
          className="border-2"
          style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
        />
      </div>
    </div>

    <DialogFooter>
      <Button 
        variant="outline" 
        onClick={() => setShowEditDialog(false)}
      >
        Cancelar
      </Button>
      <Button 
        style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}
        onClick={handleSave}
      >
        Salvar
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Adicionar Abas (Tabs)

```tsx
import { StyledTabs } from '../../components/common';

<StyledTabs
  tabs={[
    {
      value: 'info',
      label: 'Informações',
      content: <ProfileInfo />
    },
    {
      value: 'security',
      label: 'Segurança',
      content: <SecuritySettings />
    },
    {
      value: 'preferences',
      label: 'Preferências',
      content: <UserPreferences />
    }
  ]}
/>
```

---

## ✅ Checklist de Qualidade

Antes de considerar a feature pronta:

- [ ] Página é responsiva (mobile, tablet, desktop)
- [ ] Usa componentes reutilizáveis quando possível
- [ ] Segue paleta de cores Weliv
- [ ] Tem tratamento de estados vazios
- [ ] Tem feedback de ações (toasts, loading states)
- [ ] Código está limpo e comentado
- [ ] Props estão tipadas com TypeScript
- [ ] Novo componente foi adicionado ao index.ts
- [ ] Funciona offline (dados mockados)

---

## 🚀 Próximas Melhorias

Ideias para expandir a feature:

1. **Upload de Foto de Perfil**
   - Usar input de arquivo
   - Preview da imagem
   - Salvar no localStorage

2. **Validação de Formulário**
   - Usar react-hook-form
   - Validar email, telefone
   - Mensagens de erro

3. **Preferências Avançadas**
   - Notificações push
   - Tema claro/escuro
   - Idioma

4. **Histórico de Atividades**
   - Timeline de ações
   - Logs de login
   - Alterações de perfil

---

**Dica:** Use este exemplo como referência para criar qualquer nova funcionalidade!
