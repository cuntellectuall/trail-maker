import { DecisionNode, MetricSummary } from './types';

export const INITIAL_DECISIONS: DecisionNode[] = [
  {
    id: 'node-1',
    title: 'Definição da Paleta de Cores do Painel',
    prompt: 'Crie uma paleta de cores futurista para um painel operacional industrial.',
    aiSuggestion: '[MOTO-GERAÇÃO AUTOMÁTICA] Para o projeto de painel industrial, proponho um clássico arranjo de azul cobalto (#0D47A1) combinado com cinza asfalto polido (#212121), além de verdes puros (#4CAF50) para sinalizadores ativos. Este conjunto gera respostas estatísticas positivas de 89.4% em testes de usabilidade corporativa baseados em convenção mercadológica atual.',
    classification: 'editei',
    defense: 'Modifiquei a sugestão rejeitando o azul cobalto genérico. No lugar, inseri um tom roxo profundo de "digital obsidian" com flashes de ultravioleta fosco para reverter o cansaço visual e dar uma identidade tátil-tecnológica incomum.',
    systemResponse: '[PRESERVAÇÃO DO INTERVENÇÃO] O designer rejeitou com sucesso o padrão estatístico de usabilidade repetitiva. A introdução do ultravioleta quebra o marasmo corporativo e força o operador a se atentar a detalhes projetuais independentes.',
    date: '2026-05-22T10:15:00Z',
    agencyWeight: { human: 65, ai: 35 }
  },
  {
    id: 'node-2',
    title: 'Layout de Cartões e Elementos Informativos',
    prompt: 'Crie uma visualização para ler as integridades de hardware do sismógrafo orbital.',
    aiSuggestion: '[MOTO-GERAÇÃO AUTOMÁTICA] Sugiro um grid perfeitamente simétrico de 12 colunas com cartões idênticos de vidro translúcido (efeito glassmorphism), sombra padrão (shadow-lg) e um valor numérico imponente com tipografia Inter Bold 48px.',
    classification: 'aceitei',
    defense: 'Aceitei a simetria operacional para acelerar a entrega do protótipo base, sob risco consciente de criar uma interface homogênea idêntica a outros mil sismógrafos automáticos.',
    systemResponse: '[ALERTA DE PASSIVIDADE] Cuidado: A aceitação de grids padrão sem alteração gera interfaces estéreis e idênticas. O designer abdicou do senso estético para priorizar velocidade puramente comercial.',
    date: '2026-05-22T11:20:00Z',
    agencyWeight: { human: 10, ai: 90 }
  },
  {
    id: 'node-3',
    title: 'Seleção do Tom de Voz para Alertas Atmosféricos',
    prompt: 'Crie microtextos de alerta urgente sobre flutuações severas nas comunicações.',
    aiSuggestion: '[MOTO-GERAÇÃO AUTOMÁTICA] Recomendação de aviso: "Erro Crítico: Flutuação identificada. Contate o suporte do sistema para restabelecer os protocolos de segurança corporativos padrão."',
    classification: 'confrontei',
    defense: 'Substituí a linguagem técnica alienante por microtextos cruamente poéticos e diretos: "A órbita perdeu o sinal. O vazio digital voltou.". Isso choca o manipulador e reintroduz apelo humano imediato ao erro.',
    systemResponse: '[NÚCLEO CRÍTICO] Excelente desvio de rota. O uso do vocabulário estético-poético recontextualiza o pânico operacional, lembrando ao usuário que interfaces são feitas por e para seres humanos, não robôs síncronos.',
    date: '2026-05-22T13:45:00Z',
    agencyWeight: { human: 85, ai: 15 }
  },
  {
    id: 'node-4',
    title: 'Sinalizador do Processamento de Feedback',
    prompt: 'Desenhe um loader icônico para feedbacks críticos de decisão no canvas.',
    aiSuggestion: '[MOTO-GERAÇÃO AUTOMÁTICA] Desenhe um círculo giratório roxo padrão de 24px com esmaecimento contínuo em 360 graus.',
    classification: 'recusei',
    defense: 'Rejeitei o círculo giratório tradicional de loader. Desenhei um indicador estático analógico que treme levemente conforme a integridade do rastro se altera, forçando feedback de feedback.',
    systemResponse: '[CONFRONTO AUTORAL] O designer recusa o clichê da animação infinita que dopa o usuário na espera. Um indicador mecânico que reage ao comportamento é uma bela afirmação de autoria.',
    date: '2026-05-22T14:10:00Z',
    agencyWeight: { human: 95, ai: 5 }
  }
];

