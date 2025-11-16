# CLAUDE.md - News Service Preview Dashboard

## Project Overview

This is a **Next.js 14** preview dashboard application for reviewing and approving news articles about Praia Grande, São Paulo before publication. The system integrates with OpenAI's API to fetch recent news, formats them for a blog, and allows manual review before publishing to multiple output formats.

**Project Name**: `preview-dashboard`
**Primary Language**: TypeScript
**Framework**: Next.js 14 (App Router)
**Purpose**: News curation and approval workflow system

---

## Tech Stack

### Core Technologies
- **Next.js**: 14.0.4 (App Router, React Server Components)
- **React**: 18.2.0
- **TypeScript**: 5.3.3 (strict mode enabled)
- **Tailwind CSS**: 3.3.6 (custom blue theme)
- **Node.js**: 18+ required

### Dependencies
- **axios**: 1.6.2 - HTTP client for OpenAI API calls
- **date-fns**: 3.0.0 - Date formatting and manipulation
- **OpenAI API**: GPT-4 integration for news fetching

### Development Tools
- **PostCSS**: 8.4.32
- **Autoprefixer**: 10.4.16
- **ESLint**: Next.js integrated linting
- **TypeScript Compiler**: Target ES5, ESNext modules

---

## Project Structure

```
news-service/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # API Routes
│   │   │   └── news/
│   │   │       ├── preview/          # Preview endpoint
│   │   │       │   └── route.ts      # GET /api/news/preview
│   │   │       └── publish/          # Publish endpoint
│   │   │           └── route.ts      # POST /api/news/publish
│   │   ├── layout.tsx                # Root layout with metadata
│   │   ├── page.tsx                  # Main dashboard page
│   │   └── globals.css               # Global Tailwind styles
│   ├── components/
│   │   ├── NewsCard.tsx              # News article card component
│   │   └── LoadingSpinner.tsx        # Loading indicator
│   ├── lib/
│   │   └── newsService.ts            # PraiaGrandeNewsService class
│   └── types/
│       └── news.ts                   # TypeScript type definitions
├── public/                           # Static assets
├── .env.local.example                # Environment variables template
├── .gitignore                        # Git ignore rules
├── next.config.js                    # Next.js configuration
├── tailwind.config.js                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
├── postcss.config.js                 # PostCSS configuration
├── package.json                      # Dependencies and scripts
└── README.md                         # User documentation
```

---

## Key Files & Responsibilities

### Service Layer

#### `src/lib/newsService.ts`
Core service class for news operations.

**Class**: `PraiaGrandeNewsService`

**Key Methods**:
- `fetchRecentNews(previewMode)` - Fetches news from OpenAI API
- `fetchPreview()` - Preview mode wrapper
- `formatForBlog(newsData, previewMode)` - Formats raw news data
- `getManchete(noticias)` - Selects main headline
- `generateSlug(titulo)` - Creates URL-friendly slugs
- `getImagemPorCategoria(categoria)` - Maps categories to images
- `generateMetaDescription(noticias)` - Creates SEO descriptions
- `generateKeywords(temas)` - Generates SEO keywords

**OpenAI Integration**:
- Model: `gpt-4o`
- Temperature: 0.7
- Response format: JSON object
- Endpoint: `https://api.openai.com/v1/chat/completions`

**News Categories**:
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

### API Routes

#### `src/app/api/news/preview/route.ts`
**GET /api/news/preview**
- Fetches news preview without saving
- Returns: `PreviewResponse` with news data and timestamp
- Error handling: Returns 500 with error message

**POST /api/news/preview**
- Saves temporary preview to `../output/preview-temp.json`
- Used for draft storage before publishing

#### `src/app/api/news/publish/route.ts`
**POST /api/news/publish**
- Publishes approved news to multiple formats
- Generates 4 output files:
  - `noticias-YYYY-MM-DD.json` - Structured data
  - `relatorio-YYYY-MM-DD.html` - HTML report
  - `NoticiasPraiaGrande-YYYY-MM-DD.jsx` - Next.js component
  - `noticias-data-YYYY-MM-DD.ts` - TypeScript data file
- Cleans up temporary preview file

### Components

#### `src/components/NewsCard.tsx`
Reusable news article card component.

**Props**:
- `noticia: Noticia` - News article data
- `isHeadline?: boolean` - Renders as main headline if true

**Features**:
- Category-based color coding
- Relevance indicators (alta/média/baixa)
- Responsive design
- External link handling
- Date formatting (pt-BR locale)

**Color Scheme**:
- Política: Blue (bg-blue-600)
- Turismo: Cyan (bg-cyan-600)
- Infraestrutura: Orange (bg-orange-600)
- Segurança: Red (bg-red-600)
- Cultura: Purple (bg-purple-600)
- Economia: Green (bg-green-600)

#### `src/components/LoadingSpinner.tsx`
Simple loading indicator with spinning animation.

### Main Page

#### `src/app/page.tsx`
Main dashboard interface (Client Component).

