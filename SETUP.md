# Setup do Sistema de Notícias - Praia Grande

## Estrutura de Diretórios

```
/home/user/
├── news-service/           # Aplicação Next.js (preview dashboard)
│   ├── src/
│   │   ├── app/           # Pages e API routes
│   │   ├── components/    # Componentes React
│   │   ├── lib/           # Serviço TypeScript (busca notícias)
│   │   └── types/         # Definições TypeScript
│   └── ...
│
├── src/                   # Módulo core (CommonJS)
│   ├── newsService.js     # Serviço de formatação e geração
│   └── test-service.js    # Script de teste
│
└── output/                # Arquivos gerados
    ├── *.json            # Dados estruturados
    ├── *.html            # Relatórios HTML
    ├── *.jsx             # Componentes Next.js
    └── *.ts              # Dados TypeScript
```

## Como Funciona

### 1. Preview (Next.js Dashboard)

**Localização**: `/home/user/news-service/`

**Fluxo**:
1. Usuário clica em "Buscar Notícias"
2. API `/api/news/preview` chama `src/lib/newsService.ts`
3. GPT-4 busca notícias e calcula engagement score
4. Notícias são ordenadas por score e exibidas
5. Usuário seleciona quais notícias publicar

**Comandos**:
```bash
cd /home/user/news-service
npm run dev          # Inicia em http://localhost:3000
npm run build        # Build de produção
```

### 2. Publicação (Geração de Arquivos)

**Localização**: `/home/user/src/newsService.js`

**Fluxo**:
1. Usuário clica "Publicar Selecionadas"
2. API `/api/news/publish` chama `newsService.js`
3. Filtra apenas notícias selecionadas
4. Gera 4 arquivos em `/home/user/output/`:
   - `noticias-YYYY-MM-DD.json`
   - `relatorio-YYYY-MM-DD.html`
   - `NoticiasPraiaGrande-YYYY-MM-DD.jsx`
   - `noticias-data-YYYY-MM-DD.ts`

**Teste**:
```bash
cd /home/user/src
node test-service.js
```

## Variáveis de Ambiente

Arquivo: `/home/user/news-service/.env.local`

```env
OPENAI_API_KEY=your_api_key_here
```

## Funcionalidades Implementadas

### ✅ Ranking por Engagement Score
- Score 0-100 baseado em:
  - Impacto na comunidade (30 pts)
  - Originalidade (25 pts)
  - Apelo emocional (20 pts)
  - Potencial de discussão (15 pts)
  - Urgência (10 pts)

### ✅ Seleção de Notícias
- Checkbox em cada card
- Botões "Selecionar Todas" / "Desmarcar Todas"
- Contador de selecionadas
- Publicação apenas das selecionadas

### ✅ Indicadores Visuais
- 🥇 🥈 🥉 Top 3 notícias
- 🔥 Alto engajamento (80-100)
- ⭐ Médio engajamento (50-79)
- 📌 Baixo engajamento (0-49)

### ✅ URLs Reais
- GPT-4 instruído a NÃO inventar URLs
- Mensagem "Link não disponível" quando ausente
- Evita 404 errors

## Otimizações Implementadas

1. **Código Limpo**: Remoção de duplicação
2. **Performance**: Ordenação eficiente por score
3. **UX**: Feedback visual claro do estado
4. **SEO**: Meta tags, slugs, keywords
5. **Responsivo**: Design mobile-first
6. **TypeScript**: Tipagem completa
7. **Modular**: Separação de responsabilidades

## Troubleshooting

### Erro: "Cannot find module newsService"
**Solução**: Verificar que `/home/user/src/newsService.js` existe

### Erro: "OPENAI_API_KEY not found"
**Solução**: Criar `.env.local` com a chave da API

### URLs quebradas (404)
**Solução**: Já corrigido - GPT-4 não gera mais URLs fictícias

### Botão publicar desabilitado
**Solução**: Selecione ao menos uma notícia

## Próximos Passos (Opcional)

1. **Integração com CMS**: Publicar direto no WordPress/Strapi
2. **Agendamento**: Cronjob para buscar notícias diariamente
3. **API de Notícias Real**: NewsAPI, Google News API
4. **Analytics**: Tracking de quais notícias performam melhor
5. **A/B Testing**: Testar diferentes títulos/resumos
6. **Notificações**: Email quando novas notícias disponíveis

## Suporte

- **Documentação do Projeto**: `/home/user/news-service/README.md`
- **Código Fonte**: `/home/user/news-service/CLAUDE.md`
- **Testes**: `/home/user/src/test-service.js`
