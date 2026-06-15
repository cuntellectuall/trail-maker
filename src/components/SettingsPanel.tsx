import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Shield, 
  Trash2, 
  Download, 
  Upload, 
  Plus, 
  X, 
  Check, 
  History, 
  Sliders, 
  AlertTriangle, 
  User, 
  BookOpen
} from 'lucide-react';
import { AppState } from '../types';

interface SettingsPanelProps {
  systemIntegrity: number;
  protectionMode: boolean;
  onToggleProtectionMode: () => void;
  onResetState: () => void;
  appState: AppState;
  onImportState: (imported: AppState) => void;
}

const DEFAULT_FORBIDDEN_WORDS = [
  'delve',
  'a testament to',
  'synergy',
  'game-changing',
  'revolutionize',
  'nestled',
  'plethora',
  'crucial steps',
  'furthermore',
  'robust frameworks'
];

export default function SettingsPanel({
  systemIntegrity,
  protectionMode,
  onToggleProtectionMode,
  onResetState,
  appState,
  onImportState
}: SettingsPanelProps) {
  const [profileName, setProfileName] = useState('Diogo Guimarães');
  const [profileRole, setProfileRole] = useState('Designer Crítico');
  const [defenseStyle, setDefenseStyle] = useState('Contundente/Sarcástico');
  
  // Forbidden Words state
  const [forbiddenWords, setForbiddenWords] = useState<string[]>([]);
  const [newWord, setNewWord] = useState('');
  
  // General Threat level scale
  const [threatLevel, setThreatLevel] = useState<number>(75);
  
  // Operation logs state
  const [showToast, setShowToast] = useState<string | null>(null);

  // Load configuration from local storage
  useEffect(() => {
    const savedWords = localStorage.getItem('trailmaker_forbidden_words');
    if (savedWords) {
      try {
        setForbiddenWords(JSON.parse(savedWords));
      } catch (e) {
        setForbiddenWords(DEFAULT_FORBIDDEN_WORDS);
      }
    } else {
      setForbiddenWords(DEFAULT_FORBIDDEN_WORDS);
      localStorage.setItem('trailmaker_forbidden_words', JSON.stringify(DEFAULT_FORBIDDEN_WORDS));
    }

    const savedProfile = localStorage.getItem('trailmaker_profile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        if (parsed.name) setProfileName(parsed.name);
        if (parsed.role) setProfileRole(parsed.role);
        if (parsed.style) setDefenseStyle(parsed.style);
      } catch (e) {}
    }
  }, []);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(
      'trailmaker_profile',
      JSON.stringify({ name: profileName, role: profileRole, style: defenseStyle })
    );
    triggerToast('Definições do Perfil salvas com sucesso.');
  };

  const handleAddForbiddenWord = () => {
    const clean = newWord.trim().toLowerCase();
    if (!clean) return;
    if (forbiddenWords.includes(clean)) {
      triggerToast('Esta palavra já está catalogada.');
      return;
    }
    const updated = [...forbiddenWords, clean];
    setForbiddenWords(updated);
    localStorage.setItem('trailmaker_forbidden_words', JSON.stringify(updated));
    setNewWord('');
    triggerToast(`"${clean}" adicionada ao dicionário de cliché.`);
  };

  const handleRemoveForbiddenWord = (word: string) => {
    const updated = forbiddenWords.filter(w => w !== word);
    setForbiddenWords(updated);
    localStorage.setItem('trailmaker_forbidden_words', JSON.stringify(updated));
    triggerToast(`"${word}" removida do monitoramento.`);
  };

  const handleExportData = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `trailmaker_rastro_critico_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      triggerToast('Rastro de Decisões exportado com sucesso.');
    } catch (err) {
      triggerToast('Erro na exportação de metadados.');
    }
  };

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const files = e.target.files;
    if (!files || files.length === 0) return;

    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && Array.isArray(parsed.projects) && 'activeProjectId' in parsed) {
          onImportState(parsed);
          triggerToast('Estrutura de dados importada com sucesso.');
        } else {
          throw new Error('Formato do arquivo JSON inválido.');
        }
      } catch (err) {
        triggerToast('Falha na importação: Verifique o formato do JSON.');
      }
    };
    fileReader.readAsText(files[0]);
  };

  return (
    <div className="p-6 md:p-8 flex-1 flex flex-col justify-between max-w-5xl mx-auto w-full" id="settings-panel-screen">
      <div className="space-y-8">
        
        {/* Header Block Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#ec4899]/15 border border-[#ec4899]/30 flex items-center justify-center text-[#ec4899] shadow-[0_0_15px_rgba(236,72,153,0.15)]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-sans text-2xl font-black text-white uppercase tracking-tight">
                Painel de Configuração
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                Personalize os comportamentos da heurística de autoria e limites de controle.
              </p>
            </div>
          </div>
          
          <div className="bg-slate-900 border border-white/5 p-2 rounded flex items-center gap-4 px-4">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Integridade Crítica Geral</span>
            <div className="text-sm font-bold text-white">{systemIntegrity}%</div>
          </div>
        </div>

        {/* Settings Grid Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Column A: Left 7 units - Words and Controls */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Cliché Monitoring Container */}
            <div className="bg-slate-950/40 border border-white/5 p-5 md:p-6 rounded-md space-y-5">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold font-sans text-slate-200 uppercase tracking-wide flex items-center gap-2">
                    <Shield className="w-4 h-4 text-pink-500" />
                    Monitoramento de Jargões (IA)
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans">
                    Termos interceptados na interface de geração de prompt pelo módulo Escudo.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono text-slate-500 font-black uppercase">Escudo</span>
                  <button 
                    onClick={onToggleProtectionMode}
                    className={`w-10 h-5 rounded-full p-0.5 transition-all outline-none duration-250 cursor-pointer ${
                      protectionMode ? 'bg-[#ec4899]' : 'bg-slate-800'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-all transform ${
                      protectionMode ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Interactive Forbidden word tag editor */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddForbiddenWord()}
                    placeholder="Adicionar novo termo cliché (ex: delve, revolutionary...)"
                    className="flex-1 bg-slate-900/85 border border-white/10 rounded py-2 px-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-pink-500/50"
                  />
                  <button
                    onClick={handleAddForbiddenWord}
                    className="p-2 px-4 rounded bg-pink-600/10 hover:bg-pink-600/25 text-pink-400 border border-pink-500/20 text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Adicionar
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5" id="forbidden-words-tags">
                  {forbiddenWords.map((word) => (
                    <span 
                      key={word}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono bg-slate-900 border border-white/5 rounded text-slate-300 transition-all hover:border-rose-500/50"
                    >
                      <span className="text-slate-400">{word}</span>
                      <button
                        onClick={() => handleRemoveForbiddenWord(word)}
                        className="text-slate-500 hover:text-rose-400 transition-all cursor-pointer"
                        title={`Remover ${word}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Manual Weights and Threat Levels Sliders */}
            <div className="bg-slate-950/40 border border-white/5 p-5 md:p-6 rounded-md space-y-5">
              <div className="space-y-1">
                <h3 className="text-sm font-bold font-sans text-slate-200 uppercase tracking-wide flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-violet-400" />
                  Sensibilidade Heurística
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  Ajuste a agressividade com que o cartógrafo avalia desvios ideográficos.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Limite de Alerta de Colonização</span>
                    <span className="text-[#ec4899] font-bold">{threatLevel}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={threatLevel}
                    onChange={(e) => setThreatLevel(Number(e.target.value))}
                    className="w-full accent-pink-500 bg-slate-900 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Branda (Foco IA)</span>
                    <span>Modo Pânico (Foco Humano)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Backups / Metadata Synchronization */}
            <div className="bg-slate-950/40 border border-white/5 p-5 md:p-6 rounded-md space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold font-sans text-slate-200 uppercase tracking-wide">
                  Sincronização e Backup Local
                </h3>
                <p className="text-xs text-slate-500 font-sans">
                  Importe ou exporte o cache local completo do seu Rastro Crítico em JSON.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1.5">
                <button
                  onClick={handleExportData}
                  className="p-3.5 bg-slate-900 hover:bg-slate-900/60 text-slate-200 border border-white/5 rounded text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2 "
                >
                  <Download className="w-4 h-4 text-pink-400" />
                  Exportar banco (.JSON)
                </button>

                <label className="p-3.5 bg-slate-900 hover:bg-slate-900/60 text-slate-200 border border-white/5 rounded text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2 ">
                  <Upload className="w-4 h-4 text-violet-400" />
                  <span>Importar arquivo</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

          </div>

          {/* Column B: Right 5 units - Perfil e Expurgo */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Author Profile Form */}
            <div className="bg-slate-950/40 border border-white/5 p-5 md:p-6 rounded-md">
              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold font-sans text-slate-200 uppercase tracking-wide flex items-center gap-2">
                    <User className="w-4 h-4 text-violet-400" />
                    Identidade do Autor (Escritor)
                  </h3>
                  <p className="text-xs text-slate-500 font-sans">
                    Dados utilizados para gerar suas defesas cartográficas.
                  </p>
                </div>

                <div className="space-y-3.5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Nome do Autor</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-pink-500/50"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Papel / Ocupação</label>
                    <input
                      type="text"
                      value={profileRole}
                      onChange={(e) => setProfileRole(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-pink-500/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Estilo de Diálogo Preferencial</label>
                    <select
                      value={defenseStyle}
                      onChange={(e) => setDefenseStyle(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-pink-500/50"
                    >
                      <option value="Contundente/Sarcástico" className="bg-slate-950 text-slate-200">Contundente/Sarcástico</option>
                      <option value="Acadêmico/Formal" className="bg-slate-950 text-slate-200">Acadêmico/Formal</option>
                      <option value="Poético/Filosófico" className="bg-slate-950 text-slate-200">Poético/Filosófico</option>
                      <option value="Técnico-Cibernético" className="bg-slate-950 text-slate-200">Técnico-Cibernético</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer block text-center"
                  >
                    Salvar Perfil
                  </button>
                </div>
              </form>
            </div>

            {/* Wipe cache system reset card */}
            <div className="bg-rose-950/10 border border-rose-500/20 p-5 md:p-6 rounded-md space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold font-sans text-rose-400 uppercase tracking-wide flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
                  Zona de Expurgo (Destrutivo)
                </h3>
                <p className="text-xs text-rose-300/75 leading-relaxed font-sans">
                  Sua autoria de rastro será apagada permanentemente da memória. Esta ação não poderá ser desfeita.
                </p>
              </div>

              <button
                onClick={() => {
                  if (confirm('Tem certeza de que deseja apagar todos os registros críticos e retornar ao estado original?')) {
                    onResetState();
                    triggerToast('O estado do sistema foi purgado com sucesso.');
                  }
                }}
                className="w-full py-3 bg-rose-500/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/30 rounded text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
              >
                Purgar banco de dados
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Floating feedback alert toast representation */}
      {showToast && (
        <div className="fixed bottom-6 left-6 z-[60] bg-slate-950/90 border border-[#ec4899]/30 text-slate-200 py-3.5 px-5 rounded shadow-lg text-xs font-sans tracking-wide animate-fade-in flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse shrink-0"></span>
          <span>{showToast}</span>
        </div>
      )}

      {/* Epistemological disclaimer card in footer */}
      <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between gap-4 items-center">
        <span className="text-[10px] font-mono font-bold tracking-widest text-[#ec4899] uppercase select-none">
          TRAIL MAKER CONTROL DECK // V2.4
        </span>
        <span className="text-[10px] font-mono text-slate-500 text-center md:text-right">
          Pressione Esc para fechar o painel ativo ou use as guias laterais para retornar.
        </span>
      </div>
    </div>
  );
}
