# Estrutura Completa do Projeto

Última atualização: 2025-11-16

## 📂 Árvore de Diretórios

```
/home/user/
│
├── 📁 news-service/                    # Aplicação Next.js 14 (Dashboard)
│   ├── 📁 src/
│   │   ├── 📁 app/                     # App Router do Next.js
│   │   │   ├── 📁 api/                 # API Routes
│   │   │   │   └── 📁 news/
│   │   │   │       ├── 📁 preview/     # GET /api/news/preview
│   │   │   │       │   └── route.ts    # Busca notícias via GPT-4
│   │   │   │       └── 📁 publish/     # POST /api/news/publish
│   │   │   │           └── route.ts    # Publica notícias selecionadas
│   │   │   ├── favicon.ico
│   │   │   ├── globals.css             # Estilos globais Tailwind
│   │   │   ├── layout.tsx              # Layout raiz
│   │   │   └── page.tsx                # Página principal (dashboard)
│   │   │
│   │   ├── 📁 components/              # Componentes React
│   │   │   ├── LoadingSpinner.tsx      # Spinner de loading
│   │   │   └── NewsCard.tsx            # Card de notícia
│   │   │
│   │   ├── 📁 lib/                     # Lógica de negócio
│   │   │   └── newsService.ts          # Serviço TypeScript (busca)
│   │   │
│   │   └── 📁 types/                   # Definições TypeScript
│   │       └── news.ts                 # Interfaces e tipos
│   │
│   ├── 📁 public/                      # Assets estáticos
│   │
│   ├── .env.local                      # Variáveis de ambiente (não versionado)
│   ├── .env.local.example              # Template de .env
│   ├── .eslintrc.json                  # Configuração ESLint
│   ├── .gitignore                      # Git ignore do Next.js
│   ├── CLAUDE.md                       # ⭐ Documentação para AI
│   ├── next-env.d.ts                   # Types do Next.js
│   ├── next.config.js                  # Configuração do Next.js
│   ├── package.json                    # Dependencies do Next.js
│   ├── package-lock.json               # Lock file
│   ├── postcss.config.js               # Config do PostCSS
│   ├── README.md                       # Documentação do dashboard
│   ├── tailwind.config.js              # Config do Tailwind
│   └── tsconfig.json                   # Config do TypeScript
│
├── 📁 src/                             # ⭐ Módulo Core (CommonJS)
│   ├── newsService.js                  # Serviço de formatação/geração
│   ├── test-service.js                 # Script de teste
│   └── README.md                       # Documentação do módulo
│
├── 📁 output/                          # Arquivos gerados
│   ├── README.md                       # Guia de uso
│   ├── noticias-YYYY-MM-DD.json        # Dados JSON (gerado)
│   ├── relatorio-YYYY-MM-DD.html       # Relatório HTML (gerado)
│   ├── NoticiasPraiaGrande-*.jsx       # Componente Next.js (gerado)
│   └── noticias-data-YYYY-MM-DD.ts     # Dados TypeScript (gerado)
│
├── .gitignore                          # Git ignore do repo pai
├── README.md                           # ⭐ Documentação principal
└── SETUP.md                            # ⭐ Guia de setup completo
```

## 🔄 Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────────┐
│  1. BUSCA DE NOTÍCIAS                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  User (Browser)                                                 │
│       ↓                                                         │
│  GET /api/news/preview                                          │
│       ↓                                                         │
│  news-service/src/lib/newsService.ts                            │
│       ↓                                                         │
│  OpenAI GPT-4 API                                               │
│       ↓                                                         │
│  JSON Response {noticias, engagementScore, ...}                 │
│       ↓                                                         │
│  Ordenação por engagement score                                 │
│       ↓                                                         │
│  Dashboard (notícias ranqueadas)                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  2. SELEÇÃO E PUBLICAÇÃO                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  User seleciona notícias (checkboxes)                           │
│       ↓                                                         │
│  Clica "Publicar Selecionadas"                                  │
│       ↓                                                         │
│  POST /api/news/publish {newsData}                              │
│       ↓                                                         │
│  news-service/src/app/api/news/publish/route.ts                 │
│       ↓                                                         │
│  require('../../../src/newsService.js')                         │
│       ↓                                                         │
│  /home/user/src/newsService.js                                  │
│       ↓                                                         │
│  Filtra notícias selecionadas                                   │
│       ↓                                                         │
│  Gera 4 arquivos em /home/user/output/:                         │
│    • noticias-YYYY-MM-DD.json                                   │
│    • relatorio-YYYY-MM-DD.html                                  │
│    • NoticiasPraiaGrande-YYYY-MM-DD.jsx                         │
│    • noticias-data-YYYY-MM-DD.ts                                │
│       ↓                                                         │
│  Retorna {success: true, files: {...}}                          │
│       ↓                                                         │
│  Dashboard mostra mensagem de sucesso                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🔑 Arquivos-Chave

