import React, { useState } from 'react';
import { X, Sparkles, AlertTriangle, ArrowRight, Check, HelpCircle, Loader } from 'lucide-react';
import { DecisionClassification, DecisionNode } from '../types';

interface RegisterModalProps {
  onClose: () => void;
  onSave: (node: Omit<DecisionNode, 'id' | 'date' | 'systemResponse'>) => void;
  protectionMode: boolean; // Flags autopilot prompt clichés
}

export default function RegisterModal({ onClose, onSave, protectionMode }: RegisterModalProps) {
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [classification, setClassification] = useState<DecisionClassification>('editei');
  const [defense, setDefense] = useState('');
  
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [clicheWarning, setClicheWarning] = useState<string | null>(null);

  // Cliché phrase finder in prompt (Modo Proteção behavior)
  const handlePromptChange = (val: string) => {
    setPrompt(val);

    if (protectionMode) {
      const lower = val.toLowerCase();
      const cliches = [
        { terms: ['limpo', 'moderno', 'sleek', 'clean'], warning: 'Aviso de clichê: "Minimalismo limpo/moderno" é sutilmente gerado sem contexto humano real.' },
        { terms: ['azul', 'corporate', 'corporativo'], warning: 'Aviso de clichê: Paletas azuis padronizadas induzem à preguiça visual passiva.' },
        { terms: ['facilitar', 'produtividade', 'conversão'], warning: 'Aviso de clichê: Argumentos de pura eficiência mascaram a eliminação sutil do designer.' },
        { terms: ['bonito', 'intuitivo', 'agradável'], warning: 'Aviso estético: Focar apenas no "intuitivo" esvazia a expressividade crítica.' }
      ];

      const found = cliches.find(c => c.terms.some(t => lower.includes(t)));
      if (found) {
        setClicheWarning(found.warning);
      } else {
        setClicheWarning(null);
      }
    } else {
      setClicheWarning(null);
    }
  };

  const handleRequestAISuggestion = async () => {
    if (!title || !prompt) return;
    setIsLoadingSuggestion(true);
    try {
      const res = await fetch('/api/generate-ai-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, prompt })
      });
      if (res.ok) {
        const data = await res.json();
        setAiSuggestion(data.suggestion);
      } else {
        throw new Error('Falha ao acionar servidor.');
      }
    } catch (err) {
      console.error(err);
      setAiSuggestion(`[MOTO-GERAÇÃO AUTOMÁTICA DE EMERGÊNCIA]\nComo contingência para o projeto "${title}", sugiro usar uma grid de cards neutros com cantos arredondados padrão de 4px, fundo de tonalidade escura #1E293B e um loader circular clássico centralizado para indicar as integridades.`);
    } finally {
      setIsLoadingSuggestion(false);
    }
  };

  const handleSaveNode = () => {
    if (!title || !prompt || !aiSuggestion || !defense) return;

    // Calculate dynamic agency weight depending on the classification
    let human = 50;
    let ai = 50;
    if (classification === 'aceitei') { human = 10; ai = 90; }
    else if (classification === 'editei') { human = 40; ai = 60; }
    else if (classification === 'recusei') { human = 90; ai = 10; }
    else if (classification === 'confrontei') { human = 80; ai = 20; }
    else if (classification === 'recontextualizei') { human = 95; ai = 5; }

    onSave({
      title,
      prompt,
      aiSuggestion,
      classification,
      defense,
      agencyWeight: { human, ai }
    });
    
    onClose();
  };

  const isActiveSaveDisabled = !title || !prompt || !aiSuggestion || !defense;

  return (
    <div className="fixed inset-0 bg-[#030712]/90 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-[#0b1220] border-2 border-violet-500/30 max-w-2xl w-full p-6 md:p-8 rounded-sm shrink-0 flex flex-col justify-between shadow-[0_0_50px_rgba(124,58,237,0.15)] relative">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-400" />
            <h2 className="font-sans text-lg font-black text-white uppercase tracking-wider">
              Registrar Decisão Crítica
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content container */}
        <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          
          {/* Title */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 font-mono tracking-wider mb-1.5">
              1. TÍTULO DO PROJETO / NÓ DE DECISÃO
            </label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Escopo da Grade Sismográfica"
              className="w-full bg-slate-900 border border-white/5 p-3 rounded-none text-xs text-slate-100 focus:outline-none focus:border-violet-500 uppercase tracking-tight"
            />
          </div>

          {/* User Prompt */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 font-mono tracking-wider mb-1.5">
              2. SUA INTENÇÃO / PROMPT BASE
            </label>
            <textarea
              value={prompt}
              onChange={(e) => handlePromptChange(e.target.value)}
              rows={2}
              placeholder="Descreva a diretriz que você enviaria à IA..."
              className="w-full bg-slate-900 border border-white/5 p-3 rounded-none text-xs text-slate-100 focus:outline-none focus:border-violet-500 uppercase tracking-tight resize-none"
            />

            {/* Cliche Warning (Modo Proteção) */}
            {clicheWarning && (
              <div className="mt-2 p-2.5 bg-amber-950/20 border border-amber-500/20 text-amber-300 rounded font-mono text-[10px] flex items-center gap-2 animate-bounce">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>{clicheWarning}</span>
              </div>
            )}
          </div>

          {/* AI Suggestion Area */}
          <div className="bg-slate-950 p-4 border border-white/5 relative">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-400">
                3. PROPOSTA AUTOMÁTICA DA IA
              </span>
              <button
                onClick={handleRequestAISuggestion}
                disabled={!title || !prompt || isLoadingSuggestion}
                className="px-3.5 py-1.5 bg-violet-950/40 hover:bg-violet-950/85 disabled:bg-slate-900 disabled:text-slate-600 border border-violet-500/10 hover:border-violet-400 text-violet-300 text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {isLoadingSuggestion ? (
                  <>
                    <Loader className="w-3 h-3 animate-spin" />
                    <span>Gerando Cuidado...</span>
                  </>
                ) : (
                  <>
                    <span>Solicitar Proposta IA</span>
                    <ArrowRight className="w-3 h-3" />
                  </>
                )}
              </button>
            </div>

            {aiSuggestion ? (
              <pre className="text-[10.5px] leading-relaxed text-slate-300 whitespace-pre-wrap font-mono p-2.5 bg-[#030712] rounded-sm">
                {aiSuggestion}
              </pre>
            ) : (
              <div className="text-center py-6 text-slate-600 text-xs font-mono uppercase">
                Aguardando envio dos dados básicos para acionar proposta sintética...
              </div>
            )}
          </div>

          {/* Stance Choice */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 font-mono tracking-wider mb-2">
              4. CLASSIFIQUE SUA ATITUDE DE AGÊNCIA
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {[
                { value: 'aceitei', label: 'Aceitei', desc: 'Absorveu idêntico' },
                { value: 'editei', label: 'Editei', desc: 'Pequenos ajustes' },
                { value: 'recusei', label: 'Recusei', desc: 'Fez de novo do zero' },
                { value: 'confrontei', label: 'Confrontei', desc: 'Atrapalhou a IA' },
                { value: 'recontextualizei', label: 'Recontextualizei', desc: 'Criou desvio profundo' }
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setClassification(opt.value as DecisionClassification)}
                  className={`p-3 border text-center transition-all cursor-pointer ${
                    classification === opt.value
                      ? 'bg-violet-600/20 border-violet-500 text-white shadow-inner'
                      : 'bg-slate-900/60 border-white/5 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <span className="block text-xs font-black uppercase tracking-wider">{opt.label}</span>
                  <span className="text-[8.5px] text-slate-500 block leading-tight mt-1">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Defense justification */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 font-mono tracking-wider mb-1.5">
              5. SUA JUSTIFICATIVA ESTÉTICO-CRÍTICA (DEFESA)
            </label>
            <textarea
              value={defense}
              onChange={(e) => setDefense(e.target.value)}
              rows={3}
              placeholder="Explique o lastro intelectual de sua decisão sem escorar em motivos genéricos da própria máquina..."
              className="w-full bg-slate-900 border border-white/5 p-3 rounded-none text-xs text-slate-100 focus:outline-none focus:border-violet-500 uppercase tracking-tight resize-none"
            />
          </div>

        </div>

        {/* Actions Footer */}
        <div className="flex justify-end gap-3 border-t border-white/5 pt-5 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 text-slate-400 hover:text-white uppercase text-xs font-bold tracking-widest border border-white/5 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            disabled={isActiveSaveDisabled}
            onClick={handleSaveNode}
            className="px-6 py-2.5 bg-violet-600 disabled:bg-slate-800 disabled:text-slate-600 text-white uppercase text-xs font-black tracking-widest rounded-none shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:bg-violet-500 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Gravar Rastro</span>
          </button>
        </div>

      </div>
    </div>
  );
}
