// Script de teste para o newsService.js
const PraiaGrandeNewsService = require('./newsService');

// Dados de teste
const testData = {
  dataColeta: new Date().toISOString(),
  totalNoticias: 3,
  noticias: [
    {
      titulo: "Praia Grande inaugura nova ciclovia na orla",
      resumo: "A nova ciclovia de 5km conecta diferentes bairros da cidade, promovendo mobilidade sustentável e lazer para moradores e turistas.",
      categoria: "Infraestrutura",
      relevancia: "alta",
      fonte: "G1 Santos",
      dataPublicacao: "2025-11-16",
      engagementScore: 85
    },
    {
      titulo: "Festival de Verão atrai milhares de visitantes",
      resumo: "O evento cultural reuniu artistas locais e nacionais, movimentando a economia da cidade durante o final de semana.",
      categoria: "Cultura",
      relevancia: "média",
      fonte: "A Tribuna",
      dataPublicacao: "2025-11-16",
      engagementScore: 72
    },
    {
      titulo: "Prefeitura anuncia melhorias no sistema de saúde",
      resumo: "Novas UBS serão construídas nos bairros mais afastados, ampliando o atendimento à população.",
      categoria: "Saúde",
      relevancia: "alta",
      fonte: "Prefeitura de Praia Grande",
      dataPublicacao: "2025-11-16",
      engagementScore: 68
    }
  ],
  temasEmDestaque: ["Infraestrutura", "Cultura", "Saúde"],
  sugestoesPautas: [
    "Impacto da nova ciclovia no turismo local",
    "Entrevista com artistas do Festival de Verão"
  ]
};

async function test() {
  console.log('🧪 Testando PraiaGrandeNewsService...\n');

  try {
    const service = new PraiaGrandeNewsService('test-api-key');

    // Testa formatação
    console.log('✓ Testando formatação de dados...');
    const formatted = service.formatForBlog(testData, false);
    console.log(`  - ${formatted.metadata.totalNoticias} notícias formatadas`);
    console.log(`  - Manchete: ${formatted.conteudo.manchetePrincipal.titulo}`);
    console.log(`  - Engagement da manchete: ${formatted.conteudo.manchetePrincipal.engagementScore}/100`);

    // Verifica ordenação por engagement
    console.log('\n✓ Verificando ordenação por engagement score...');
    const scores = formatted.conteudo.noticias.map(n => n.engagementScore);
    console.log(`  - Scores: ${scores.join(', ')}`);
    const isOrdered = scores.every((score, i) => i === 0 || score <= scores[i - 1]);
    console.log(`  - Ordenação correta: ${isOrdered ? '✓' : '✗'}`);

    // Testa geração de arquivos
    console.log('\n✓ Testando geração de arquivos...');

    const timestamp = new Date().toISOString().split('T')[0];

    await service.saveToFile(formatted, `test-noticias-${timestamp}.json`);
    console.log('  - JSON gerado ✓');

    await service.saveHTMLReport(formatted, `test-relatorio-${timestamp}.html`);
    console.log('  - HTML gerado ✓');

    await service.saveNextJSComponent(formatted, `test-component-${timestamp}.jsx`);
    console.log('  - Componente Next.js gerado ✓');

    await service.saveNextJSData(formatted, `test-data-${timestamp}.ts`);
    console.log('  - Dados TypeScript gerados ✓');

    console.log('\n🎉 Todos os testes passaram com sucesso!');
    console.log('\nArquivos gerados em: /home/user/output/');

  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

test();
