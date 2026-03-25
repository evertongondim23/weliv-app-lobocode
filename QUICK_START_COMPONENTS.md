# 🚀 Guia Rápido - Componentes Weliv

## Importação

```tsx
// Importar tudo de uma vez
import { 
  WelcomeCard,
  StatCard,
  QuickActionCard,
  SectionCard,
  AppointmentCard,
  ProfessionalCard,
  DocumentCard,
  NotificationCard,
  ActionButton,
  GradientIcon,
  FilterSection,
  StyledTabs,
  EmptyState,
  PageHeader,
  WelivLogo
} from '../../components/common';
```

## Templates Prontos

### 📱 Página de Dashboard (Paciente)

```tsx
export function MyDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-6">
      {/* Header de Boas-vindas */}
      <WelcomeCard
        icon={Heart}
        title={`Olá, ${user?.name}!`}
        subtitle="Como posso ajudar hoje?"
        iconFilled={true}
      />

      {/* Grid de Ações Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickActionCard
          title="Nova Ação"
          description="Descrição curta"
          icon={Calendar}
          gradient="linear-gradient(135deg, #FFA500, #FF8C00)"
          onClick={() => navigate('/path')}
        />
      </div>

      {/* Seção de Conteúdo */}
      <SectionCard
        title="Minha Seção"
        description="Descrição opcional"
        icon={Calendar}
      >
        {/* Seu conteúdo aqui */}
      </SectionCard>
    </div>
  );
}
```

### 📊 Dashboard Profissional

```tsx
export function ProfessionalDashboard() {
  return (
    <div className="space-y-6 pb-6">
      <WelcomeCard
        icon={Activity}
        title="Painel Profissional"
        subtitle="Bem-vindo de volta!"
      />

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Hoje"
          value={15}
          description="Consultas agendadas"
          icon={Calendar}
          gradient="linear-gradient(135deg, #FFA500, #FF8C00)"
        />
      </div>
    </div>
  );
}
```

### 🔍 Página de Busca

```tsx
export function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6 pb-6">
      <WelcomeCard
        icon={Search}
        title="Buscar"
        subtitle="Encontre o que precisa"
      />

      <FilterSection
        title="Filtros"
        description="Refine sua busca"
      >
        <Input
          placeholder="Digite para buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </FilterSection>

      {/* Resultados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {results.map(item => (
          <ProfessionalCard
            key={item.id}
            {...item}
            onBookClick={handleBook}
          />
        ))}
      </div>
    </div>
  );
}
```

### 📄 Página de Documentos

```tsx
export function DocumentsPage() {
  const documents = useDocuments();

  return (
    <div className="space-y-6 pb-6">
      <WelcomeCard
        icon={FolderOpen}
        title="Meus Documentos"
        subtitle="Exames e receitas"
      />

      {documents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Nenhum documento"
          description="Envie seu primeiro documento"
          actionLabel="Enviar Documento"
          onAction={handleUpload}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map(doc => (
            <DocumentCard
              key={doc.id}
              title={doc.name}
              type={doc.type}
              uploadDate={doc.date}
              onView={() => {}}
              onDownload={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

### 🔔 Página de Notificações

```tsx
export function NotificationsPage() {
  const notifications = useNotifications();
  const unread = notifications.filter(n => !n.read);

  return (
    <div className="space-y-6 pb-6">
      <WelcomeCard
        icon={Bell}
        title="Notificações"
        subtitle={`${unread.length} não lidas`}
      />

      <StyledTabs
        tabs={[
          {
            value: 'unread',
            label: 'Não lidas',
            count: unread.length,
            content: (
              <div className="space-y-3">
                {unread.map(notif => (
                  <NotificationCard
                    key={notif.id}
                    type="appointment"
                    title={notif.title}
                    message={notif.message}
                    date={notif.date}
                    read={false}
                  />
                ))}
              </div>
            )
          },
          {
            value: 'all',
            label: 'Todas',
            content: (/* Conteúdo */)
          }
        ]}
      />
    </div>
  );
}
```

## 🎨 Paleta de Cores

```tsx
// Cores principais
const primary = '#FFA500';        // Laranja
const secondary = '#FFC700';      // Amarelo
const dark = '#4A3728';          // Marrom escuro
const medium = '#6B5D53';        // Marrom médio
const light = '#FFF8E7';         // Bege claro

// Gradientes prontos
const gradients = {
  primary: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)',
  secondary: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
  tertiary: 'linear-gradient(135deg, #FFC700 0%, #FF8C00 100%)',
  quaternary: 'linear-gradient(135deg, #FF8C00 0%, #FFA500 100%)',
};
```

## 📐 Grid Layouts

```tsx
// 1 coluna mobile, 2 tablet, 4 desktop
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

// 1 coluna mobile, 2 desktop
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

// 1 coluna mobile, 3 desktop
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
```

## 🎯 Estilos Comuns

```tsx
// Borda Weliv
className="border-2"
style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}

// Card com hover
className="hover:shadow-lg transition-all duration-300"

// Background gradiente header
className="bg-gradient-to-r from-[#FFF8E7] to-white"

// Texto primário
style={{ color: '#4A3728' }}

// Texto secundário
style={{ color: '#6B5D53' }}
```

## ✅ Checklist de Nova Página

- [ ] Importar componentes necessários
- [ ] Usar `<WelcomeCard>` no topo
- [ ] Envolver tudo em `<div className="space-y-6 pb-6">`
- [ ] Usar grid responsivo para cards
- [ ] Adicionar `EmptyState` quando não há dados
- [ ] Aplicar cores e gradientes da paleta Weliv
- [ ] Testar responsividade (mobile, tablet, desktop)

## 🚫 Evite

❌ **Não faça:**
```tsx
// Repetir código de card
<Card className="...">
  <CardContent>
    <div className="flex gap-4">
      <div className="p-4 rounded-xl" style={{ background: '...' }}>
        <Icon />
      </div>
      // ... muito código repetido
    </div>
  </CardContent>
</Card>
```

✅ **Faça:**
```tsx
// Use o componente apropriado
<ProfessionalCard {...props} />
```

## 📚 Documentação Completa

Para detalhes completos sobre cada componente, consulte:
- `COMPONENT_PATTERN.md` - Documentação técnica completa
- `/src/app/components/common/` - Código fonte dos componentes

---

**Dica:** Ao criar uma nova página, copie um dos templates acima e adapte para suas necessidades!
