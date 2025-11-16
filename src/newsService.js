const fs = require('fs').promises;
const path = require('path');

/**
 * Serviço de notícias para Praia Grande - SP
 * Versão otimizada para uso com Next.js e TypeScript
 */
class PraiaGrandeNewsService {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  /**
   * Formata os dados para uso em blog
   * @param {Object} newsData - Dados brutos das notícias
   * @param {boolean} previewMode - Se true, não gera componente Next.js
   * @returns {Object} Dados formatados
   */
  formatForBlog(newsData, previewMode = false) {
    // Ordena notícias por engagement score (maior para menor)
    const sortedNoticias = [...newsData.noticias].sort((a, b) => {
      const scoreA = a.engagementScore || 0;
      const scoreB = b.engagementScore || 0;
      return scoreB - scoreA;
    });

    const formattedData = {
      metadata: {
        dataColeta: newsData.dataColeta || new Date().toISOString(),
        totalNoticias: newsData.totalNoticias || sortedNoticias.length,
        cidade: 'Praia Grande',
        estado: 'São Paulo'
      },
      conteudo: {
        manchetePrincipal: this.getManchete(sortedNoticias),
        noticias: sortedNoticias.map(noticia => ({
          ...noticia,
          slug: this.generateSlug(noticia.titulo),
          imagemPlaceholder: this.getImagemPorCategoria(noticia.categoria),
          selected: noticia.selected !== undefined ? noticia.selected : true
        })),
        sidebar: {
          temasEmDestaque: newsData.temasEmDestaque || [],
          sugestoesPautas: newsData.sugestoesPautas || []
        }
      },
      seo: {
        title: `Notícias de Praia Grande - ${new Date().toLocaleDateString('pt-BR')}`,
        description: this.generateMetaDescription(sortedNoticias),
        keywords: this.generateKeywords(newsData.temasEmDestaque)
      }
    };

    // Adiciona componente Next.js se não for preview
    if (!previewMode) {
      formattedData.nextjs = this.generateNextJSComponent(formattedData);
    }

    return formattedData;
  }

  /**
   * Seleciona a manchete principal (notícia com maior engagement score)
   */
  getManchete(noticias) {
    if (!noticias || noticias.length === 0) return null;

    // Prioriza por engagement score, depois por relevância
    const sorted = [...noticias].sort((a, b) => {
      const scoreA = a.engagementScore || 0;
      const scoreB = b.engagementScore || 0;
      if (scoreB !== scoreA) return scoreB - scoreA;

      // Se scores iguais, usa relevância
      const relOrder = { 'alta': 3, 'média': 2, 'baixa': 1 };
      return (relOrder[b.relevancia] || 0) - (relOrder[a.relevancia] || 0);
    });

    return sorted[0];
  }

