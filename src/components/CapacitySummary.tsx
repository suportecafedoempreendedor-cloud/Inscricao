import React, { useState } from 'react';
import { TicketTier, Registration, EventSettings } from '../types';
import {
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  Edit3,
  Sliders,
  Check,
  X,
  TrendingUp,
  Layers,
  ShieldCheck,
  Flame,
  Bell,
  BellRing,
  Mail,
  Send,
} from 'lucide-react';
import { eventStore } from '../services/store';

export interface CapacitySummaryProps {
  ticketTiers: TicketTier[];
  registrations: Registration[];
  settings: EventSettings;
  onUpdateTier?: (tier: TicketTier) => void;
  className?: string;
}

export type ExhaustionStatus = 'DISPONIVEL' | 'ALTA_PROCURA' | 'ULTIMAS_VAGAS' | 'ESGOTADO';

export interface TierCapacityMetric {
  tier: TicketTier;
  modality: 'GRATUITA' | 'CAFE_EXPERIENCE' | 'OUTROS';
  maxCapacity: number;
  confirmedCount: number;
  pendingCount: number;
  totalBooked: number;
  remainingSlots: number;
  occupancyRate: number; // percentage based on confirmed
  bookedRate: number; // percentage including pending
  exhaustionStatus: ExhaustionStatus;
  statusLabel: string;
  statusBadgeColor: string;
}

