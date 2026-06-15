import React, { useState, useEffect } from 'react';
import { Send, Eye, Fingerprint, History, MessageCircle, HelpCircle, AlertTriangle, Sparkles, Loader, X } from 'lucide-react';
import { DecisionNode, DecisionClassification } from '../types';

interface DialogoCriticoProps {
  activeNode: DecisionNode | null;
  onUpdateDefense: (nodeId: string, defense: string, systemResponse: string) => void;
  onClose?: () => void;
}

export default function DialogoCritico({ activeNode, onUpdateDefense, onClose }: DialogoCriticoProps) {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localFeedback, setLocalFeedback] = useState<string | null>(null);

  // Sync state with active node
  useEffect(() => {
    if (activeNode) {
      setInputText(activeNode.defense || '');
      setLocalFeedback(activeNode.systemResponse || null);
    } else {
      setInputText('');
      setLocalFeedback(null);
    }
  }, [activeNode]);

  const handleSubmitDefense = async () => {
    if (!activeNode || !inputText.trim()) return;

    setIsLoading(true);
    setLocalFeedback(null);

    try {
      const res = await fetch('/api/critical-critique', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: activeNode.title,
          prompt: activeNode.prompt,
          aiSuggestion: activeNode.aiSuggestion,
          classification: activeNode.classification,
          defense: inputText
        })
      });

      if (!res.ok) {
        throw new Error('Erro ao chamar o Diálogo Crítico do servidor.');
      }

      const data = await res.json();
      const feedbackText = data.critique;

      // Update in global state
      onUpdateDefense(activeNode.id, inputText, feedbackText);
      setLocalFeedback(feedbackText);
    } catch (err: any) {
      console.error(err);
      const fallbackMsg = `[SISTEMA DE EMERGÊNCIA]\nSua rádio-defesa para "${activeNode.title}" foi armazenada em local estático. O diálogo crítico ressalta: Atuar na classificação "${activeNode.classification}" exige que você de fato fundamente com desvios expressivos fora de fórmulas de treino!`;
      onUpdateDefense(activeNode.id, inputText, fallbackMsg);
      setLocalFeedback(fallbackMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const PROVOCATIONS = [
    {
      category: 'Incitação do Sistema',
      question: 'Você consegue defender essa escolha sem mencionar a tecnologia?',
      icon: <HelpCircle className="w-3.5 h-3.5 text-violet-400" />
    },
    {
      category: 'Avaliação Estética',
      question: 'Essa solução resolve o problema de usabilidade ou apenas parece visualmente agradável?',
      icon: <Eye className="w-3.5 h-3.5 text-violet-400" />
    },
    {
      category: 'Autoria Projetual',
      question: 'O que exatamente nessa entrega evidencia o seu repertório histórico como designer?',
      icon: <Fingerprint className="w-3.5 h-3.5 text-violet-400" />
    },
    {
      category: 'Contexto e História',
      question: 'Que referência cultural profunda ou história real sustenta essa decisão de roteamento espacial?',
      icon: <History className="w-3.5 h-3.5 text-violet-400" />
    }
  ];

  return (
    <aside className="w-full lg:w-[763.112px] bg-[#070e1d] border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col justify-between h-[800px] lg:h-[800px] p-6 z-20 overflow-y-auto" id="critic-dialogue-drawer">
      <div>
        {/* Sticky section title */}
        <header className="mb-6 flex items-center gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 text-slate-400 hover:text-white rounded transition-all cursor-pointer shadow-sm flex items-center justify-center"
              id="btn-close-dialogue"
              title="Fechar Diálogo"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <MessageCircle className="w-4 h-4 text-violet-400" />
              <h2 className="font-sans text-xl text-white font-extrabold uppercase tracking-tight">
                Diálogo
              </h2>
            </div>
            <div className="w-12 h-1 bg-violet-600 rounded"></div>
          </div>
        </header>

        {activeNode ? (
          <div className="space-y-6">
            <div className="bg-violet-950/10 p-3.5 rounded border border-violet-500/10 mb-4 animate-pulse">
              <span className="text-[9px] font-mono text-violet-400 uppercase tracking-widest font-black block">Analisando Nó:</span>
              <span className="text-xs font-semibold text-slate-200 uppercase">{activeNode.title}</span>
            </div>

            {/* Static Question Provocations Guide */}
            <div className="space-y-4 pr-1">
              {PROVOCATIONS.map((p, idx) => (
                <div key={idx} className="space-y-1.5 group">
                  <div className="flex items-center gap-2">
                    {p.icon}
                    <span className="font-mono font-black text-[9px] text-violet-400 uppercase tracking-widest">
                      {p.category}
                    </span>
                  </div>
                  <div className="pl-5 border-l border-violet-500/20 group-hover:border-violet-500/50 transition-all">
                    <p className="font-sans text-xs font-medium text-slate-300 leading-relaxed italic">
                      "{p.question}"
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Current Real-time critique of the node */}
            {localFeedback && (
              <div className="mt-6 pt-5 border-t border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-violet-400 text-[10px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Crítica Analítica de Autoria</span>
                </div>
                <div className="bg-slate-900/80 p-4 border border-violet-500/10 font-mono text-[10.5px] leading-relaxed text-slate-300 rounded-sm">
                  {localFeedback}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-center px-4">
            <HelpCircle className="w-10 h-10 text-slate-700 mb-3 animate-pulse" />
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Modo Incômodo Inativo</h3>
            <p className="text-slate-500 text-[11px] mt-2 leading-relaxed">
              Clique em um dos nós do canvas para iniciar o Diálogo Crítico provocativo sobre suas escolhas projetuais.
            </p>
          </div>
        )}
      </div>

      {activeNode && (
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
              rows={4}
              className="w-full bg-slate-900 border border-white/5 rounded-none p-4 font-sans text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-violet-500 uppercase tracking-tight resize-none focus:ring-0 leading-relaxed"
              placeholder="DEFENDA SUA DECISÃO COMPROVANDO SEU REPERTÓRIO..."
            />
            
            <button
              onClick={handleSubmitDefense}
              disabled={isLoading || !inputText.trim()}
              className="absolute bottom-4 right-4 w-9 h-9 bg-violet-600 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-none flex items-center justify-center hover:bg-violet-500 transition-all shadow-md cursor-pointer"
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
          
          <p className="mt-3 font-mono text-[9px] text-slate-500 text-center font-bold tracking-widest uppercase">
            {isLoading ? 'Sintonizando Rádio-Crítica...' : 'Sua reflexão define a deriva do sistema.'}
          </p>
        </div>
      )}
    </aside>
  );
}
