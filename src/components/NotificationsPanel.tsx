import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Trash2, 
  ShieldAlert, 
  Sparkles, 
  Check, 
  Volume2, 
  VolumeX, 
  Terminal, 
  AlertTriangle,
  Flame,
  ArrowRight
} from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: 'critical' | 'warning' | 'info' | 'system';
  timestamp: string;
  isRead: boolean;
  actionRequired?: {
    label: string;
    path: string;
  };
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Colonização Heurística Detectada',
    description: 'A palavra cliché "a testament to" foi interceptada no Prompt #2. Recomenda-se substituição imediata por escrita autoral.',
    type: 'critical',
    timestamp: 'Há 5 minutos',
    isRead: false,
    actionRequired: { label: 'Tensionar Prompt', path: 'canvas' }
  },
  {
    id: 'notif-2',
    title: 'Nível de Autoria Elevado',
    description: 'Ao recontextualizar a sugestão da IA no último nó, você elevou a integridade existencial do seu portfólio em +4%.',
    type: 'system',
    timestamp: 'Há 20 minutos',
    isRead: false
  },
  {
    id: 'notif-3',
    title: 'Aviso de Dependência Comercial',
    description: 'Seu padrão de aceitação rápida de código e textos pode criar dependências ocultas das estruturas de nuvem estrangeiras.',
    type: 'warning',
    timestamp: 'Há 1 hora',
    isRead: false,
    actionRequired: { label: 'Rever Agência', path: 'agency' }
  },
  {
    id: 'notif-4',
    title: 'Atualização do Vocabulário de Bloqueio',
    description: 'Dicionário de jargões "ChatGPTês" v2.4 sincronizado automaticamente. 45 novos termos banidos.',
    type: 'info',
    timestamp: 'Há 5 horas',
    isRead: true
  }
];

interface NotificationsPanelProps {
  onNavigateToView: (view: 'canvas' | 'cartografia' | 'agency' | 'interventions' | 'archive' | 'notifications' | 'settings') => void;
}

