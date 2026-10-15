import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Registration,
  StaffUser,
  CheckInRecord,
  CheckInValidationResult,
  EventSettings,
  TicketTier,
} from '../types';
import { eventStore } from '../services/store';
import { QrCameraScanner } from './QrCameraScanner';
import {
  QrCode,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Users,
  ShieldCheck,
  UserCheck,
  Camera,
  KeyRound,
  RefreshCw,
  X,
  ArrowRight,
  Award,
  Layers,
  Check,
  RotateCcw,
  Sparkles,
  BarChart3,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Activity,
} from 'lucide-react';

interface CheckInStaffPortalProps {
  settings: EventSettings;
  ticketTiers: TicketTier[];
  isOpen: boolean;
  onClose: () => void;
  onOpenAdminFull?: () => void;
}

export const CheckInStaffPortal: React.FC<CheckInStaffPortalProps> = ({
  settings,
  ticketTiers,
  isOpen,
  onClose,
  onOpenAdminFull,
}) => {
  const [activeStaff, setActiveStaff] = useState<StaffUser>(() => eventStore.getActiveStaffUser());
  const [isStaffLoginOpen, setIsStaffLoginOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Search & Validation state
  const [queryInput, setQueryInput] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Current Validation Evaluation
  const [evaluation, setEvaluation] = useState<{
    status: CheckInValidationResult;
    message: string;
    registration?: Registration;
    previousCheckIn?: CheckInRecord;
    canOverride?: boolean;
  } | null>(null);

  // Success Feedback
  const [successFeedback, setSuccessFeedback] = useState<string | null>(null);

  // Override Modal
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');

  // Live KPIs
  const [kpis, setKpis] = useState(() => eventStore.getLiveCheckInKPIs());

  const refreshKpis = () => {
    setKpis(eventStore.getLiveCheckInKPIs());
  };

  useEffect(() => {
    refreshKpis();
    const interval = setInterval(refreshKpis, 3500);
    return () => clearInterval(interval);
  }, []);

  if (!isOpen) return null;

  // Handle Query Evaluation (Backend Check via eventStore)
  const handleEvaluate = (code: string) => {
    setSuccessFeedback(null);
    const clean = code.trim();
    if (!clean) return;

    setIsEvaluating(true);
    // Simulate brief network round-trip for atomic server check
    setTimeout(() => {
      const res = eventStore.evaluateCheckIn(clean);
      setEvaluation(res);
      setIsEvaluating(false);
    }, 120);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleEvaluate(queryInput);
  };

  // Execute standard check-in: ONLY registers presence upon clicking CONFIRMAR ENTRADA
  const handleConfirmEntry = () => {
    if (!evaluation?.registration) return;

    const execRes = eventStore.executeCheckIn(evaluation.registration.id, activeStaff);
    if (execRes.success) {
      setSuccessFeedback(execRes.message);
      setEvaluation(null);
      setQueryInput('');
      refreshKpis();
    } else {
      setEvaluation({
        status: 'INVALIDO',
        message: execRes.message,
      });
    }
  };

  // Execute override check-in (authorized by supervisor/admin)
  const handleConfirmOverride = () => {
    if (!evaluation?.registration || !overrideReason.trim()) return;

    const execRes = eventStore.executeCheckIn(
      evaluation.registration.id,
      activeStaff,
      true,
      overrideReason.trim()
    );

    if (execRes.success) {
      setSuccessFeedback(execRes.message);
      setEvaluation(null);
      setIsOverrideModalOpen(false);
      setOverrideReason('');
      setQueryInput('');
      refreshKpis();
    }
  };

  // Continuous scanning reset
  const handleNextScan = () => {
    setEvaluation(null);
    setSuccessFeedback(null);
    setQueryInput('');
  };

  // Staff PIN Authentication
  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    const user = eventStore.authenticateStaffPin(pinInput);
    if (user) {
      setActiveStaff(user);
      eventStore.setActiveStaffUser(user.id);
      setIsStaffLoginOpen(false);
      setPinInput('');
    } else {
      setPinError('PIN de funcionário incorrecto ou conta inactiva.');
    }
  };

  // Hourly Flow Chart Settings
  const [isChartExpanded, setIsChartExpanded] = useState(true);
  const [chartMode, setChartMode] = useState<'stacked' | 'grouped'>('stacked');

  // Hourly check-in aggregation calculated from eventStore records
  const hourlyData = useMemo(() => {
    const checkIns = eventStore.getCheckIns();
    // Default daytime event hours: 08:00 to 18:00
    const baseHours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

    // Detect if checkins occurred in other hours and include them dynamically
    checkIns.forEach((c) => {
      const match = c.timestamp.match(/(?:^|\s)(\d{1,2}):/);
      if (match) {
        const h = parseInt(match[1], 10);
        if (!baseHours.includes(h) && h >= 0 && h <= 23) {
          baseHours.push(h);
        }
      }
    });

    baseHours.sort((a, b) => a - b);

    let maxFlow = 0;
    let peakHourStr = '09h – 10h';

    const data = baseHours.map((h) => {
      const recordsThisHour = checkIns.filter((c) => {
        const match = c.timestamp.match(/(?:^|\s)(\d{1,2}):/);
        return match ? parseInt(match[1], 10) === h : false;
      });

      const conf = recordsThisHour.filter((c) =>
        c.modality.toLowerCase().includes('conferência')
      ).length;
      const exp = recordsThisHour.filter(
        (c) => !c.modality.toLowerCase().includes('conferência')
      ).length;
      const total = conf + exp;

      if (total > maxFlow) {
        maxFlow = total;
        peakHourStr = `${h.toString().padStart(2, '0')}h – ${(h + 1).toString().padStart(2, '0')}h`;
      }

      return {
        hourLabel: `${h.toString().padStart(2, '0')}h`,
        hour: h,
        conferencia: conf,
        experience: exp,
        total,
      };
    });

    const activeHoursCount = data.filter((d) => d.total > 0).length || 1;
    const totalEntries = checkIns.length;
    const avgFlow = Math.round(totalEntries / activeHoursCount);

    return {
      chartData: data,
      peakHour: peakHourStr,
      peakValue: maxFlow,
      averageFlow: avgFlow,
      totalEntries,
    };
  }, [kpis, successFeedback]);

  // Custom Dark Tooltip Component for Recharts
  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-zinc-950 border border-zinc-700 p-3 rounded-xl shadow-2xl text-xs space-y-1.5 min-w-[200px]">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
            <span className="font-semibold text-zinc-400">Janela Horária:</span>
            <span className="font-mono font-bold text-amber-400">{label}:00 – {label}:59</span>
          </div>
          <div className="space-y-1 pt-0.5">
            <div className="flex items-center justify-between text-purple-300">
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span>Conferência Gratuita:</span>
              </span>
              <span className="font-mono font-bold">{d.conferencia}</span>
            </div>
            <div className="flex items-center justify-between text-amber-300">
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Café Experience:</span>
              </span>
              <span className="font-mono font-bold">{d.experience}</span>
            </div>
            <div className="flex items-center justify-between text-white font-bold pt-1.5 border-t border-zinc-800">
              <span>Total no Horário:</span>
              <span className="font-mono text-emerald-400 text-sm">{d.total}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-950 border border-zinc-700 rounded-3xl max-w-4xl w-full p-4 sm:p-6 space-y-6 shadow-2xl relative my-auto">
        {/* Top Header & Operator Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-4 gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#3B0764] to-[#BE123C] flex items-center justify-center text-white shadow">
              <QrCode className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <h2 className="text-base sm:text-lg font-black text-white">
                  Validação de Ingressos · Terminal de Portaria
                </h2>
              </div>
              <p className="text-xs text-zinc-400">
                79.ª Edição do Café do Empreendedor · Leitura por Câmara & Controlo em Tempo Real
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Active Staff Switcher Button */}
            <button
              onClick={() => setIsStaffLoginOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-xs font-semibold text-zinc-200 flex items-center space-x-1.5 transition-colors cursor-pointer"
              title="Trocar operador ou introduzir PIN"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{activeStaff.name}</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-zinc-800 text-zinc-400 font-mono">
                {activeStaff.role === 'ADMIN' ? 'Admin' : activeStaff.role === 'SUPERVISOR_CHECKIN' ? 'Sup' : 'Portaria'}
              </span>
            </button>

            {onOpenAdminFull && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAdminFull();
                }}
                className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 transition-colors hidden md:inline-flex cursor-pointer"
              >
                Painel Admin
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 cursor-pointer"
              title="Fechar Terminal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Event Real-Time KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1">
            <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Total Confirmados</span>
            <p className="text-xl sm:text-2xl font-black text-white font-mono">{kpis.totalConfirmed}</p>
            <p className="text-[10px] text-zinc-500">Inscrições com ingresso emitido</p>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 space-y-1">
            <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">Participantes Presentes</span>
            <p className="text-xl sm:text-2xl font-black text-emerald-300 font-mono">{kpis.totalCheckedIn}</p>
            <p className="text-[10px] text-emerald-400 font-semibold">{kpis.attendanceRate}% do público presente</p>
          </div>

          <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-800/40 space-y-1">
            <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">Aguardando Entrada</span>
            <p className="text-xl sm:text-2xl font-black text-amber-300 font-mono">{kpis.totalUnused}</p>
            <p className="text-[10px] text-amber-400">Ingressos por utilizar</p>
          </div>

          <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-800/40 space-y-1">
            <span className="text-[10px] text-purple-400 uppercase font-bold tracking-wider">Por Modalidade</span>
            <div className="flex items-baseline space-x-2 font-mono">
              <span className="text-sm font-bold text-white">{kpis.confCheckedIn}/{kpis.confTotal} Conf</span>
              <span className="text-zinc-600">·</span>
              <span className="text-sm font-bold text-amber-400">{kpis.expCheckedIn}/{kpis.expTotal} Exp</span>
            </div>
            <p className="text-[10px] text-purple-300">Conferência vs Experience</p>
          </div>
        </div>

        {/* Hourly Check-In Flow Chart (Recharts) */}
        <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-4 sm:p-5 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Evolução das Entradas por Hora (Fluxo de Portaria)
                </h3>
              </div>
              <p className="text-xs text-zinc-400">
                Visualização do volume de entradas por hora para gestão de fluxo, controlo de filas e alocação de operadores.
              </p>
            </div>

            {/* Controls: Mode Switcher & Toggle */}
            <div className="flex items-center space-x-2 shrink-0">
              <div className="flex bg-zinc-950 p-0.5 rounded-xl border border-zinc-800 text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setChartMode('stacked')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    chartMode === 'stacked'
                      ? 'bg-[#BE123C] text-white shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Empilhado (Total)
                </button>
                <button
                  type="button"
                  onClick={() => setChartMode('grouped')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    chartMode === 'grouped'
                      ? 'bg-[#BE123C] text-white shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Lado a Lado
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsChartExpanded(!isChartExpanded)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 cursor-pointer"
                title={isChartExpanded ? 'Recolher Gráfico' : 'Expandir Gráfico'}
              >
                {isChartExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Metrics Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-850 flex items-center justify-between">
              <span className="text-zinc-400">Horário de Pico:</span>
              <span className="font-mono font-bold text-amber-400 flex items-center space-x-1">
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                <span>{hourlyData.peakHour}</span>
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-850 flex items-center justify-between">
              <span className="text-zinc-400">Pico Registado:</span>
              <span className="font-mono font-bold text-emerald-400">{hourlyData.peakValue} entradas</span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-850 flex items-center justify-between">
              <span className="text-zinc-400">Média Horária:</span>
              <span className="font-mono font-bold text-white">{hourlyData.averageFlow} / hora</span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-850 flex items-center justify-between">
              <span className="text-zinc-400">Total Validado:</span>
              <span className="font-mono font-bold text-purple-300">{hourlyData.totalEntries} entradas</span>
            </div>
          </div>

          {/* Recharts Bar Chart Container */}
          {isChartExpanded && (
            <div className="w-full h-64 pt-2">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={hourlyData.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="hourLabel"
                    stroke="#71717a"
                    tick={{ fill: '#a1a1aa', fontSize: 11, fontFamily: 'monospace' }}
                    axisLine={{ stroke: '#3f3f46' }}
                  />
                  <YAxis
                    stroke="#71717a"
                    tick={{ fill: '#a1a1aa', fontSize: 11, fontFamily: 'monospace' }}
                    axisLine={{ stroke: '#3f3f46' }}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomChartTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }} />
                  <Legend
                    wrapperStyle={{ paddingTop: 10, fontSize: 11 }}
                    iconType="circle"
                    formatter={(val) => <span className="text-zinc-300 font-semibold">{val}</span>}
                  />
                  {chartMode === 'stacked' ? (
                    <>
                      <Bar
                        dataKey="conferencia"
                        name="Conferência Gratuita"
                        stackId="a"
                        fill="#9333EA"
                        radius={[0, 0, 0, 0]}
                      />
                      <Bar
                        dataKey="experience"
                        name="Café Experience"
                        stackId="a"
                        fill="#F59E0B"
                        radius={[4, 4, 0, 0]}
                      />
                    </>
                  ) : (
                    <>
                      <Bar
                        dataKey="conferencia"
                        name="Conferência Gratuita"
                        fill="#9333EA"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="experience"
                        name="Café Experience"
                        fill="#F59E0B"
                        radius={[4, 4, 0, 0]}
                      />
                    </>
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Input & Scanner Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Main Area: Camera Reader & Search (col-span-8) */}
          <div className="md:col-span-8 space-y-4">
            {/* Prominent QR Camera Scanner Component */}
            <QrCameraScanner
              buttonLabel="ABRIR CÂMARA E LER QR CODE"
              onScanSuccess={(decoded) => handleEvaluate(decoded)}
              isProcessing={isEvaluating}
            />

            {/* Manual Code Input & Search by Name */}
            <form onSubmit={handleSearchSubmit} className="space-y-2 pt-1">
              <label className="text-xs font-bold text-zinc-200 flex items-center justify-between">
                <span>Introdução Manual de Código ou Pesquisa de Participante</span>
                <span className="text-[11px] text-amber-400 font-mono">Ex: CDE79-K8P4X7</span>
              </label>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Código (CDE79-...), Ref Interna (CTRL-79-...) ou Nome do Participante..."
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 font-mono uppercase focus:outline-none focus:border-[#BE123C]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isEvaluating}
                  className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#BE123C] hover:bg-rose-600 disabled:opacity-50 rounded-xl transition-colors shadow flex items-center space-x-1.5 cursor-pointer shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span>{isEvaluating ? 'A Consultar...' : 'Validar'}</span>
                </button>
              </div>
            </form>

            {/* Success Notification after confirming entry */}
            {successFeedback && (
              <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg animate-fade-in">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-black text-white text-base">ENTRADA CONFIRMADA COM SUCESSO!</p>
                    <p className="text-zinc-200">{successFeedback}</p>
                  </div>
                </div>

                <button
                  onClick={handleNextScan}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer flex items-center space-x-1.5 shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>LER PRÓXIMO INGRESSO</span>
                </button>
              </div>
            )}

            {/* Validation Outcome Card strictly matching Prompt Section 3 */}
            {evaluation && (
              <div
                className={`p-5 rounded-2xl border space-y-4 shadow-xl animate-fade-in ${
                  evaluation.status === 'VALIDO'
                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-100 ring-1 ring-emerald-500/50'
                    : evaluation.status === 'JA_UTILIZADO'
                    ? 'bg-rose-950/40 border-rose-600 text-rose-100 ring-1 ring-rose-500/50'
                    : evaluation.status === 'PAGAMENTO_PENDENTE'
                    ? 'bg-amber-950/40 border-amber-600 text-amber-100 ring-1 ring-amber-500/50'
                    : evaluation.status === 'CANCELADO'
                    ? 'bg-zinc-900 border-rose-800 text-rose-200'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-200'
                }`}
              >
                {/* Visual Status Banner */}
                <div className="flex items-start justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center space-x-3">
                    {evaluation.status === 'VALIDO' ? (
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      </div>
                    ) : evaluation.status === 'JA_UTILIZADO' ? (
                      <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-400 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-6 h-6 text-rose-400 animate-bounce" />
                      </div>
                    ) : evaluation.status === 'PAGAMENTO_PENDENTE' ? (
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center shrink-0">
                        <Clock className="w-6 h-6 text-amber-400" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500 flex items-center justify-center shrink-0">
                        <XCircle className="w-6 h-6 text-rose-500" />
                      </div>
                    )}

                    <div>
                      <h4 className="text-base sm:text-lg font-black tracking-wide uppercase">
                        {evaluation.status === 'VALIDO' && 'INGRESSO VÁLIDO'}
                        {evaluation.status === 'JA_UTILIZADO' && 'INGRESSO JÁ UTILIZADO'}
                        {evaluation.status === 'PAGAMENTO_PENDENTE' && 'PAGAMENTO PENDENTE'}
                        {evaluation.status === 'CANCELADO' && 'INGRESSO CANCELADO'}
                        {evaluation.status === 'INVALIDO' && 'INGRESSO INVÁLIDO OU NÃO ENCONTRADO'}
                      </h4>
                      <p className="text-xs font-medium text-zinc-200 mt-0.5">
                        {evaluation.message}
                      </p>
                    </div>
                  </div>

                  {evaluation.registration && (
                    <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-black/40 border border-white/20 font-bold text-amber-300">
                      {evaluation.registration.ticketCode}
                    </span>
                  )}
                </div>

                {/* Participant Details if Found */}
                {evaluation.registration && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs bg-black/50 p-4 rounded-xl border border-white/10">
                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
                        Nome Completo do Participante
                      </span>
                      <p className="text-sm sm:text-base font-black text-white">{evaluation.registration.fullName}</p>
                      <p className="text-zinc-300 text-xs">{evaluation.registration.company} · {evaluation.registration.jobTitle}</p>
                      <p className="text-[11px] text-zinc-400 font-mono">{evaluation.registration.phone}</p>
                    </div>

                    <div className="space-y-2 sm:text-right">
                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
                          Modalidade & Pacote Adquirido
                        </span>
                        <p className="text-xs font-black text-amber-300 mt-0.5">
                          {ticketTiers.find((t) => t.id === evaluation.registration?.ticketTierId)?.name || 'Geral'}
                        </p>
                      </div>

                      {/* Payment Status (authorized staff only) */}
                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
                          Estado do Pagamento
                        </span>
                        <p
                          className={`font-mono text-xs font-bold ${
                            evaluation.registration.status === 'CONFIRMADO'
                              ? 'text-emerald-400'
                              : 'text-amber-400'
                          }`}
                        >
                          {evaluation.registration.status === 'CONFIRMADO'
                            ? `PAGO / REGULARIZADO (${evaluation.registration.amountAoa.toLocaleString('pt-AO')} Kz)`
                            : `PENDENTE (${evaluation.registration.amountAoa.toLocaleString('pt-AO')} Kz)`}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
                          Estado de Utilização
                        </span>
                        <p className="text-xs font-semibold text-zinc-200">
                          {evaluation.registration.checkInStatus === 'CHECKED_IN'
                            ? 'Utilizado (Entrada já registada)'
                            : 'Por Utilizar (Ingresso Emitido)'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Primary Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  {/* BUTTON 1: CONFIRMAR ENTRADA (MANDATORY REQUIREMENT) */}
                  {evaluation.status === 'VALIDO' && (
                    <button
                      onClick={handleConfirmEntry}
                      className="flex-1 py-3.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all cursor-pointer hover:scale-[1.01]"
                    >
                      <Check className="w-5 h-5 text-white" />
                      <span>CONFIRMAR ENTRADA</span>
                    </button>
                  )}

                  {/* BUTTON 2: LER PRÓXIMO INGRESSO (Continuous scanning flow) */}
                  <button
                    onClick={handleNextScan}
                    className="py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-colors cursor-pointer border border-zinc-700"
                  >
                    <RotateCcw className="w-4 h-4 text-amber-400" />
                    <span>LER PRÓXIMO INGRESSO</span>
                  </button>

                  {/* Exceptional Authorization for Supervisors / Admins with Reason */}
                  {evaluation.canOverride &&
                    (activeStaff.role === 'ADMIN' || activeStaff.role === 'SUPERVISOR_CHECKIN') && (
                      <button
                        onClick={() => setIsOverrideModalOpen(true)}
                        className="py-3 px-4 bg-amber-950 hover:bg-amber-900 border border-amber-700 text-amber-200 text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        <span>Autorização Excepcional com Justificativa</span>
                      </button>
                    )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live Stream & Operations (col-span-4) */}
          <div className="md:col-span-4 space-y-4">
            {/* Operator Stats Card */}
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="font-semibold">Operador Autenticado:</span>
                <span className="font-mono text-white font-bold">{activeStaff.name}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>Perfil de Acesso:</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-800 text-amber-300 font-mono font-bold">
                  {activeStaff.role}
                </span>
              </div>
              <div className="flex items-center justify-between text-zinc-400 pt-1 border-t border-zinc-800">
                <span>Check-Ins Validados:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {activeStaff.totalCheckInsValidated} entradas
                </span>
              </div>
            </div>

            {/* Recent Check-Ins History List */}
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Últimas Entradas Registadas</span>
                </h4>
                <span className="text-[10px] text-zinc-500 font-mono">Tempo Real</span>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {kpis.recentCheckIns.length === 0 ? (
                  <p className="text-[11px] text-zinc-500">Nenhum check-in registado recentemente.</p>
                ) : (
                  kpis.recentCheckIns.slice(0, 8).map((chk) => (
                    <div
                      key={chk.id}
                      className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-850 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-[11px] truncate max-w-[140px]">
                          {chk.participantName}
                        </span>
                        <span className="font-mono text-[10px] text-emerald-400 font-bold">
                          {chk.timestamp.slice(-5)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-zinc-400">
                        <span className="font-mono text-amber-400">{chk.ticketCode}</span>
                        <span className="truncate max-w-[120px] text-zinc-500">{chk.packageName}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal: Operator PIN Switcher */}
        {isStaffLoginOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-950 border border-zinc-700 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center space-x-2">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <h4 className="font-bold text-white text-sm">Autenticação de Operador</h4>
                </div>
                <button
                  onClick={() => setIsStaffLoginOpen(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-zinc-300">
                Introduza o seu PIN de funcionário autorizado para registar as validações no seu nome.
              </p>

              <div className="space-y-1.5 text-xs text-zinc-400">
                <p className="font-semibold text-zinc-300">Contas disponíveis para teste:</p>
                <div className="space-y-1 font-mono text-[11px]">
                  <p>• Manuel Santos (Portaria 1) - PIN: <strong className="text-amber-400">1234</strong></p>
                  <p>• Ana Sebastião (Portaria 2) - PIN: <strong className="text-amber-400">5678</strong></p>
                  <p>• Carlos Silva (Supervisor) - PIN: <strong className="text-amber-400">9999</strong></p>
                  <p>• Geração Digital Admin - PIN: <strong className="text-amber-400">7900</strong></p>
                </div>
              </div>

              <form onSubmit={handleStaffLogin} className="space-y-3">
                <div>
                  <label className="text-xs text-zinc-300 font-semibold">PIN do Funcionário (4 dígitos)</label>
                  <input
                    type="password"
                    maxLength={6}
                    required
                    autoFocus
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="PIN..."
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-center text-lg font-mono text-white tracking-widest focus:outline-none focus:border-[#BE123C] mt-1"
                  />
                  {pinError && <p className="text-xs text-rose-400 mt-1">{pinError}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#BE123C] hover:bg-rose-600 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Validar PIN & Ativar Operador
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Exceptional Authorization with Reason */}
        {isOverrideModalOpen && evaluation?.registration && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-950 border border-amber-600 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center space-x-2 text-amber-400">
                  <AlertTriangle className="w-5 h-5" />
                  <h4 className="font-bold text-white text-sm">Autorização Excepcional de Entrada</h4>
                </div>
                <button
                  onClick={() => setIsOverrideModalOpen(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800 text-xs text-amber-200 space-y-1">
                <p className="font-bold">Aviso da Organização:</p>
                <p>
                  A autorização excepcional requer uma justificativa obrigatória e ficará permanentemente registada nos registos de auditoria do evento sob responsabilidade de <strong>{activeStaff.name}</strong>.
                </p>
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-zinc-300 font-semibold">Motivo da Autorização Excepcional *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ex: Pagamento regularizado no balcão presencial com comprovativo exibido..."
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  onClick={() => setIsOverrideModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 text-xs rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmOverride}
                  disabled={!overrideReason.trim()}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow cursor-pointer"
                >
                  Confirmar Entrada Excepcional
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
