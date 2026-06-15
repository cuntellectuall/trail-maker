import React, { useState } from 'react';
import { DecisionNode } from '../types';
import { 
  AlertTriangle, 
  Activity, 
  Cpu, 
  Shield, 
  Download, 
  Send, 
  Sparkles, 
  RefreshCw, 
  ArrowRight, 
  Zap, 
  HelpCircle,
  X,
  MessageCircle
} from 'lucide-react';

interface InterventionsLogProps {
  decisions: DecisionNode[];
  onSelectNode: (nodeId: string) => void;
}

interface InterventionItem {
  id: string;
  nodeTag: string;
  time: string;
  title: string;
  aiSuggestion: string;
  defense: string;
  description: string;
  integrityImpact: string;
  latency: string;
  biasDrift: string;
  entropyValue: string;
}

export default function InterventionsLog({ decisions, onSelectNode }: InterventionsLogProps) {
  
  // Custom mock base list matching reference screenshot exactly
  const defaultInterventions: InterventionItem[] = [
    {
      id: 'node-alpha-04',
      nodeTag: 'NODE-ALPHA-04',
      time: '14:22:01',
      title: 'Controle Manual',
      aiSuggestion: 'Utilizar padrão "Bento" para grid de arquivos e simetria de catálogo.',
      defense: 'Recusar. Aplicar assimetria brutalista para evocar desordem informacional e resistir ao padrão corporativo.',
      description: 'IA sugeriu um padrão genérico de layout; Designer forçou uma referência histórica baseada em interfaces de mainframe dos anos 1970.',
      integrityImpact: '+12%',
      latency: '12ms',
      biasDrift: '0.002%',
      entropyValue: '0.12'
    },
    {
      id: 'node-epsilon-09',
      nodeTag: 'NODE-EPSILON-09',
      time: '13:45:12',
      title: 'Reinserção Contextual',
      aiSuggestion: 'Remover metadados conflitantes e simplificar logs operacionais para maior clareza comercial.',
      defense: 'Preservar intencionalmente o ruído estético para injetar micro-atritos analógicos e salvar a sensação tátil.',
      description: 'O sistema removeu metadados conflitantes para maximizar a clareza; Designer reinseriu o ruído para preservar a nuance.',
      integrityImpact: '+04%',
      latency: '8ms',
      biasDrift: '0.005%',
      entropyValue: '0.24'
    },
    {
      id: 'node-zeta-12',
      nodeTag: 'NODE-ZETA-12',
      time: '12:10:55',
      title: 'Controle Manual',
      aiSuggestion: 'Geração automatizada de textos promocionais polidos para engajamento rápido de usuários.',
      defense: 'Rejeitar copywriting automatizado sintético. Escrever copy agressivamente conceitual e poético de punho humano.',
      description: 'A autogeração de texto de marca foi rejeitada. Escrita humana iniciada para garantir distanciamento crítico frente ao clichê.',
      integrityImpact: '+22%',
      latency: '15ms',
      biasDrift: '0.001%',
      entropyValue: '0.08'
    }
  ];

  // Map any user interventions created in the app into the item feed
  const activeUserNodes = decisions.filter(
    d => d.classification === 'recusei' || d.classification === 'confrontei' || d.classification === 'recontextualizei'
  );

  const formattedUserInterventions: InterventionItem[] = activeUserNodes.map((node, i) => ({
    id: node.id,
    nodeTag: `NÓ-${node.id.toUpperCase()}`,
    time: new Date(node.date).toLocaleTimeString('pt-BR'),
    title: node.classification === 'recusei' ? 'Controle Manual' : node.classification === 'confrontei' ? 'Intervenção Ativa' : 'Reinserção Contextual',
    aiSuggestion: node.aiSuggestion.replace(/\[.*?\]\s*/g, ''),
    defense: node.defense,
    description: node.defense,
    integrityImpact: `+${10 + i * 4}%`,
    latency: `${10 + i * 2}ms`,
    biasDrift: `0.00${i + 2}%`,
    entropyValue: '0.15'
  }));

  // Combine lists with user notifications coming first
  const allInterventionsList = [...formattedUserInterventions, ...defaultInterventions];

  // Selected item state for the sidebar report
  const [selectedIntervention, setSelectedIntervention] = useState<InterventionItem>(allInterventionsList[0]);

  // Simulated metrics that dynamically change on tool click
  const [driftDistance, setDriftDistance] = useState<number>(42.4);
  const [driftEntropy, setDriftEntropy] = useState<number>(0.12);
  const [entropyStatus, setEntropyStatus] = useState<string>('ESTÁVEL');
  const [visualState, setVisualState] = useState<'normal' | 'human' | 'noise' | 'override'>('normal');

  // Input message state for simulation
  const [chatInput, setChatInput] = useState<string>('');
  const [conversation, setConversation] = useState<Array<{ sender: 'ia' | 'designer'; text: string }>>([
    { sender: 'ia', text: selectedIntervention.aiSuggestion },
    { sender: 'designer', text: selectedIntervention.defense }
  ]);

  // Adjust conversation whenever the active card changes
  React.useEffect(() => {
    setConversation([
      { sender: 'ia', text: selectedIntervention.aiSuggestion },
      { sender: 'designer', text: selectedIntervention.defense }
    ]);
  }, [selectedIntervention]);

  // State toast feedback
  const [alertToast, setAlertToast] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Trigger simulated actions from the Recontextualization Tools
  const handleToolClick = (toolType: 'force_human' | 'inject_noise' | 'reset_heuristic' | 'manual_override') => {
    if (toolType === 'force_human') {
      setDriftDistance(12.5);
      setDriftEntropy(0.04);
      setEntropyStatus('SÓLIDA ESTABILIDADE');
      setVisualState('human');
      setAlertToast('Referência humana forçada! Retração imediata da deriva generativa.');
    } else if (toolType === 'inject_noise') {
      setDriftDistance(78.2);
      setDriftEntropy(0.89);
      setEntropyStatus('ALTA VARIÂNCIA');
      setVisualState('noise');
      setAlertToast('Ruído aleatório injetado! Tensão criativa forçada na rede neural.');
    } else if (toolType === 'reset_heuristic') {
      setDriftDistance(42.4);
      setDriftEntropy(0.12);
      setEntropyStatus('ESTÁVEL');
      setVisualState('normal');
      setAlertToast('Heurísticas de controle resetadas para o nível base.');
    } else if (toolType === 'manual_override') {
      setDriftDistance(0.0);
      setDriftEntropy(0.01);
      setEntropyStatus('INTEGRIDADE ABSOLUTA');
      setVisualState('override');
      setAlertToast('AUDITORIA DE ANULAÇÃO: Domínio absoluto do design humano estabelecido.');
    }

    setTimeout(() => {
      setAlertToast(null);
    }, 4000);
  };

  // Submit messages into the dialogue chat area
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const currentMsg = chatInput;
    const nextConversation = [
      ...conversation,
      { sender: 'designer' as const, text: currentMsg }
    ];
    setConversation(nextConversation);
    setChatInput('');

    // Instant automated smart simulated AI reaction in Portuguese
    setTimeout(() => {
      let reply = 'Ação de resistência mapeada. Entropia recalibrada para acomodar sua decisão.';
      if (currentMsg.toLowerCase().includes('recusar') || currentMsg.toLowerCase().includes('negar')) {
        reply = 'Anulação executada. Solução padronizada removida do canvas operacional.';
      } else if (currentMsg.toLowerCase().includes('ruído') || currentMsg.toLowerCase().includes('sujeira')) {
        reply = 'Ruído injetado com sucesso. Parâmetros estocásticos de usabilidade alterados.';
      }

      setConversation([
        ...nextConversation,
        { sender: 'ia' as const, text: reply }
      ]);
    }, 800);
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row bg-[#030712]" id="interventions-workspace-root">
      
      {/* LEFT AREA: Title, Drift Radar Dashboard, Actions, and Dynamic Feed lists */}
      <div className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto" id="interventions-viewport-main">
        
        {/* Top Badges and Titles */}
        <div>
          <span className="font-mono text-[9px] font-black tracking-[0.22em] text-[#ec4899] bg-[#ec4899]/10 border border-[#ec4899]/25 px-2 py-0.5 rounded inline-block mb-2 uppercase">
            OPERAÇÃO DE ALTO NÍVEL
          </span>
          <h1 className="font-sans text-3xl font-extrabold text-white tracking-tight uppercase">
            INTERVENÇÕES
          </h1>
          <p className="text-slate-400 font-medium text-xs md:text-sm mt-1.5">
            Controle de Autoria e Recontextualização Crítica
          </p>
        </div>

        {/* Dynamic Two-Column Main Layout: Gauge panel + Intervention items list */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6" id="interventions-bento-split">
          
          {/* LEFT COLUMN: Authorial Drift Monitor & Tools */}
          <div className="space-y-6 flex flex-col justify-between" id="drift-panel-sub">
            
            {/* Monitor Box Wrapper */}
            <div className="relative w-full h-[280px] bg-[#070e1d] border border-white/10 rounded-sm p-5 overflow-hidden select-none flex flex-col justify-between shadow-lg" id="authorial-drift-wrapper">
              
              {/* Subtle background static grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
              
              {/* Spinning or glowing radial glow depending on visual override state */}
              <div className={`absolute inset-0 pointer-events-none transition-all duration-500 bg-[radial-gradient(circle_at_50%_60%,rgba(139,92,246,0.06)_0%,transparent_70%)] ${
                visualState === 'noise' ? 'bg-[radial-gradient(circle_at_50%_60%,rgba(236,72,153,0.1)_0%,transparent_60%)]' :
                visualState === 'override' ? 'bg-[radial-gradient(circle_at_50%_60%,rgba(244,63,94,0.12)_0%,transparent_50%)]' : ''
              }`} />

              {/* Title Header with live feed indicators */}
              <div className="relative z-10 flex justify-between items-center">
                <div>
                  <h3 className="font-mono text-[10px] font-extrabold tracking-wider text-slate-300">
                    AUTHORIAL DRIFT MONITOR
                  </h3>
                  <p className="text-[9px] text-slate-500 font-bold mt-0.5">
                    Mapeamento de Desvio Criativo (Real-time)
                  </p>
                </div>
                {/* Live pulsing feedback badge */}
                <div className="flex items-center gap-1.5 bg-[#ec4899]/10 border border-[#ec4899]/20 px-2.5 py-1 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ec4899] animate-ping" />
                  <span className="font-mono text-[8px] font-black text-[#ec4899] tracking-widest uppercase">
                    LIVE FEED
                  </span>
                </div>
              </div>

              {/* Radial Connected vector graphic showing drift curve */}
              <div className="relative w-full h-28 flex items-center justify-center" id="live-drift-graph">
                <svg className="w-full h-full" viewBox="0 0 240 100">
                  {/* Outer safety radar orbit tracks */}
                  <circle cx="120" cy="90" r="75" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="3 3 shrink-0" />
                  <circle cx="120" cy="90" r="45" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                  
                  {/* Straight direct baseline intent track */}
                  <line 
                    x1="60" y1="80" 
                    x2="180" y2="30" 
                    stroke="rgba(139,92,246,0.15)" 
                    strokeWidth="1" 
                    strokeDasharray="4 4" 
                  />

                  {/* Dynamic interactive deviation curve line */}
                  <path
                    d={
                      visualState === 'human' ? "M 60 80 Q 120 55 180 30" : 
                      visualState === 'noise' ? "M 60 80 Q 90 20 150 10 T 180 30" :
                      visualState === 'override' ? "M 60 80 L 180 30" :
                      "M 60 80 Q 140 25 180 30" // standard path
                    }
                    fill="none"
                    stroke={visualState === 'override' ? '#f43f5e' : visualState === 'noise' ? '#ec4899' : '#8b5cf6'}
                    strokeWidth={visualState === 'override' ? '3' : '2'}
                    className="transition-all duration-700 ease-in-out"
                  />

                  {/* Pulsating interactive node points for HUMAN INTENT and AI PREDICTION */}
                  {/* 1. Human Left base */}
                  <g className="cursor-pointer" transform="translate(60, 80)">
                    <circle r="5" fill="#030712" stroke="#ec4899" strokeWidth="2" />
                    <text x="-8" y="16" className="text-[7px] font-black font-mono fill-slate-500" textAnchor="middle">
                      HUMAN_INTENT
                    </text>
                  </g>

                  {/* 2. AI right prediction goal */}
                  <g className="cursor-pointer animate-pulse" transform="translate(180, 30)">
                    <circle r="5" fill="#030712" stroke="#a78bfa" strokeWidth="2" />
                    <text x="5" y="-10" className="text-[7px] font-black font-mono fill-violet-400" textAnchor="middle">
                      AI_PREDICTION
                    </text>
                  </g>

                  {/* 3. Floating jitter wave node tracker representing drift noise */}
                  {visualState === 'noise' && (
                    <circle cx="110" cy="22" r="3.5" fill="#f43f5e" className="animate-ping" />
                  )}
                </svg>
              </div>

              {/* Distancia and Entopia live readout parameters */}
              <div className="relative z-10 flex justify-between items-center font-mono border-t border-white/5 pt-3 mt-1 text-[10px]">
                <div className="space-y-0.5">
                  <span className="text-slate-500 block font-bold">DISTÂNCIA DE DESVIO:</span>
                  <span className="text-[#dce2f7] font-black block text-sm transition-all duration-500">
                    {driftDistance.toFixed(1)}pt
                  </span>
                </div>
                <div className="space-y-0.5 text-right">
                  <span className="text-slate-500 block font-bold">ENTROPIA ATUAL:</span>
                  <span className="text-violet-400 font-extrabold block text-sm transition-all duration-500">
                    {driftEntropy.toFixed(2)}
                  </span>
                </div>
              </div>

            </div>

            {/* Recontextualization Tools Widget */}
            <div className="bg-[#070e1d]/40 border border-white/5 p-5 rounded-sm" id="recontextualization-tools-box">
              <span className="text-[9px] font-mono text-slate-500 font-extrabold tracking-widest uppercase block mb-3">
                FERRAMENTAS DE RECONTEXTUALIZAÇÃO
              </span>
              
              <div className="grid grid-cols-2 gap-3" id="tools-buttons-grid">
                
                {/* Tool Button 1: Force human reference */}
                <button
                  type="button"
                  onClick={() => handleToolClick('force_human')}
                  className="py-3 px-3 bg-slate-950 hover:bg-white/5 border border-white/10 hover:border-violet-500/30 text-slate-200 hover:text-white rounded transition-all text-left flex flex-col justify-between h-20 group cursor-pointer"
                  id="btn-force-human"
                >
                  <Activity className="w-4 h-4 text-violet-400 group-hover:scale-110 transition-all" />
                  <span className="text-[10px] uppercase font-black tracking-wide leading-tight">
                    Forçar Ref. Humana
                  </span>
                </button>

                {/* Tool Button 2: Inject noise */}
                <button
                  type="button"
                  onClick={() => handleToolClick('inject_noise')}
                  className="py-3 px-3 bg-slate-950 hover:bg-white/5 border border-white/10 hover:border-[#ec4899]/30 text-slate-200 hover:text-white rounded transition-all text-left flex flex-col justify-between h-20 group cursor-pointer"
                  id="btn-inject-noise"
                >
                  <Sparkles className="w-4 h-4 text-[#ec4899] group-hover:animate-spin transition-all" />
                  <span className="text-[10px] uppercase font-black tracking-wide leading-tight">
                    Injetar Ruído Criativo
                  </span>
                </button>

                {/* Tool Button 3: Reset heuristic */}
                <button
                  type="button"
                  onClick={() => handleToolClick('reset_heuristic')}
                  className="py-3 px-3 bg-slate-950 hover:bg-white/5 border border-white/10 hover:border-slate-500/35 text-slate-200 hover:text-white rounded transition-all text-left flex flex-col justify-between h-20 group cursor-pointer"
                  id="btn-reset-heuristic"
                >
                  <RefreshCw className="w-4 h-4 text-slate-400 group-hover:rotate-180 transition-all duration-500" />
                  <span className="text-[10px] uppercase font-black tracking-wide leading-tight">
                    Resetar Heurística
                  </span>
                </button>

                {/* Tool Button 4: Manual Override (Anulação / Controle em cor vermelha) */}
                <button
                  type="button"
                  onClick={() => handleToolClick('manual_override')}
                  className="py-3 px-3 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/35 hover:border-rose-500 text-rose-300 hover:text-rose-100 rounded transition-all text-left flex flex-col justify-between h-20 group cursor-pointer shadow-md shadow-rose-950/20"
                  id="btn-trigger-manual-override"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-450 group-hover:scale-110 tracking-widest animate-pulse" />
                  <span className="text-[10px] uppercase font-black tracking-wide leading-tight">
                    Controle Manual
                  </span>
                </button>

              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Active Intervention Feed lists */}
          <div className="space-y-4" id="active-feed-sub">
            
            {/* List Header and Sorter representation */}
            <div className="flex justify-between items-center px-1">
              <h3 className="text-[10px] font-mono font-extrabold tracking-wider text-slate-400">
                ACTIVE INTERVENTION FEED
              </h3>
              <span className="text-[8px] font-mono text-slate-500 tracking-wider">
                ORDEM: RECENTES
              </span>
            </div>

            {/* List of custom visual feed cards */}
            <div className="space-y-4" id="interventions-feed-list">
              {allInterventionsList.map((item) => {
                const isActive = selectedIntervention.id === item.id;
                
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedIntervention(item)}
                    className={`p-4 bg-slate-900/40 rounded border text-left cursor-pointer transition-all duration-300 flex flex-col justify-between hover:scale-[1.01] ${
                      isActive 
                        ? 'border-violet-500/80 shadow-[0_0_12px_rgba(139,92,246,0.15)] bg-violet-950/10' 
                        : 'border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div>
                      {/* Metadata tag header line */}
                      <div className="flex justify-between items-center mb-2.5">
                        <span className="px-2 py-0.5 bg-violet-950/40 border border-violet-500/20 rounded-sm font-mono text-[8px] font-extrabold text-[#a28eff] tracking-widest">
                          {item.nodeTag}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500 font-bold">
                          {item.time}
                        </span>
                      </div>

                      {/* Main intervention card custom text details */}
                      <h4 className="font-sans text-xs font-extrabold uppercase tracking-wider text-slate-100 mb-1.5 leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-[11.5px] text-slate-400 leading-relaxed font-sans line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    {/* Return arrow impacts indicator */}
                    <div className="mt-3 pt-2.5 border-t border-white/5 flex justify-between items-center">
                      <span className="font-mono text-[9px] text-emerald-400 font-bold uppercase tracking-wider">
                        Efeito na Integridade: {item.integrityImpact}
                      </span>
                      <ArrowRight className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                        isActive ? 'translate-x-1 text-violet-400' : ''
                      }`} />
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

        {/* Global Bottom Status line to replicate the status line under main */}
        <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[9px] font-mono text-slate-550 select-none" id="interventions-layout-footer">
          <div className="flex items-center gap-1.5 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>AGÊNCIA: LIDERADA POR HUMANOS</span>
            <span className="text-slate-700 font-normal">|</span>
            <span>STATUS DE ENTROPIA: {entropyStatus}</span>
          </div>
          <span className="text-slate-600 block">
            RASTRO_CRÍTICO_OS v4.0.2
          </span>
        </div>

      </div>

      {/* RIGHT SIDE AREA: Critical Dialogue (Node analysis sidebar report) */}
      {isSidebarOpen ? (
        <aside className="w-full lg:w-[412px] bg-[#070e1d] border-t lg:border-t-0 lg:border-l border-white/10 p-6 md:p-8 flex flex-col justify-between shrink-0" id="dialogo-de-processo-sidebar">
          
          {/* Upper content stack */}
          <div className="space-y-6 flex-1 flex flex-col">
            
            {/* Header section with elegant standard title and subtle horizontal bar */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 text-slate-400 hover:text-white rounded transition-all cursor-pointer shadow-sm flex items-center justify-center shrink-0"
                id="btn-close-logs-dialogue"
                title="Fechar Diálogo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="flex-1">
                <h2 className="font-sans text-xl font-extrabold text-white tracking-tight uppercase mb-0.5">
                  Diálogo Crítico
                </h2>
                <div className="flex gap-1.5 items-center">
                  <span className="text-[10px] font-mono tracking-wider font-extrabold text-slate-500 uppercase">
                    Diagnóstico de Processos
                  </span>
                  <div className="flex-1 h-[1px] bg-white/5" />
                </div>
              </div>
            </div>

            {/* Connected statistics diagnostic gauges */}
          <div className="bg-slate-950/40 border border-white/5 p-4 rounded-sm space-y-3" id="diagnostics-sub">
            <span className="text-[9px] font-mono text-slate-500 font-extrabold uppercase tracking-widest block mb-1">
              DIAGNÓSTICOS
            </span>
            
            {/* Text details for latency and drift metric indices */}
            <div className="flex justify-between items-center text-[10.5px] font-mono font-bold">
              <div className="space-y-0.5">
                <span className="text-slate-500 uppercase block">LATÊNCIA:</span>
                <span className="text-violet-300 block">
                  {selectedIntervention.latency}
                </span>
              </div>
              <div className="space-y-0.5 text-right">
                <span className="text-slate-500 uppercase block">DERIVA DE VIÉS:</span>
                <span className="text-rose-400 block">
                  {selectedIntervention.biasDrift}
                </span>
              </div>
            </div>

            {/* Custom visual horizontal bar to match image */}
            <div className="w-full h-1.5 rounded-sm bg-slate-800 relative overflow-hidden mt-2">
              <div 
                style={{ width: `${selectedIntervention.id === 'node-alpha-04' ? 18 : selectedIntervention.id === 'node-epsilon-09' ? 44 : 12}%` }}
                className="h-full bg-gradient-to-r from-violet-600 via-pink-500 to-rose-500 transition-all duration-500"
              />
            </div>
          </div>

          {/* Dialogue Transcript Speech bubbles area (AI system vs Human Override) */}
          <div className="flex-1 flex flex-col space-y-4" id="dialogue-transcript-panel">
            <span className="text-[9px] font-mono text-slate-550 font-extrabold tracking-[0.15em] block uppercase mb-1">
              SISTEMA VERSUS AUTOR
            </span>

            {/* Scrollable list containing dialogue statements */}
            <div className="space-y-4 flex-1 overflow-y-auto pr-1 text-xs max-h-[320px] lg:max-h-none" id="bubbles-scroller">
              {conversation.map((msg, index) => {
                const isAI = msg.sender === 'ia';
                
                return (
                  <div
                    key={index}
                    className={`p-3.5 rounded-sm flex flex-col space-y-1.5 transition-all ${
                      isAI 
                        ? 'bg-slate-900 shadow-sm border-l-2 border-slate-500 text-slate-350' 
                        : 'bg-violet-950/25 border border-violet-500/20 border-l-2 border-l-violet-500 text-slate-100 font-semibold'
                    }`}
                  >
                    <span className="font-mono text-[8px] font-black uppercase tracking-wider text-slate-500">
                      {isAI ? 'Sistema Sugeriu:' : 'Controle do Designer:'}
                    </span>
                    <p className={`font-sans leading-relaxed text-[11px] ${isAI ? 'italic' : ''}`}>
                      "{msg.text}"
                    </p>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

        {/* BOTTOM SECTION AREA: Interactive Input with simulated reactions */}
        <div className="pt-4 border-t border-white/5 space-y-4" id="bottom-dialogue-input-section">
          
          {/* Chat Form to input customized override commands */}
          <form onSubmit={handleSendChat} className="relative w-full" id="chat-simulation-form">
            <input 
              type="text" 
              placeholder="Intervir no processo..." 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="w-full bg-slate-950/80 border border-white/10 hover:border-violet-500/30 font-sans text-xs text-white rounded pr-10 pl-3.5 py-3 focus:outline-none focus:border-violet-500/50 transition-colors"
            />
            <button 
              type="submit" 
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-violet-400 hover:text-[#ec4899] active:scale-95 transition-colors cursor-pointer"
              aria-label="Submit override message"
              id="btn-submit-chat-intervention"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>

      </aside>
    ) : (
      <button
        type="button"
        onClick={() => setIsSidebarOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-[#070e1d]/90 hover:bg-violet-950/50 border-l border-t border-b border-white/10 hover:border-violet-500/40 px-2 py-6 rounded-l shadow-[0_0_15px_rgba(124,58,237,0.15)] text-slate-300 hover:text-white transition-all cursor-pointer flex flex-col items-center gap-2 font-mono text-[9px] font-black uppercase tracking-[0.2em] select-none"
        id="btn-reopen-dialogue-logs"
        style={{ writingMode: 'vertical-rl' }}
        title="Abrir Diálogo"
      >
        <MessageCircle className="w-3.5 h-3.5 rotate-90 text-violet-400 mb-1" />
        <span>ABRIR DIÁLOGO CRÍTICO</span>
      </button>
    )}

      {/* Floating feedback alert toast representation */}
      {alertToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#070e1d] border-2 border-violet-500/80 text-white font-sans text-xs py-3 px-5 rounded shadow-[0_4px_30px_rgba(124,58,237,0.3)] flex items-center gap-3 animate-slide-up max-w-sm">
          <Zap className="w-4 h-4 text-violet-400 animate-bounce shrink-0" />
          <span className="font-semibold">{alertToast}</span>
        </div>
      )}

    </div>
  );
}