export const CapacitySummary: React.FC<CapacitySummaryProps> = ({
  ticketTiers,
  registrations,
  settings,
  onUpdateTier,
  className = '',
}) => {
  const [filterModality, setFilterModality] = useState<'ALL' | 'GRATUITA' | 'CAFE_EXPERIENCE'>('ALL');
  const [editingTierId, setEditingTierId] = useState<string | null>(null);
  const [newCapacityInput, setNewCapacityInput] = useState<number>(0);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [alertActionMsg, setAlertActionMsg] = useState<string | null>(null);

  const handleTriggerTest = (modality: 'Gratuita' | 'Café Experience') => {
    eventStore.testTriggerCapacityAlert(modality, 92);
    setAlertActionMsg(`Alerta de teste aos 92% para "${modality}" emitido com sucesso para gdangola12@gmail.com e gravado na auditoria!`);
    setTimeout(() => setAlertActionMsg(null), 4500);
  };

  // Compute metrics for each tier
  const metrics: TierCapacityMetric[] = ticketTiers.map((tier) => {
    const tierRegs = registrations.filter((r) => r.ticketTierId === tier.id);
    const confirmedCount = tierRegs.filter((r) => r.status === 'CONFIRMADO').length;
    const pendingCount = tierRegs.filter((r) => r.status === 'PENDENTE').length;
    const totalBooked = confirmedCount + pendingCount;
    const maxCapacity = tier.maxCapacity || 0;
    const remainingSlots = Math.max(0, maxCapacity - confirmedCount - pendingCount);

    const occupancyRate = maxCapacity > 0 ? Math.min(100, Math.round((confirmedCount / maxCapacity) * 100)) : 0;
    const bookedRate = maxCapacity > 0 ? Math.min(100, Math.round((totalBooked / maxCapacity) * 100)) : 0;

    let exhaustionStatus: ExhaustionStatus = 'DISPONIVEL';
    let statusLabel = 'Disponível';
    let statusBadgeColor = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';

    if (maxCapacity > 0 && totalBooked >= maxCapacity) {
      exhaustionStatus = 'ESGOTADO';
      statusLabel = 'Esgotado (Lista de Espera)';
      statusBadgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    } else if (bookedRate >= 90) {
      exhaustionStatus = 'ULTIMAS_VAGAS';
      statusLabel = 'Últimas Vagas (Crítico)';
      statusBadgeColor = 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse';
    } else if (bookedRate >= 75) {
      exhaustionStatus = 'ALTA_PROCURA';
      statusLabel = 'Alta Procura (>75%)';
      statusBadgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }

    const modality: 'GRATUITA' | 'CAFE_EXPERIENCE' | 'OUTROS' = tier.isConference
      ? 'GRATUITA'
      : tier.id.startsWith('tier-exp') || tier.name.toLowerCase().includes('experience')
      ? 'CAFE_EXPERIENCE'
      : 'OUTROS';

    return {
      tier,
      modality,
      maxCapacity,
      confirmedCount,
      pendingCount,
      totalBooked,
      remainingSlots,
      occupancyRate,
      bookedRate,
      exhaustionStatus,
      statusLabel,
      statusBadgeColor,
    };
  });

  // Aggregated Groups
  const freeConferenceMetric = metrics.find((m) => m.modality === 'GRATUITA');
  const experienceMetrics = metrics.filter((m) => m.modality === 'CAFE_EXPERIENCE');
  const otherMetrics = metrics.filter((m) => m.modality === 'OUTROS');

  // Experience Subtotals
  const expCapacityTotal = experienceMetrics.reduce((sum, m) => sum + m.maxCapacity, 0);
  const expConfirmedTotal = experienceMetrics.reduce((sum, m) => sum + m.confirmedCount, 0);
  const expPendingTotal = experienceMetrics.reduce((sum, m) => sum + m.pendingCount, 0);
  const expBookedTotal = expConfirmedTotal + expPendingTotal;
  const expRemainingTotal = Math.max(0, expCapacityTotal - expBookedTotal);
  const expOccupancyRate = expCapacityTotal > 0 ? Math.round((expConfirmedTotal / expCapacityTotal) * 100) : 0;
  const expBookedRate = expCapacityTotal > 0 ? Math.round((expBookedTotal / expCapacityTotal) * 100) : 0;

  // Global Totals
  const globalCapacityTotal = metrics.reduce((sum, m) => sum + m.maxCapacity, 0);
  const globalConfirmedTotal = metrics.reduce((sum, m) => sum + m.confirmedCount, 0);
  const globalPendingTotal = metrics.reduce((sum, m) => sum + m.pendingCount, 0);
  const globalBookedTotal = globalConfirmedTotal + globalPendingTotal;
  const globalRemainingTotal = Math.max(0, globalCapacityTotal - globalBookedTotal);
  const globalOccupancyRate = globalCapacityTotal > 0 ? Math.round((globalConfirmedTotal / globalCapacityTotal) * 100) : 0;
  const globalBookedRate = globalCapacityTotal > 0 ? Math.round((globalBookedTotal / globalCapacityTotal) * 100) : 0;

  // Filtered list for display
  const displayedMetrics = metrics.filter((m) => {
    if (filterModality === 'ALL') return true;
    return m.modality === filterModality;
  });

  // Handle Editing Capacity Limit
  const handleStartEdit = (tier: TicketTier) => {
    setEditingTierId(tier.id);
    setNewCapacityInput(tier.maxCapacity);
  };

  const handleSaveCapacity = (tier: TicketTier) => {
    if (onUpdateTier && newCapacityInput > 0) {
      const updated = { ...tier, maxCapacity: Number(newCapacityInput) };
      onUpdateTier(updated);
      setSaveSuccessMessage(`Limite de "${tier.name}" ajustado para ${newCapacityInput} vagas.`);
      setTimeout(() => setSaveSuccessMessage(null), 3500);
    }
    setEditingTierId(null);
  };

  // Export CSV Report
  const handleExportCSV = () => {
    const headers =
      'Modalidade,Pacote,Preço (Kz),Limite Configurado,Ocupação Actual (Confirmados),Reservas Pendentes,Total Bloqueado,Vagas Restantes,Taxa Confirmada (%),Taxa Global Bloqueada (%),Estado de Esgotamento\n';
    const rows = metrics
      .map((m) => {
        return `"${m.modality}","${m.tier.name}",${m.tier.priceAoa},${m.maxCapacity},${m.confirmedCount},${m.pendingCount},${m.totalBooked},${m.remainingSlots},${m.occupancyRate}%,${m.bookedRate}%,"${m.statusLabel}"`;
      })
      .join('\n');

    const summaryRows = `\n"SUBTOTAL","Café Experience",-,${expCapacityTotal},${expConfirmedTotal},${expPendingTotal},${expBookedTotal},${expRemainingTotal},${expOccupancyRate}%,${expBookedRate}%,"${expBookedRate >= 90 ? 'Crítico' : 'Disponível'}"\n"TOTAL GERAL","Todas as Modalidades",-,${globalCapacityTotal},${globalConfirmedTotal},${globalPendingTotal},${globalBookedTotal},${globalRemainingTotal},${globalOccupancyRate}%,${globalBookedRate}%,"${globalBookedRate >= 90 ? 'Lotação Máxima' : 'Operacional'}"`;

    const blob = new Blob([headers + rows + summaryRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `resumo-capacidade-79-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* SECTION HEADER & CONTROL BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
              Painel de Controlo de Lotação
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-[#BE123C]" />
            <span>Resumo de Capacidade & Ocupação de Vagas</span>
          </h3>
          <p className="text-xs text-zinc-400 max-w-2xl">
            Acompanhamento em tempo real dos limites configurados para a <strong>Conferência Gratuita (800 vagas)</strong>{' '}
            e pacotes <strong>Café Experience</strong>, detalhando reservas confirmadas, comprovação de pagamento pendente e esgotamento.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Modality Filter Pills */}
          <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs font-semibold">
            <button
              onClick={() => setFilterModality('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterModality === 'ALL'
                  ? 'bg-[#BE123C] text-white shadow'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilterModality('GRATUITA')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterModality === 'GRATUITA'
                  ? 'bg-purple-700 text-white shadow'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
              }`}
            >
              Conferência Gratuita
            </button>
            <button
              onClick={() => setFilterModality('CAFE_EXPERIENCE')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterModality === 'CAFE_EXPERIENCE'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
              }`}
            >
              Café Experience
            </button>
          </div>

          {/* Export Report */}
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
            title="Descarregar relatório de capacidade em CSV"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {saveSuccessMessage && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-600/60 rounded-xl text-xs text-emerald-300 font-semibold flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* Total Event Capacity */}
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
          <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider flex items-center space-x-1">
            <Users className="w-3.5 h-3.5 text-zinc-500" />
            <span>Capacidade Global</span>
          </span>
          <p className="text-2xl font-black text-white font-mono">{globalCapacityTotal.toLocaleString('pt-AO')}</p>
          <p className="text-[10px] text-zinc-500">Total de vagas autorizadas</p>
        </div>

        {/* Confirmed Occupancy */}
        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/60 space-y-1">
          <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ocupação Confirmada</span>
          </span>
          <p className="text-2xl font-black text-emerald-300 font-mono">
            {globalConfirmedTotal.toLocaleString('pt-AO')}
          </p>
          <div className="flex items-center space-x-1 text-[10px] text-emerald-400 font-semibold">
            <span>{globalOccupancyRate}% do limite efectivo</span>
          </div>
        </div>

        {/* Pending Reservations */}
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/60 space-y-1">
          <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Reservas Pendentes</span>
          </span>
          <p className="text-2xl font-black text-amber-300 font-mono">
            {globalPendingTotal.toLocaleString('pt-AO')}
          </p>
          <p className="text-[10px] text-amber-400">Aguardando conciliação bancária</p>
        </div>

        {/* Free / Remaining Slots */}
        <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/60 space-y-1">
          <span className="text-[11px] text-purple-300 font-bold uppercase tracking-wider flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Vagas Restantes</span>
          </span>
          <p className="text-2xl font-black text-purple-200 font-mono">
            {globalRemainingTotal.toLocaleString('pt-AO')}
          </p>
          <p className="text-[10px] text-purple-400">Livres para novas inscrições</p>
        </div>

        {/* Overall Blocked Percentage */}
        <div className="col-span-2 md:col-span-1 p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
          <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider flex items-center space-x-1">
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span>Taxa de Bloqueio</span>
          </span>
          <p className="text-2xl font-black text-rose-400 font-mono">{globalBookedRate}%</p>
          <p className="text-[10px] text-zinc-500">Confirmados + pendentes</p>
        </div>
      </div>

      {alertActionMsg && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 font-semibold flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{alertActionMsg}</span>
          </div>
          <button onClick={() => setAlertActionMsg(null)} className="text-emerald-400 hover:text-white text-xs">
            ✕
          </button>
        </div>
      )}

      {/* AUTOMATIC 90% CAPACITY NOTIFICATION PROTOCOL MONITOR */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>Motor de Notificações Automáticas (Limiar dos 90%)</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-600/30 text-rose-300 border border-rose-600/40">
                  ACTIVO
                </span>
              </h4>
              <p className="text-xs text-zinc-400">
                Disparo imediato por email para <strong className="text-amber-400">gdangola12@gmail.com</strong> e registo em auditoria ao atingir 90% das vagas.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleTriggerTest('Gratuita')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-950/60 hover:bg-purple-900 border border-purple-600/40 text-purple-200 cursor-pointer transition-colors"
              title="Testar disparo de email para a Conferência Gratuita"
            >
              Testar Alerta Grátis
            </button>
            <button
              onClick={() => handleTriggerTest('Café Experience')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-950/60 hover:bg-amber-900 border border-amber-600/40 text-amber-200 cursor-pointer transition-colors"
              title="Testar disparo de email para o Café Experience"
            >
              Testar Alerta Experience
            </button>
          </div>
        </div>

        {/* Real-time status cards for Gratuita and Experience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Conferência Gratuita 90% Meter */}
          <div
            className={`p-4 rounded-xl border space-y-2.5 ${
              (freeConferenceMetric?.bookedRate || 0) >= 90
                ? 'bg-rose-950/30 border-rose-500/50'
                : 'bg-zinc-950/60 border-zinc-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-300 uppercase flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span>Conferência Gratuita</span>
              </span>
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded ${
                  (freeConferenceMetric?.bookedRate || 0) >= 90
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {(freeConferenceMetric?.bookedRate || 0) >= 90 ? 'ALERTA 90% DISPARADO' : 'Capacidade Normal'}
              </span>
            </div>
            <div className="flex justify-between items-baseline text-xs">
              <span className="text-zinc-400 font-mono">
                {freeConferenceMetric?.totalBooked || 0} / {freeConferenceMetric?.maxCapacity || 800} vagas
              </span>
              <span className="font-mono font-bold text-white">
                {freeConferenceMetric?.bookedRate || 0}% / Limiar: 90%
              </span>
            </div>
            {/* Progress bar with 90% marker */}
            <div className="relative w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
              <div
                style={{ width: `${Math.min(100, freeConferenceMetric?.bookedRate || 0)}%` }}
                className={`h-full rounded-full transition-all ${
                  (freeConferenceMetric?.bookedRate || 0) >= 90
                    ? 'bg-rose-500'
                    : 'bg-purple-500'
                }`}
              />
              <div
                style={{ left: '90%' }}
                className="absolute top-0 bottom-0 w-0.5 bg-amber-400 shadow-sm"
                title="Limiar de disparo 90%"
              />
            </div>
          </div>

          {/* Café Experience 90% Meter */}
          <div
            className={`p-4 rounded-xl border space-y-2.5 ${
              expBookedRate >= 90
                ? 'bg-rose-950/30 border-rose-500/50'
                : 'bg-zinc-950/60 border-zinc-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 uppercase flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Café Experience (Global)</span>
              </span>
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded ${
                  expBookedRate >= 90
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {expBookedRate >= 90 ? 'ALERTA 90% DISPARADO' : 'Capacidade Normal'}
              </span>
            </div>
            <div className="flex justify-between items-baseline text-xs">
              <span className="text-zinc-400 font-mono">
                {expBookedTotal} / {expCapacityTotal} vagas
              </span>
              <span className="font-mono font-bold text-white">
                {expBookedRate}% / Limiar: 90%
              </span>
            </div>
            {/* Progress bar with 90% marker */}
            <div className="relative w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
              <div
                style={{ width: `${Math.min(100, expBookedRate)}%` }}
                className={`h-full rounded-full transition-all ${
                  expBookedRate >= 90
                    ? 'bg-rose-500'
                    : 'bg-amber-500'
                }`}
              />
              <div
                style={{ left: '90%' }}
                className="absolute top-0 bottom-0 w-0.5 bg-amber-400 shadow-sm"
                title="Limiar de disparo 90%"
              />
            </div>
          </div>
        </div>
      </div>

      {/* MAIN TABULAR VIEW OF CAPACITIES */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            {/* Table Header */}
            <thead>
              <tr className="bg-zinc-950 border-b border-zinc-800 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                <th className="py-3.5 px-4 min-w-[220px]">Modalidade & Pacote</th>
                <th className="py-3.5 px-3">Preço Unitário</th>
                <th className="py-3.5 px-3 text-center">Limite Configurado</th>
                <th className="py-3.5 px-3 text-center">Ocupação Actual</th>
                <th className="py-3.5 px-3 text-center">Reservas Pendentes</th>
                <th className="py-3.5 px-3 text-center">Vagas Restantes</th>
                <th className="py-3.5 px-4 min-w-[170px]">Lotação (% Confirmada)</th>
                <th className="py-3.5 px-3 text-center">Estado de Esgotamento</th>
                <th className="py-3.5 px-3 text-right">Gestão</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-zinc-800/80 font-sans">
              {/* GROUP 1: MODALIDADE CONFERÊNCIA GRATUITA */}
              {(filterModality === 'ALL' || filterModality === 'GRATUITA') && freeConferenceMetric && (
                <>
                  <tr className="bg-purple-950/30 border-y border-purple-800/50">
                    <td colSpan={9} className="py-2 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-purple-400" />
                        <span className="text-[11px] font-black uppercase tracking-wider text-purple-300">
                          Modalidade 1: Conferência Gratuita (Roxo e Branco · Detalhes Magenta)
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-900/60 text-purple-200 border border-purple-700/60 font-mono">
                          Regra Oficial: 800 Vagas
                        </span>
                      </div>
                    </td>
                  </tr>

                  <tr
                    key={freeConferenceMetric.tier.id}
                    className="hover:bg-zinc-850/60 transition-colors bg-purple-950/10"
                  >
                    {/* Modality & Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-start space-x-2.5">
                        <div className="w-3.5 h-3.5 rounded bg-purple-600 border border-purple-300 shrink-0 mt-0.5" />
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="font-black text-white text-sm">
                              {freeConferenceMetric.tier.name}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase">
                              Gratuito
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-0.5">
                            Acesso Plenária & Feira · Certificado opcional de 2.000 Kz
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Unit Price */}
                    <td className="py-3.5 px-3 font-mono font-bold text-emerald-400">
                      0 Kz <span className="text-[10px] text-zinc-400 block font-normal">(Entrada Livre)</span>
                    </td>

                    {/* Configured Limit */}
                    <td className="py-3.5 px-3 text-center">
                      {editingTierId === freeConferenceMetric.tier.id ? (
                        <div className="flex items-center justify-center space-x-1">
                          <input
                            type="number"
                            min="1"
                            value={newCapacityInput}
                            onChange={(e) => setNewCapacityInput(Number(e.target.value))}
                            className="w-20 bg-zinc-950 border border-purple-500 rounded p-1 text-center font-mono font-bold text-white text-xs"
                          />
                          <button
                            onClick={() => handleSaveCapacity(freeConferenceMetric.tier)}
                            className="p-1 text-emerald-400 hover:bg-emerald-950 rounded"
                            title="Guardar"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingTierId(null)}
                            className="p-1 text-zinc-400 hover:bg-zinc-800 rounded"
                            title="Cancelar"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="font-mono text-base font-bold text-white">
                          {freeConferenceMetric.maxCapacity.toLocaleString('pt-AO')}
                        </span>
                      )}
                    </td>

                    {/* Actual Occupancy (Confirmed) */}
                    <td className="py-3.5 px-3 text-center">
                      <span className="font-mono text-base font-bold text-emerald-300">
                        {freeConferenceMetric.confirmedCount.toLocaleString('pt-AO')}
                      </span>
                    </td>

                    {/* Pending Reservations */}
                    <td className="py-3.5 px-3 text-center">
                      <span className="font-mono text-sm font-semibold text-amber-300">
                        {freeConferenceMetric.pendingCount.toLocaleString('pt-AO')}
                      </span>
                    </td>

                    {/* Remaining Slots */}
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`font-mono text-base font-black ${
                          freeConferenceMetric.remainingSlots === 0
                            ? 'text-rose-400'
                            : freeConferenceMetric.remainingSlots <= 50
                            ? 'text-amber-400'
                            : 'text-purple-300'
                        }`}
                      >
                        {freeConferenceMetric.remainingSlots.toLocaleString('pt-AO')}
                      </span>
                    </td>

                    {/* Progress Bar & Rate */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-zinc-400 font-bold">{freeConferenceMetric.occupancyRate}% confirmados</span>
                          <span className="text-zinc-500">{freeConferenceMetric.totalBooked}/{freeConferenceMetric.maxCapacity}</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden flex">
                          <div
                            style={{ width: `${freeConferenceMetric.occupancyRate}%` }}
                            className="h-full bg-gradient-to-r from-purple-600 to-[#BE123C] rounded-full transition-all"
                          />
                          {freeConferenceMetric.pendingCount > 0 && (
                            <div
                              style={{
                                width: `${Math.min(
                                  100 - freeConferenceMetric.occupancyRate,
                                  Math.round((freeConferenceMetric.pendingCount / freeConferenceMetric.maxCapacity) * 100)
                                )}%`,
                              }}
                              className="h-full bg-amber-500/60 transition-all"
                            />
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Exhaustion State */}
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-flex items-center space-x-1 ${freeConferenceMetric.statusBadgeColor}`}
                      >
                        {freeConferenceMetric.exhaustionStatus === 'ESGOTADO' && (
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                        )}
                        {freeConferenceMetric.exhaustionStatus === 'DISPONIVEL' && (
                          <CheckCircle2 className="w-3 h-3 shrink-0" />
                        )}
                        <span>{freeConferenceMetric.statusLabel}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-3 text-right">
                      {onUpdateTier && editingTierId !== freeConferenceMetric.tier.id && (
                        <button
                          onClick={() => handleStartEdit(freeConferenceMetric.tier)}
                          className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded text-[10px] font-semibold cursor-pointer inline-flex items-center space-x-1"
                          title="Ajustar limite de vagas"
                        >
                          <Edit3 className="w-3 h-3 text-purple-400" />
                          <span>Ajustar</span>
                        </button>
                      )}
                    </td>
                  </tr>
                </>
              )}

              {/* GROUP 2: MODALIDADE CAFÉ EXPERIENCE */}
              {(filterModality === 'ALL' || filterModality === 'CAFE_EXPERIENCE') && (
                <>
                  <tr className="bg-amber-950/30 border-y border-amber-800/50">
                    <td colSpan={9} className="py-2 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                          Modalidade 2: Café Experience (Preto e Dourado · Acentos Magenta & Roxo)
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-900/60 text-amber-200 border border-amber-700/60 font-mono">
                          Certificado Oficial Incluso em Todos os Pacotes
                        </span>
                      </div>
                    </td>
                  </tr>

                  {experienceMetrics.map((m) => {
                    const isEssencial = m.tier.id.includes('essencial');
                    const isProfissional = m.tier.id.includes('profissional');
                    const isExecutivo = m.tier.id.includes('executivo');

                    const packageAccentColor = isExecutivo
                      ? '#F59E0B' // Dourado / Ouro VIP
                      : isProfissional
                      ? '#BE123C' // Magenta
                      : '#9333EA'; // Roxo

                    return (
                      <tr
                        key={m.tier.id}
                        className="hover:bg-zinc-850/60 transition-colors bg-zinc-900/40"
                      >
                        {/* Name & Package Badge */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-start space-x-2.5">
                            <div
                              style={{ backgroundColor: packageAccentColor }}
                              className="w-3.5 h-3.5 rounded shrink-0 mt-0.5 shadow"
                            />
                            <div>
                              <div className="flex items-center space-x-1.5">
                                <span className="font-bold text-white text-sm">
                                  {m.tier.name}
                                </span>
                                {isExecutivo && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                    VIP
                                  </span>
                                )}
                                {isProfissional && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                                    Pro
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-zinc-400 mt-0.5">
                                {m.tier.lote} · Certificado Café Experience Incluído
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="py-3.5 px-3 font-mono font-bold text-amber-400">
                          {m.tier.priceAoa.toLocaleString('pt-AO')}{' '}
                          <span className="text-[10px] text-zinc-400 font-normal">Kz</span>
                        </td>

                        {/* Limit */}
                        <td className="py-3.5 px-3 text-center">
                          {editingTierId === m.tier.id ? (
                            <div className="flex items-center justify-center space-x-1">
                              <input
                                type="number"
                                min="1"
                                value={newCapacityInput}
                                onChange={(e) => setNewCapacityInput(Number(e.target.value))}
                                className="w-20 bg-zinc-950 border border-amber-500 rounded p-1 text-center font-mono font-bold text-white text-xs"
                              />
                              <button
                                onClick={() => handleSaveCapacity(m.tier)}
                                className="p-1 text-emerald-400 hover:bg-emerald-950 rounded"
                                title="Guardar"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingTierId(null)}
                                className="p-1 text-zinc-400 hover:bg-zinc-800 rounded"
                                title="Cancelar"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <span className="font-mono text-base font-bold text-white">
                              {m.maxCapacity.toLocaleString('pt-AO')}
                            </span>
                          )}
                        </td>

                        {/* Confirmed */}
                        <td className="py-3.5 px-3 text-center">
                          <span className="font-mono text-base font-bold text-emerald-300">
                            {m.confirmedCount.toLocaleString('pt-AO')}
                          </span>
                        </td>

                        {/* Pending */}
                        <td className="py-3.5 px-3 text-center">
                          <span className="font-mono text-sm font-semibold text-amber-300">
                            {m.pendingCount.toLocaleString('pt-AO')}
                          </span>
                        </td>

                        {/* Remaining */}
                        <td className="py-3.5 px-3 text-center">
                          <span
                            className={`font-mono text-base font-black ${
                              m.remainingSlots === 0
                                ? 'text-rose-400'
                                : m.remainingSlots <= 15
                                ? 'text-amber-400'
                                : 'text-zinc-200'
                            }`}
                          >
                            {m.remainingSlots.toLocaleString('pt-AO')}
                          </span>
                        </td>

                        {/* Progress */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-mono">
                              <span className="text-zinc-400 font-bold">{m.occupancyRate}% confirmados</span>
                              <span className="text-zinc-500">{m.totalBooked}/{m.maxCapacity}</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden flex">
                              <div
                                style={{ width: `${m.occupancyRate}%`, backgroundColor: packageAccentColor }}
                                className="h-full rounded-full transition-all"
                              />
                              {m.pendingCount > 0 && (
                                <div
                                  style={{
                                    width: `${Math.min(
                                      100 - m.occupancyRate,
                                      Math.round((m.pendingCount / m.maxCapacity) * 100)
                                    )}%`,
                                  }}
                                  className="h-full bg-amber-400/50 transition-all"
                                />
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-3 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-flex items-center space-x-1 ${m.statusBadgeColor}`}
                          >
                            {m.exhaustionStatus === 'ESGOTADO' && (
                              <AlertTriangle className="w-3 h-3 shrink-0" />
                            )}
                            {m.exhaustionStatus === 'DISPONIVEL' && (
                              <CheckCircle2 className="w-3 h-3 shrink-0" />
                            )}
                            <span>{m.statusLabel}</span>
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-3 text-right">
                          {onUpdateTier && editingTierId !== m.tier.id && (
                            <button
                              onClick={() => handleStartEdit(m.tier)}
                              className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded text-[10px] font-semibold cursor-pointer inline-flex items-center space-x-1"
                              title="Ajustar limite de vagas"
                            >
                              <Edit3 className="w-3 h-3 text-amber-400" />
                              <span>Ajustar</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {/* SUBTOTAL CAFÉ EXPERIENCE */}
                  <tr className="bg-amber-950/20 font-bold text-amber-200 border-t border-amber-900/50">
                    <td className="py-3 px-4 flex items-center space-x-2">
                      <Layers className="w-4 h-4 text-amber-400" />
                      <span>SUBTOTAL CAFÉ EXPERIENCE (Consolidado)</span>
                    </td>
                    <td className="py-3 px-3 text-zinc-400 text-[11px]">—</td>
                    <td className="py-3 px-3 text-center font-mono text-base text-amber-300">
                      {expCapacityTotal.toLocaleString('pt-AO')}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-base text-emerald-400">
                      {expConfirmedTotal.toLocaleString('pt-AO')}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-sm text-amber-300">
                      {expPendingTotal.toLocaleString('pt-AO')}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-base text-white">
                      {expRemainingTotal.toLocaleString('pt-AO')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span>{expOccupancyRate}% ({expBookedRate}% c/ pendentes)</span>
                          <span>{expBookedTotal}/{expCapacityTotal}</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                          <div
                            style={{ width: `${expOccupancyRate}%` }}
                            className="h-full bg-gradient-to-r from-amber-500 to-[#BE123C] rounded-full"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 uppercase">
                        {expRemainingTotal > 0 ? `${expRemainingTotal} Vagas Restantes` : 'Esgotado'}
                      </span>
                    </td>
                    <td className="py-3 px-3"></td>
                  </tr>
                </>
              )}

              {/* GROUP 3: STANDS / EXPOSITORES (Se houver) */}
              {filterModality === 'ALL' && otherMetrics.length > 0 && (
                <>
                  <tr className="bg-zinc-950/80 border-y border-zinc-800">
                    <td colSpan={9} className="py-2 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-zinc-400" />
                        <span className="text-[11px] font-black uppercase tracking-wider text-zinc-400">
                          Espaços Comerciais & Stands
                        </span>
                      </div>
                    </td>
                  </tr>

                  {otherMetrics.map((m) => (
                    <tr key={m.tier.id} className="hover:bg-zinc-850/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white text-sm">
                        {m.tier.name}
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-amber-400">
                        {m.tier.priceAoa.toLocaleString('pt-AO')} Kz
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono text-base font-bold text-white">
                        {m.maxCapacity}
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono text-base font-bold text-emerald-300">
                        {m.confirmedCount}
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono text-sm font-semibold text-amber-300">
                        {m.pendingCount}
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono text-base font-bold text-zinc-300">
                        {m.remainingSlots}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-mono">
                            <span>{m.occupancyRate}%</span>
                            <span>{m.totalBooked}/{m.maxCapacity}</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                            <div
                              style={{ width: `${m.occupancyRate}%` }}
                              className="h-full bg-purple-500 rounded-full"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${m.statusBadgeColor}`}>
                          {m.statusLabel}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        {onUpdateTier && (
                          <button
                            onClick={() => handleStartEdit(m.tier)}
                            className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-[10px]"
                          >
                            Ajustar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>

            {/* Table Footer: TOTAL GERAL DO EVENTO */}
            <tfoot>
              <tr className="bg-zinc-950 border-t-2 border-zinc-700 font-bold text-white text-xs">
                <td className="py-4 px-4 flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-black uppercase tracking-wider text-emerald-400">
                    TOTAL GERAL DO EVENTO (Todas as Modalidades)
                  </span>
                </td>
                <td className="py-4 px-3 text-zinc-400">—</td>
                <td className="py-4 px-3 text-center font-mono text-lg font-black text-white">
                  {globalCapacityTotal.toLocaleString('pt-AO')}
                </td>
                <td className="py-4 px-3 text-center font-mono text-lg font-black text-emerald-400">
                  {globalConfirmedTotal.toLocaleString('pt-AO')}
                </td>
                <td className="py-4 px-3 text-center font-mono text-base font-bold text-amber-400">
                  {globalPendingTotal.toLocaleString('pt-AO')}
                </td>
                <td className="py-4 px-3 text-center font-mono text-lg font-black text-purple-300">
                  {globalRemainingTotal.toLocaleString('pt-AO')}
                </td>
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono font-bold">
                      <span className="text-emerald-400">{globalOccupancyRate}% Efectivo</span>
                      <span className="text-zinc-400">{globalBookedTotal}/{globalCapacityTotal}</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-zinc-800 overflow-hidden flex">
                      <div
                        style={{ width: `${globalOccupancyRate}%` }}
                        className="h-full bg-gradient-to-r from-emerald-500 via-[#BE123C] to-amber-500 rounded-full"
                      />
                    </div>
                  </div>
                </td>
                <td className="py-4 px-3 text-center">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {globalRemainingTotal > 0 ? `${globalRemainingTotal} Vagas Totais Livres` : 'Lotação Completa'}
                  </span>
                </td>
                <td className="py-4 px-3 text-right">
                  <button
                    onClick={handleExportCSV}
                    className="text-[10px] text-amber-400 hover:underline font-semibold"
                  >
                    Exportar
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* OPERATIONAL CAPACITY PROTOCOLS (FOOTER NOTICE) */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-xs text-zinc-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start space-x-2.5">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Critério de Controlo Automático:</strong> Os ingressos da Conferência Gratuita são limitados a 800 vagas.
            Ao atingir a capacidade máxima configurada, o formulário público encerra novas emissões imediatas e ativa automaticamente a
            <strong> Lista de Espera Oficial</strong>. As reservas dos pacotes Café Experience garantem lugar mediante reconciliação de comprovativo bancário.
          </p>
        </div>
      </div>
    </div>
  );
};