**State Management**:
- `newsData` - Current preview data
- `loading` - Loading state
- `publishing` - Publishing state
- `error` - Error messages
- `publishSuccess` - Success indicator

**User Flow**:
1. Click "Buscar Notícias para Preview"
2. Review fetched news articles
3. Approve and publish OR cancel
4. View success/error messages

**Sections**:
- Header with title and description
- Action buttons (fetch, publish, cancel)
- Main content (headline + news list)
- Sidebar (themes, suggestions, statistics, SEO)
- Footer

### Type Definitions

#### `src/types/news.ts`

**Core Interfaces**:

```typescript
Noticia {
  titulo: string
  resumo: string
  categoria: string
  relevancia: 'alta' | 'média' | 'baixa'
  fonte: string
  url?: string
  dataPublicacao: string
  slug: string
  imagemPlaceholder: string
}

NoticiaData {
  metadata: {
    dataColeta: string
    totalNoticias: number
    cidade: string
    estado: string
  }
  conteudo: {
    manchetePrincipal: Noticia | null
    noticias: Noticia[]
    sidebar: {
      temasEmDestaque: string[]
      sugestoesPautas: string[]
    }
  }
  seo: {
    title: string
    description: string
    keywords: string
  }
}

PreviewResponse {
  success: boolean
  data?: NoticiaData
  error?: string
  timestamp: string
}

PublishResponse {
  success: boolean
  message?: string
  files?: {
    json: string
    html: string
    component: string
    data: string
  }
  error?: string
  timestamp: string
}
```

---

## Configuration Files

### `tsconfig.json`
- **Target**: ES5
- **Module**: ESNext (bundler resolution)
- **Strict Mode**: Enabled
- **JSX**: preserve
- **Path Aliases**: `@/*` → `./src/*`
- **Incremental**: true

### `next.config.js`
- **React Strict Mode**: Enabled
- **SWC Minify**: Enabled (faster builds)

### `tailwind.config.js`
- **Content Paths**: pages, components, app directories
- **Extended Colors**:
  - Primary palette (blue shades 50-900)
  - Custom color mapping in components

### `postcss.config.js`
- **Plugins**: Tailwind CSS, Autoprefixer

---

## Environment Variables

Required environment variables (see `.env.local.example`):

```bash
# Required
OPENAI_API_KEY=your_openai_api_key_here

# Optional
NEXT_PUBLIC_APP_NAME="Preview de Notícias - Praia Grande"
```

**Setup**:
```bash
cp .env.local.example .env.local
# Edit .env.local with your OpenAI API key
```

---

## Development Workflows

### Starting Development
```bash
npm install           # Install dependencies
npm run dev          # Start dev server at http://localhost:3000
```

### Building for Production
```bash
npm run build        # Build production bundle
npm start            # Start production server
```

### Linting
```bash
npm run lint         # Run ESLint
```

---

## API Workflow

### 1. Preview Flow
```
User clicks "Buscar Preview"
  ↓
Frontend: fetch('/api/news/preview')
  ↓
Backend: PraiaGrandeNewsService.fetchPreview()
  ↓
OpenAI API call with GPT-4
  ↓
Parse JSON response
  ↓
Format for blog (add slugs, images, SEO)
  ↓
Return PreviewResponse
  ↓
Frontend: Display in dashboard
```

### 2. Publish Flow
```
User clicks "Aprovar e Publicar"
  ↓
Frontend: POST to /api/news/publish with newsData
  ↓
Backend: Re-format data
  ↓
Generate 4 output files:
  - JSON (structured data)
  - HTML (report)
  - JSX (Next.js component)
  - TS (TypeScript data)
  ↓
Save to ../output/ directory
  ↓
Clean up preview-temp.json
  ↓
Return PublishResponse with file names
  ↓
Frontend: Show success message, clear preview
```

---

## Code Conventions

### File Organization
- **Client Components**: Use `'use client'` directive
- **Server Components**: Default (no directive needed)
- **API Routes**: Use `export const dynamic = 'force-dynamic'`
- **Imports**: Use `@/` path alias for src imports

### Naming Conventions
- **Components**: PascalCase (e.g., `NewsCard.tsx`)
- **Files**: camelCase for utilities (e.g., `newsService.ts`)
- **Types**: PascalCase interfaces (e.g., `NoticiaData`)
- **CSS Classes**: Tailwind utility classes

### TypeScript Patterns
- **Strict Mode**: All files must pass strict type checking
- **Type Annotations**: Explicit types for props and state
- **Interfaces**: Prefer interfaces over types for object shapes
- **Null Safety**: Use optional chaining (`?.`) and nullish coalescing (`??`)

### React Patterns
- **Hooks**: Use functional components with hooks
- **State**: Local state with `useState`, no external state management
- **Error Handling**: Try-catch blocks with user-friendly error messages
- **Async Operations**: async/await pattern with loading states

### Styling Conventions
- **Tailwind-First**: Use Tailwind utility classes
- **Responsive Design**: Mobile-first approach
- **Color System**: Use defined color palettes in config
- **Spacing**: Consistent use of Tailwind spacing scale

