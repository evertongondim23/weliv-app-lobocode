# Weliv Design System

## 🎨 Identidade Visual

Sistema de design para a plataforma weliv de gestão de clínicas médicas, focado em uma experiência calorosa, acessível e profissional.

---

## 🌈 Paleta de Cores

### Cores Primárias

```css
--weliv-orange-primary: #FFA500  /* Laranja principal */
--weliv-orange-dark: #FF8C00     /* Laranja escuro */
--weliv-yellow: #FFC700          /* Amarelo */
--weliv-yellow-light: #FFD700    /* Amarelo claro */
```

### Cores de Texto

```css
--weliv-brown: #4A3728           /* Marrom escuro (títulos) */
--weliv-brown-light: #6B5D53     /* Marrom claro (subtítulos) */
```

### Cores de Fundo

```css
--background: #FAFAFA            /* Fundo geral */
--secondary: #FFF8E7             /* Fundo secundário */
--accent: #FFE5B4                /* Destaque */
```

---

## 🎭 Gradientes

### Gradiente Principal
```css
background: linear-gradient(135deg, #FFA500 0%, #FF8C00 100%);
```
**Uso:** Botões primários, badges, ícones de destaque

### Gradiente Secundário
```css
background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
```
**Uso:** Cards alternativos, elementos de suporte

### Gradiente Suave
```css
background: linear-gradient(135deg, #FFF8E7 0%, #FFE5B4 100%);
```
**Uso:** Fundos de estados vazios, ícones grandes

### Gradiente de Fundo (Login/Splash)
```css
background: linear-gradient(135deg, #FFF8E7 0%, #FFE5B4 50%, #FFD7A5 100%);
```
**Uso:** Telas de login, splash screens

---

## 📝 Tipografia

### Fonte
**Plus Jakarta Sans** - Google Fonts
- Weights: 300, 400, 500, 600, 700, 800

### Hierarquia

```css
h1: 3xl, font-bold, color: #4A3728
h2: 2xl, font-semibold, color: #4A3728
h3: xl, font-semibold, color: #4A3728
body: base, font-normal, color: #6B5D53
```

---

## 🧩 Componentes

### Cards

**Padrão:**
```tsx
<Card className="border-0 shadow-md">
  <CardHeader className="bg-gradient-to-r from-[#FFF8E7] to-white border-b">
    ...
  </CardHeader>
</Card>
```

**Com borda colorida:**
```tsx
<Card className="border-2" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
```

### Botões

**Primário:**
```tsx
<Button style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}>
  Texto do Botão
</Button>
```

**Outline:**
```tsx
<Button variant="outline" className="border-2" 
        style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
  Texto do Botão
</Button>
```

### Inputs

```tsx
<Input className="border-2" 
       style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }} />
```

### Badges

```tsx
<Badge style={{ 
  background: 'linear-gradient(135deg, #FFA500, #FF8C00)', 
  color: 'white',
  border: 'none' 
}}>
  Status
</Badge>
```

### Avatares

```tsx
<Avatar className="border-2" style={{ borderColor: '#FFA500' }}>
  <AvatarFallback style={{ 
    background: 'linear-gradient(135deg, #FFA500, #FF8C00)', 
    color: 'white' 
  }}>
    JS
  </AvatarFallback>
</Avatar>
```

---

## 🎯 Ícones

**Biblioteca:** Lucide React

**Cores de ícones:**
- Primário: `#FFA500` (laranja)
- Com fundo: Brancos sobre gradiente
- Secundário: `#6B5D53` (marrom claro)

**Tamanhos:**
- Pequeno: `size-4`
- Médio: `size-5` ou `size-6`
- Grande: `size-8` ou `size-12`

---

## 📐 Espaçamentos

### Raio de Bordas
```css
--radius: 0.75rem (12px)
```

**Variações:**
- Cards principais: `rounded-2xl` (16px)
- Cards secundários: `rounded-xl` (12px)
- Botões/Inputs: `rounded-lg` (8px)

