import React, { useState, useEffect } from 'react';
import { AppState, DecisionNode, DecisionClassification, MetricSummary } from './types';
import { INITIAL_PROJECTS, INITIAL_METRICS } from './initialData';

// Modular UI subcomponents
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DecisionCanvas from './components/DecisionCanvas';
import DialogoCritico from './components/DialogoCritico';
import RegisterModal from './components/RegisterModal';
import CartografiaPanel from './components/CartografiaPanel';
import NodesOfAgency from './components/NodesOfAgency';
import InterventionsLog from './components/InterventionsLog';
import ArchiveProjects from './components/ArchiveProjects';
import NotificationsPanel from './components/NotificationsPanel';
import SettingsPanel from './components/SettingsPanel';

import { Activity, ShieldAlert, Sparkles, AlertOctagon, MessageCircle } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'rastro_critico_app_state_v1';

export default function App() {
  // 1. Initial State formulation
  const [state, setState] = useState<AppState>({
    projects: INITIAL_PROJECTS,
    activeProjectId: INITIAL_PROJECTS[0].id,
    activeDecisionNodeId: INITIAL_PROJECTS[0].decisions[0]?.id || null,
    protectionMode: true,
    systemIntegrity: 98 // base baseline
  });

  const [currentView, setCurrentView] = useState<'canvas' | 'cartografia' | 'agency' | 'interventions' | 'archive' | 'notifications' | 'settings'>('canvas');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isRecalculatingMetrics, setIsRecalculatingMetrics] = useState(false);
  const [isDialogueOpen, setIsDialogueOpen] = useState(true);

  // Load from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.projects)) {
          parsed.projects = parsed.projects.map((p: any) => ({
            ...p,
            decisions: (p.decisions || []).slice(0, 4)
          }));
        }
        setState(parsed);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
      }
    } catch (err) {
      console.error('Error loading state from localStorage:', err);
    }
  }, []);

  // Save to local storage
  const saveState = (newState: AppState) => {
    setState(newState);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
    } catch (err) {
      console.error('Error saving state to localStorage', err);
    }
  };

  // Get active items cleanly
  const activeProject = state.projects.find(p => p.id === state.activeProjectId) || state.projects[0];
  const activeNode = activeProject ? (activeProject.decisions.find(d => d.id === state.activeDecisionNodeId) || null) : null;

  // Global actions
  const handleSelectProject = (projectId: string) => {
    const proj = state.projects.find(p => p.id === projectId);
    const firstNodeId = proj && proj.decisions.length > 0 ? proj.decisions[0].id : null;
    
    saveState({
      ...state,
      activeProjectId: projectId,
      activeDecisionNodeId: firstNodeId
    });
  };

  const handleCreateProject = (name: string) => {
    const newId = `proj-${Date.now()}`;
    const newProject = {
      id: newId,
      name,
      createdAt: new Date().toISOString(),
      decisions: [],
      metrics: {
        aiDependency: 'Baixa' as const,
        criticalIntervention: 'Baixa' as const,
        genericRisk: 'Baixo' as const,
        humanContext: 'Moderado' as const,
        summaryQuote: 'Novo projeto iniciado. Comece a monitorar suas escolhas para calcular seu rastro crítico.'
      }
    };

    saveState({
      ...state,
      projects: [...state.projects, newProject],
      activeProjectId: newId,
      activeDecisionNodeId: null
    });
    setCurrentView('canvas');
  };

  const handleDeleteProject = (projectId: string) => {
    if (state.projects.length <= 1) return; // Prevent deleting everything
    const remaining = state.projects.filter(p => p.id !== projectId);
    const nextActive = remaining[0].id;
    const nextNode = remaining[0].decisions[0]?.id || null;

    saveState({
      ...state,
      projects: remaining,
      activeProjectId: nextActive,
      activeDecisionNodeId: nextNode
    });
  };

  const handleSelectNode = (nodeId: string) => {
    saveState({
      ...state,
      activeDecisionNodeId: nodeId
    });
    setIsDialogueOpen(true);
  };

  // Re-classify design node stance direct from timeline controls
  const handleClassifyActiveNode = (classification: DecisionClassification) => {
    if (!state.activeDecisionNodeId || !activeProject) return;

    // Recalculate human / AI agency weight
    let human = 50;
    let ai = 50;
    if (classification === 'aceitei') { human = 10; ai = 90; }
    else if (classification === 'editei') { human = 40; ai = 60; }
    else if (classification === 'recusei') { human = 90; ai = 10; }
    else if (classification === 'confrontei') { human = 80; ai = 20; }
    else if (classification === 'recontextualizei') { human = 95; ai = 5; }

    const updatedDecisions = activeProject.decisions.map((node) => {
      if (node.id === state.activeDecisionNodeId) {
        return {
          ...node,
          classification,
          agencyWeight: { human, ai }
        };
      }
      return node;
    });

    // Integrity level impact
    let systemIntegrity = Math.max(10, Math.min(100, state.systemIntegrity + (classification === 'aceitei' ? -5 : 4)));

    const updatedProjects = state.projects.map((p) => {
      if (p.id === state.activeProjectId) {
        return { ...p, decisions: updatedDecisions };
      }
      return p;
    });

    saveState({
      ...state,
      projects: updatedProjects,
      systemIntegrity
    });
  };

  const handleDeleteNode = (nodeId: string) => {
    if (!activeProject) return;
    const updatedDecisions = activeProject.decisions.filter(d => d.id !== nodeId);
    const nextActiveId = updatedDecisions[0]?.id || null;

    const updatedProjects = state.projects.map((p) => {
      if (p.id === state.activeProjectId) {
        return { ...p, decisions: updatedDecisions };
      }
      return p;
    });

    saveState({
      ...state,
      projects: updatedProjects,
      activeDecisionNodeId: nextActiveId
    });
  };

  // Live trigger to update user-written defenses and call backend evaluate dialogue
  const handleUpdateDefense = (nodeId: string, defense: string, systemResponse: string) => {
    if (!activeProject) return;

    const updatedDecisions = activeProject.decisions.map((node) => {
      if (node.id === nodeId) {
        return {
          ...node,
          defense,
          systemResponse
        };
      }
      return node;
    });

    // Slightly tilt system integrity level positively depending on active defense submissions
    let systemIntegrity = Math.min(100, state.systemIntegrity + 2);

    const updatedProjects = state.projects.map((p) => {
      if (p.id === state.activeProjectId) {
        return { ...p, decisions: updatedDecisions };
      }
      return p;
    });

    saveState({
      ...state,
      projects: updatedProjects,
      systemIntegrity
    });
  };

  // Add registered node to project decisions
  const handleSaveNewDecisionNode = (newNodeData: Omit<DecisionNode, 'id' | 'date' | 'systemResponse'>) => {
    if (!activeProject) return;

    const newId = `node-${Date.now()}`;
    const completeNode: DecisionNode = {
      ...newNodeData,
      id: newId,
      date: new Date().toISOString(),
      systemResponse: '[DIÁLOGO EM AGUARDO]\nEnvie a sua justificativa na gaveta direita para obter o veredito crítico do cartógrafo.'
    };

    const updatedDecisions = [...activeProject.decisions, completeNode].slice(0, 4);

    const updatedProjects = state.projects.map((p) => {
      if (p.id === state.activeProjectId) {
        return { ...p, decisions: updatedDecisions };
      }
      return p;
    });

    saveState({
      ...state,
      projects: updatedProjects,
      activeDecisionNodeId: newId
    });
  };

  // Manual weights slider updates in agency tab view
  const handleUpdateWeights = (nodeId: string, human: number, ai: number) => {
    if (!activeProject) return;

    const updatedDecisions = activeProject.decisions.map((node) => {
      if (node.id === nodeId) {
        return {
          ...node,
          agencyWeight: { human, ai }
        };
      }
      return node;
    });

    const updatedProjects = state.projects.map((p) => {
      if (p.id === state.activeProjectId) {
        return { ...p, decisions: updatedDecisions };
      }
      return p;
    });

    saveState({
      ...state,
      projects: updatedProjects
    });
  };

  // Force compilation of Cartografia Metrics from decisions (via server-side or local)
  const handleRecalculateCartography = async () => {
    if (!activeProject || activeProject.decisions.length === 0) return;
    setIsRecalculatingMetrics(true);

    try {
      const res = await fetch('/api/generate-cartography', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decisions: activeProject.decisions })
      });

      if (res.ok) {
        const data = await res.json();
        const updatedProjects = state.projects.map((p) => {
          if (p.id === state.activeProjectId) {
            return {
              ...p,
              metrics: data.metrics
            };
          }
          return p;
        });

        saveState({
          ...state,
          projects: updatedProjects
        });
      } else {
        throw new Error('Falha na resposta do servidor.');
      }
    } catch (err) {
      console.warn('Backend recalculation failed, rendering offline robust calculation.', err);
      // Perfect fallback heuristics in Brazilian Portuguese
      const totalDecisions = activeProject.decisions.length;
      const countAceitei = activeProject.decisions.filter(d => d.classification === 'aceitei').length;
      const countCritical = activeProject.decisions.filter(d => ['recusei', 'confrontei', 'recontextualizei'].includes(d.classification)).length;

      const aiDependency = countAceitei / totalDecisions > 0.5 ? 'Alta' : (countAceitei / totalDecisions > 0.2 ? 'Média' : 'Baixa');
      const criticalIntervention = countCritical / totalDecisions > 0.5 ? 'Alta' : (countCritical / totalDecisions > 0.2 ? 'Média' : 'Baixa');
      const genericRisk = aiDependency === 'Alta' ? 'Alto' : (aiDependency === 'Média' ? 'Médio' : 'Baixo');
      const humanContext = criticalIntervention === 'Alta' ? 'Resistente' : (criticalIntervention === 'Média' ? 'Moderado' : 'Frágil');

      const quote = countCritical > countAceitei 
        ? "Seu rastro local offline atesta uma barreira ativa contra a colonização do imaginário por clichés generativos corporativos padrão."
        : "O rastro apresenta fraturas de passividade produtiva. Busque tensionar ativamente as diretrizes para garantir de fato autoria projetual.";

      const updatedProjects = state.projects.map((p) => {
        if (p.id === state.activeProjectId) {
          return {
            ...p,
            metrics: {
              aiDependency,
              criticalIntervention,
              genericRisk,
              humanContext,
              summaryQuote: quote
            }
          };
        }
        return p;
      });

      saveState({
        ...state,
        projects: updatedProjects
      });
    } finally {
      setIsRecalculatingMetrics(false);
    }
  };

  const handleToggleProtectionMode = () => {
    saveState({
      ...state,
      protectionMode: !state.protectionMode
    });
  };

  const handleResetState = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    saveState({
      projects: INITIAL_PROJECTS,
      activeProjectId: INITIAL_PROJECTS[0].id,
      activeDecisionNodeId: INITIAL_PROJECTS[0].decisions[0]?.id || null,
      protectionMode: true,
      systemIntegrity: 98
    });
    setCurrentView('canvas');
  };

  const handleImportState = (imported: AppState) => {
    saveState(imported);
    if (imported.projects && imported.projects.length > 0) {
      const activeProj = imported.projects.find(p => p.id === imported.activeProjectId) || imported.projects[0];
      const activeNodeId = activeProj.decisions[0]?.id || null;
      setState(prev => ({
        ...imported,
        activeProjectId: activeProj.id,
        activeDecisionNodeId: activeNodeId
      }));
    }
  };

  // Render sub-view panels dynamically depending on current router tab
  const renderViewContent = () => {
    switch (currentView) {
      case 'canvas':
        return (
          <DecisionCanvas
            decisions={activeProject?.decisions || []}
            activeNodeId={state.activeDecisionNodeId}
            onSelectNode={handleSelectNode}
            onClassifyActiveNode={handleClassifyActiveNode}
            onDeleteNode={handleDeleteNode}
            metrics={activeProject?.metrics || null}
            onTriggerRecalculate={handleRecalculateCartography}
          />
        );
      case 'cartografia':
        return (
          <CartografiaPanel
            decisions={activeProject?.decisions || []}
            metrics={activeProject?.metrics || null}
            onTriggerRecalculate={handleRecalculateCartography}
          />
        );
      case 'agency':
        return (
          <NodesOfAgency
            decisions={activeProject?.decisions || []}
            onUpdateWeights={handleUpdateWeights}
            onSelectNode={handleSelectNode}
            activeNodeId={state.activeDecisionNodeId}
          />
        );
      case 'interventions':
        return (
          <InterventionsLog
            decisions={activeProject?.decisions || []}
            onSelectNode={(nodeId) => {
              handleSelectNode(nodeId);
              setCurrentView('canvas');
            }}
          />
        );
      case 'archive':
        return (
          <ArchiveProjects
            projects={state.projects}
            activeProjectId={state.activeProjectId}
            onSelectProject={handleSelectProject}
            onCreateProject={handleCreateProject}
            onDeleteProject={handleDeleteProject}
          />
        );
      case 'notifications':
        return (
          <NotificationsPanel
            onNavigateToView={setCurrentView}
          />
        );
      case 'settings':
        return (
          <SettingsPanel
            systemIntegrity={state.systemIntegrity}
            protectionMode={state.protectionMode}
            onToggleProtectionMode={handleToggleProtectionMode}
            onResetState={handleResetState}
            appState={state}
            onImportState={handleImportState}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#0c1322] text-[#dce2f7] min-h-screen flex flex-col font-sans selection:bg-violet-600 selection:text-white" id="rastro-critico-root">
      
      {/* 1. Universal Spec Header top navigation */}
      <Header
        projects={state.projects}
        activeProjectId={state.activeProjectId}
        onSelectProject={handleSelectProject}
        onTriggerNewDecision={() => setIsRegisterOpen(true)}
        systemIntegrity={state.systemIntegrity}
        currentView={currentView}
        onChangeView={setCurrentView}
      />

      {/* 2. Main content split with structural layouts */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative" id="split-layout-spec">
        
        {/* Left menu Sidebar */}
        <Sidebar
          currentView={currentView}
          onChangeView={setCurrentView}
          systemIntegrity={state.systemIntegrity}
          protectionMode={state.protectionMode}
          onToggleProtectionMode={handleToggleProtectionMode}
        />

        {/* Central interactive viewport */}
        <main className="flex-1 flex flex-col overflow-y-auto min-h-[calc(100vh-160px)] md:min-h-0 relative z-10">
          
          {/* Global Warnings in Active Protection Mode with Cliché alert flags */}
          {state.protectionMode && (
            <div className="bg-amber-500/10 border-b border-amber-500/25 px-6 py-2.5 flex items-center justify-between text-xs text-amber-300">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
                <span className="font-medium">
                  <strong>Modo Proteção Ativo:</strong> Monitorando prompts em tempo real para acusar jargões genéricos da indústria.
                </span>
              </div>
              <span className="hidden sm:inline font-mono text-[9px] uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded text-amber-400">
                Escudo Ativo
              </span>
            </div>
          )}

          {renderViewContent()}
        </main>

        {/* Right drawer sidebar: Diálogo Crítico */}
        {currentView !== 'archive' && currentView !== 'agency' && currentView !== 'interventions' && currentView !== 'notifications' && currentView !== 'settings' && (
          isDialogueOpen ? (
            <DialogoCritico
              activeNode={activeNode}
              onUpdateDefense={handleUpdateDefense}
              onClose={() => setIsDialogueOpen(false)}
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsDialogueOpen(true)}
              className="fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-[#070e1d]/90 hover:bg-violet-950/50 border-l border-t border-b border-white/10 hover:border-violet-500/40 px-2 py-6 rounded-l shadow-[0_0_15px_rgba(124,58,237,0.15)] text-slate-300 hover:text-white transition-all cursor-pointer flex flex-col items-center gap-2 font-mono text-[9px] font-black uppercase tracking-[0.2em] select-none"
              id="critic-dialogue-drawer"
              style={{ writingMode: 'vertical-rl' }}
              title="Abrir Diálogo"
            >
              <MessageCircle className="w-3.5 h-3.5 rotate-90 text-violet-400 mb-1" />
              <span>ABRIR DIÁLOGO CRÍTICO</span>
            </button>
          )
        )}
      </div>

      {/* 3. New Decision registration overlay dialog */}
      {isRegisterOpen && (
        <RegisterModal
          onClose={() => setIsRegisterOpen(false)}
          onSave={handleSaveNewDecisionNode}
          protectionMode={state.protectionMode}
        />
      )}

      {/* Atmospheric speculative scanlines back pattern overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 mix-blend-screen bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" id="scanlines-pattern"></div>
    </div>
  );
}
