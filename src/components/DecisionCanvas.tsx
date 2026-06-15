import React from 'react';
import { DecisionNode, DecisionClassification, MetricSummary } from '../types';
import {
  Brain,
  HelpCircle,
  FileText,
  Trash2,
  GitCommit,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface DecisionCanvasProps {
  decisions: DecisionNode[];
  activeNodeId: string | null;
  onSelectNode: (id: string) => void;
  onClassifyActiveNode: (classification: DecisionClassification) => void;
  onDeleteNode: (id: string) => void;
  metrics: MetricSummary | null;
  onTriggerRecalculate: () => void;
}

export default function DecisionCanvas({
  decisions,
  activeNodeId,
  onSelectNode,
  onClassifyActiveNode,
  onDeleteNode,
  metrics,
  onTriggerRecalculate
}: DecisionCanvasProps) {
  const activeNode = decisions.find(d => d.id === activeNodeId) || null;

  // Render node icon helper depending on category or status
  const getClassificationStyles = (classification: DecisionClassification) => {
    switch (classification) {
      case 'aceitei':
        return { label: 'Aceitou da IA', color: 'text-rose-400 bg-rose-500/10 border-rose-500/40' };
      case 'editei':
        return { label: 'Editei a IA', color: 'text-sky-400 bg-sky-500/10 border-sky-500/40' };
      case 'recusei':
        return { label: 'Recusou', color: 'text-amber-400 bg-amber-500/10 border-amber-500/40' };
      case 'confrontei':
        return { label: 'Confrontei', color: 'text-violet-400 bg-violet-500/10 border-violet-500/40' };
      case 'recontextualizei':
        return { label: 'Recontextualizei', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/40' };
      default:
        return { label: 'Sem classificação', color: 'text-slate-400 bg-slate-500/10 border-slate-500/40' };
    }
  };

  const getMetricColor = (val: string) => {
    const v = val.toLowerCase();
    if (v === 'alta' || v === 'alto' || v === 'frágil') return 'text-rose-400 font-extrabold';
    if (v === 'média' || v === 'médio' || v === 'moderado') return 'text-violet-400 font-bold';
    if (v === 'baixa' || v === 'baixo' || v === 'resistente') return 'text-emerald-400 font-extrabold';
    return 'text-slate-200';
  };

  return (
    <div className="flex-1 relative overflow-y-auto bg-[#030712] p-6 md:p-8 flex flex-col justify-between" id="decision-canvas">
      {/* 1. Header Section */}
      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="font-sans text-3xl md:text-4xl font-extrabold text-white tracking-tight uppercase">
              Decisões
            </h1>
            <div className="text-violet-400 italic font-light text-lg mt-1">
              Cluster atual: deriva ética e autoria sintética
            </div>
          </div>
          <div className="mt-3 md:mt-0 flex gap-2">
            <span className="font-mono text-[10px] text-zinc-950 bg-violet-400 px-3 py-1 text-center font-bold uppercase tracking-widest leading-normal">
              Nó Ativo: {activeNode ? activeNode.title : 'Nenhum selecionado'}
            </span>
          </div>
        </div>

        {/* 2. central timelines */}
        <div className="mt-8 border border-white/5 bg-[#0b1220]/60 p-6 md:p-10 rounded-sm relative min-h-[220px] flex flex-col justify-center">
          {decisions.length === 0 ? (
            <div className="text-center py-10">
              <Brain className="w-12 h-12 text-slate-600 mx-auto animate-pulse mb-3" />
              <p className="text-slate-400 text-sm uppercase tracking-widest font-bold">
                Nenhum nó de decisão ativo
              </p>
              <p className="text-slate-500 text-xs mt-1">
                Utilize o botão principal superior para registrar o seu primeiro rastro crítico.
              </p>
            </div>
          ) : (
            <div className="relative">
              {/* Connected Wire Lines */}
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/10 -translate-y-1/2 z-0 hidden lg:block"></div>
              
              {/* Glow Active Wire */}
              <div 
                className="absolute top-1/2 left-0 h-[2px] bg-violet-500/80 -translate-y-1/2 z-0 shadow-[0_0_15px_rgba(124,58,237,0.8)] transition-all duration-500 hidden lg:block"
                style={{
                  width: `${Math.min(100, Math.max(10, ((decisions.findIndex(d => d.id === activeNodeId) + 1) / decisions.length) * 100))}%`
                }}
              ></div>

              {/* Dynamic Timeline Nodes Wrapper */}
              <div className="flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-4 relative z-10">
                {decisions.map((node, index) => {
                  const isActive = node.id === activeNodeId;
                  const cInfo = getClassificationStyles(node.classification);
                  
                  return (
                    <div 
                      key={node.id} 
                      onClick={() => onSelectNode(node.id)}
                      className={`flex lg:flex-col items-center gap-4 cursor-pointer group transition-all w-full lg:w-auto p-3 rounded lg:rounded-none lg:p-0 ${
                        isActive ? 'bg-violet-950/15 border border-violet-500/30' : 'hover:bg-slate-900/40'
                      }`}
                    >
                      {/* Timeline Node Point representation */}
                      <div className="relative">
                        {isActive ? (
                          <div className="w-8 h-8 rounded-full bg-violet-500 border-4 border-[#030712] shadow-[0_0_20px_rgba(124,58,237,0.9)] flex items-center justify-center animate-pulse">
                            <Sparkles className="w-3.5 h-3.5 text-white" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-[#0b1220] border-2 border-slate-700 hover:border-violet-400 group-hover:scale-110 transition-all flex items-center justify-center">
                            <span className="text-[9px] text-slate-500 font-bold">{index + 1}</span>
                          </div>
                        )}
                      </div>

                      {/* Title & Stats */}
                      <div className="text-left lg:text-center max-w-[150px]">
                        <span className={`block text-[11px] font-bold uppercase tracking-wider truncate mb-1 ${
                          isActive ? 'text-violet-400' : 'text-slate-300'
                        }`}>
                          {node.title}
                        </span>
                        <span className={`inline-block text-[9px] uppercase font-black tracking-widest px-2 py-0.5 border ${cInfo.color}`}>
                          {cInfo.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Bottom Panels: Process Cartography Cards + Action Classification */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
        
        {/* Left Side: Cartografia do Processo */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="mb-2">
            <span className="text-[10px] text-violet-400 font-extrabold uppercase tracking-[0.25em]">
              Cartografia do Processo
            </span>
          </div>

          <div className="bg-[#0b1220]/70 p-5 rounded border-l-4 border-violet-400 border-t border-r border-b border-white/5 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-sans text-xs font-black text-violet-300 uppercase tracking-widest">
                  Perfil de Autoria
                </h4>
                <button 
                  onClick={onTriggerRecalculate}
                  className="p-1 rounded text-slate-400 hover:bg-white/5 hover:text-white transition-all"
                  title="Recalcular Cartografia"
                >
                  <RefreshCw className="w-3 h-3 animate-spin duration-3000" />
                </button>
              </div>

              {metrics ? (
                <div className="space-y-4">
                  {/* Metric: Dependência de IA */}
                  <div className="border-b border-white/5 pb-3">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold">Dependência de IA</span>
                      <span className={`uppercase text-[11px] font-mono ${getMetricColor(metrics.aiDependency)}`}>
                        {metrics.aiDependency}
                      </span>
                    </div>
                    {/* Visual Meter Bar */}
                    <div className="w-full bg-slate-950 h-2 rounded-none overflow-hidden border border-white/10 relative">
                      <div 
                        className={`h-full transition-all duration-700 ${
                          metrics.aiDependency.toLowerCase() === 'alta' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] w-full' :
                          metrics.aiDependency.toLowerCase() === 'média' ? 'bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.6)] w-1/2' :
                          'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] w-1/5'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Metric: Intervenção Crítica */}
                  <div className="border-b border-white/5 pb-3">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold">Intervenção Crítica</span>
                      <span className={`uppercase text-[11px] font-mono ${getMetricColor(metrics.criticalIntervention)}`}>
                        {metrics.criticalIntervention}
                      </span>
                    </div>
                    {/* Visual Meter Bar */}
                    <div className="w-full bg-slate-950 h-2 rounded-none overflow-hidden border border-white/10 relative">
                      <div 
                        className={`h-full transition-all duration-700 ${
                          metrics.criticalIntervention.toLowerCase() === 'alta' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] w-full' :
                          metrics.criticalIntervention.toLowerCase() === 'média' ? 'bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.6)] w-1/2' :
                          'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] w-1/5'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Metric: Risco de solução genérica */}
                  <div className="border-b border-white/5 pb-3">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold">Risco de solução genérica</span>
                      <span className={`uppercase text-[11px] font-mono ${getMetricColor(metrics.genericRisk)}`}>
                        {metrics.genericRisk}
                      </span>
                    </div>
                    {/* Visual Meter Bar */}
                    <div className="w-full bg-slate-950 h-2 rounded-none overflow-hidden border border-white/10 relative">
                      <div 
                        className={`h-full transition-all duration-700 ${
                          metrics.genericRisk.toLowerCase() === 'alto' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] w-full' :
                          metrics.genericRisk.toLowerCase() === 'médio' ? 'bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.6)] w-1/2' :
                          'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] w-1/5'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Metric: Contexto Humano */}
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold">Contexto Humano</span>
                      <span className={`uppercase text-[11px] font-mono ${getMetricColor(metrics.humanContext)}`}>
                        {metrics.humanContext}
                      </span>
                    </div>
                    {/* Visual Meter Bar */}
                    <div className="w-full bg-slate-950 h-2 rounded-none overflow-hidden border border-white/10 relative">
                      <div 
                        className={`h-full transition-all duration-700 ${
                          metrics.humanContext.toLowerCase() === 'resistente' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] w-full' :
                          metrics.humanContext.toLowerCase() === 'moderado' ? 'bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.6)] w-1/2' :
                          'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] w-1/5'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-slate-500 font-mono text-[10px] py-4 uppercase">
                  Insira mais registros de decisões para processar gráficos da autoria.
                </div>
              )}
            </div>

            {metrics && (
              <p className="text-[10.5px] leading-relaxed text-slate-300 italic border-t border-white/5 pt-4 mt-4 font-sans border-dashed">
                "{metrics.summaryQuote}"
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Classify Active Node */}
        <div className="lg:col-span-7">
          <div className="mb-2">
            <span className="text-[10px] text-violet-400 font-extrabold uppercase tracking-[0.25em]">
              Controle de Agência
            </span>
          </div>

          <div className="bg-[#0b1220]/70 p-6 rounded border border-white/5 flex flex-col justify-between h-full">
            {activeNode ? (
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-sans text-sm font-black text-rose-500 uppercase tracking-wider">
                      {activeNode.title}
                    </h3>
                    <p className="text-slate-400 text-xs mt-1">
                      Classifique a natureza de agência desta decisão. Como você se relacionou com a IA?
                    </p>
                  </div>
                  <button 
                    onClick={() => onDeleteNode(activeNode.id)}
                    className="p-1 px-2.5 bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 rounded hover:text-rose-300 border border-rose-500/10 cursor-pointer flex items-center gap-1.5 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Remover</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  <div>
                    <span className="text-[9px] uppercase font-mono text-slate-500 block mb-1">PROMPT:</span>
                    <p className="text-slate-300 text-xs font-medium line-clamp-3 bg-slate-900/60 p-2 border border-white/5 rounded-sm">
                      {activeNode.prompt}
                    </p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-mono text-slate-500 block mb-1">IA SUGERIU:</span>
                    <p className="text-slate-300 text-xs font-mono line-clamp-3 bg-slate-900/60 p-2 border border-white/5 rounded-sm overflow-y-auto">
                      {activeNode.aiSuggestion}
                    </p>
                  </div>
                </div>

                {/* Grid selection for fast classification */}
                <div className="mt-5 border-t border-white/5 pt-4">
                  <span className="text-[9px] font-bold uppercase text-slate-400 font-mono">Alterar Classificação Ativa:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {[
                      { key: 'aceitei', label: 'Aceitei da IA' },
                      { key: 'editei', label: 'Editei a IA' },
                      { key: 'recusei', label: 'Recusei' },
                      { key: 'confrontei', label: 'Confrontei' },
                      { key: 'recontextualizei', label: 'Recontextualizei' }
                    ].map((btn) => {
                      const isSelected = activeNode.classification === btn.key;
                      return (
                        <button
                          key={btn.key}
                          onClick={() => onClassifyActiveNode(btn.key as DecisionClassification)}
                          className={`px-3 py-2 rounded-sm text-[9.5px] font-black uppercase tracking-wider border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-violet-600 border-violet-400 text-white shadow-[0_0_10px_rgba(124,58,237,0.4)]'
                              : 'bg-slate-900 border-white/5 text-slate-400 hover:border-violet-500/50 hover:text-slate-200'
                          }`}
                        >
                          {btn.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 h-full">
                <HelpCircle className="w-8 h-8 text-slate-600 mb-2 animate-bounce" />
                <span className="text-xs text-slate-400 uppercase tracking-widest font-black">
                  Selecione um nó de decisão acima
                </span>
                <span className="text-slate-500 text-[10px] mt-1 text-center">
                  Inspecione o prompt, a sugestão automática e re-classifique o rastro de agoridade do projeto.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
