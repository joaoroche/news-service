import axios from 'axios';

interface Noticia {
  titulo: string;
  resumo: string;
  categoria: string;
  relevancia: 'alta' | 'média' | 'baixa';
  fonte: string;
  url?: string;
  dataPublicacao: string;
}

interface NoticiaRawData {
  dataColeta: string;
  totalNoticias: number;
  noticias: Noticia[];
  temasEmDestaque: string[];
  sugestoesPautas: string[];
}

interface NoticiaFormatted extends Noticia {
  slug: string;
  imagemPlaceholder: string;
}

interface FormattedData {
  metadata: {
    dataColeta: string;
    totalNoticias: number;
    cidade: string;
    estado: string;
  };
  conteudo: {
    manchetePrincipal: NoticiaFormatted | null;
    noticias: NoticiaFormatted[];
    sidebar: {
      temasEmDestaque: string[];
      sugestoesPautas: string[];
    };
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
}

export class PraiaGrandeNewsService {
  private searchQuery: string;
  private apiEndpoint: string;
  private apiKey: string;

  constructor(apiKey?: string) {
    this.searchQuery = 'Praia Grande São Paulo';
    this.apiEndpoint = 'https://api.openai.com/v1/chat/completions';
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || '';

    if (!this.apiKey) {
      throw new Error('Chave da API do OpenAI não fornecida. Defina OPENAI_API_KEY ou passe no construtor.');
    }
  }

  /**
   * Busca notícias sobre Praia Grande das últimas 24 horas
   * @param previewMode - Se true, retorna dados sem formatar para Next.js
   * @returns Notícias formatadas para blog
   */
  async fetchRecentNews(previewMode = false): Promise<FormattedData> {
    try {
      const response = await axios.post(
        this.apiEndpoint,
        {
          model: 'gpt-4o',
          temperature: 0.7,
          response_format: { type: "json_object" },
          messages: [
            {
              role: 'system',
              content: 'Você é um assistente especializado em curadoria de conteúdo para blogs. Retorne sempre respostas em formato JSON válido.'
            },
            {
              role: 'user',
              content: `Busque e organize notícias recentes sobre Praia Grande (cidade de São Paulo) das últimas 24 horas.

IMPORTANTE: Faça uma busca web para encontrar notícias ATUAIS. Busque por "Praia Grande SP notícias ${new Date().toISOString().split('T')[0]}" ou similar.

Retorne APENAS um objeto JSON válido no seguinte formato:

{
  "dataColeta": "${new Date().toISOString()}",
  "totalNoticias": 5,
  "noticias": [
    {
      "titulo": "Título da notícia",
      "resumo": "Resumo de 2-3 linhas sobre a notícia",
      "categoria": "Política|Turismo|Infraestrutura|Segurança|Cultura|Economia|Outros",
      "relevancia": "alta|média|baixa",
      "fonte": "Nome da fonte",
      "url": "URL da notícia se disponível",
      "dataPublicacao": "2025-11-15"
    }
  ],
  "temasEmDestaque": ["tema1", "tema2", "tema3"],
  "sugestoesPautas": [
    "Sugestão de pauta 1 baseada nas notícias",
    "Sugestão de pauta 2 baseada nas notícias"
  ]
}

REGRAS:
1. Busque notícias reais e atuais
2. Retorne SOMENTE JSON válido
3. Foque em notícias das últimas 24 horas
4. Priorize fontes confiáveis (G1, Folha, Estadão, jornais locais)
5. Inclua apenas notícias verificáveis com fontes reais`
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      const rawResponse = response.data.choices[0].message.content;

      // Remove possíveis markdown code blocks
      let cleanedResponse = rawResponse
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim();

      const newsData: NoticiaRawData = JSON.parse(cleanedResponse);

      return this.formatForBlog(newsData, previewMode);

    } catch (error: any) {
      console.error('Erro ao buscar notícias:', error.message);
      throw new Error(`Falha na busca de notícias: ${error.message}`);
    }
  }

  /**
   * Busca notícias em modo preview (para API)
   * @returns Notícias sem gerar componente Next.js
   */
  async fetchPreview(): Promise<FormattedData> {
    return this.fetchRecentNews(true);
  }

  /**
   * Formata os dados para uso em blog
   * @param newsData - Dados brutos das notícias
   * @param previewMode - Se true, não gera componente Next.js
   * @returns Dados formatados
   */
  private formatForBlog(newsData: NoticiaRawData, previewMode = false): FormattedData {
    const formattedData: FormattedData = {
      metadata: {
        dataColeta: newsData.dataColeta || new Date().toISOString(),
        totalNoticias: newsData.totalNoticias || 0,
        cidade: 'Praia Grande',
        estado: 'São Paulo'
      },
      conteudo: {
        manchetePrincipal: this.getManchete(newsData.noticias),
        noticias: newsData.noticias.map(noticia => ({
          ...noticia,
          slug: this.generateSlug(noticia.titulo),
          imagemPlaceholder: this.getImagemPorCategoria(noticia.categoria)
        })),
        sidebar: {
          temasEmDestaque: newsData.temasEmDestaque || [],
          sugestoesPautas: newsData.sugestoesPautas || []
        }
      },
      seo: {
        title: `Notícias de Praia Grande - ${new Date().toLocaleDateString('pt-BR')}`,
        description: this.generateMetaDescription(newsData.noticias),
        keywords: this.generateKeywords(newsData.temasEmDestaque)
      }
    };

    return formattedData;
  }

  /**
   * Seleciona a manchete principal (notícia de maior relevância)
   */
  private getManchete(noticias: Noticia[]): NoticiaFormatted | null {
    if (!noticias || noticias.length === 0) return null;

    const noticiasAlta = noticias.filter(n => n.relevancia === 'alta');
    const manchete = noticiasAlta.length > 0 ? noticiasAlta[0] : noticias[0];

    return {
      ...manchete,
      slug: this.generateSlug(manchete.titulo),
      imagemPlaceholder: this.getImagemPorCategoria(manchete.categoria)
    };
  }

  /**
   * Gera slug para URL amigável
   */
  private generateSlug(titulo: string): string {
    return titulo
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /**
   * Retorna sugestão de imagem por categoria
   */
  private getImagemPorCategoria(categoria: string): string {
    const imagens: Record<string, string> = {
      'Política': 'politica-praia-grande.jpg',
      'Turismo': 'praia-turismo.jpg',
      'Infraestrutura': 'obras-infraestrutura.jpg',
      'Segurança': 'seguranca-publica.jpg',
      'Cultura': 'cultura-eventos.jpg',
      'Economia': 'economia-local.jpg',
      'Outros': 'praia-grande-geral.jpg'
    };

    return imagens[categoria] || imagens['Outros'];
  }

  /**
   * Gera meta description para SEO
   */
  private generateMetaDescription(noticias: Noticia[]): string {
    if (!noticias || noticias.length === 0) {
      return 'Acompanhe as principais notícias de Praia Grande - SP atualizadas diariamente.';
    }

    const primeiroResumo = noticias[0].resumo;
    return primeiroResumo.substring(0, 155) + '...';
  }

  /**
   * Gera keywords para SEO
   */
  private generateKeywords(temas: string[]): string {
    const baseKeywords = ['Praia Grande', 'Praia Grande SP', 'notícias Praia Grande'];
    return [...baseKeywords, ...temas].join(', ');
  }
}