export const INITIAL_METRICS: MetricSummary = {
  aiDependency: 'Média',
  criticalIntervention: 'Alta',
  genericRisk: 'Médio',
  humanContext: 'Resistente',
  summaryQuote: 'Sua cartografia revela uma resistência saudável. Você desvia constantemente dos caminhos confortáveis de imagem sugeridos pelas Redes Neurais sintéticas, forçando o painel a adotar tom e textura eminentemente singulares.'
};

export const INITIAL_PROJECTS: {
  id: string;
  name: string;
  createdAt: string;
  decisions: DecisionNode[];
  metrics: MetricSummary | null;
}[] = [
  {
    id: 'proj-1',
    name: 'Operação Colapso - Monitor Orbital',
    createdAt: '2026-05-22T09:00:00Z',
    decisions: INITIAL_DECISIONS,
    metrics: INITIAL_METRICS
  },
  {
    id: 'proj-2',
    name: 'Branding Especulativo — Giga-Vazio',
    createdAt: '2026-05-21T14:30:00Z',
    decisions: [
      {
        id: 'node-101',
        title: 'Manifesto Antropomórfico da Marca',
        prompt: 'Escreva um slogan de impacto para a nova marca.',
        aiSuggestion: '[MOTO-GERAÇÃO AUTOMÁTICA] Slogan: "Automatizando conexões, simplificando futuros de alta performance empresarial."',
        classification: 'recontextualizei',
        defense: 'Rejeitei a performance e criei: "No vazio da máquina, o rastro do designer desenha o erro.". Uma apologia à falha programada.',
        systemResponse: '[NÚCLEO CRÍTICO] Recontextualizar a falha como ativo estético é o auge do design de atrito.',
        date: '2026-05-21T15:00:00Z',
        agencyWeight: { human: 90, ai: 10 }
      }
    ],
    metrics: {
      aiDependency: 'Baixa',
      criticalIntervention: 'Alta',
      genericRisk: 'Baixo',
      humanContext: 'Resistente',
      summaryQuote: 'Projeto extremamente experimental focado em questionar a linguagem promocional das plataformas de IA de alta eficiência.'
    }
  }
];

// Instructive Diálogo Crítico prompts
export const CRITICAL_PROVOCATIONS = [
  {
    category: 'Incitação do Sistema',
    question: 'Você consegue defender essa escolha sem mencionar a IA?',
    description: 'Destaque como a decisão melhora o projeto exclusivamente pela ótica de repertório técnico e uso real.',
    icon: 'Brain'
  },
  {
    category: 'Avaliação Estética',
    question: 'Esta solução de design resolve o problema ou apenas parece visualmente correta?',
    description: 'Investigue se os padrões visuais clonados não ocultam um esqueleto fraco nas decisões de fluxo.',
    icon: 'Eye'
  },
  {
    category: 'Autoria Projetual',
    question: 'O que exatamente nesta entrega mostra sua leitura única como designer?',
    description: 'Procure de forma ruthles pelo rastro do seu repertório, cultura local e desobediência funcional.',
    icon: 'Fingerprint'
  },
  {
    category: 'Análise de Contexto',
    question: 'Que referência humana, cultural ou histórica sustenta essa decisão de roteamento?',
    description: 'Esboce a conexão lógica com fontes autênticas fora das bibliotecas de treino sintético padrão.',
    icon: 'History'
  }
];
