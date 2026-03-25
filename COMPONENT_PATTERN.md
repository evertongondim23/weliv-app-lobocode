# Padrão de Desenvolvimento de Componentes - Weliv

## 📋 Visão Geral

Este documento descreve o padrão de desenvolvimento de componentes do sistema Weliv, seguindo boas práticas de componentização e reutilização de código.

## 🏗️ Estrutura de Componentes

```
/src/app/components/
├── common/              # Componentes reutilizáveis
│   ├── WelcomeCard.tsx
│   ├── StatCard.tsx
│   ├── QuickActionCard.tsx
│   ├── SectionCard.tsx
│   ├── AppointmentCard.tsx
│   ├── ProfessionalCard.tsx
│   ├── DocumentCard.tsx
│   ├── NotificationCard.tsx
│   ├── GradientIcon.tsx
│   ├── ActionButton.tsx
│   ├── FilterSection.tsx
│   └── index.ts         # Exportação centralizada
├── layouts/             # Layouts de página
│   ├── DashboardLayout.tsx
│   └── index.ts
├── ui/                  # Componentes shadcn/ui
└── figma/               # Componentes específicos do Figma

/src/app/pages/          # Páginas que usam os componentes
├── patient/
└── professional/
```

## 📦 Componentes Disponíveis

### 1. WelcomeCard
Card de boas-vindas com ícone e título.

```tsx
<WelcomeCard
  icon={Heart}
  title="Olá, João!"
  subtitle="Como está sua saúde hoje?"
  iconFilled={true}
/>
```

**Props:**
- `icon`: LucideIcon - Ícone a ser exibido
- `title`: string - Título principal
- `subtitle`: string - Subtítulo/descrição
- `iconFilled`: boolean (opcional) - Se o ícone deve ser preenchido

---

### 2. StatCard
Card de estatística/métrica com valor numérico.

```tsx
<StatCard
  title="Consultas Hoje"
  value={5}
  description="Agendamentos confirmados"
  icon={Calendar}
  gradient="linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)"
/>
```

**Props:**
- `title`: string - Título da métrica
- `value`: string | number - Valor da métrica
- `description`: string - Descrição
- `icon`: LucideIcon - Ícone
- `gradient`: string - Gradiente CSS

---

### 3. QuickActionCard
Card clicável para ações rápidas.

```tsx
<QuickActionCard
  title="Buscar Médicos"
  description="Encontre profissionais próximos"
  icon={Search}
  gradient="linear-gradient(135deg, #FFA500, #FF8C00)"
  onClick={() => navigate('/patient/search')}
/>
```

**Props:**
- `title`: string - Título da ação
- `description`: string - Descrição
- `icon`: LucideIcon - Ícone
- `gradient`: string - Gradiente CSS
- `onClick`: () => void - Função ao clicar

---

### 4. SectionCard
Card de seção com header e conteúdo.

```tsx
<SectionCard
  title="Próximas Consultas"
  description="Suas consultas agendadas"
  icon={Calendar}
>
  {/* Conteúdo aqui */}
</SectionCard>
```

**Props:**
- `title`: string - Título da seção
- `description`: string (opcional) - Descrição
- `icon`: LucideIcon (opcional) - Ícone
- `children`: ReactNode - Conteúdo do card
- `headerExtra`: ReactNode (opcional) - Conteúdo extra no header

---

### 5. AppointmentCard
Card para exibir informações de consulta.

```tsx
<AppointmentCard
  date="2026-03-22"
  time="14:00"
  status="confirmed"
  title="Dr. João Silva"
  subtitle="Cardiologia"
  type="patient"
/>
```

**Props:**
- `date`: string - Data da consulta (ISO)
- `time`: string - Horário
- `status`: string - Status da consulta
- `title`: string - Nome do profissional/paciente
- `subtitle`: string - Especialidade/descrição
- `type`: 'patient' | 'professional' - Tipo de visualização
- `onDetailsClick`: () => void (opcional) - Ação de detalhes

---

### 6. ProfessionalCard
Card para exibir profissional na busca.

```tsx
<ProfessionalCard
  id={professional.id}
  name="Dr. João Silva"
  specialty="Cardiologia"
  location="São Paulo, SP"
  consultationPrice={250.00}
  rating={4.8}
  available={true}
  onBookClick={(id) => navigate(`/patient/book/${id}`)}
/>
```

**Props:**
- `id`: string - ID do profissional
- `name`: string - Nome
- `specialty`: string - Especialidade
- `location`: string - Localização
- `consultationPrice`: number - Preço da consulta
- `rating`: number - Avaliação
- `avatar`: string (opcional) - URL do avatar
- `available`: boolean - Se está disponível
- `onBookClick`: (id: string) => void - Função ao clicar em agendar

---

### 7. DocumentCard
Card para exibir documento.

```tsx
<DocumentCard
  title="Hemograma Completo"
  type="Exame"
  uploadDate="2026-03-20"
  onView={() => {}}
  onDownload={() => {}}
/>
```

**Props:**
- `title`: string - Nome do documento
- `type`: string - Tipo (Exame, Receita, Laudo, etc)
- `uploadDate`: string - Data de upload (ISO)
- `fileSize`: string (opcional) - Tamanho do arquivo
- `onView`: () => void (opcional) - Função visualizar
- `onDownload`: () => void (opcional) - Função download

---

### 8. NotificationCard
Card para exibir notificação.

```tsx
<NotificationCard
  type="appointment"
  title="Consulta confirmada"
  message="Sua consulta foi confirmada para amanhã às 14h"
  date="2026-03-20T10:30:00"
  read={false}
  onClick={() => {}}
/>
```

