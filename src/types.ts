export type DecisionClassification =
  | 'aceitei' // Aceitei da IA
  | 'editei' // Editei a IA
  | 'recusei' // Recusei
  | 'confrontei' // Confrontei
  | 'recontextualizei'; // Recontextualizei

export interface DecisionNode {
  id: string;
  title: string;
  prompt: string;
  aiSuggestion: string;
  classification: DecisionClassification;
  defense: string;
  systemResponse: string;
  date: string;
  agencyWeight: {
    human: number;
    ai: number;
  };
}

export interface MetricSummary {
  aiDependency: 'Alta' | 'Média' | 'Baixa';
  criticalIntervention: 'Alta' | 'Média' | 'Baixa';
  genericRisk: 'Alto' | 'Médio' | 'Baixo';
  humanContext: 'Frágil' | 'Moderado' | 'Resistente';
  summaryQuote: string;
}

export interface AppState {
  projects: {
    id: string;
    name: string;
    createdAt: string;
    decisions: DecisionNode[];
    metrics: MetricSummary | null;
  }[];
  activeProjectId: string;
  activeDecisionNodeId: string | null;
  protectionMode: boolean;
  systemIntegrity: number; // 0-100%
}
