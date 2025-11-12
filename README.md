# Duty Pilot - Frontend

Interface web moderna para o aplicativo Duty Pilot - Sistema de gerenciamento de tarefas (to-do list).

## 🚀 Tecnologias

- **React 19** - Biblioteca JavaScript para interfaces
- **TypeScript** - Superset tipado do JavaScript (strict mode)
- **Vite** - Build tool e dev server moderno
- **Ant Design** - Biblioteca de componentes UI
- **Axios** - Cliente HTTP para requisições à API
- **Jest** - Framework de testes
- **React Testing Library** - Testes de componentes React

## 📋 Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Backend rodando em `http://localhost:3001` (ou configurar outra URL)

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone <repository-url>
cd duty-pilot/front
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente (opcional)

Crie um arquivo `.env` na raiz do diretório `front` se quiser mudar a URL da API:

```env
VITE_API_URL=http://localhost:3001/api
```

Se não criar, o padrão será `http://localhost:3001/api`.

## 🎯 Scripts Disponíveis

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Build para produção
npm run build

# Preview da build de produção
npm run preview

# Executar testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage

# Lint do código
npm run lint

# Lint e correção automática
npm run lint:fix

# Formatação de código
npm run format
```

## 🎨 Interface do Usuário

### Screenshots

#### Tela Principal

![Duty Pilot Main Screen](./docs/screenshots/main-screen.png)

A aplicação apresenta:

- **Header** com logo e título "Duty Pilot"
- **Formulário de criação** no topo para adicionar novas tarefas
- **Lista de tarefas** abaixo, mostrando todas as duties
- **Ações por tarefa**: Editar e Deletar
- **Design responsivo** que funciona em desktop, tablet e mobile

### Funcionalidades

#### ✅ Criar Tarefa

1. Digite o nome da tarefa no campo de input
2. Clique no botão "Add Duty" ou pressione Enter
3. A tarefa aparecerá imediatamente na lista

#### ✏️ Editar Tarefa

1. Clique no botão "Edit" na tarefa desejada
2. Modifique o nome no campo de input
3. Clique em "Save" ou pressione Enter para salvar
4. Clique em "Cancel" para cancelar a edição

#### 🗑️ Deletar Tarefa

1. Clique no botão "Delete" na tarefa desejada
2. Confirme a ação no modal de confirmação
3. A tarefa será removida da lista

### Validações

O formulário implementa as seguintes validações:

- ✅ Nome é obrigatório (não pode estar vazio)
- ✅ Nome não pode conter apenas espaços
- ✅ Nome deve ter no máximo 255 caracteres
- ✅ Contador de caracteres visível
- ✅ Mensagens de erro claras em português/inglês

### Estados da Interface

#### Loading

- Spinner animado durante carregamento inicial
- Botões desabilitados durante operações

#### Empty State

- Mensagem amigável quando não há tarefas
- Incentivo para criar a primeira tarefa

#### Error State

- Alertas visuais para erros de conexão
- Mensagens de erro descritivas
- Possibilidade de retry

## 🏗️ Arquitetura

O projeto segue uma arquitetura componentizada e escalável:

```
src/
├── components/        # Componentes React
│   ├── DutyForm/     # Formulário de criação
│   ├── DutyList/     # Lista de tarefas
│   └── DutyItem/     # Item individual
├── hooks/            # Custom hooks
│   └── useDuties.ts  # Hook para gerenciar duties
├── services/         # Serviços de API
│   ├── api.ts        # Cliente Axios configurado
│   └── dutyService.ts # Operações CRUD
├── types/            # Tipos TypeScript
│   └── duty.types.ts # Interfaces e tipos
├── utils/            # Utilitários
│   └── validation.ts # Validações
├── styles/           # Estilos globais
├── App.tsx           # Componente principal
└── main.tsx          # Entry point
```

### Fluxo de Dados

```
App.tsx
  ↓
useDuties() hook
  ↓
dutyService (API calls)
  ↓
