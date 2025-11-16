# Output Directory

Esta pasta contém os arquivos gerados pelo sistema de notícias de Praia Grande.

## Estrutura de Arquivos

Quando você publica notícias, o sistema gera automaticamente 4 arquivos:

1. **noticias-YYYY-MM-DD.json** - Dados estruturados em JSON
2. **relatorio-YYYY-MM-DD.html** - Relatório HTML para visualização
3. **NoticiasPraiaGrande-YYYY-MM-DD.jsx** - Componente Next.js pronto para uso
4. **noticias-data-YYYY-MM-DD.ts** - Arquivo TypeScript com tipagem

## Exemplo de Uso

### Usar o componente Next.js no seu blog:

```jsx
// Copie o arquivo NoticiasPraiaGrande-YYYY-MM-DD.jsx para seu projeto
// Importe e use:
import NoticiasPraiaGrande from './NoticiasPraiaGrande-2025-11-16';

export default function NewsPage() {
  return <NoticiasPraiaGrande />;
}
```

### Usar os dados TypeScript:

```typescript
// Importe os dados:
import { noticiasPraiaGrande } from './noticias-data-2025-11-16';

// Acesse as notícias:
const noticias = noticiasPraiaGrande.conteudo.noticias;
const manchete = noticiasPraiaGrande.conteudo.manchetePrincipal;
```

## Recursos

- Todas as notícias incluem **engagement score** (0-100)
- Ordenação automática por potencial de engajamento
- Ranking visual com medalhas (🥇 🥈 🥉)
- Design responsivo com Tailwind CSS
- Otimizado para SEO
