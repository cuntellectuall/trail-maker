import React, { useState } from 'react';
import { DecisionNode, MetricSummary } from '../types';
import { Activity, AlertTriangle, Fingerprint, Award, FileText, Download, Sparkles, RefreshCw } from 'lucide-react';

interface CartografiaPanelProps {
  decisions: DecisionNode[];
  metrics: MetricSummary | null;
  onTriggerRecalculate: () => void;
}

export default function CartografiaPanel({
  decisions,
  metrics,
  onTriggerRecalculate
}: CartografiaPanelProps) {
  const [isExporting, setIsExporting] = useState(false);

  // Math totals for the visual meters
  const total = decisions.length;
  const counts = {
    aceitei: decisions.filter(d => d.classification === 'aceitei').length,
    editei: decisions.filter(d => d.classification === 'editei').length,
    recusei: decisions.filter(d => d.classification === 'recusei').length,
    confrontei: decisions.filter(d => d.classification === 'confrontei').length,
    recontextualizei: decisions.filter(d => d.classification === 'recontextualizei').length
  };

  const getPercentage = (count: number) => {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  };

  // Human vs Machine weights summaries
  const humanWeightTotal = decisions.reduce((acc, curr) => acc + curr.agencyWeight.human, 0);
  const aiWeightTotal = decisions.reduce((acc, curr) => acc + curr.agencyWeight.ai, 0);
  const avgHumanWeight = total > 0 ? Math.round(humanWeightTotal / total) : 0;
  const avgAiWeight = total > 0 ? Math.round(aiWeightTotal / total) : 0;

  const handleExportTextReport = () => {
    setIsExporting(true);
    setTimeout(() => {
      let reportText = `***************************************************\n`;
      reportText += `       RASTRO CRÍTICO - CARTOGRAFIA DE AUTORIA      \n`;
      reportText += `       EMISSÃO: ${new Date().toLocaleDateString('pt-BR')}  \n`;
      reportText += `***************************************************\n\n`;
      reportText += `MÉTRICAS DO MONITOR PROJETUAL:\n`;
      reportText += `- Dependência de IA: ${metrics?.aiDependency || 'N/A'}\n`;
      reportText += `- Intervenção Crítica: ${metrics?.criticalIntervention || 'N/A'}\n`;
      reportText += `- Risco de Clichês Sintéticos: ${metrics?.genericRisk || 'N/A'}\n`;
      reportText += `- Resistência do Contexto Humano: ${metrics?.humanContext || 'N/A'}\n\n`;
      reportText += `MÉDIA DO SALDO DE AGÊNCIA:\n`;
      reportText += `- Agência Humana Direct: ${avgHumanWeight}%\n`;
      reportText += `- Agência Mecânica / IA: ${avgAiWeight}%\n\n`;
      reportText += `SÍNTESE ANALÍTICA DO CARTÓGRAFO:\n`;
      reportText += `"${metrics?.summaryQuote || 'Nenhuma síntese compilada ainda.'}"\n\n`;
      reportText += `DECISÕES CRÍTICAS RASTREADAS (${total}):\n`;
      
      decisions.forEach((d, i) => {
        reportText += `---------------------------------------------------\n`;
        reportText += `Nó #${i+1}: ${d.title}\n`;
        reportText += `Atitude: [${d.classification.toUpperCase()}]\n`;
        reportText += `Idea/Prompt: "${d.prompt}"\n`;
        reportText += `Sugestão da IA: "${d.aiSuggestion}"\n`;
        reportText += `Defesa do Designer: "${d.defense}"\n`;
        reportText += `Análise do Sistema: "${d.systemResponse}"\n`;
      });
      reportText += `---------------------------------------------------\n`;
      reportText += `\n*Fim do Relatório de Rastro Crítico-Especulativo.*\n`;

      const element = document.createElement("a");
      const file = new Blob([reportText], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = "cartografia_rastro_critico.txt";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setIsExporting(false);
    }, 1000);
  };

  return (
    <div className="flex-1 relative overflow-y-auto bg-[#030712] p-6 md:p-8 space-y-8" id="cartografia-panel">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="font-sans text-3xl font-extrabold text-white tracking-tight uppercase">
            Cartografia de Autoria
          </h1>
          <p className="text-violet-400 italic text-sm mt-1">
            Mapeamento analítico do rastro do processo criativo versus automação sintética
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          <button
            onClick={onTriggerRecalculate}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-violet-300 px-4 py-2 text-xs font-semibold uppercase tracking-widest border border-violet-500/15 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Recalcular Análise
          </button>
          
          <button
            onClick={handleExportTextReport}
            disabled={isExporting || total === 0}
            className="flex items-center gap-2 bg-violet-600 disabled:bg-slate-800 text-white hover:bg-violet-500 px-4 py-2 text-xs font-semibold uppercase tracking-widest cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            {isExporting ? 'Exportando...' : 'Exportar Ficha'}
          </button>
        </div>
      </div>

      {total === 0 ? (
        <div className="bg-[#0b1220]/60 p-12 text-center rounded border border-white/5">
          <Fingerprint className="w-12 h-12 text-slate-600 mx-auto mb-3 animate-pulse" />
          <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest">Cartografia Vazia</h3>
          <p className="text-slate-500 text-xs mt-2 max-w-md mx-auto leading-relaxed">
            Nossos sensores necessitam de dados ativos de decisão para projetar o seu mapa de autoria espacial. Retorne ao canvas para registrar.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Block: Visual Indicators & Meters */}
          <div className="lg:col-span-7 bg-[#0b1220]/60 p-6 rounded border border-white/5 space-y-6">
            <h3 className="text-sm font-black text-violet-300 uppercase tracking-widest border-b border-white/5 pb-2">
              Balanço de Intervenções por Atitude
            </h3>

            <div className="space-y-4">
              {[
                { title: 'Aceitou da IA de forma passiva', count: counts.aceitei, pct: getPercentage(counts.aceitei), color: 'bg-rose-500' },
                { title: 'Ajustou a IA com pequenos detalhes', count: counts.editei, pct: getPercentage(counts.editei), color: 'bg-sky-500' },
                { title: 'Recusou as sugestões automáticas', count: counts.recusei, pct: getPercentage(counts.recusei), color: 'bg-amber-500' },
                { title: 'Confrontou a inteligência geradora', count: counts.confrontei, pct: getPercentage(counts.confrontei), color: 'bg-violet-500' },
                { title: 'Recontextualizou decisões em repertórios autorais', count: counts.recontextualizei, pct: getPercentage(counts.recontextualizei), color: 'bg-emerald-500' }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs uppercase tracking-tight">
                    <span className="text-slate-400 font-medium">{item.title}</span>
                    <span className="text-slate-200 font-mono font-bold">{item.count} nós ({item.pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-sm overflow-hidden border border-white/5">
                    <div className={`${item.color} h-full transition-all duration-500`} style={{ width: `${item.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mean Power agency readout */}
            <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 border border-white/5 text-center rounded">
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Agência Humana Registrada</span>
                <span className="text-3xl font-extrabold text-violet-400 font-mono block mt-1">{avgHumanWeight}%</span>
                <p className="text-[10.5px] text-slate-400 mt-2 line-clamp-2 leading-tight">
                  Medida do seu esforço para desviar do piloto automático.
                </p>
              </div>

              <div className="bg-slate-950 p-4 border border-white/5 text-center rounded">
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Agência Automatizada</span>
                <span className="text-3xl font-extrabold text-white font-mono block mt-1">{avgAiWeight}%</span>
                <p className="text-[10.5px] text-slate-400 mt-2 line-clamp-2 leading-tight">
                  Porcentagem delegada ao núcleo preditivo da máquina.
                </p>
              </div>
            </div>
          </div>

          {/* Right Block: Polygonal Footprint SVG & Synthesis Text */}
          <div className="lg:col-span-5 space-y-6 flex flex-col">
            
            {/* Visual Polygonal Rastro de Autoria chart */}
            <div className="bg-[#070e1d] p-6 rounded border border-white/5 text-center flex flex-col items-center justify-center">
              <span className="text-[10px] uppercase font-mono text-slate-500 mb-4 block">Cartografia Poligonal (Impressão de Rastro)</span>
              
              <div className="relative w-48 h-48">
                {/* Custom SVG radar map */}
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  {/* Grid Lines */}
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#2e3545" strokeWidth="0.5" strokeDasharray="2" />
                  <circle cx="50" cy="50" r="30" fill="none" stroke="#2e3545" strokeWidth="0.5" strokeDasharray="2" />
                  <circle cx="50" cy="50" r="20" fill="none" stroke="#2e3545" strokeWidth="0.5" strokeDasharray="2" />
                  <line x1="50" y1="10" x2="50" y2="90" stroke="#2e3545" strokeWidth="0.5" strokeDasharray="2" />
                  <line x1="10" y1="50" x2="90" y2="50" stroke="#2e3545" strokeWidth="0.5" strokeDasharray="2" />

                  {/* Polygon calculating coordinates */}
                  {/* North (IA dependency), East (Interventions), South (Risk of Autopilot), West (Human Context) */}
                  {/* Center is at 50,50 */}
                  {(() => {
                    const mathVal = (metric: 'Alta' | 'Média' | 'Baixa' | 'Alto' | 'Médio' | 'Baixo' | 'Resistente' | 'Moderado' | 'Frágil', invert: boolean = false) => {
                      const m = metric?.toLowerCase() || 'média';
                      if (m === 'alta' || m === 'alto' || m === 'frágil') return invert ? 10 : 38;
                      if (m === 'média' || m === 'médio' || m === 'moderado') return 24;
                      return invert ? 38 : 10;
                    };

                    const n = mathVal(metrics?.aiDependency || 'Média', true); // Inverse high is bad
                    const e = mathVal(metrics?.criticalIntervention || 'Média');
                    const s = mathVal(metrics?.genericRisk || 'Médio', true); // Inverse high is bad
                    const w = mathVal(metrics?.humanContext || 'Moderado');

                    const pNorth = { x: 50, y: 50 - n };
                    const pEast = { x: 50 + e, y: 50 };
                    const pSouth = { x: 50, y: 50 + s };
                    const pWest = { x: 50 - w, y: 50 };

                    const pointsStr = `${pNorth.x},${pNorth.y} ${pEast.x},${pEast.y} ${pSouth.x},${pSouth.y} ${pWest.x},${pWest.y}`;

                    return (
                      <>
                        <polygon
                          points={pointsStr}
                          fill="rgba(124, 58, 237, 0.25)"
                          stroke="#7c3aed"
                          strokeWidth="1.5"
                          className="transition-all duration-700"
                        />
                        {/* Dot Vertices */}
                        <circle cx={pNorth.x} cy={pNorth.y} r="2" fill="#7c3aed" />
                        <circle cx={pEast.x} cy={pEast.y} r="2" fill="#7c3aed" />
                        <circle cx={pSouth.x} cy={pSouth.y} r="2" fill="#7c3aed" />
                        <circle cx={pWest.x} cy={pWest.y} r="2" fill="#7c3aed" />
                      </>
                    );
                  })()}
                </svg>

                {/* Legend Labels around radar */}
                <div className="absolute top-1 left-1/2 -translate-x-1/2 font-mono text-[8px] uppercase tracking-wider text-slate-500 font-bold">DEPENDÊNCIA</div>
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 font-mono text-[8px] uppercase tracking-wider text-slate-500 font-bold">RISCO SINTÉTICO</div>
                <div className="absolute right-1 top-1/2 -translate-y-1/2 font-mono text-[8px] uppercase tracking-wider text-slate-500 font-bold text-right leading-none w-16">INTERVENÇÃO</div>
                <div className="absolute left-1 top-1/2 -translate-y-1/2 font-mono text-[8px] uppercase tracking-wider text-slate-500 font-bold text-left leading-none w-16 text-slate-400">CONTEXTO</div>
              </div>
            </div>

            {/* Editorial manifesto summary */}
            <div className="bg-violet-950/15 border border-violet-500/25 p-5 rounded flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3 text-violet-400 text-xs font-black uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Síntese do Cartógrafo</span>
                </div>
                
                {metrics ? (
                  <p className="font-sans text-xs text-slate-300 leading-relaxed font-medium">
                    "{metrics.summaryQuote}"
                  </p>
                ) : (
                  <p className="text-slate-500 font-mono text-xs uppercase">
                    Calculando tendências com o sensor central...
                  </p>
                )}
              </div>

              <div className="border-t border-violet-500/10 pt-4 mt-4 flex items-center gap-2 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                <Award className="w-4 h-4 text-violet-400" />
                <span>Rastro Crítico avaliado com sucesso.</span>
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