### Padding
- Cards grandes: `p-6`
- Cards médios: `p-4`
- Botões: `px-8` ou `px-4`

### Gaps
- Entre seções: `gap-6` ou `space-y-6`
- Entre cards em grid: `gap-4`
- Entre ícone e texto: `gap-2` ou `gap-3`

---

## 🎨 Estados Visuais

### Hover (Cards)
```tsx
className="hover:shadow-lg transition-all duration-300"
```

### Hover (Botões com borda)
```tsx
className="hover:bg-secondary hover:border-primary"
```

### Estados Vazios

Sempre usar:
1. Ícone grande (size-12) em container com gradiente suave
2. Título em #4A3728
3. Descrição em #6B5D53
4. Call-to-action com botão primário

```tsx
<div className="text-center py-16">
  <div className="inline-flex p-4 rounded-full mb-4"
       style={{ background: 'linear-gradient(135deg, #FFF8E7, #FFE5B4)' }}>
    <Icon className="size-12 text-[#FFA500]" />
  </div>
  <p className="text-lg mb-2" style={{ color: '#4A3728' }}>Título</p>
  <p className="mb-6" style={{ color: '#6B5D53' }}>Descrição</p>
  <Button>Ação</Button>
</div>
```

---

## 📱 Mobile First

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Grid Responsivo
```tsx
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
```

### Navegação Mobile
- Bottom navigation com 5 itens principais
- Cor ativa: `#FFA500`
- Cor inativa: `#6B5D53`
- Ícones: strokeWidth aumentado quando ativo

---

## ♿ Acessibilidade

### Contraste
- Texto principal (#4A3728) sobre branco: ✅ AAA
- Texto secundário (#6B5D53) sobre branco: ✅ AA
- Laranja (#FFA500) sobre branco: ✅ AA (apenas para ícones/decoração)
- Branco sobre laranja (#FFA500): ✅ AAA

### Interatividade
- Todos os botões com feedback visual no hover
- Estados de foco visíveis
- Tamanhos de toque mínimos: 44x44px (mobile)

---

## 🎭 Tom e Voz

### Princípios UX
1. **Caloroso:** Usar emojis sutis (👋, 👤, 👨‍⚕️, ✓)
2. **Acolhedor:** Linguagem amigável e próxima
3. **Profissional:** Informações claras e objetivas
4. **Confiável:** Feedback constante das ações

### Mensagens
- Sucesso: Verde com toast
- Erro: Vermelho com alerta
- Info: Laranja com ícone
- Confirmação: Dialog com ação destacada

---

## 🚀 Componentes Customizados

### WelivLogo
Componente de logo com três tamanhos:
```tsx
<WelivLogo size="sm" showText={true} />
<WelivLogo size="md" showText={true} />
<WelivLogo size="lg" showText={true} />
```

### LoadingScreen
Tela de carregamento com animação:
```tsx
<LoadingScreen />
```

---

## 📦 Utilitários

### Theme Utils
```tsx
import { welivColors, welivBorder, getGradientStyle } from '@/utils/theme';

// Usar cores
style={{ color: welivColors.orangePrimary }}

// Usar bordas
style={{ borderColor: welivBorder(0.2) }}

// Usar gradientes
style={getGradientStyle('primary')}
```

---

## ✅ Checklist de Implementação

Ao criar novos componentes, certifique-se de:

- [ ] Usar cores da paleta weliv
- [ ] Aplicar bordas arredondadas apropriadas
- [ ] Incluir estados de hover e transições
- [ ] Responsividade mobile-first
- [ ] Acessibilidade (contraste, foco)
- [ ] Feedback visual para ações
- [ ] Consistência com outros componentes
- [ ] Estados vazios bem desenhados

---

**Versão:** 1.0  
**Última atualização:** Março 2026  
**Contato:** design@weliv.com.br
