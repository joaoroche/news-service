# Preview Dashboard - Notícias Praia Grande

Dashboard Next.js para visualizar e aprovar notícias antes da publicação.

## 🚀 Funcionalidades

- **Preview de Notícias**: Visualize as notícias que serão geradas antes de publicá-las
- **Aprovação Manual**: Revise e aprove cada lote de notícias
- **Interface Intuitiva**: Dashboard moderno e responsivo com Tailwind CSS
- **Estatísticas**: Visualize métricas sobre as notícias coletadas
- **SEO Preview**: Veja como as notícias aparecerão nos mecanismos de busca

## 📋 Pré-requisitos

- Node.js 18 ou superior
- Chave da API do OpenAI

## 🔧 Instalação

1. Entre na pasta do dashboard:
```bash
cd preview-dashboard
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.local.example .env.local
```

4. Edite o arquivo `.env.local` e adicione sua chave da API do OpenAI:
```env
OPENAI_API_KEY=sua_chave_aqui
```

## 🎯 Uso

### Modo Desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

### Modo Produção

```bash
npm run build
npm start
```

## 📖 Como Usar

1. **Buscar Preview**: Clique no botão "Buscar Notícias para Preview"
   - O sistema irá buscar as últimas notícias usando a API do OpenAI
   - As notícias serão exibidas para revisão

2. **Revisar Notícias**:
   - Veja a manchete principal
   - Revise todas as notícias encontradas
   - Analise temas em destaque e sugestões de pautas
   - Confira estatísticas e informações de SEO

3. **Publicar**:
   - Clique em "Aprovar e Publicar" para salvar as notícias
   - Os seguintes arquivos serão gerados na pasta `output/`:
     - `noticias-YYYY-MM-DD.json` - Dados estruturados
     - `relatorio-YYYY-MM-DD.html` - Relatório HTML
     - `NoticiasPraiaGrande-YYYY-MM-DD.jsx` - Componente Next.js
     - `noticias-data-YYYY-MM-DD.ts` - Arquivo TypeScript

4. **Cancelar**: Clique em "Cancelar" para descartar o preview atual

## 🏗️ Estrutura do Projeto

```
preview-dashboard/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── news/
│   │   │       ├── preview/     # API de preview
│   │   │       └── publish/     # API de publicação
│   │   ├── layout.tsx
│   │   ├── page.tsx             # Página principal
│   │   └── globals.css
│   ├── components/
│   │   ├── NewsCard.tsx         # Componente de notícia
│   │   └── LoadingSpinner.tsx   # Spinner de loading
│   └── types/
│       └── news.ts              # Tipos TypeScript
├── public/
├── package.json
└── README.md
```

## 🔄 Fluxo de Trabalho

```
1. Usuário clica em "Buscar Preview"
   ↓
2. API busca notícias do OpenAI
   ↓
3. Notícias são exibidas no dashboard
   ↓
4. Usuário revisa as notícias
   ↓
5. Usuário aprova e publica
   ↓
6. Arquivos são gerados na pasta output/
```

## 🛠️ APIs Disponíveis

### GET /api/news/preview
Busca preview das notícias sem salvá-las

**Resposta:**
```json
{
  "success": true,
  "data": {
    "metadata": {...},
    "conteudo": {...},
    "seo": {...}
  },
  "timestamp": "2025-11-15T10:30:00Z"
}
```

### POST /api/news/publish
Publica as notícias (salva os arquivos finais)

**Body:**
```json
{
  "newsData": {...}
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Notícias publicadas com sucesso",
  "files": {
    "json": "noticias-2025-11-15.json",
    "html": "relatorio-2025-11-15.html",
    "component": "NoticiasPraiaGrande-2025-11-15.jsx",
    "data": "noticias-data-2025-11-15.ts"
  }
}
```

## 🎨 Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **React** - Biblioteca UI

## 📝 Notas

- As notícias em preview não são salvas até você clicar em "Aprovar e Publicar"
- Cada busca de preview consome créditos da API do OpenAI
- Os arquivos publicados são salvos na pasta `output/` do projeto principal

## 🤝 Integração com o Projeto Principal

Este dashboard é parte do projeto `news-service` e utiliza os mesmos serviços de backend para gerar as notícias.

Para voltar ao projeto principal:
```bash
cd ..
```
