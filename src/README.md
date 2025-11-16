# News Service - Core Module

Este diretório contém o módulo principal do serviço de notícias de Praia Grande.

## newsService.js

Serviço otimizado para formatação e geração de arquivos de notícias.

### Funcionalidades

✅ **Formatação de Dados**
- Ordenação automática por engagement score
- Seleção de manchete baseada em engajamento
- Geração de slugs SEO-friendly
- Mapeamento de imagens por categoria

✅ **Geração de Arquivos**
- JSON estruturado
- Relatório HTML estilizado
- Componente Next.js com Tailwind CSS
- Arquivo TypeScript tipado

✅ **Suporte a Engagement Score**
- Ranking de notícias por potencial de engajamento (0-100)
- Indicadores visuais (🔥 ⭐ 📌)
- Medalhas para top 3 notícias (🥇 🥈 🥉)

### Uso

```javascript
const PraiaGrandeNewsService = require('./newsService');

const service = new PraiaGrandeNewsService(apiKey);

// Formatar dados
const formatted = service.formatForBlog(rawData, false);

// Salvar arquivos
await service.saveToFile(formatted, 'noticias-2025-11-16.json');
await service.saveHTMLReport(formatted, 'relatorio-2025-11-16.html');
await service.saveNextJSComponent(formatted, 'NoticiasPraiaGrande.jsx');
await service.saveNextJSData(formatted, 'noticias-data.ts');
```

### Otimizações Implementadas

1. **Remoção de código duplicado** - Funções auxiliares reutilizáveis
2. **Suporte a engagement score** - Ordenação e visualização
3. **HTML responsivo** - Design moderno e limpo
4. **Componente Next.js otimizado** - Inclui ranking visual e badges
5. **Tratamento de URLs ausentes** - Mensagem "Link não disponível"

### Categorias Suportadas

- Política
- Turismo
- Infraestrutura
- Segurança
- Cultura
- Economia
- Educação
- Saúde
- Meio Ambiente
- Esportes
- Outros

Cada categoria tem uma imagem placeholder associada.
