import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export const dynamic = 'force-dynamic';

/**
 * API para publicar notícias (salvar arquivos finais)
 * POST /api/news/publish
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { newsData } = body;

    if (!newsData) {
      return NextResponse.json(
        { error: 'Dados das notícias não fornecidos' },
        { status: 400 }
      );
    }

    // Importa o serviço de notícias
    const PraiaGrandeNewsService = require(path.join(process.cwd(), '../src/newsService.js'));

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Chave da API do OpenAI não configurada' },
        { status: 500 }
      );
    }

    const service = new PraiaGrandeNewsService(apiKey);

    // Gera timestamp para os arquivos
    const timestamp = new Date().toISOString().split('T')[0];

    // Filtra apenas as notícias selecionadas
    const selectedNoticias = newsData.conteudo.noticias.filter((n: any) => n.selected !== false);

    if (selectedNoticias.length === 0) {
      return NextResponse.json(
        { error: 'Nenhuma notícia selecionada para publicação' },
        { status: 400 }
      );
    }

    // Re-formata os dados para incluir o componente Next.js (apenas notícias selecionadas)
    const formattedData = service.formatForBlog({
      dataColeta: newsData.metadata.dataColeta,
      totalNoticias: selectedNoticias.length,
      noticias: selectedNoticias.map((n: any) => ({
        titulo: n.titulo,
        resumo: n.resumo,
        categoria: n.categoria,
        relevancia: n.relevancia,
        fonte: n.fonte,
        url: n.url,
        dataPublicacao: n.dataPublicacao,
        engagementScore: n.engagementScore
      })),
      temasEmDestaque: newsData.conteudo.sidebar.temasEmDestaque,
      sugestoesPautas: newsData.conteudo.sidebar.sugestoesPautas
    }, false); // false = gera componente Next.js

    // Salva todos os arquivos
    const files = await Promise.all([
      service.saveToFile(formattedData, `noticias-${timestamp}.json`),
      service.saveHTMLReport(formattedData, `relatorio-${timestamp}.html`),
      service.saveNextJSComponent(formattedData, `NoticiasPraiaGrande-${timestamp}.jsx`),
      service.saveNextJSData(formattedData, `noticias-data-${timestamp}.ts`)
    ]);

    // Remove preview temporário se existir
    try {
      const fs = require('fs').promises;
      const previewPath = path.join(process.cwd(), '../output/preview-temp.json');
      await fs.unlink(previewPath);
    } catch (error) {
      // Ignora erro se arquivo não existir
    }

    return NextResponse.json({
      success: true,
      message: `${selectedNoticias.length} notícia(s) selecionada(s) publicada(s) com sucesso`,
      files: {
        json: `noticias-${timestamp}.json`,
        html: `relatorio-${timestamp}.html`,
        component: `NoticiasPraiaGrande-${timestamp}.jsx`,
        data: `noticias-data-${timestamp}.ts`
      },
      totalNoticias: selectedNoticias.length,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Erro ao publicar notícias:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro ao publicar notícias',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