export default function NotificationsPanel({ onNavigateToView }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [audioFeedback, setAudioFeedback] = useState(true);

  // Load from localStorage or set default
  useEffect(() => {
    const saved = localStorage.getItem('rastro_critico_notifications');
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch (e) {
        setNotifications(DEFAULT_NOTIFICATIONS);
      }
    } else {
      setNotifications(DEFAULT_NOTIFICATIONS);
      localStorage.setItem('rastro_critico_notifications', JSON.stringify(DEFAULT_NOTIFICATIONS));
    }
  }, []);

  const saveToStorage = (items: NotificationItem[]) => {
    setNotifications(items);
    localStorage.setItem('rastro_critico_notifications', JSON.stringify(items));
  };

  const handleMarkAsRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
    saveToStorage(updated);
  };

  const handleMarkAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    saveToStorage(updated);
  };

  const handleClearAll = () => {
    saveToStorage([]);
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notifications.filter(n => n.id !== id);
    saveToStorage(updated);
  };

  // Allow the user to simulate an alert to see it working live
  const handleSimulateAlert = () => {
    const alerts = [
      {
        title: 'Cliché Corporativo Interceptado',
        description: 'Uso de "Furthermore, it is crucial" detectado na entrada de texto. Ação de limpeza recomendada.',
        type: 'critical' as const,
        actionRequired: { label: 'Filtrar Prompt', path: 'canvas' as const }
      },
      {
        title: 'Integridade Crítica Comprometida',
        description: 'Seu nível de integridade caiu abaixo de 60%. Restabeleça o controle manual ou confronte os nós.',
        type: 'warning' as const,
        actionRequired: { label: 'Confrontar nós', path: 'canvas' as const }
      },
      {
        title: 'Sincronização de Heurística Concluída',
        description: 'Seu Rastro Crítico local obteve redundância descentralizada no cache persistente.',
        type: 'info' as const
      }
    ];

    const chosenAlert = alerts[Math.floor(Math.random() * alerts.length)];
    const newAlert: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: chosenAlert.title,
      description: chosenAlert.description,
      type: chosenAlert.type,
      timestamp: 'Agora mesmo',
      isRead: false,
      actionRequired: chosenAlert.actionRequired as any
    };

    saveToStorage([newAlert, ...notifications]);

    // Play a gentle feedback synth sound in modern browsers if enabled
    if (audioFeedback) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        if (chosenAlert.type === 'critical') {
          oscillator.frequency.setValueAtTime(260, audioCtx.currentTime); // C4
          oscillator.frequency.exponentialRampToValueAtTime(130, audioCtx.currentTime + 0.3);
          gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
          oscillator.start();
          oscillator.stop(audioCtx.currentTime + 0.3);
        } else {
          oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
          oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.2);
          gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
          oscillator.start();
          oscillator.stop(audioCtx.currentTime + 0.2);
        }
      } catch (err) {
        // Safe fallback if browser security blocks automated audio
      }
    }
  };

  const getStyleByType = (type: NotificationItem['type']) => {
    switch (type) {
      case 'critical':
        return {
          border: 'border-rose-500/30 bg-rose-955/20 hover:border-rose-500/50',
          text: 'text-rose-400',
          bgLight: 'bg-rose-500/10',
          badgeText: 'Alerta Crítico'
        };
      case 'warning':
        return {
          border: 'border-amber-500/30 bg-amber-955/10 hover:border-amber-500/50',
          text: 'text-amber-400',
          bgLight: 'bg-amber-500/10',
          badgeText: 'Atenção'
        };
      case 'system':
        return {
          border: 'border-emerald-500/30 bg-emerald-955/10 hover:border-emerald-500/50',
          text: 'text-emerald-400',
          bgLight: 'bg-emerald-500/10',
          badgeText: 'Sucesso'
        };
      case 'info':
      default:
        return {
          border: 'border-violet-500/30 bg-violet-955/10 hover:border-violet-500/50',
          text: 'text-violet-400',
          bgLight: 'bg-violet-500/10',
          badgeText: 'Heurística'
        };
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="p-6 md:p-8 flex-1 flex flex-col justify-between max-w-5xl mx-auto w-full" id="notifications-panel-screen">
      <div className="space-y-6">
        {/* Header Block Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-600/15 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
              <Bell className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="font-sans text-2xl font-black text-white uppercase tracking-tight">
                Notificações de Integridade
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                Sinais em tempo real captados pela malha contra passividade cognitiva.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Toggle Audio feedback */}
            <button
              onClick={() => setAudioFeedback(!audioFeedback)}
              className={`p-2 rounded border text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                audioFeedback 
                  ? 'bg-violet-950/40 border-violet-500/30 text-violet-300' 
                  : 'bg-slate-900/60 border-white/5 text-slate-500'
              }`}
              title={audioFeedback ? 'Desativar feedback sonoro' : 'Ativar feedback sonoro'}
            >
              {audioFeedback ? (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Som Ativo</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Mutado</span>
                </>
              )}
            </button>

            {/* Test alert trigger */}
            <button
              onClick={handleSimulateAlert}
              className="px-3 py-2 rounded bg-pink-600/15 hover:bg-pink-600/25 text-pink-400 hover:text-pink-300 text-xs font-mono font-bold uppercase border border-pink-500/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              Testar Alerta
            </button>

            {notifications.length > 0 && (
              <>
                <button
                  onClick={handleMarkAllAsRead}
                  className="px-3 py-2 rounded bg-slate-900 border border-white/10 hover:border-white/20 text-xs font-sans text-slate-300 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  Marcar Solucionadas
                </button>

                <button
                  onClick={handleClearAll}
                  className="px-3 py-2 rounded bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/20 text-rose-400 hover:text-rose-300 text-xs font-sans transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Limpar Logs
                </button>
              </>
            )}
          </div>
        </div>

        {/* Dynamic counters bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-950/30 border border-white/5 p-4 rounded flex items-center justify-between">
            <div>
              <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest block">ALERTAS PENDENTES</span>
              <span className="text-xl font-bold font-sans text-white">{unreadCount}</span>
            </div>
            <div className={`p-2 rounded ${unreadCount > 0 ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-900 text-slate-600'}`}>
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="bg-slate-950/30 border border-white/5 p-4 rounded flex items-center justify-between">
            <div>
              <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest block">HISTÓRICO TOTAL</span>
              <span className="text-xl font-bold font-sans text-white">{notifications.length}</span>
            </div>
            <div className="p-2 rounded bg-violet-500/10 text-violet-400">
              <Terminal className="w-4 h-4" />
            </div>
          </div>
          <div className="bg-slate-950/30 border border-white/5 p-4 rounded flex items-center justify-between">
            <div>
              <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest block">FEEDBACK SONORO</span>
              <span className="text-xl font-bold font-sans text-white">{audioFeedback ? 'OPERANTE' : 'OFF'}</span>
            </div>
            <div className="p-2 rounded bg-emerald-500/10 text-emerald-400">
              <Volume2 className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Notifications list layout */}
        {notifications.length === 0 ? (
          <div className="bg-slate-950/15 border border-dashed border-white/10 rounded-lg p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-slate-500">
              <Check className="w-6 h-6" />
            </div>
            <div className="max-w-md">
              <h3 className="text-sm font-sans font-bold text-slate-200 uppercase tracking-wider">
                Integridade Operacional Limpa
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Nenhum desvio crítico pendente. Sua autoria epistemológica está mantida com segurança contra padrões automáticos.
              </p>
            </div>
            <button
              onClick={handleSimulateAlert}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              Simular entrada de aviso
            </button>
          </div>
        ) : (
          <div className="space-y-3" id="notifications-list-container">
            {notifications.map((item) => {
              const styles = getStyleByType(item.type);
              return (
                <div
                  key={item.id}
                  onClick={() => handleMarkAsRead(item.id)}
                  className={`border rounded p-4 transition-all duration-200 cursor-pointer flex flex-col md:flex-row justify-between gap-4 items-start ${styles.border} ${
                    item.isRead ? 'opacity-65 grayscale-[30%]' : 'shadow-[0_0_15px_rgba(236,72,153,0.03)]'
                  }`}
                >
                  <div className="flex gap-3.5 items-start">
                    <div className={`p-2 rounded-md ${styles.bgLight} ${styles.text} shrink-0 mt-0.5`}>
                      {item.type === 'critical' && <Flame className="w-4 h-4 animate-pulse" />}
                      {item.type === 'warning' && <AlertTriangle className="w-4 h-4" />}
                      {item.type === 'system' && <Check className="w-4 h-4" />}
                      {item.type === 'info' && <Terminal className="w-4 h-4" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-sans font-bold text-white tracking-tight uppercase">
                          {item.title}
                        </h4>
                        {!item.isRead && (
                          <span className="w-2 h-2 rounded-full bg-pink-500 inline-block animate-ping" />
                        )}
                        <span className="font-mono text-[8px] uppercase tracking-widest font-black bg-white/5 border border-white/10 px-1.5 py-0.5 text-slate-400 rounded">
                          {styles.badgeText}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans max-w-3xl">
                        {item.description}
                      </p>
                      <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
                        <span>{item.timestamp}</span>
                        <span>•</span>
                        <span className="hover:underline text-slate-400 uppercase">
                          {item.isRead ? 'Resolvido (Lido)' : 'Marcar como resolvido'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
                    {item.actionRequired && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(item.id);
                          onNavigateToView(item.actionRequired!.path as any);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded bg-violet-600/10 hover:bg-violet-600 text-violet-300 hover:text-white border border-violet-500/30 text-xs font-mono font-black uppercase tracking-wider transition-all cursor-pointer"
                      >
                        <span>{item.actionRequired.label}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={(e) => handleDeleteItem(item.id, e)}
                      className="p-1.5 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 border border-transparent hover:border-rose-500/20 rounded transition-all cursor-pointer"
                      title="Excluir log"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Epistemological disclaimer card in footer */}
      <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between gap-4 items-center">
        <span className="text-[10px] font-mono font-bold tracking-widest text-[#ec4899] uppercase select-none">
          TRAIL MAKER COGNITIVE ESCORT // V2.4
        </span>
        <span className="text-[10px] font-mono text-slate-500 text-center md:text-right">
          Pressione Esc para fechar o painel ativo ou use as guias laterais para navegar.
        </span>
      </div>
    </div>
  );
}
