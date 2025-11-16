export interface Noticia {
  titulo: string;
  resumo: string;
  categoria: string;
  relevancia: 'alta' | 'média' | 'baixa';
  fonte: string;
  url?: string;
  dataPublicacao: string;
  slug: string;
  imagemPlaceholder: string;
}

export interface NoticiaData {
  metadata: {
    dataColeta: string;
    totalNoticias: number;
    cidade: string;
    estado: string;
  };
  conteudo: {
    manchetePrincipal: Noticia | null;
    noticias: Noticia[];
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

export interface PreviewResponse {
  success: boolean;
  data?: NoticiaData;
  error?: string;
  timestamp: string;
}

export interface PublishResponse {
  success: boolean;
  message?: string;
  files?: {
    json: string;
    html: string;
    component: string;
    data: string;
  };
  error?: string;
  timestamp: string;
}