**Props:**
- `type`: 'appointment' | 'payment' | 'reminder' | 'info' | 'success' | 'warning'
- `title`: string - Título
- `message`: string - Mensagem
- `date`: string - Data (ISO)
- `read`: boolean - Se foi lida
- `onClick`: () => void (opcional) - Função ao clicar

---

### 9. GradientIcon
Ícone com background gradiente.

```tsx
<GradientIcon
  icon={Calendar}
  size="lg"
  gradient="linear-gradient(135deg, #FFA500, #FF8C00)"
/>
```

**Props:**
- `icon`: LucideIcon - Ícone
- `gradient`: string (opcional) - Gradiente CSS (padrão weliv)
- `size`: 'sm' | 'md' | 'lg' | 'xl' (opcional) - Tamanho
- `className`: string (opcional) - Classes adicionais

---

### 10. ActionButton
Botão de ação estilizado.

```tsx
<ActionButton
  icon={Calendar}
  label="Ver Agenda"
  onClick={() => navigate('/professional/schedule')}
  fullWidth
/>
```

**Props:**
- `icon`: LucideIcon - Ícone
- `label`: string - Label do botão
- `onClick`: () => void - Função ao clicar
- `variant`: 'primary' | 'outline' (opcional) - Variante
- `fullWidth`: boolean (opcional) - Largura total
- `gradient`: string (opcional) - Gradiente CSS

---

### 11. FilterSection
Seção de filtros com header estilizado.

```tsx
<FilterSection
  title="Filtros de Busca"
  description="Refine sua busca"
>
  {/* Inputs de filtro aqui */}
</FilterSection>
```

**Props:**
- `title`: string (opcional) - Título
- `description`: string (opcional) - Descrição
- `children`: ReactNode - Conteúdo dos filtros

---

## 🎨 Paleta de Cores Weliv

```tsx
const welivColors = {
  primary: '#FFA500',      // Laranja principal
  secondary: '#FFC700',    // Amarelo
  dark: '#4A3728',         // Marrom escuro (textos)
  medium: '#6B5D53',       // Marrom médio (textos secundários)
  light: '#FFF8E7',        // Bege claro (backgrounds)
};

const welivGradients = {
  primary: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)',
  secondary: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
  tertiary: 'linear-gradient(135deg, #FFC700 0%, #FF8C00 100%)',
  quaternary: 'linear-gradient(135deg, #FF8C00 0%, #FFA500 100%)',
};
```

## 📝 Boas Práticas

### 1. **Importação Centralizada**
Sempre importe componentes comuns do index:
```tsx
import { WelcomeCard, StatCard, ActionButton } from '../../components/common';
```

### 2. **Componentização**
- **Não repita código**: Se um padrão aparece 2+ vezes, crie um componente
- **Componentes pequenos e focados**: Cada componente deve ter uma responsabilidade clara
- **Props tipadas**: Use TypeScript para todas as props

### 3. **Estrutura de Página**
Exemplo de página bem estruturada:
```tsx
export function PatientDashboard() {
  // Hooks
  const { user } = useAuth();
  const { data } = useData();
  const navigate = useNavigate();

  // Lógica de dados
  const processedData = processData(data);

  // Render
  return (
    <div className="space-y-6 pb-6">
      <WelcomeCard {...welcomeProps} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map(action => (
          <QuickActionCard key={action.id} {...action} />
        ))}
      </div>

      <SectionCard {...sectionProps}>
        {/* Conteúdo */}
      </SectionCard>
    </div>
  );
}
```

### 4. **Estilos Consistentes**
- Use as cores e gradientes da paleta Weliv
- Bordas: `border-2` com `rgba(255, 165, 0, 0.2)`
- Shadows: `shadow-sm`, `shadow-md`, `shadow-lg`
- Transições: `transition-all duration-300`

### 5. **Responsividade**
Use a abordagem mobile-first do Tailwind:
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
```

### 6. **Estados Vazios**
Sempre use o componente `EmptyState` para estados sem dados:
```tsx
<EmptyState
  icon={Calendar}
  title="Nenhuma consulta agendada"
  description="Que tal encontrar um profissional?"
  actionLabel="Buscar Profissionais"
  onAction={() => navigate('/search')}
/>
```

## 🔄 Fluxo de Desenvolvimento

1. **Identifique padrões**: Encontre código repetido nas páginas
2. **Crie o componente**: Adicione em `/components/common/`
3. **Exporte no index**: Adicione a exportação em `index.ts`
4. **Refatore páginas**: Substitua código repetido pelo componente
5. **Documente**: Adicione exemplo neste README

## 📂 Exemplo Completo

**Antes (código repetido):**
```tsx
<Card className="hover:shadow-xl transition-all">
  <CardContent className="p-6">
    <div className="flex gap-4">
      <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(...)' }}>
        <Icon className="size-6 text-white" />
      </div>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
        <Button onClick={onClick}>Ação</Button>
      </div>
    </div>
  </CardContent>
</Card>
```

**Depois (componentizado):**
```tsx
<ProfessionalCard
  id={id}
  name={name}
  specialty={specialty}
  onBookClick={handleBook}
/>
```

## 🎯 Próximos Passos

- [ ] Criar testes unitários para componentes
- [ ] Adicionar Storybook para documentação visual
- [ ] Implementar theme provider para cores
- [ ] Criar variantes de tamanho para cards
- [ ] Adicionar animações com Motion

---

**Mantido por:** Equipe Weliv  
**Última atualização:** Março 2026