---

## Common Tasks for AI Assistants

### Adding a New News Category
1. Update `getCategoriaColor()` in `src/components/NewsCard.tsx`
2. Add category to prompt in `src/lib/newsService.ts:96`
3. Update `getImagemPorCategoria()` mapping in `src/lib/newsService.ts:222`

### Modifying API Prompts
- Edit `src/lib/newsService.ts:83-115` (system and user prompts)
- Adjust temperature in `src/lib/newsService.ts:74`
- Modify response format if needed

### Adding New Output Formats
1. Create new save method in newsService (similar to `saveToFile()`)
2. Call in `src/app/api/news/publish/route.ts:57-62`
3. Add to `PublishResponse.files` type in `src/types/news.ts`

### Updating UI Components
- Components are in `src/components/`
- Use Tailwind classes for styling
- Follow existing color scheme patterns
- Ensure responsive design with Tailwind breakpoints

### Error Handling
- API routes: Return NextResponse.json with error and status
- Frontend: Update error state and display to user
- Backend: Log errors with console.error before returning

---

## Integration Points

### External Dependencies
- **OpenAI API**: Requires valid API key, uses GPT-4o model
- **File System**: Writes to `../output/` directory (relative to project root)
- **Parent Project**: References `../src/newsService.js` (legacy integration)

### Output Directory
Expected structure:
```
output/
├── noticias-2025-11-16.json
├── relatorio-2025-11-16.html
├── NoticiasPraiaGrande-2025-11-16.jsx
├── noticias-data-2025-11-16.ts
└── preview-temp.json (temporary)
```

---

## Testing Checklist

When making changes, verify:
- [ ] TypeScript compilation succeeds (`npm run build`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] Preview endpoint returns valid data
- [ ] Publish endpoint creates all 4 files
- [ ] UI displays news cards correctly
- [ ] Error states show appropriate messages
- [ ] Loading states work properly
- [ ] Responsive design works on mobile
- [ ] Environment variables are documented

---

## Known Issues & Limitations

1. **No Database**: All data is ephemeral; files are the persistence layer
2. **No Authentication**: Dashboard is open to anyone with access
3. **Rate Limiting**: OpenAI API calls may fail if rate limits exceeded
4. **File System Access**: Requires write permissions to `../output/`
5. **Language**: Hardcoded for Portuguese (pt-BR)
6. **Location**: Hardcoded for Praia Grande, São Paulo

---

## Performance Considerations

- **API Calls**: Each preview fetch costs OpenAI API credits
- **Response Time**: Depends on OpenAI API latency (typically 5-15 seconds)
- **Build Time**: Next.js builds are optimized with SWC minification
- **Bundle Size**: Tailwind CSS is purged of unused classes in production
- **Client-Side**: Main page is client-rendered for interactivity

---

## Security Notes

- **API Keys**: Must be stored in `.env.local`, never committed to git
- **External URLs**: News URLs are rendered with `rel="noopener noreferrer"`
- **Input Validation**: API routes validate required fields
- **Error Messages**: Generic errors to avoid leaking sensitive info
- **CORS**: Not configured; assumes same-origin requests

---

## Maintenance Guidelines

### When OpenAI API Changes
- Update model name in `src/lib/newsService.ts:73`
- Adjust prompt format if API requirements change
- Test response parsing logic

### When Adding Features
- Update this CLAUDE.md file
- Add TypeScript types to `src/types/news.ts`
- Follow existing patterns and conventions
- Test end-to-end workflow

### Regular Updates
- Keep dependencies up to date (npm audit)
- Monitor OpenAI API deprecation notices
- Review and update prompts for better results
- Optimize Tailwind config to reduce bundle size

---

## Debugging Tips

### API Issues
- Check `.env.local` for correct OPENAI_API_KEY
- Verify API key has sufficient credits
- Check browser console for fetch errors
- Review server logs for API response errors

### Build Issues
- Clear `.next` directory and rebuild
- Verify TypeScript types are correct
- Check for conflicting dependencies

### UI Issues
- Verify Tailwind classes are correct
- Check browser console for React errors
- Test in different browsers/viewports
- Validate data structure matches types

---

## Resources

- **Next.js 14 Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **OpenAI API**: https://platform.openai.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs
- **React**: https://react.dev

---

## Quick Reference

### NPM Scripts
```bash
npm run dev      # Development server
npm run build    # Production build
npm start        # Production server
npm run lint     # ESLint check
```

### Key Directories
- `src/app` - Pages and API routes
- `src/components` - React components
- `src/lib` - Business logic
- `src/types` - TypeScript definitions
- `public` - Static assets

### Important Files
- `src/lib/newsService.ts` - Core service logic
- `src/app/page.tsx` - Main UI
- `src/types/news.ts` - Type definitions
- `.env.local` - Environment variables (create from .example)

---

*Last Updated: 2025-11-16*
*Generated for AI Assistant Context*