### Dashboard (Next.js)

| Arquivo | Responsabilidade | Linhas |
|---------|-----------------|--------|
| `src/app/page.tsx` | Interface principal do dashboard | ~320 |
| `src/components/NewsCard.tsx` | Card de notícia com ranking | ~168 |
| `src/lib/newsService.ts` | Busca notícias via GPT-4 | ~255 |
| `src/types/news.ts` | Definições TypeScript | ~54 |
| `src/app/api/news/preview/route.ts` | API de preview | ~40 |
| `src/app/api/news/publish/route.ts` | API de publicação | ~98 |

### Core Module (CommonJS)

| Arquivo | Responsabilidade | Linhas |
|---------|-----------------|--------|
| `src/newsService.js` | Formatação e geração de arquivos | ~844 |
| `src/test-service.js` | Script de teste do módulo | ~80 |

### Documentação

| Arquivo | Conteúdo |
|---------|----------|
| `README.md` | Visão geral do projeto completo |
| `SETUP.md` | Guia completo de instalação e uso |
| `src/README.md` | Documentação do newsService.js |
| `output/README.md` | Guia de uso dos arquivos gerados |
| `news-service/CLAUDE.md` | Instruções para AI assistants |
| `news-service/README.md` | Documentação do dashboard |

## 📊 Estatísticas

```
Total de arquivos TypeScript/JavaScript: ~15
Total de linhas de código: ~2000+
Total de componentes React: 2
Total de API routes: 2
Total de formatos de saída: 4
```

## 🛠️ Tecnologias por Módulo

### news-service (Dashboard)
- Next.js 14.0.4
- React 18.2.0
- TypeScript 5.3.3
- Tailwind CSS 3.3.6
- Axios 1.6.2
- date-fns 3.0.0

### src (Core)
- Node.js (CommonJS)
- Pure JavaScript
- fs/promises
- path

## 🔐 Variáveis de Ambiente

```env
# /home/user/news-service/.env.local
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_APP_NAME="Preview de Notícias - Praia Grande"
```

## 🚀 Scripts Disponíveis

### news-service
```bash
npm run dev        # Desenvolvimento (localhost:3000)
npm run build      # Build de produção
npm start          # Servidor de produção
npm run lint       # ESLint
```

### src
```bash
node test-service.js    # Testa o newsService.js
```

## 📦 Repositórios Git

### 1. /home/user (Core)
- **Branch**: master
- **Commits**: 2
- **Arquivos**: newsService.js, documentação

### 2. /home/user/news-service (Dashboard)
- **Branch**: claude/news-ranking-selection-01NpN4bNq387LdF2c5QPvd63
- **Remote**: origin
- **Commits**: 5+
- **Status**: Up to date

## 📝 Convenções

### Nomenclatura de Arquivos
- Componentes: PascalCase (NewsCard.tsx)
- Utilitários: camelCase (newsService.ts)
- Tipos: PascalCase (news.ts exports interfaces)
- Páginas: lowercase (page.tsx)

### Padrões de Código
- TypeScript strict mode
- Tailwind utility-first
- Functional components com hooks
- Async/await para operações assíncronas
- Error handling com try-catch

## 🔗 Dependências Entre Módulos

```
news-service/src/app/api/news/publish/route.ts
    ↓ require()
/home/user/src/newsService.js
    ↓ fs.writeFile()
/home/user/output/*.{json,html,jsx,ts}
```

## 📖 Ordem de Leitura Recomendada

Para novos desenvolvedores:

1. **README.md** - Visão geral
2. **SETUP.md** - Como configurar
3. **news-service/CLAUDE.md** - Entender a arquitetura
4. **src/README.md** - Entender o core module
5. **Código fonte** - Explorar implementação

---

**Mantido por:** Claude AI
**Última atualização:** 2025-11-16
**Versão do projeto:** 1.0.0
