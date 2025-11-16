import { NextRequest, NextResponse } from 'next/server';
import { PraiaGrandeNewsService } from '@/lib/newsService';
import path from 'path';
import { promises as fs } from 'fs';

export const dynamic = 'force-dynamic';

/**
 * API para buscar preview das notícias
 * GET /api/news/preview
 */
export async function GET() {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Chave da API do OpenAI não configurada' },
        { status: 500 }
      );
    }

    const service = new PraiaGrandeNewsService(apiKey);

    // Busca notícias em modo preview
    const newsData = await service.fetchPreview();

    return NextResponse.json({
      success: true,
      data: newsData,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Erro ao buscar preview:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro ao buscar notícias',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

/**
 * API para salvar preview temporário
 * POST /api/news/preview
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

    // Salva preview temporário
    const previewPath = path.join(process.cwd(), '../output/preview-temp.json');

    await fs.writeFile(
      previewPath,
      JSON.stringify(newsData, null, 2),
      'utf-8'
    );

    return NextResponse.json({
      success: true,
      message: 'Preview salvo temporariamente',
      path: previewPath,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Erro ao salvar preview:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro ao salvar preview',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
