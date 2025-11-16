'use client';

import { useState } from 'react';
import { NoticiaData, PreviewResponse, PublishResponse } from '@/types/news';
import NewsCard from '@/components/NewsCard';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function HomePage() {
  const [newsData, setNewsData] = useState<NoticiaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const fetchPreview = async () => {
    setLoading(true);
    setError(null);
    setPublishSuccess(false);

    try {
      const response = await fetch('/api/news/preview');
      const data: PreviewResponse = await response.json();

      if (data.success && data.data) {
        setNewsData(data.data);
      } else {
        setError(data.error || 'Erro ao buscar notícias');
      }
    } catch (err: any) {
      setError('Erro ao conectar com a API: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const publishNews = async () => {
    if (!newsData) return;

    setPublishing(true);
    setError(null);

    try {
      const response = await fetch('/api/news/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newsData }),
      });

      const data: PublishResponse = await response.json();

      if (data.success) {
        setPublishSuccess(true);
        // Limpa os dados após publicar
        setTimeout(() => {
          setNewsData(null);
          setPublishSuccess(false);
        }, 3000);
      } else {
        setError(data.error || 'Erro ao publicar notícias');
      }
    } catch (err: any) {
      setError('Erro ao publicar: ' + err.message);
    } finally {
      setPublishing(false);
    }
  };

  const cancelPreview = () => {
    setNewsData(null);
    setError(null);
    setPublishSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">📰 Preview de Notícias</h1>
          <p className="text-blue-100">
            Visualize e aprove notícias antes de publicar
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Botões de Ação */}
        {!newsData && !loading && (
          <div className="text-center mb-8">
            <button
              onClick={fetchPreview}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105"
            >
              🔍 Buscar Notícias para Preview
            </button>
            <p className="mt-4 text-gray-600">
              Clique para buscar as últimas notícias de Praia Grande
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && <LoadingSpinner />}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
            <div className="flex items-center">
              <span className="text-2xl mr-3">❌</span>
              <div>
                <h3 className="text-red-800 font-bold">Erro</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success */}
        {publishSuccess && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-lg">
            <div className="flex items-center">
              <span className="text-2xl mr-3">✅</span>
              <div>
                <h3 className="text-green-800 font-bold">Sucesso!</h3>
                <p className="text-green-700">Notícias publicadas com sucesso!</p>
              </div>
            </div>
          </div>
        )}

        {/* Preview Content */}
        {newsData && !loading && (
          <>
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-8 bg-white p-6 rounded-lg shadow-md">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Preview das Notícias
                </h2>
                <p className="text-gray-600">
                  Total de {newsData.metadata.totalNoticias} notícias encontradas
                </p>
                <p className="text-gray-500 text-sm">
                  Coletado em: {new Date(newsData.metadata.dataColeta).toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <button
                  onClick={cancelPreview}
                  disabled={publishing}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ❌ Cancelar
                </button>
                <button
                  onClick={publishNews}
                  disabled={publishing}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {publishing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                      Publicando...
                    </>
                  ) : (
                    <>✓ Aprovar e Publicar</>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Conteúdo Principal */}
              <div className="lg:col-span-2">
                {/* Manchete Principal */}
                {newsData.conteudo.manchetePrincipal && (
                  <NewsCard
                    noticia={newsData.conteudo.manchetePrincipal}
                    isHeadline={true}
                  />
                )}

                {/* Lista de Notícias */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    📋 Todas as Notícias
                  </h2>

                  <div className="space-y-6">
                    {newsData.conteudo.noticias.map((noticia, index) => (
                      <NewsCard key={index} noticia={noticia} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-4 space-y-6">
                  {/* Temas em Destaque */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span>🏷️</span>
                      Temas em Destaque
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {newsData.conteudo.sidebar.temasEmDestaque.map((tema, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                        >
                          {tema}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Sugestões de Pautas */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span>💡</span>
                      Sugestões de Pautas
                    </h3>
                    <ul className="space-y-3">
                      {newsData.conteudo.sidebar.sugestoesPautas.map((pauta, index) => (
                        <li
                          key={index}
                          className="text-gray-700 text-sm leading-relaxed pl-4 border-l-2 border-blue-500"
                        >
                          {pauta}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Estatísticas */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span>📊</span>
                      Estatísticas
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 text-sm">Total de notícias:</span>
                        <span className="font-bold text-blue-600">
                          {newsData.metadata.totalNoticias}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 text-sm">Alta relevância:</span>
                        <span className="font-bold text-red-600">
                          {newsData.conteudo.noticias.filter(n => n.relevancia === 'alta').length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 text-sm">Média relevância:</span>
                        <span className="font-bold text-yellow-600">
                          {newsData.conteudo.noticias.filter(n => n.relevancia === 'média').length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 text-sm">Baixa relevância:</span>
                        <span className="font-bold text-green-600">
                          {newsData.conteudo.noticias.filter(n => n.relevancia === 'baixa').length}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* SEO Info */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span>🔍</span>
                      SEO
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-gray-500 font-semibold mb-1">Title:</p>
                        <p className="text-gray-700">{newsData.seo.title}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-semibold mb-1">Description:</p>
                        <p className="text-gray-700">{newsData.seo.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {!newsData && !loading && !error && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📰</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              Nenhuma notícia carregada
            </h2>
            <p className="text-gray-500">
              Clique no botão acima para buscar as últimas notícias
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300">
            © {new Date().getFullYear()} Preview de Notícias - Praia Grande
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Sistema de preview e aprovação de notícias
          </p>
        </div>
      </footer>
    </div>
  );
}