  /**
   * Gera slug para URL amigável
   */
  generateSlug(titulo) {
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
  getImagemPorCategoria(categoria) {
    const imagens = {
      'Política': 'politica-praia-grande.jpg',
      'Turismo': 'praia-turismo.jpg',
      'Infraestrutura': 'obras-infraestrutura.jpg',
      'Segurança': 'seguranca-publica.jpg',
      'Cultura': 'cultura-eventos.jpg',
      'Economia': 'economia-local.jpg',
      'Educação': 'educacao-praia-grande.jpg',
      'Saúde': 'saude-publica.jpg',
      'Meio Ambiente': 'meio-ambiente.jpg',
      'Esportes': 'esportes-praia-grande.jpg',
      'Outros': 'praia-grande-geral.jpg'
    };

    return imagens[categoria] || imagens['Outros'];
  }

  /**
   * Gera meta description para SEO
   */
  generateMetaDescription(noticias) {
    if (!noticias || noticias.length === 0) {
      return 'Acompanhe as principais notícias de Praia Grande - SP atualizadas diariamente.';
    }

    const primeiroResumo = noticias[0].resumo;
    return primeiroResumo.substring(0, 155) + '...';
  }

  /**
   * Gera keywords para SEO
   */
  generateKeywords(temas) {
    const baseKeywords = ['Praia Grande', 'Praia Grande SP', 'notícias Praia Grande'];
    return [...baseKeywords, ...(temas || [])].join(', ');
  }

  /**
   * Gera componente Next.js completo com Tailwind CSS e suporte a engagement score
   */
  generateNextJSComponent(data) {
    const { metadata, conteudo, seo } = data;

    const component = `import Head from 'next/head';

export default function NoticiasPraiaGrande() {
  const metadata = ${JSON.stringify(metadata, null, 2)};

  const manchete = ${JSON.stringify(conteudo.manchetePrincipal, null, 2)};

  const noticias = ${JSON.stringify(conteudo.noticias, null, 2)};

  const temasEmDestaque = ${JSON.stringify(conteudo.sidebar.temasEmDestaque, null, 2)};

  const sugestoesPautas = ${JSON.stringify(conteudo.sidebar.sugestoesPautas, null, 2)};

  const getCategoriaColor = (categoria) => {
    const colors = {
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

  const getRelevanciaStyles = (relevancia) => {
    const styles = {
      'alta': 'border-l-4 border-red-500 bg-red-50',
      'média': 'border-l-4 border-yellow-500 bg-yellow-50',
      'baixa': 'border-l-4 border-green-500 bg-green-50'
    };
    return styles[relevancia] || styles['baixa'];
  };

  const getEngagementColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getEngagementIcon = (score) => {
    if (score >= 80) return '🔥';
    if (score >= 50) return '⭐';
    return '📌';
  };

  const getRankMedal = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return \`#\${rank}\`;
  };

  return (
    <>
      <Head>
        <title>${seo.title}</title>
        <meta name="description" content="${seo.description}" />
        <meta name="keywords" content="${seo.keywords}" />
        <meta property="og:title" content="${seo.title}" />
        <meta property="og:description" content="${seo.description}" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${seo.title}" />
        <meta name="twitter:description" content="${seo.description}" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 shadow-lg">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-2">📰 Notícias de Praia Grande</h1>
            <p className="text-blue-100">
              Atualizado em: {new Date(metadata.dataColeta).toLocaleString('pt-BR')}
            </p>
            <p className="text-blue-100">
              {metadata.totalNoticias} notícias selecionadas
            </p>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Conteúdo Principal */}
            <div className="lg:col-span-2">
              {/* Manchete Principal */}
              {manchete && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-t-4 border-red-500">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🔥</span>
                      <h2 className="text-2xl font-bold text-gray-900">Manchete Principal</h2>
                    </div>
                    {manchete.engagementScore !== undefined && (
                      <div className={\`px-4 py-2 rounded-lg font-bold flex items-center gap-2 \${getEngagementColor(manchete.engagementScore)}\`}>
                        <span className="text-xl">{getEngagementIcon(manchete.engagementScore)}</span>
                        <span>Engajamento: {manchete.engagementScore}/100</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    {manchete.titulo}
                  </h3>

                  <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                    {manchete.resumo}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className={\`\${getCategoriaColor(manchete.categoria)} text-white px-4 py-1 rounded-full text-sm font-semibold\`}>
                      {manchete.categoria}
                    </span>
                    <span className="text-gray-600 text-sm">
                      Fonte: <span className="font-semibold">{manchete.fonte}</span>
                    </span>
                    <span className="text-gray-500 text-sm">
                      {new Date(manchete.dataPublicacao).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  {manchete.url ? (
                    <a
                      href={manchete.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                    >
                      Ler notícia completa →
                    </a>
                  ) : (
                    <div className="text-gray-500 text-sm italic">
                      Link da fonte não disponível
                    </div>
                  )}
                </div>
              )}

              {/* Lista de Notícias */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">📋 Ranking de Notícias por Engajamento</h2>

                <div className="space-y-6">
                  {noticias.map((noticia, index) => (
                    <article
                      key={index}
                      className={\`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow \${getRelevanciaStyles(noticia.relevancia)}\`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold">{getRankMedal(index + 1)}</span>
                        {noticia.engagementScore !== undefined && (
                          <div className={\`px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-1 \${getEngagementColor(noticia.engagementScore)}\`}>
                            <span>{getEngagementIcon(noticia.engagementScore)}</span>
                            <span>{noticia.engagementScore}/100</span>
                          </div>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {noticia.titulo}
                      </h3>

                      <p className="text-gray-700 mb-4 leading-relaxed">
                        {noticia.resumo}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className={\`\${getCategoriaColor(noticia.categoria)} text-white px-3 py-1 rounded-full text-xs font-semibold\`}>
                          {noticia.categoria}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs">
                          <span className={\`w-2 h-2 rounded-full \${
                            noticia.relevancia === 'alta' ? 'bg-red-500' :
                            noticia.relevancia === 'média' ? 'bg-yellow-500' :
                            'bg-green-500'
                          }\`}></span>
                          Relevância: {noticia.relevancia}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600">
                        <span>
                          Fonte: <span className="font-semibold">{noticia.fonte}</span>
                        </span>
                        <span>{new Date(noticia.dataPublicacao).toLocaleDateString('pt-BR')}</span>
                      </div>

                      {noticia.url ? (
                        <a
                          href={noticia.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-semibold text-sm"
                        >
                          Ler mais →
                        </a>
                      ) : (
                        <div className="mt-4 text-gray-400 text-xs italic">
                          Link não disponível
                        </div>
                      )}
                    </article>
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
                    {temasEmDestaque.map((tema, index) => (
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
                    {sugestoesPautas.map((pauta, index) => (
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
                      <span className="text-gray-700 text-sm">Total publicadas:</span>
                      <span className="font-bold text-blue-600">{metadata.totalNoticias}</span>
                    </div>
                    <hr className="border-gray-300" />
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 text-sm">🔥 Alto engajamento:</span>
                      <span className="font-bold text-green-600">
                        {noticias.filter(n => (n.engagementScore || 0) >= 80).length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 text-sm">⭐ Médio engajamento:</span>
                      <span className="font-bold text-yellow-600">
                        {noticias.filter(n => (n.engagementScore || 0) >= 50 && (n.engagementScore || 0) < 80).length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 text-sm">📌 Baixo engajamento:</span>
                      <span className="font-bold text-gray-600">
                        {noticias.filter(n => (n.engagementScore || 0) < 50).length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-6 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-300">
              © {new Date().getFullYear()} Notícias de Praia Grande - Atualizado diariamente
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}`;

    return component;
  }

  /**
   * Salva dados em arquivo JSON
   */
  async saveToFile(data, filename = 'noticias-praia-grande.json') {
    const outputDir = path.join(__dirname, '../output');
    await fs.mkdir(outputDir, { recursive: true });

    const filepath = path.join(outputDir, filename);
    await fs.writeFile(filepath, JSON.stringify(data, null, 2), 'utf-8');

    console.log(`✅ Dados salvos em: ${filepath}`);
    return filepath;
  }

  /**
   * Gera relatório em formato HTML
   */
  generateHTMLReport(data) {
    const { metadata, conteudo, seo } = data;

    let html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${seo.title}</title>
    <meta name="description" content="${seo.description}">
    <meta name="keywords" content="${seo.keywords}">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2563eb, #1e40af); color: white; padding: 30px; border-radius: 8px; margin-bottom: 30px; }
        .header h1 { font-size: 2.5em; margin-bottom: 10px; }
        .header-info { opacity: 0.9; font-size: 0.95em; }
        .manchete { background: white; padding: 30px; margin: 20px 0; border-left: 4px solid #ef4444; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .manchete h2 { color: #ef4444; margin-bottom: 15px; font-size: 1.5em; }
        .manchete h3 { color: #111; margin-bottom: 15px; font-size: 1.8em; }
        .engagement-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 0.9em; margin: 10px 0; }
        .engagement-high { background: #dcfce7; color: #166534; }
        .engagement-medium { background: #fef3c7; color: #92400e; }
        .engagement-low { background: #f3f4f6; color: #4b5563; }
        .noticia { background: white; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1); position: relative; }
        .noticia.relevancia-alta { border-left: 4px solid #ef4444; }
        .noticia.relevancia-média { border-left: 4px solid #f59e0b; }
        .noticia.relevancia-baixa { border-left: 4px solid #10b981; }
        .noticia h3 { color: #111; margin-bottom: 15px; font-size: 1.3em; }
        .rank-badge { position: absolute; top: 20px; right: 20px; font-size: 2em; }
        .categoria { display: inline-block; background: #2563eb; color: white; padding: 6px 14px; border-radius: 20px; font-size: 0.85em; margin-right: 10px; }
        .meta { color: #666; font-size: 0.9em; margin-top: 15px; }
        .sidebar { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .sidebar h3 { color: #111; margin-bottom: 15px; font-size: 1.2em; }
        .tag { display: inline-block; background: #e5e7eb; color: #374151; padding: 6px 12px; margin: 4px; border-radius: 6px; font-size: 0.85em; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
        .stat-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .stat-value { font-size: 2em; font-weight: bold; color: #2563eb; }
        .stat-label { color: #666; font-size: 0.9em; }
        a { color: #2563eb; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .btn { display: inline-block; background: #2563eb; color: white; padding: 10px 20px; border-radius: 6px; margin-top: 10px; }
        .btn:hover { background: #1e40af; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📰 Notícias de Praia Grande - SP</h1>
            <div class="header-info">
                <p>📅 Atualizado em: ${new Date(metadata.dataColeta).toLocaleString('pt-BR')}</p>
                <p>📊 Total de notícias publicadas: ${metadata.totalNoticias}</p>
            </div>
        </div>

        <div class="stats">
            <div class="stat-card">
                <div class="stat-value">${conteudo.noticias.filter(n => (n.engagementScore || 0) >= 80).length}</div>
                <div class="stat-label">🔥 Alto Engajamento</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${conteudo.noticias.filter(n => (n.engagementScore || 0) >= 50 && (n.engagementScore || 0) < 80).length}</div>
                <div class="stat-label">⭐ Médio Engajamento</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${conteudo.noticias.filter(n => n.relevancia === 'alta').length}</div>
                <div class="stat-label">Alta Relevância</div>
            </div>
        </div>
`;

    if (conteudo.manchetePrincipal) {
      const m = conteudo.manchetePrincipal;
      const engagementClass = (m.engagementScore || 0) >= 80 ? 'engagement-high' :
                              (m.engagementScore || 0) >= 50 ? 'engagement-medium' : 'engagement-low';
      html += `
        <div class="manchete">
            <h2>🔥 Manchete Principal</h2>
            ${m.engagementScore !== undefined ? `<span class="engagement-badge ${engagementClass}">Engajamento: ${m.engagementScore}/100</span>` : ''}
            <h3>${m.titulo}</h3>
            <p>${m.resumo}</p>
            <div style="margin-top: 15px;">
                <span class="categoria">${m.categoria}</span>
                <span class="meta">Fonte: <strong>${m.fonte}</strong> | ${new Date(m.dataPublicacao).toLocaleDateString('pt-BR')}</span>
            </div>
            ${m.url ? `<a href="${m.url}" target="_blank" class="btn">Ler notícia completa →</a>` : '<p class="meta" style="color: #999; margin-top: 10px;">Link não disponível</p>'}
        </div>
`;
    }

    html += `<h2 style="margin: 40px 0 20px 0; font-size: 1.8em;">📋 Ranking de Notícias por Engajamento</h2>`;

    conteudo.noticias.forEach((noticia, index) => {
      const getRankMedal = (rank) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
      };
      const engagementClass = (noticia.engagementScore || 0) >= 80 ? 'engagement-high' :
                              (noticia.engagementScore || 0) >= 50 ? 'engagement-medium' : 'engagement-low';

      html += `
        <div class="noticia relevancia-${noticia.relevancia}">
            <span class="rank-badge">${getRankMedal(index + 1)}</span>
            ${noticia.engagementScore !== undefined ? `<span class="engagement-badge ${engagementClass}">Engajamento: ${noticia.engagementScore}/100</span>` : ''}
            <h3>${noticia.titulo}</h3>
            <p>${noticia.resumo}</p>
            <div class="meta">
                <span class="categoria">${noticia.categoria}</span>
                <span>Relevância: ${noticia.relevancia}</span> |
                <strong>Fonte:</strong> ${noticia.fonte} |
                ${new Date(noticia.dataPublicacao).toLocaleDateString('pt-BR')}
            </div>
            ${noticia.url ? `<a href="${noticia.url}" target="_blank" class="btn" style="margin-top: 15px;">Ler mais →</a>` : '<p class="meta" style="color: #999; margin-top: 10px;">Link não disponível</p>'}
        </div>
`;
    });

    html += `
        <div class="sidebar">
            <h3>🏷️ Temas em Destaque</h3>
            <div>
                ${conteudo.sidebar.temasEmDestaque.map(tema => `<span class="tag">${tema}</span>`).join('')}
            </div>

            <h3 style="margin-top: 30px;">💡 Sugestões de Pautas</h3>
            <ul style="padding-left: 20px;">
                ${conteudo.sidebar.sugestoesPautas.map(pauta => `<li style="margin: 8px 0;">${pauta}</li>`).join('')}
            </ul>
        </div>

        <div style="text-align: center; padding: 30px; color: #666;">
            <p>© ${new Date().getFullYear()} Notícias de Praia Grande - Gerado automaticamente</p>
        </div>
    </div>
</body>
</html>`;

    return html;
  }

  /**
   * Salva relatório HTML
   */
  async saveHTMLReport(data, filename = 'relatorio-noticias.html') {
    const html = this.generateHTMLReport(data);
    const outputDir = path.join(__dirname, '../output');
    await fs.mkdir(outputDir, { recursive: true });

    const filepath = path.join(outputDir, filename);
    await fs.writeFile(filepath, html, 'utf-8');

    console.log(`✅ Relatório HTML salvo em: ${filepath}`);
    return filepath;
  }

  /**
   * Salva componente Next.js
   */
  async saveNextJSComponent(data, filename = 'NoticiasPraiaGrande.jsx') {
    const outputDir = path.join(__dirname, '../output');
    await fs.mkdir(outputDir, { recursive: true });

    const filepath = path.join(outputDir, filename);
    await fs.writeFile(filepath, data.nextjs || this.generateNextJSComponent(data), 'utf-8');

    console.log(`✅ Componente Next.js salvo em: ${filepath}`);
    return filepath;
  }

  /**
   * Gera arquivo de dados TypeScript
   */
  generateNextJSData(data) {
    const { metadata, conteudo, seo } = data;

    return `// Gerado automaticamente em ${new Date().toISOString()}
// Dados das notícias de Praia Grande

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
  engagementScore?: number;
  selected?: boolean;
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

export const noticiasPraiaGrande: NoticiaData = ${JSON.stringify(
  {
    metadata,
    conteudo,
    seo
  },
  null,
  2
)};
`;
  }

  /**
   * Salva arquivo de dados TypeScript
   */
  async saveNextJSData(data, filename = 'noticias-data.ts') {
    const tsData = this.generateNextJSData(data);
    const outputDir = path.join(__dirname, '../output');
    await fs.mkdir(outputDir, { recursive: true });

    const filepath = path.join(outputDir, filename);
    await fs.writeFile(filepath, tsData, 'utf-8');

    console.log(`✅ Arquivo de dados TypeScript salvo em: ${filepath}`);
    return filepath;
  }
}

module.exports = PraiaGrandeNewsService;
