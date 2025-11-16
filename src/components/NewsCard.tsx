'use client';

import { Noticia } from '@/types/news';

interface NewsCardProps {
  noticia: Noticia;
  isHeadline?: boolean;
}

export default function NewsCard({ noticia, isHeadline = false }: NewsCardProps) {
  const getCategoriaColor = (categoria: string) => {
    const colors: Record<string, string> = {
      'Política': 'bg-blue-600',
      'Turismo': 'bg-cyan-600',
      'Infraestrutura': 'bg-orange-600',
      'Segurança': 'bg-red-600',
      'Cultura': 'bg-purple-600',
      'Economia': 'bg-green-600',
      'Educação': 'bg-indigo-600',
      'Saúde': 'bg-pink-600',
      'Meio Ambiente': 'bg-emerald-600',
      'Esportes': 'bg-yellow-600',
      'Outros': 'bg-gray-600'
    };
    return colors[categoria] || colors['Outros'];
  };

  const getRelevanciaStyles = (relevancia: string) => {
    const styles: Record<string, string> = {
      'alta': 'border-l-4 border-red-500 bg-red-50',
      'média': 'border-l-4 border-yellow-500 bg-yellow-50',
      'baixa': 'border-l-4 border-green-500 bg-green-50'
    };
    return styles[relevancia] || styles['baixa'];
  };

  const getRelevanciaColor = (relevancia: string) => {
    const colors: Record<string, string> = {
      'alta': 'bg-red-500',
      'média': 'bg-yellow-500',
      'baixa': 'bg-green-500'
    };
    return colors[relevancia] || colors['baixa'];
  };

  if (isHeadline) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-t-4 border-red-500">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🔥</span>
          <h2 className="text-2xl font-bold text-gray-900">Manchete Principal</h2>
        </div>

        <h3 className="text-3xl font-bold text-gray-900 mb-4">
          {noticia.titulo}
        </h3>

        <p className="text-gray-700 text-lg mb-4 leading-relaxed">
          {noticia.resumo}
        </p>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className={`${getCategoriaColor(noticia.categoria)} text-white px-4 py-1 rounded-full text-sm font-semibold`}>
            {noticia.categoria}
          </span>
          <span className="text-gray-600 text-sm">
            Fonte: <span className="font-semibold">{noticia.fonte}</span>
          </span>
          <span className="text-gray-500 text-sm">
            {new Date(noticia.dataPublicacao).toLocaleDateString('pt-BR')}
          </span>
        </div>

        {noticia.url && (
          <a
            href={noticia.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Ler notícia completa →
          </a>
        )}
      </div>
    );
  }

  return (
    <article
      className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${getRelevanciaStyles(noticia.relevancia)}`}
    >
      <h3 className="text-xl font-bold text-gray-900 mb-3">
        {noticia.titulo}
      </h3>

      <p className="text-gray-700 mb-4 leading-relaxed">
        {noticia.resumo}
      </p>

      <div className="flex flex-wrap items-center gap-3 mb-3">
        <span className={`${getCategoriaColor(noticia.categoria)} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
          {noticia.categoria}
        </span>
        <span className="inline-flex items-center gap-1 text-xs">
          <span className={`w-2 h-2 rounded-full ${getRelevanciaColor(noticia.relevancia)}`}></span>
          Relevância: {noticia.relevancia}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600">
        <span>
          Fonte: <span className="font-semibold">{noticia.fonte}</span>
        </span>
        <span>{new Date(noticia.dataPublicacao).toLocaleDateString('pt-BR')}</span>
      </div>

      {noticia.url && (
        <a
          href={noticia.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-semibold text-sm"
        >
          Ler mais →
        </a>
      )}
    </article>
  );
}