Backend API
```

**Gerenciamento de Estado:**

- Uso de `useState` para estado local dos componentes
- Custom hook `useDuties` centraliza lógica de dados
- **SEM** Redux, useReducer ou outros gerenciadores complexos

## 🧪 Testes

O projeto inclui testes para componentes e utilitários:

```bash
# Executar todos os testes
npm test

# Ver cobertura de testes
npm run test:coverage
```

**Arquivos de teste:**

- `src/utils/validation.test.ts` - Testes de validação
- `src/components/DutyForm/DutyForm.test.tsx` - Testes do formulário
- `src/components/DutyList/DutyList.test.tsx` - Testes da lista

**Cobertura de testes:**

- Validações de formulário
- Renderização de componentes
- Interações do usuário
- Estados de loading e error
- Empty states

## 🎨 Design System

### Ant Design Components

Componentes utilizados do Ant Design:

- **Layout** - Estrutura da página
- **Card** - Cartões para tarefas
- **Input** - Campos de texto
- **Button** - Botões de ação
- **Modal** - Confirmações
- **Message** - Notificações toast
- **Alert** - Mensagens de erro
- **Spin** - Loading spinners
- **Empty** - Estado vazio
- **Space** - Espaçamento

### Cores

```css
Primary: #1890ff (Azul Ant Design)
Background Gradient: #667eea → #764ba2
Success: #52c41a
Error: #ff4d4f
Warning: #faad14
```

### Responsividade

Breakpoints:

- Desktop: > 768px
- Tablet: 768px
- Mobile: < 768px

## 🔒 Segurança

- Validação rigorosa de entrada no client-side
- TypeScript strict mode
- Sanitização de dados antes de enviar ao backend
- Tratamento de erros sem exposição de informações sensíveis
- Timeout configurável para requisições HTTP

## 🚀 Build e Deploy

### Build para produção

```bash
npm run build
```

Os arquivos otimizados estarão em `dist/`.

### Preview local da build

```bash
npm run preview
```

### Deploy

A aplicação pode ser deployada em qualquer serviço de hosting estático:

- **Vercel** - `vercel deploy`
- **Netlify** - Arraste a pasta `dist/`
- **GitHub Pages** - Configure no repositório
- **AWS S3 + CloudFront**
- **Firebase Hosting**

#### Configuração de Variáveis de Ambiente

No serviço de deploy, configure:

```
VITE_API_URL=https://seu-backend-url.com/api
```

## 📱 Compatibilidade

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## ⚡ Performance

- **Code Splitting** - Vite faz automaticamente
- **Tree Shaking** - Remoção de código não utilizado
- **Lazy Loading** - Componentes carregados sob demanda
- **Otimização de Assets** - Minificação e compressão
- **Fast Refresh** - Hot Module Replacement (HMR)

## 🔍 Observabilidade

- Logs de erros no console (desenvolvimento)
- Mensagens de feedback para o usuário
- Estados de loading visíveis
- Tratamento de erros de rede

## 📝 Convenções de Código

- **Componentes**: PascalCase (`DutyForm.tsx`)
- **Hooks**: camelCase com prefixo `use` (`useDuties.ts`)
- **Tipos**: PascalCase com sufixo de contexto (`duty.types.ts`)
- **Estilos**: CSS Modules ou CSS normal
- **Imports**: Absolutos para melhor legibilidade

## 🤝 Contribuindo

1. Certifique-se de que os testes passam: `npm test`
2. Execute o linter: `npm run lint`
3. Formate o código: `npm run format`
4. Faça commits seguindo Conventional Commits

## 📄 Licença

ISC

## 👥 Autor

Desenvolvido como parte de um teste técnico.

---

## 📞 Suporte

Em caso de problemas:

1. Verifique se o backend está rodando
2. Verifique a URL da API no console do navegador
3. Limpe o cache do navegador
4. Reinstale as dependências: `rm -rf node_modules && npm install`

## 🔗 Links Úteis

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Ant Design Components](https://ant.design/components/overview/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Axios Documentation](https://axios-http.com/)
