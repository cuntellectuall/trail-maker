import React, { useState, useEffect } from 'react';
import { DecisionNode } from '../types';
import { 
  GitCommit, 
  AlertTriangle, 
  Workflow, 
  Brain, 
  User2, 
  Laptop, 
  Settings, 
  Cpu, 
  Shield, 
  Sparkles, 
  Activity, 
  ArrowRight, 
  Download, 
  Share2 
} from 'lucide-react';

interface NodesOfAgencyProps {
  decisions: DecisionNode[];
  onUpdateWeights: (nodeId: string, human: number, ai: number) => void;
  onSelectNode: (nodeId: string) => void;
  activeNodeId: string | null;
}

export default function NodesOfAgency({
  decisions,
  onUpdateWeights,
  onSelectNode,
  activeNodeId
}: NodesOfAgencyProps) {
  
  // Local state to keep track of selected node index (0-3) for visual map
  // If activeNodeId matches any of the decisions, we select that one, otherwise default to 2 (Execution Phase)
  const [selectedIdx, setSelectedIdx] = useState<number>(2);

  useEffect(() => {
    if (activeNodeId) {
      const idx = decisions.findIndex(d => d.id === activeNodeId);
      if (idx !== -1 && idx < 4) {
        setSelectedIdx(idx);
      }
    }
  }, [activeNodeId, decisions]);

  const handleNodeClick = (idx: number) => {
    setSelectedIdx(idx);
    if (decisions[idx]) {
      onSelectNode(decisions[idx].id);
    }
  };

  // Safe fallback if fewer nodes are registered
  const getNodeTitle = (idx: number, fallback: string) => {
    return decisions[idx]?.title || fallback;
  };

  const getWeightHuman = (idx: number, fallback: number) => {
    return decisions[idx]?.agencyWeight?.human ?? fallback;
  };

  const getWeightAI = (idx: number, fallback: number) => {
    return decisions[idx]?.agencyWeight?.ai ?? fallback;
  };

  const currentHumanWeight = getWeightHuman(selectedIdx, selectedIdx === 0 ? 85 : selectedIdx === 1 ? 65 : selectedIdx === 2 ? 45 : 20);
  const currentAIWeight = getWeightAI(selectedIdx, selectedIdx === 0 ? 15 : selectedIdx === 1 ? 35 : selectedIdx === 2 ? 55 : 80);

  const getCollaborationType = (human: number) => {
    if (human >= 80) return { label: 'Liderança Soberana', desc: 'Direção cognitiva de design soberano' };
    if (human >= 60) return { label: 'Visão Aumentada', desc: 'Curadoria assistida de alta autoria' };
    if (human >= 40) return { label: 'Fricção Criativa', desc: 'Tensão simbiótica ativa humano-máquina' };
    return { label: 'Deriva Autônoma', desc: 'Perda assistida de controle do conceito' };
  };

  const colab = getCollaborationType(currentHumanWeight);

  // Export report action with stylish feedback toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const handleExport = () => {
    setToastMsg("Relatório de Auditoria Exportado com Sucesso!");
    setTimeout(() => {
      setToastMsg(null);
    }, 3000);
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row bg-[#030712]" id="nodes-of-agency-layout">
      
      {/* LEFT AREA: Central interactive diagram and Bento cards */}
      <div className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto" id="nodes-main-area">
        
        {/* Header Section */}
        <div>
          <span className="font-mono text-[9px] font-black tracking-[0.22em] text-[#ec4899] bg-[#ec4899]/10 border border-[#ec4899]/25 px-2 py-0.5 rounded inline-block mb-2 uppercase">
            OPERAÇÃO DE ALTO NÍVEL
          </span>
          <h1 className="font-sans text-3xl font-extrabold text-white tracking-tight uppercase">
            Nós de Agência
          </h1>
          <p className="text-slate-400 font-medium text-xs md:text-sm mt-1.5">
            Cartografia de Interferência e Autoria: Audite o equilíbrio de poder entre criatividade humana e automação algorítmica.
          </p>
        </div>

        {/* Dynamic Canvas / Diagram Box */}
        <div className="relative w-full h-[380px] bg-[#070e1d]/80 rounded border border-white/10 overflow-hidden flex flex-col justify-between p-6 select-none shadow-[0_4px_30px_rgba(0,0,0,0.5)]" id="nodes-canvas-container">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:18px_18px]" id="grid-pattern-overlay"></div>
          
          {/* Glowing central radial background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(124,58,237,0.06)_0%,transparent_75%)]" id="glowing-bg"></div>

          {/* Svg connection path lines behind cards */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" id="svg-connections">
            {/* From Briefing to Conceptualization */}
            <line 
              x1="20%" y1="52%" 
              x2="40%" y2="35%" 
              stroke="rgba(139,92,246,0.2)" 
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            {/* From Conceptualization to Diamond */}
            <line 
              x1="40%" y1="35%" 
              x2="55%" y2="45%" 
              stroke="rgba(139,92,246,0.3)" 
              strokeWidth="2" 
            />
            {/* From Diamond to Execution Alpha */}
            <line 
              x1="55%" y1="45%" 
              x2="55%" y2="65%" 
              stroke="#8b5cf6" 
              strokeWidth="2.5" 
              className="animate-pulse"
            />
            {/* From Diamond/Execution to Refinement */}
            <line 
              x1="55%" y1="45%" 
              x2="78%" y2="35%" 
              stroke="rgba(139,92,246,0.2)" 
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          </svg>

          {/* 1. NODE 01: Briefing */}
          <div 
            style={{ left: '10%', top: '38%' }}
            className="absolute z-10 text-center cursor-pointer transition-all duration-300"
            onClick={() => handleNodeClick(0)}
            id="node-map-briefing"
          >
            {/* Pink glowing dot */}
            <div className={`w-3.5 h-3.5 mx-auto rounded-full mb-3.5 transition-all ${
              selectedIdx === 0 
                ? 'bg-[#ec4899] ring-4 ring-[#ec4899]/30 shadow-[0_0_15px_#ec4899]' 
                : 'bg-[#ec4899]/60 hover:bg-[#ec4899]'
            }`} />
            
            <div className={`px-4 py-2.5 bg-[#0b1220]/90 border rounded w-[112px] text-center transition-all ${
              selectedIdx === 0 
                ? 'border-violet-500 shadow-[0_0_15px_rgba(124,58,237,0.15)] ring-1 ring-violet-500/20' 
                : 'border-white/10 hover:border-white/20'
            }`}>
              <span className="font-mono text-[9px] text-slate-500 font-bold block leading-none mb-1">
                01
              </span>
              <span className="text-[11px] font-sans font-extrabold text-[#dce2f7] block">
                Briefing
              </span>
              {/* Custom indicator dots under text */}
              <div className="flex justify-center gap-1 mt-1.5">
                <span className="w-1 h-1 rounded-full bg-violet-400"></span>
                <span className="w-1 h-1 rounded-full bg-violet-400"></span>
                <span className="w-1 h-1 rounded-full bg-slate-700"></span>
              </div>
            </div>
          </div>

          {/* 2. NODE 02: Conceptualization */}
          <div 
            style={{ left: '30%', top: '18%' }}
            className="absolute z-10 text-center cursor-pointer transition-all duration-300"
            onClick={() => handleNodeClick(1)}
            id="node-map-conceptualization"
          >
            {/* Violet glowing dot */}
            <div className={`w-3.5 h-3.5 mx-auto rounded-full mb-3.5 transition-all ${
              selectedIdx === 1 
                ? 'bg-violet-400 ring-4 ring-violet-500/30 shadow-[0_0_15px_#a78bfa]' 
                : 'bg-violet-400/60 hover:bg-violet-400'
            }`} />
            
            <div className={`px-4 py-2.5 bg-[#0b1220]/90 border rounded w-[136px] text-center transition-all ${
              selectedIdx === 1 
                ? 'border-violet-500 shadow-[0_0_15px_rgba(124,58,237,0.15)] ring-1 ring-violet-500/20' 
                : 'border-white/10 hover:border-white/20'
            }`}>
              <span className="font-mono text-[9px] text-slate-500 font-bold block leading-none mb-1">
                02
              </span>
              <span className="text-[11px] font-sans font-extrabold text-[#dce2f7] block truncate">
                Conceituação
              </span>
              {/* Custom indicator dots under text */}
              <div className="flex justify-center gap-1 mt-1.5">
                <span className="w-1 h-1 rounded-full bg-violet-400"></span>
                <span className="w-1 h-1 rounded-full bg-violet-400"></span>
                <span className="w-1 h-1 rounded-full bg-slate-700"></span>
              </div>
            </div>
          </div>

          {/* 3. CENTRAL DIAMOND */}
          <div 
            style={{ left: '53.5%', top: '40%' }}
            className="absolute z-20 pointer-events-none transition-all duration-300 transform -translate-x-1/2"
            id="connector-diamond"
          >
            <div className="w-7 h-7 rotate-45 border border-violet-500/60 bg-slate-950 flex items-center justify-center shadow-[0_0_10px_rgba(139,92,246,0.3)]">
              <div className="w-2.5 h-2.5 bg-violet-400 rotate-45" />
            </div>
          </div>

          {/* 4. NODE 03: ACTIVE AUDIT - Execution Alpha */}
          <div 
            style={{ left: '39%', top: '60%' }}
            className="absolute z-20 cursor-pointer transition-all duration-300"
            onClick={() => handleNodeClick(2)}
            id="node-map-execution"
          >
            <div className={`px-5 py-3.5 bg-slate-900 border-2 rounded-sm text-center transition-all min-w-[190px] ${
              selectedIdx === 2 
                ? 'border-violet-500 shadow-[0_0_20px_rgba(124,58,237,0.45)] scale-[1.02]' 
                : 'border-violet-500/40 hover:border-violet-500 shadow-[0_0_10px_rgba(124,58,237,0.15)]'
            }`}>
              <span className="font-mono text-[8px] font-bold uppercase tracking-widest text-[#ec4899] block mb-1">
                AUDITORIA ATIVA
              </span>
              <span className="text-xs font-sans font-black text-slate-100 block tracking-tight">
                Execução Alfa
              </span>
              {/* Custom continuous active status lights */}
              <div className="flex justify-center gap-1 mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
              </div>
            </div>
          </div>

          {/* Legend Details Panel next to Active Audit */}
          <div 
            style={{ left: '62%', top: '54%' }}
            className="absolute z-10 bg-[#070e1d]/90 border border-white/5 p-3 rounded-sm w-[158px] text-[10px] hidden md:block"
            id="legend-details-panel"
          >
            <div className="space-y-1.5 font-sans font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 block shrink-0"></span>
                <span className="text-slate-300">Predomínio Humano</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 block shrink-0"></span>
                <span className="text-slate-400">Simbiose Algorítmica</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700 block shrink-0"></span>
                <span className="text-slate-500">Estágio Latente</span>
              </div>
            </div>
          </div>

          {/* 5. NODE 04: Refinement */}
          <div 
            style={{ right: '11%', top: '23%' }}
            className="absolute z-10 text-center cursor-pointer transition-all duration-300"
            onClick={() => handleNodeClick(3)}
            id="node-map-refinement"
          >
            {/* Gray/inactive glowing dot */}
            <div className={`w-3 h-3 mx-auto rounded-full mb-4 transition-all ${
              selectedIdx === 3 
                ? 'bg-slate-400 ring-4 ring-slate-500/30' 
                : 'bg-slate-600 hover:bg-slate-500'
            }`} />
            
            <div className={`px-4 py-2.5 bg-[#0b1220]/60 border rounded w-[112px] text-center transition-all ${
              selectedIdx === 3 
                ? 'border-violet-500 shadow-[0_0_15px_rgba(124,58,237,0.15)] ring-1 ring-violet-500/20' 
                : 'border-white/5 opacity-80 hover:opacity-100'
            }`}>
              <span className="font-mono text-[9px] text-slate-600 block leading-none mb-1">
                04
              </span>
              <span className="text-[11px] font-sans font-extrabold text-slate-400 block">
                Refinamento
              </span>
              {/* Custom indicator dots under text */}
              <div className="flex justify-center gap-1 mt-1.5">
                <span className="w-1 h-1 rounded-full bg-slate-550"></span>
                <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                <span className="w-1 h-1 rounded-full bg-slate-750"></span>
              </div>
            </div>
          </div>

        </div>

        {/* THREE BENTO CELLS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="bento-container">
          
          {/* Bento Card 1: Automated Drift */}
          <div className="p-5 bg-[#070e1d] border border-white/5 hover:border-violet-500/20 rounded transition-all group shadow-sm flex flex-col justify-between" id="bento-automated-drift">
            <div className="space-y-4">
              <div className="w-8 h-8 rounded bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:bg-violet-600/20 transition-all">
                <Activity className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-slate-100 tracking-wider">
                  Deriva Automatizada
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Detecção de desvio autoral nos últimos 3 nós. IA está assumindo decisões conceituais críticas.
                </p>
              </div>
            </div>
          </div>

          {/* Bento Card 2: Cognitive Load */}
          <div className="p-5 bg-[#070e1d] border border-white/5 hover:border-violet-500/20 rounded transition-all group shadow-sm flex flex-col justify-between" id="bento-cognitive-load">
            <div className="space-y-4">
              <div className="w-8 h-8 rounded bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:bg-violet-600/20 transition-all">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-slate-100 tracking-wider">
                  Carga Cognitiva
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  O esforço de re-contextualização humana está acima da média (0.78). Risco de fadiga analítica.
                </p>
              </div>
            </div>
          </div>

          {/* Bento Card 3: Sovereignty Shield */}
          <div className="p-5 bg-[#070e1d] border border-white/5 hover:border-violet-500/20 rounded transition-all group shadow-sm flex flex-col justify-between" id="bento-sovereignty-shield">
            <div className="space-y-4">
              <div className="w-8 h-8 rounded bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:bg-violet-600/20 transition-all">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-slate-100 tracking-wider">
                  Escudo de Soberania
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Protocolos de 'Human-in-the-loop' ativos. Intervenção manual necessária no próximo nó.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* RIGHT SIDE AREA: Critical Dialogue (Node analysis sidebar report) */}
      <aside className="w-full lg:w-[412px] bg-[#070e1d] border-t lg:border-t-0 lg:border-l border-white/10 p-6 md:p-8 flex flex-col justify-between" id="critic-dialogue-report-sidebar">
        
        <div className="space-y-8 flex-1 flex flex-col">
          {/* Header section with subtitle */}
          <div>
            <h2 className="font-sans text-xl font-extrabold text-white tracking-tight uppercase mb-1.5">
              Diálogo Crítico
            </h2>
            <div className="w-10 h-[2px] bg-violet-600 rounded"></div>
          </div>

          {/* Connected data view */}
          <div className="space-y-6">
            <div>
              <span className="text-[9px] font-mono text-slate-500 font-extrabold uppercase tracking-[0.15em] block mb-1">
                ANÁLISE DO NÓ ATIVO
              </span>
              <h3 className="text-base text-white font-black uppercase tracking-tight font-sans">
                {getNodeTitle(selectedIdx, selectedIdx === 0 ? 'Briefing' : selectedIdx === 1 ? 'Conceituação' : selectedIdx === 2 ? 'Execução Alfa' : 'Refinamento')}
              </h3>
            </div>

            {/* Human agency vs AI agency weights output bars */}
            <div className="space-y-4 bg-slate-950/40 border border-white/5 p-5 rounded">
              
              {/* Human agency slider row */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[11px] font-mono text-slate-300 font-bold uppercase tracking-wide">
                  <span>Agência Humana</span>
                  <span className="text-violet-400 font-black">
                    {currentHumanWeight >= 80 ? 'Alta' : currentHumanWeight >= 45 ? 'Média' : 'Baixa'}&nbsp;({currentHumanWeight}%)
                  </span>
                </div>
                {/* Visual bar graph */}
                <div className="w-full h-2 rounded bg-slate-800 relative overflow-hidden">
                  <div 
                    style={{ width: `${currentHumanWeight}%` }}
                    className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-500 transition-all duration-300 rounded"
                  />
                </div>
              </div>

              {/* AI agency slider row */}
              <div className="space-y-1.5 mt-5">
                <div className="flex justify-between items-center text-[11px] font-mono text-slate-300 font-bold uppercase tracking-wide">
                  <span>Agência IA</span>
                  <span className="text-slate-400 font-black">
                    {currentAIWeight >= 70 ? 'Alta' : currentAIWeight >= 40 ? 'Média' : 'Baixa'}&nbsp;({currentAIWeight}%)
                  </span>
                </div>
                {/* Visual bar graph */}
                <div className="w-full h-2 rounded bg-slate-800 relative overflow-hidden">
                  <div 
                    style={{ width: `${currentAIWeight}%` }}
                    className="h-full bg-slate-500 transition-all duration-300 rounded"
                  />
                </div>
              </div>

              {/* Slider for interactive balance weights calibration directly on the selected active node */}
              <div className="pt-4 border-t border-white/5 space-y-2 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-slate-550 font-bold uppercase">Calibragem Direta</span>
                  <span className="text-[9px] font-mono text-violet-400 font-bold">HUMANO VS IA</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={currentHumanWeight}
                  onChange={(e) => {
                    const hVal = parseInt(e.target.value);
                    const aiVal = 100 - hVal;
                    if (decisions[selectedIdx]) {
                      onUpdateWeights(decisions[selectedIdx].id, hVal, aiVal);
                    }
                  }}
                  className="w-full accent-violet-600 h-1 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

            </div>

            {/* Collaboration Type Pill Badge */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-mono text-slate-500 font-extrabold uppercase tracking-[0.15em] block">
                TIPO DE COLABORAÇÃO
              </span>
              <div className="inline-block bg-violet-600/10 border border-violet-500/20 text-violet-300 font-bold px-3 py-1.5 rounded-sm text-xs font-semibold tracking-wide" id="colaboration-type-badge">
                {colab.label}
              </div>
              <p className="text-[11px] text-slate-400 italic font-medium leading-relaxed pl-1 mt-1 block">
                "{colab.desc}"
              </p>
            </div>

            {/* Black Box Metrics Section */}
            <div className="space-y-3 pt-4 border-t border-white/5" id="black-box-metrics">
              <span className="text-[10px] font-mono text-slate-550 font-extrabold tracking-widest uppercase block mb-2">
                MÉTRICAS DA CAIXA PRETA
              </span>
              <div className="space-y-2 text-xs font-sans font-medium">
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">Soberania Criativa</span>
                  <span className="text-[#dce2f7] font-bold font-mono">
                    {selectedIdx === 0 ? '0.95 / 1.0' : selectedIdx === 1 ? '0.88 / 1.0' : selectedIdx === 2 ? '0.82 / 1.0' : '0.45 / 1.0'}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">Deriva Algorítmica</span>
                  <span className="text-[#dce2f7] font-bold">
                    {selectedIdx === 0 ? 'Baixa (5%)' : selectedIdx === 1 ? 'Baixa (22%)' : selectedIdx === 2 ? 'Baixa (14%)' : 'Alta (75%)'}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">Índice de Rastreabilidade</span>
                  <span className="text-violet-400 font-bold uppercase tracking-wider">
                    {selectedIdx === 3 ? 'Degradado' : 'Excelente'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM ACTION BUTTON: Export and Toast confirmation layout */}
        <div className="mt-8 relative" id="bottom-action-container">
          {toastMsg && (
            <div className="absolute -top-12 left-0 right-0 bg-violet-600 border border-violet-400 text-white font-bold font-sans text-xs py-2 px-4 rounded text-center transition-all animate-bounce shadow-[0_0_15px_rgba(124,58,237,0.4)]">
              {toastMsg}
            </div>
          )}

          <button 
            onClick={handleExport}
            className="flex items-center justify-center gap-2 bg-transparent hover:bg-white/5 border border-white/10 hover:border-violet-500/50 text-[#dce2f7] font-semibold text-xs tracking-wider uppercase py-3 w-full rounded transition-all cursor-pointer font-sans"
            id="btn-export-audit"
          >
            <Download className="w-3.5 h-3.5" />
            Exportar Relatório de Auditoria
          </button>
        </div>

      </aside>

    </div>
  );
}
