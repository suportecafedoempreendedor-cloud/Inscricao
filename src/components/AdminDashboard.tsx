import React, { useState, useEffect } from 'react';
import {
  EventSettings,
  TicketTier,
  Registration,
  Certificate,
  Exhibitor,
  PitchCandidate,
  AgendaSession,
  AuditLog,
  StaffUser,
  TicketDispatch,
  CheckInRecord,
  CapacityAlert,
} from '../types';
import { eventStore } from '../services/store';
import {
  Shield,
  Users,
  CheckCircle2,
  XCircle,
  X,
  Clock,
  DollarSign,
  Download,
  Search,
  Plus,
  Trash2,
  Edit,
  Save,
  Check,
  QrCode,
  AlertTriangle,
  Layers,
  Store,
  Award,
  Calendar,
  Settings,
  Activity,
  LogOut,
  FileCheck,
  RefreshCw,
  Ban,
  Printer,
  Ticket,
  Send,
  MessageSquare,
  Mail,
  UserPlus,
  UserCheck,
  KeyRound,
  ExternalLink,
  Sliders,
  Camera,
  Bell,
  BellRing,
  Eye,
  Flame,
  CheckCheck,
} from 'lucide-react';
import { CapacitySummary } from './CapacitySummary';
import { QrCameraScanner } from './QrCameraScanner';
import {
  downloadCertificatePdf,
  createCertificateCanvas,
  printCanvasDirectly,
  downloadTicketPdf,
  createTicketCanvas,
} from '../utils/documentExport';

interface AdminDashboardProps {
  settings: EventSettings;
  ticketTiers: TicketTier[];
  registrations: Registration[];
  certificates: Certificate[];
  exhibitors: Exhibitor[];
  pitchCandidates: PitchCandidate[];
  agenda: AgendaSession[];
  auditLogs: AuditLog[];
  onUpdateSettings: (settings: Partial<EventSettings>) => void;
  onUpdateTier: (tier: TicketTier) => void;
  onUpdateRegistrationStatus: (id: string, status: Registration['status'], notes?: string) => void;
  onValidateCheckIn: (code: string) => { success: boolean; message: string; registration?: Registration };
  onUpdateExhibitorStatus: (id: string, status: 'APROVADO' | 'REJEITADO', stand?: string) => void;
  onAddAgendaSession: (session: Omit<AgendaSession, 'id'>) => void;
  onDeleteAgendaSession: (id: string) => void;
  onViewCertificate: (cert: Certificate) => void;
  onViewTicket?: (registration: Registration) => void;
  onOpenCheckInPortal?: () => void;
  onOpenDeliveryModal?: (reg: Registration) => void;
  onAnnulCertificate: (id: string, reason: string) => void;
  onReissueCertificate: (id: string, updatedName?: string) => void;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  settings,
  ticketTiers,
  registrations,
  certificates,
  exhibitors,
  pitchCandidates,
  agenda,
  auditLogs,
  onUpdateSettings,
  onUpdateTier,
  onUpdateRegistrationStatus,
  onValidateCheckIn,
  onUpdateExhibitorStatus,
  onAddAgendaSession,
  onDeleteAgendaSession,
  onViewCertificate,
  onViewTicket,
  onOpenCheckInPortal,
  onOpenDeliveryModal,
  onAnnulCertificate,
  onReissueCertificate,
  onClose,
}) => {
  // Tabs
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'capacity'
    | 'certificates'
    | 'checkin'
    | 'staff'
    | 'dispatches'
    | 'registrations'
    | 'exhibitors'
    | 'pitch'
    | 'agenda'
    | 'settings'
    | 'audit'
  >('overview');

  // Staff and Dispatches state
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>(() => eventStore.getStaffUsers());
  const [dispatches, setDispatches] = useState<TicketDispatch[]>(() => eventStore.getDispatches());
  const [isNewStaffOpen, setIsNewStaffOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffUsername, setNewStaffUsername] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<StaffUser['role']>('OPERADOR_PORTARIA');
  const [newStaffPin, setNewStaffPin] = useState('');

  // Check-In input state
  const [checkInInput, setCheckInInput] = useState('');
  const [checkInResult, setCheckInResult] = useState<{
    success: boolean;
    message: string;
    registration?: Registration;
  } | null>(null);

  // Search & Filters in Registrations
  const [regSearch, setRegSearch] = useState('');
  const [regFilterStatus, setRegFilterStatus] = useState<string>('todos');

  // Certificates module state
  const [certSearch, setCertSearch] = useState('');
  const [certTypeFilter, setCertTypeFilter] = useState<'todos' | 'CONFERENCIA' | 'CAFE_EXPERIENCE'>('todos');
  const [annulModalCert, setAnnulModalCert] = useState<Certificate | null>(null);
  const [annulReasonInput, setAnnulReasonInput] = useState('');
  const [reissueModalCert, setReissueModalCert] = useState<Certificate | null>(null);
  const [reissueNameInput, setReissueNameInput] = useState('');

  // Settings Edit State
  const [editingSettings, setEditingSettings] = useState<EventSettings>(settings);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState(false);

  // Add Agenda Session form state
  const [newSession, setNewSession] = useState({
    title: '',
    speakerName: '',
    speakerRole: '',
    speakerCompany: '',
    startTime: '10:00',
    endTime: '11:00',
    room: 'Auditório Principal',
    trackSlug: 'negocios' as AgendaSession['trackSlug'],
    description: '',
  });

  // Capacity Alerts System (90% Automatic Monitoring)
  const [capacityAlerts, setCapacityAlerts] = useState<CapacityAlert[]>(() => {
    eventStore.checkAndTriggerCapacityAlerts();
    return eventStore.getCapacityAlerts();
  });
  const [isAlertsDrawerOpen, setIsAlertsDrawerOpen] = useState(false);
  const [previewEmailAlert, setPreviewEmailAlert] = useState<CapacityAlert | null>(null);
  const [alertFeedbackMsg, setAlertFeedbackMsg] = useState<string | null>(null);

  // Auto-evaluate capacity whenever registrations or ticketTiers update
  useEffect(() => {
    eventStore.checkAndTriggerCapacityAlerts();
    setCapacityAlerts(eventStore.getCapacityAlerts());
  }, [registrations, ticketTiers]);

  const activeAlerts = capacityAlerts.filter((a) => a.status === 'ACTIVO');
  const critical90Alerts = activeAlerts.filter((a) => a.occupancyPercentage >= 90);

  const handleSendAlertEmail = (alertId: string) => {
    const res = eventStore.sendCapacityAlertEmail(alertId);
    if (res.success) {
      setAlertFeedbackMsg('Notificação de alerta reenviada com sucesso por email para gdangola12@gmail.com!');
      setCapacityAlerts(eventStore.getCapacityAlerts());
      setTimeout(() => setAlertFeedbackMsg(null), 4000);
    }
  };

  const handleDismissAlert = (alertId: string) => {
    eventStore.dismissCapacityAlert(alertId);
    setAlertFeedbackMsg('Alerta de lotação reconhecido e arquivado com sucesso.');
    setCapacityAlerts(eventStore.getCapacityAlerts());
    setTimeout(() => setAlertFeedbackMsg(null), 4000);
  };

  const handleTestTrigger = (modality: 'Gratuita' | 'Café Experience') => {
    eventStore.testTriggerCapacityAlert(modality, 92);
    setAlertFeedbackMsg(`Disparo de teste (92%) para "${modality}" executado! Registado em auditoria e despachado para gdangola12@gmail.com.`);
    setCapacityAlerts(eventStore.getCapacityAlerts());
    setTimeout(() => setAlertFeedbackMsg(null), 4000);
  };

  // Calculate KPIs
  const totalRevenueAoa = registrations
    .filter((r) => r.status === 'CONFIRMADO')
    .reduce((acc, curr) => acc + curr.amountAoa, 0);

  const pendingPaymentsCount = registrations.filter((r) => r.status === 'PENDENTE').length;
  const checkedInCount = registrations.filter((r) => r.checkInStatus === 'CHECKED_IN').length;
  const approvedExhibitorsCount = exhibitors.filter((e) => e.status === 'APROVADO').length;

  // Certificate KPIs from Store
  const certKpis = eventStore.getCertificateKPIs();

  const handleRunCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkInInput.trim()) return;
    const res = onValidateCheckIn(checkInInput.trim());
    setCheckInResult(res);
    setCheckInInput('');
  };

  const handleRunCheckInWithValue = (val: string) => {
    if (!val.trim()) return;
    const res = onValidateCheckIn(val.trim());
    setCheckInResult(res);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(editingSettings);
    setSettingsSavedMessage(true);
    setTimeout(() => setSettingsSavedMessage(false), 3000);
  };

  const handleExportRegistrationsCSV = () => {
    const headers = 'ID,Código Ingresso,Nome,Email,Telefone,Empresa,Cargo,Montante (Kz),Estado,Check-In,CertificadoPago,CriadoEm\n';
    const rows = registrations
      .map(
        (r) =>
          `"${r.id}","${r.ticketCode}","${r.fullName}","${r.email}","${r.phone}","${r.company}","${r.jobTitle}",${r.amountAoa},"${r.status}","${r.checkInStatus}","${
            r.conferenceCertificatePaid ? 'SIM' : 'NAO'
          }","${r.createdAt}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `participantes-cafe-empreendedor-79-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  const handleExportCertificatesCSV = () => {
    const headers = 'ID Certificado,ID Inscrição,Código Ingresso,Participante,Empresa,Modalidade,Estado,Downloads,EmitidoEm\n';
    const rows = certificates
      .map(
        (c) =>
          `"${c.id}","${c.registrationId}","${c.ticketCode}","${c.participantName}","${c.companyName}","${c.packageName}","${c.status}",${c.downloadCount},"${c.issueDate}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `certificados-cafe-empreendedor-79-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  const filteredRegistrations = registrations.filter((r) => {
    if (regFilterStatus !== 'todos' && r.status !== regFilterStatus) return false;
    if (regSearch.trim()) {
      const q = regSearch.toLowerCase();
      const matchName = r.fullName.toLowerCase().includes(q);
      const matchEmail = r.email.toLowerCase().includes(q);
      const matchId = r.id.toLowerCase().includes(q);
      const matchCode = r.ticketCode?.toLowerCase().includes(q);
      return matchName || matchEmail || matchId || matchCode;
    }
    return true;
  });

  const filteredCertificates = certificates.filter((c) => {
    if (certTypeFilter !== 'todos' && c.type !== certTypeFilter) return false;
    if (certSearch.trim()) {
      const q = certSearch.toLowerCase();
      const matchName = c.participantName.toLowerCase().includes(q);
      const matchId = c.id.toLowerCase().includes(q);
      const matchCode = c.ticketCode.toLowerCase().includes(q);
      return matchName || matchId || matchCode;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md overflow-hidden">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-6xl h-[94vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top bar */}
        <div className="p-4 sm:p-5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-purple-950 border border-purple-800 text-amber-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Painel Administrativo da 79.ª Edição
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold uppercase">
                  Organização Oficial
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Geração Digital Angola · Inscrições, Ingressos & Certificados Digitais
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsAlertsDrawerOpen(true)}
              className={`relative px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                critical90Alerts.length > 0
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                  : 'bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700'
              }`}
              title="Notificações e Alertas Automáticos de Lotação (90%)"
            >
              {critical90Alerts.length > 0 ? (
                <BellRing className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
              ) : (
                <Bell className="w-3.5 h-3.5 text-zinc-400" />
              )}
              <span>Alertas (90%)</span>
              {critical90Alerts.length > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-black leading-none text-white bg-rose-600 rounded-full animate-pulse">
                  {critical90Alerts.length}
                </span>
              )}
            </button>

            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center space-x-1"
            >
              <LogOut className="w-3.5 h-3.5 text-zinc-400" />
              <span>Voltar ao Website</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-zinc-900/60 border-b border-zinc-800/80 px-4 flex items-center space-x-1 overflow-x-auto scrollbar-none shrink-0 py-2">
          {[
            { id: 'overview', label: 'Visão Geral & KPIs', icon: Activity },
            { id: 'capacity', label: 'Resumo de Capacidade', icon: Sliders },
            { id: 'checkin', label: 'Portaria & Validador', icon: QrCode },
            { id: 'staff', label: 'Equipa de Portaria', icon: UserCheck },
            { id: 'dispatches', label: 'Envios de Ingressos', icon: Send },
            { id: 'registrations', label: 'Participantes & Inscrições', icon: Users },
            { id: 'certificates', label: 'Gestão de Certificados', icon: Award },
            { id: 'exhibitors', label: 'Gestão de Expositores', icon: Store },
            { id: 'pitch', label: 'Gestão do Pitch & Júri', icon: Award },
            { id: 'agenda', label: 'Gestão da Agenda', icon: Calendar },
            { id: 'settings', label: 'Definições do Evento', icon: Settings },
            { id: 'audit', label: 'Auditoria de Ações', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg flex items-center space-x-1.5 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#BE123C] text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Feedback message banner if present */}
          {alertFeedbackMsg && (
            <div className="p-3 bg-emerald-950/90 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs flex items-center justify-between shadow-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-medium">{alertFeedbackMsg}</span>
              </div>
              <button
                onClick={() => setAlertFeedbackMsg(null)}
                className="text-emerald-400 hover:text-white text-xs px-2 py-0.5 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* CRITICAL 90% CAPACITY ALERT BANNER */}
          {critical90Alerts.length > 0 && (
            <div className="bg-gradient-to-r from-rose-950/95 via-red-950/80 to-purple-950/90 border-2 border-rose-500/60 rounded-2xl p-4 sm:p-5 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 bg-rose-600 rounded-xl shrink-0 mt-0.5 animate-pulse shadow-md">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-600 text-white uppercase tracking-wider">
                      ALERTA AUTOMÁTICO DE LOTAÇÃO (≥90%)
                    </span>
                    <span className="text-xs text-rose-200 font-semibold">
                      {critical90Alerts.length} modalidade(s) com capacidade crítica atingida
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white mt-1.5 flex flex-wrap gap-2">
                    {critical90Alerts.map((a) => (
                      <span
                        key={a.id}
                        className="inline-flex items-center space-x-1.5 px-3 py-1 bg-black/50 border border-rose-500/50 rounded-lg text-xs"
                      >
                        <Flame className="w-3.5 h-3.5 text-rose-400" />
                        <span className="font-bold text-white">{a.modality}:</span>
                        <span className="text-amber-300 font-mono font-black">{a.occupancyPercentage}%</span>
                        <span className="text-zinc-300 text-[11px]">
                          ({a.occupancyCount}/{a.maxCapacity} vagas)
                        </span>
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-rose-200/90 mt-1.5 flex items-center space-x-1.5">
                    <Mail className="w-3.5 h-3.5 text-rose-300 shrink-0" />
                    <span>
                      Notificações despachadas automaticamente para{' '}
                      <span className="font-semibold text-white underline">gdangola12@gmail.com</span> e registadas
                      nos logs de auditoria.
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 shrink-0 w-full md:w-auto">
                <button
                  onClick={() => setIsAlertsDrawerOpen(true)}
                  className="flex-1 md:flex-none px-4 py-2.5 text-xs font-bold bg-white text-rose-900 hover:bg-rose-100 rounded-xl shadow cursor-pointer transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Central de Alertas</span>
                </button>
                <button
                  onClick={() => setActiveTab('capacity')}
                  className="flex-1 md:flex-none px-4 py-2.5 text-xs font-bold bg-rose-800/90 hover:bg-rose-700 text-white rounded-xl border border-rose-600/50 cursor-pointer transition-colors"
                >
                  Gerir Vagas
                </button>
              </div>
            </div>
          )}

          {/* TAB: OVERVIEW & KPIS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Receita Ingressos (AOA)</p>
                  <p className="text-2xl font-black text-amber-400 font-mono">
                    {totalRevenueAoa.toLocaleString('pt-AO')} <span className="text-xs text-zinc-400">Kz</span>
                  </p>
                  <p className="text-xs text-emerald-400 font-medium">Pagamentos reconciliados</p>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Certificados Emitidos</p>
                  <p className="text-2xl font-black text-white font-mono">{certKpis.totalIssued}</p>
                  <p className="text-xs text-amber-400">
                    {certKpis.conferenceRevenueAoa.toLocaleString('pt-AO')} Kz (Conferência)
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Check-Ins na Portaria</p>
                  <p className="text-2xl font-black text-emerald-400 font-mono">
                    {checkedInCount} <span className="text-xs text-zinc-400">/ {registrations.length}</span>
                  </p>
                  <p className="text-xs text-zinc-400">
                    {registrations.length > 0
                      ? `${Math.round((checkedInCount / registrations.length) * 100)}% validados`
                      : '0%'}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Expositores Activos</p>
                  <p className="text-2xl font-black text-purple-300 font-mono">
                    {approvedExhibitorsCount}
                  </p>
                  <p className="text-xs text-zinc-400">{exhibitors.length} candidaturas</p>
                </div>
              </div>

              {/* Callouts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                      <Sliders className="w-4 h-4 text-purple-400" />
                      <span>Resumo de Capacidade</span>
                    </h4>
                    <p className="text-xs text-zinc-400">
                      Limites, ocupação e controlo de vagas por modalidade.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('capacity')}
                    className="px-4 py-2 text-xs font-bold text-white bg-purple-900 hover:bg-purple-800 rounded-xl cursor-pointer"
                  >
                    Ver Lotação
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>Gestão Oficial de Certificados</span>
                    </h4>
                    <p className="text-xs text-zinc-400">
                      Consulte, reemita ou anule certificados da Conferência e Café Experience.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('certificates')}
                    className="px-4 py-2 text-xs font-bold text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl cursor-pointer"
                  >
                    Abrir Módulo
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                      <QrCode className="w-4 h-4 text-rose-400" />
                      <span>Validador de Entrada na Portaria</span>
                    </h4>
                    <p className="text-xs text-zinc-400">
                      Leitura de ingressos e bloqueio contra utilização duplicada.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('checkin')}
                    className="px-4 py-2 text-xs font-bold text-white bg-[#BE123C] hover:bg-rose-600 rounded-xl cursor-pointer"
                  >
                    Abrir Check-In
                  </button>
                </div>
              </div>

              {/* Dedicated Capacity Summary in Overview */}
              <CapacitySummary
                ticketTiers={ticketTiers}
                registrations={registrations}
                settings={settings}
                onUpdateTier={onUpdateTier}
              />
            </div>
          )}

          {/* TAB: CAPACITY SUMMARY (DEDICATED FULL TAB) */}
          {activeTab === 'capacity' && (
            <div className="space-y-6">
              <CapacitySummary
                ticketTiers={ticketTiers}
                registrations={registrations}
                settings={settings}
                onUpdateTier={onUpdateTier}
              />
            </div>
          )}

          {/* TAB: CERTIFICATES MANAGEMENT (NEW MANDATORY MODULE) */}
          {activeTab === 'certificates' && (
            <div className="space-y-6">
              {/* Specific Certificate KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="text-[11px] text-zinc-400 font-semibold uppercase">Total Emitidos</span>
                  <p className="text-xl font-bold font-mono text-white mt-1">{certKpis.totalIssued}</p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="text-[11px] text-zinc-400 font-semibold uppercase">Conf. Pagos (2.000 Kz)</span>
                  <p className="text-xl font-bold font-mono text-emerald-400 mt-1">{certKpis.conferencePaid}</p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="text-[11px] text-zinc-400 font-semibold uppercase">Conf. Pendentes</span>
                  <p className="text-xl font-bold font-mono text-amber-400 mt-1">{certKpis.conferencePending}</p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="text-[11px] text-zinc-400 font-semibold uppercase">Café Experience</span>
                  <p className="text-xl font-bold font-mono text-purple-300 mt-1">{certKpis.experienceCount}</p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="text-[11px] text-zinc-400 font-semibold uppercase">Downloads PDF</span>
                  <p className="text-xl font-bold font-mono text-teal-400 mt-1">{certKpis.totalDownloads}</p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="text-[11px] text-zinc-400 font-semibold uppercase">Anulados</span>
                  <p className="text-xl font-bold font-mono text-rose-400 mt-1">{certKpis.annulledCount}</p>
                </div>
              </div>

              {/* Policy toggle: whether check-in is required */}
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <h4 className="font-bold text-white">Critério de Elegibilidade para Emissão:</h4>
                  <p className="text-zinc-400">
                    Defina se a emissão do certificado depende apenas do pagamento ou se exige igualmente a confirmação de presença (check-in) no evento.
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => onUpdateSettings({ requireCheckInForCertificate: false })}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                      !settings.requireCheckInForCertificate
                        ? 'bg-emerald-700 text-white shadow'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    Apenas Pagamento
                  </button>
                  <button
                    onClick={() => onUpdateSettings({ requireCheckInForCertificate: true })}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                      settings.requireCheckInForCertificate
                        ? 'bg-[#BE123C] text-white shadow'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    Pagamento + Check-In
                  </button>
                </div>
              </div>

              {/* Filters & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Pesquisar por participante, código de ingresso ou certificado..."
                    value={certSearch}
                    onChange={(e) => setCertSearch(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white min-w-[300px]"
                  />
                  <select
                    value={certTypeFilter}
                    onChange={(e) => setCertTypeFilter(e.target.value as any)}
                    className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white"
                  >
                    <option value="todos">Todas as Modalidades</option>
                    <option value="CONFERENCIA">Apenas Conferência</option>
                    <option value="CAFE_EXPERIENCE">Apenas Café Experience</option>
                  </select>
                </div>

                <button
                  onClick={handleExportCertificatesCSV}
                  className="px-4 py-2 text-xs font-bold text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg flex items-center space-x-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Exportar Relatório CSV</span>
                </button>
              </div>

              {/* Certificates List Table */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-zinc-300">
                    <thead className="bg-zinc-950 text-[11px] uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
                      <tr>
                        <th className="p-3">N.º Certificado</th>
                        <th className="p-3">Participante</th>
                        <th className="p-3">Ingresso</th>
                        <th className="p-3">Modalidade</th>
                        <th className="p-3">Estado</th>
                        <th className="p-3">Downloads</th>
                        <th className="p-3">Emitido Em</th>
                        <th className="p-3 text-right">Acções</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/80 font-mono">
                      {filteredCertificates.map((c) => (
                        <tr key={c.id} className="hover:bg-zinc-800/40">
                          <td className="p-3 font-bold text-white">{c.id}</td>
                          <td className="p-3 font-sans font-semibold text-white">
                            {c.participantName}
                            <div className="text-[11px] text-zinc-400 font-normal">{c.companyName}</div>
                          </td>
                          <td className="p-3 text-amber-400 font-bold">{c.ticketCode}</td>
                          <td className="p-3 font-sans text-zinc-300">{c.packageName}</td>
                          <td className="p-3 font-sans">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                c.status === 'VALIDO'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                  : 'bg-rose-950 text-rose-300 border border-rose-800'
                              }`}
                            >
                              {c.status}
                            </span>
                          </td>
                          <td className="p-3 text-center">{c.downloadCount}</td>
                          <td className="p-3 text-[11px] text-zinc-400">{c.issueDate}</td>
                          <td className="p-3 text-right font-sans space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => onViewCertificate(c)}
                              className="px-2.5 py-1 text-[11px] font-bold text-white bg-zinc-800 hover:bg-zinc-700 rounded cursor-pointer"
                              title="Visualizar Certificado Oficial"
                            >
                              Ver
                            </button>
                            <button
                              onClick={() => {
                                eventStore.incrementCertificateDownload(c.id);
                                downloadCertificatePdf(c, settings);
                              }}
                              className="px-2.5 py-1 text-[11px] font-bold text-white bg-[#9F1239] hover:bg-[#BE123C] rounded cursor-pointer"
                              title="Descarregar PDF do Certificado"
                            >
                              Descarregar
                            </button>
                            <button
                              onClick={async () => {
                                eventStore.incrementCertificateDownload(c.id);
                                const canvas = await createCertificateCanvas(c, settings);
                                await printCanvasDirectly(canvas, `Certificado - ${c.participantName}`, 'landscape');
                              }}
                              className="px-2.5 py-1 text-[11px] font-bold text-zinc-300 hover:text-white bg-zinc-850 hover:bg-zinc-750 border border-zinc-700 rounded cursor-pointer"
                              title="Imprimir Certificado (A4)"
                            >
                              Imprimir
                            </button>
                            <button
                              onClick={() => {
                                setReissueModalCert(c);
                                setReissueNameInput(c.participantName);
                              }}
                              className="px-2 py-1 text-[11px] font-semibold text-amber-300 bg-amber-950/60 rounded cursor-pointer"
                              title="Reemitir com correção de nome"
                            >
                              Reemitir
                            </button>
                            {c.status === 'VALIDO' && (
                              <button
                                onClick={() => {
                                  setAnnulModalCert(c);
                                  setAnnulReasonInput('');
                                }}
                                className="px-2 py-1 text-[11px] font-semibold text-rose-400 bg-rose-950/60 rounded"
                                title="Anular Certificado"
                              >
                                Anular
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CHECK-IN & CONTROLO DE ENTRADAS (DASHBOARD EM TEMPO REAL) */}
          {activeTab === 'checkin' && (
            <div className="space-y-6">
              {/* Top Banner & Launch Camera Portal */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-[#3B0764] via-[#881337] to-[#BE123C] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                      Modo Operacional da Portaria
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black">
                    Controlo de Entradas · 79.ª Edição
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-200">
                    Terminal dedicado para leitura de QR Code por câmara de telemóvel/tablet e validação de credenciais.
                  </p>
                </div>

                {onOpenCheckInPortal && (
                  <button
                    onClick={onOpenCheckInPortal}
                    className="px-6 py-3.5 bg-white text-zinc-950 hover:bg-zinc-100 font-black text-xs sm:text-sm rounded-xl shadow-2xl flex items-center space-x-2 shrink-0 transition-transform hover:scale-105 cursor-pointer"
                  >
                    <QrCode className="w-5 h-5 text-[#BE123C]" />
                    <span>ABRIR CÂMARA E LER QR CODE</span>
                  </button>
                )}
              </div>

              {/* Live Event Real-Time KPIs (Prompt section 9) */}
              {(() => {
                const liveKpis = eventStore.getLiveCheckInKPIs();
                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                        <span className="text-[11px] text-zinc-400 font-bold uppercase">Total Inscrições</span>
                        <p className="text-2xl font-black text-white font-mono">{liveKpis.totalConfirmed}</p>
                        <p className="text-[10px] text-zinc-500">Inscrições confirmadas</p>
                      </div>

                      <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 space-y-1">
                        <span className="text-[11px] text-emerald-400 font-bold uppercase">Participantes Presentes</span>
                        <p className="text-2xl font-black text-emerald-300 font-mono">{liveKpis.totalCheckedIn}</p>
                        <p className="text-[10px] text-emerald-400 font-semibold">{liveKpis.attendanceRate}% taxa de comparência</p>
                      </div>

                      <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800 space-y-1">
                        <span className="text-[11px] text-amber-400 font-bold uppercase">Aguardando Entrada</span>
                        <p className="text-2xl font-black text-amber-300 font-mono">{liveKpis.totalUnused}</p>
                        <p className="text-[10px] text-amber-400">Ingressos por utilizar</p>
                      </div>

                      <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800 space-y-1">
                        <span className="text-[11px] text-purple-400 font-bold uppercase">Conferência vs Experience</span>
                        <div className="flex items-baseline space-x-2 font-mono text-sm font-bold text-white">
                          <span>{liveKpis.confCheckedIn}/{liveKpis.confTotal} Conf</span>
                          <span className="text-zinc-600">·</span>
                          <span className="text-amber-300">{liveKpis.expCheckedIn}/{liveKpis.expTotal} Exp</span>
                        </div>
                        <p className="text-[10px] text-purple-300">Entradas por modalidade</p>
                      </div>
                    </div>

                    {/* Breakdown by package list */}
                    <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Comparência por Pacote do Evento
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        {liveKpis.packageStats.map((p) => (
                          <div key={p.tierId} className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-zinc-200 truncate">{p.tierName}</span>
                              <span className="font-mono text-emerald-400 font-bold">{p.rate}%</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-amber-500 to-[#BE123C]" style={{ width: `${p.rate}%` }} />
                            </div>
                            <p className="text-[10px] text-zinc-500">
                              {p.totalCheckedIn} de {p.totalConfirmed} presentes
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Direct In-Page Camera Scanner */}
                    <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                          <Camera className="w-4 h-4 text-emerald-400" />
                          <span>Leitor de Câmara no Painel</span>
                        </h4>
                        <span className="text-[10px] text-zinc-400 font-mono">Detecção Automática</span>
                      </div>
                      <QrCameraScanner
                        buttonLabel="ABRIR CÂMARA E LER QR CODE"
                        onScanSuccess={(code) => {
                          setCheckInInput(code);
                          handleRunCheckInWithValue(code);
                        }}
                      />
                    </div>

                    {/* Quick Validator Manual Form */}
                    <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                        <Search className="w-3.5 h-3.5 text-amber-400" />
                        <span>Validação Manual por Código ou Nome</span>
                      </h4>
                      <form onSubmit={handleRunCheckIn} className="flex gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Código único (ex: CDE79-K8P4X7), Ref Interna ou Nome..."
                          value={checkInInput}
                          onChange={(e) => setCheckInInput(e.target.value)}
                          className="flex-1 bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-2 text-xs sm:text-sm font-mono text-white focus:outline-none focus:border-[#BE123C]"
                        />
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#BE123C] hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow cursor-pointer shrink-0"
                        >
                          Validar Entrada
                        </button>
                      </form>

                      {checkInResult && (
                        <div
                          className={`p-4 rounded-xl border text-xs space-y-1 ${
                            checkInResult.success
                              ? 'bg-emerald-950/40 border-emerald-600 text-emerald-200'
                              : 'bg-rose-950/40 border-rose-600 text-rose-200'
                          }`}
                        >
                          <div className="flex items-center space-x-2 font-bold">
                            {checkInResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                            <span>{checkInResult.success ? 'CHECK-IN APROVADO' : 'CHECK-IN RECUSADO'}</span>
                          </div>
                          <p className="text-[11px] text-zinc-300">{checkInResult.message}</p>
                        </div>
                      )}
                    </div>

                    {/* Recent Check-Ins Table */}
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
                      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                          Histórico de Entradas Registadas ({liveKpis.recentCheckIns.length})
                        </h4>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-zinc-300">
                          <thead className="bg-zinc-950 text-[10px] uppercase text-zinc-400 border-b border-zinc-800 font-mono">
                            <tr>
                              <th className="p-3">Horário</th>
                              <th className="p-3">Participante</th>
                              <th className="p-3">Código Ingresso</th>
                              <th className="p-3">Ref. Controlo</th>
                              <th className="p-3">Modalidade</th>
                              <th className="p-3">Operador</th>
                              <th className="p-3">Resultado</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-800/80 font-mono">
                            {liveKpis.recentCheckIns.map((chk) => (
                              <tr key={chk.id} className="hover:bg-zinc-800/40">
                                <td className="p-3 font-semibold text-white">{chk.timestamp}</td>
                                <td className="p-3 font-sans font-bold text-white">{chk.participantName}</td>
                                <td className="p-3 text-amber-400 font-bold">{chk.ticketCode}</td>
                                <td className="p-3 text-teal-300 text-[11px]">{chk.internalControlCode}</td>
                                <td className="p-3 font-sans text-zinc-400">{chk.packageName}</td>
                                <td className="p-3 font-sans text-zinc-300">{chk.staffUserName}</td>
                                <td className="p-3 font-sans">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                                    {chk.result}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB: EQUIPA DE PORTARIA (GESTÃO DE OPERADORES - PROMPT SECTION 8) */}
          {activeTab === 'staff' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold text-white">Equipa de Portaria & Controlo de Entradas</h4>
                  <p className="text-xs text-zinc-400">
                    Definição de contas, permissões, PINs de acesso e histórico de check-ins validados por cada funcionário.
                  </p>
                </div>

                <button
                  onClick={() => setIsNewStaffOpen(true)}
                  className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#9F1239] to-[#BE123C] hover:opacity-95 rounded-xl shadow flex items-center space-x-1.5 cursor-pointer shrink-0"
                >
                  <UserPlus className="w-4 h-4 text-amber-300" />
                  <span>Criar Nova Conta de Operador</span>
                </button>
              </div>

              {/* Staff Accounts Table */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-zinc-300">
                    <thead className="bg-zinc-950 text-[11px] uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
                      <tr>
                        <th className="p-3">Nome do Funcionário</th>
                        <th className="p-3">Utilizador</th>
                        <th className="p-3">Cargo / Perfil</th>
                        <th className="p-3">PIN de Acesso</th>
                        <th className="p-3">Check-Ins Validados</th>
                        <th className="p-3">Estado</th>
                        <th className="p-3 text-right">Acções</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/80 font-mono">
                      {staffUsers.map((staff) => (
                        <tr key={staff.id} className="hover:bg-zinc-800/40">
                          <td className="p-3 font-sans font-bold text-white">{staff.name}</td>
                          <td className="p-3 text-zinc-400">{staff.username}</td>
                          <td className="p-3 font-sans">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800">
                              {staff.role === 'ADMIN' ? 'Administrador' : staff.role === 'SUPERVISOR_CHECKIN' ? 'Supervisor Portaria' : 'Operador de Portaria'}
                            </span>
                          </td>
                          <td className="p-3 text-amber-400 font-bold tracking-widest">{staff.pin}</td>
                          <td className="p-3 text-center text-emerald-400 font-bold">{staff.totalCheckInsValidated}</td>
                          <td className="p-3 font-sans">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                staff.active
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                  : 'bg-zinc-800 text-zinc-500'
                              }`}
                            >
                              {staff.active ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td className="p-3 text-right font-sans space-x-1 whitespace-nowrap">
                            <button
                              onClick={() => {
                                eventStore.toggleStaffUserActive(staff.id);
                                setStaffUsers(eventStore.getStaffUsers());
                              }}
                              className="px-2.5 py-1 text-[11px] font-semibold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded cursor-pointer"
                            >
                              {staff.active ? 'Desactivar' : 'Activar'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Modal: Create Staff Account */}
              {isNewStaffOpen && (
                <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                  <div className="bg-zinc-950 border border-zinc-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                      <div className="flex items-center space-x-2 text-white">
                        <UserPlus className="w-5 h-5 text-amber-400" />
                        <h4 className="font-bold text-sm">Criar Conta de Funcionário de Entrada</h4>
                      </div>
                      <button
                        onClick={() => setIsNewStaffOpen(false)}
                        className="text-zinc-400 hover:text-white"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newStaffName.trim() || !newStaffPin.trim()) return;
                        eventStore.addStaffUser({
                          name: newStaffName.trim(),
                          username: newStaffUsername.trim() || newStaffName.toLowerCase().replace(/\s+/g, '.'),
                          role: newStaffRole,
                          active: true,
                          pin: newStaffPin.trim(),
                        });
                        setStaffUsers(eventStore.getStaffUsers());
                        setIsNewStaffOpen(false);
                        setNewStaffName('');
                        setNewStaffUsername('');
                        setNewStaffPin('');
                      }}
                      className="space-y-3 text-xs"
                    >
                      <div>
                        <label className="text-zinc-300 font-semibold">Nome Completo *</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: João Baptista"
                          value={newStaffName}
                          onChange={(e) => setNewStaffName(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-white mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-zinc-300 font-semibold">Nome de Utilizador</label>
                        <input
                          type="text"
                          placeholder="Ex: jbaptista"
                          value={newStaffUsername}
                          onChange={(e) => setNewStaffUsername(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-white mt-1 font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-zinc-300 font-semibold">Perfil de Acesso</label>
                          <select
                            value={newStaffRole}
                            onChange={(e) => setNewStaffRole(e.target.value as any)}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-white mt-1"
                          >
                            <option value="OPERADOR_PORTARIA">Operador de Portaria</option>
                            <option value="SUPERVISOR_CHECKIN">Supervisor de Check-In</option>
                            <option value="ADMIN">Administrador</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-zinc-300 font-semibold">PIN de Validação (4-6 dígitos) *</label>
                          <input
                            type="password"
                            maxLength={6}
                            required
                            placeholder="PIN..."
                            value={newStaffPin}
                            onChange={(e) => setNewStaffPin(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-white mt-1 font-mono tracking-widest text-center"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2 pt-3">
                        <button
                          type="button"
                          onClick={() => setIsNewStaffOpen(false)}
                          className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-xl"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#BE123C] hover:bg-rose-600 text-white font-bold rounded-xl shadow cursor-pointer"
                        >
                          Criar Conta
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: ENVIOS DE INGRESSOS (WHATSAPP & EMAIL - PROMPT SECTION 2 & 11) */}
          {activeTab === 'dispatches' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold text-white">Histórico de Envios de Ingressos</h4>
                  <p className="text-xs text-zinc-400">
                    Registo em base de dados dos ingressos emitidos e despachados via WhatsApp Business e Email Transaccional.
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                    {dispatches.filter((d) => d.status === 'ENTREGUE').length} Entregues
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-300 font-bold">
                    Total: {dispatches.length}
                  </span>
                </div>
              </div>

              {/* Dispatches Table */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-zinc-300">
                    <thead className="bg-zinc-950 text-[11px] uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
                      <tr>
                        <th className="p-3">Código Ingresso</th>
                        <th className="p-3">Canal</th>
                        <th className="p-3">Destinatário</th>
                        <th className="p-3">Estado</th>
                        <th className="p-3">Fornecedor</th>
                        <th className="p-3">ID Mensagem</th>
                        <th className="p-3">Data / Hora</th>
                        <th className="p-3 text-right">Acções</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/80 font-mono">
                      {dispatches.map((disp) => (
                        <tr key={disp.id} className="hover:bg-zinc-800/40">
                          <td className="p-3 font-bold text-amber-400">{disp.ticketCode}</td>
                          <td className="p-3 font-sans">
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-200">
                              {disp.channel === 'WHATSAPP' ? (
                                <MessageSquare className="w-3 h-3 text-emerald-400" />
                              ) : disp.channel === 'EMAIL' ? (
                                <Mail className="w-3 h-3 text-rose-400" />
                              ) : (
                                <Send className="w-3 h-3 text-purple-400" />
                              )}
                              <span>{disp.channel}</span>
                            </span>
                          </td>
                          <td className="p-3 font-sans text-white text-[11px]">{disp.recipient}</td>
                          <td className="p-3 font-sans">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                disp.status === 'ENTREGUE'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                  : disp.status === 'ENVIADO'
                                  ? 'bg-teal-950 text-teal-300 border border-teal-800'
                                  : disp.status === 'PENDENTE'
                                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                  : 'bg-rose-950 text-rose-300 border border-rose-800'
                              }`}
                            >
                              {disp.status}
                            </span>
                          </td>
                          <td className="p-3 font-sans text-zinc-400 text-[11px]">{disp.providerName}</td>
                          <td className="p-3 text-zinc-500 text-[10px]">{disp.messageId}</td>
                          <td className="p-3 text-zinc-400 text-[11px]">{disp.sentAt}</td>
                          <td className="p-3 text-right font-sans whitespace-nowrap">
                            {onOpenDeliveryModal && (
                              <button
                                onClick={() => {
                                  const reg = registrations.find((r) => r.id === disp.registrationId);
                                  if (reg) onOpenDeliveryModal(reg);
                                }}
                                className="px-2.5 py-1 text-[11px] font-bold text-white bg-zinc-800 hover:bg-zinc-700 rounded cursor-pointer"
                              >
                                Reenviar
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: REGISTRATIONS & TICKETS */}
          {activeTab === 'registrations' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Pesquisar participante, código ou empresa..."
                    value={regSearch}
                    onChange={(e) => setRegSearch(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white min-w-[260px]"
                  />
                  <select
                    value={regFilterStatus}
                    onChange={(e) => setRegFilterStatus(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white"
                  >
                    <option value="todos">Todos os Estados</option>
                    <option value="CONFIRMADO">Apenas Confirmados</option>
                    <option value="PENDENTE">Apenas Pendentes</option>
                  </select>
                </div>

                <button
                  onClick={handleExportRegistrationsCSV}
                  className="px-4 py-2 text-xs font-bold text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-zinc-700 flex items-center space-x-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Exportar CSV Oficial</span>
                </button>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-zinc-300">
                    <thead className="bg-zinc-950 text-[11px] uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
                      <tr>
                        <th className="p-3">Código Ingresso</th>
                        <th className="p-3">Nome Completo</th>
                        <th className="p-3">Empresa</th>
                        <th className="p-3">Montante</th>
                        <th className="p-3">Estado</th>
                        <th className="p-3">Check-In</th>
                        <th className="p-3">Certificado</th>
                        <th className="p-3 text-right">Acções</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/80 font-mono">
                      {filteredRegistrations.map((r) => (
                        <tr key={r.id} className="hover:bg-zinc-800/40">
                          <td className="p-3 font-bold text-amber-400">{r.ticketCode}</td>
                          <td className="p-3 font-sans font-semibold text-white">
                            {r.fullName}
                            <div className="text-[11px] text-zinc-400 font-normal">{r.jobTitle}</div>
                          </td>
                          <td className="p-3 font-sans text-zinc-300">{r.company}</td>
                          <td className="p-3 font-bold text-white">
                            {r.amountAoa.toLocaleString('pt-AO')} Kz
                          </td>
                          <td className="p-3 font-sans">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                r.status === 'CONFIRMADO'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                  : 'bg-amber-950 text-amber-300 border border-amber-800'
                              }`}
                            >
                              {r.status}
                            </span>
                          </td>
                          <td className="p-3 font-sans text-[11px]">
                            {r.checkInStatus === 'CHECKED_IN' ? (
                              <span className="text-emerald-400 font-bold">Validado</span>
                            ) : (
                              <span className="text-zinc-500">Pendente</span>
                            )}
                          </td>
                          <td className="p-3 font-sans text-[11px]">
                            {r.conferenceCertificatePaid ? (
                              <span className="text-purple-300 font-semibold">Pago (Conf)</span>
                            ) : r.wantsConferenceCertificate ? (
                              <span className="text-amber-400">Pendente</span>
                            ) : (
                              <span className="text-zinc-500">—</span>
                            )}
                          </td>
                          <td className="p-3 text-right font-sans space-x-1 whitespace-nowrap">
                            {onViewTicket && (
                              <button
                                onClick={() => onViewTicket(r)}
                                className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-amber-300 rounded text-[11px] font-semibold cursor-pointer"
                                title="Ver Ingresso Digital"
                              >
                                Ingresso
                              </button>
                            )}
                            <button
                              onClick={() => {
                                const tier = ticketTiers.find((t) => t.id === r.ticketTierId) || ticketTiers[0];
                                downloadTicketPdf(r, tier, settings);
                              }}
                              className="px-2 py-1 bg-[#9F1239] hover:bg-[#BE123C] text-white rounded text-[11px] font-semibold cursor-pointer"
                              title="Descarregar PDF do Ingresso"
                            >
                              PDF
                            </button>
                            <button
                              onClick={async () => {
                                const tier = ticketTiers.find((t) => t.id === r.ticketTierId) || ticketTiers[0];
                                const canvas = await createTicketCanvas(r, tier, settings);
                                await printCanvasDirectly(canvas, `Ingresso-${r.ticketCode}`, 'portrait');
                              }}
                              className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-[11px] font-semibold cursor-pointer"
                              title="Imprimir Ingresso"
                            >
                              <Printer className="w-3 h-3 inline mr-0.5" />
                              Imprimir
                            </button>
                            {onOpenDeliveryModal && (
                              <button
                                onClick={() => onOpenDeliveryModal(r)}
                                className="px-2 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 rounded text-[11px] font-semibold cursor-pointer"
                                title="Enviar por WhatsApp ou Email"
                              >
                                <Send className="w-3 h-3 inline mr-0.5" />
                                Enviar
                              </button>
                            )}
                            {r.status !== 'CONFIRMADO' && (
                              <button
                                onClick={() => onUpdateRegistrationStatus(r.id, 'CONFIRMADO')}
                                className="px-2 py-1 bg-emerald-800 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold cursor-pointer"
                              >
                                Aprovar
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: EXHIBITORS */}
          {activeTab === 'exhibitors' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-white">Candidaturas e Stands de Expositores</h4>
                <span className="text-xs text-zinc-400">Total: {exhibitors.length} empresas</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exhibitors.map((exh) => (
                  <div key={exh.id} className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="text-base font-bold text-white">{exh.companyName}</h5>
                        <p className="text-xs text-amber-400">{exh.sector} · {exh.standNumber}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300">
                        {exh.status}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300">{exh.description}</p>
                    <div className="pt-2 border-t border-zinc-800 flex justify-end space-x-2">
                      {exh.status !== 'APROVADO' && (
                        <button
                          onClick={() => onUpdateExhibitorStatus(exh.id, 'APROVADO', 'Stand A-05')}
                          className="px-3 py-1 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded"
                        >
                          Aprovar Stand
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PITCH */}
          {activeTab === 'pitch' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white">Avaliações do Júri do Pitch</h4>
              <div className="space-y-3">
                {pitchCandidates.map((c, i) => (
                  <div key={c.id} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-amber-400">#{i + 1} </span>
                      <strong className="text-white">{c.projectName}</strong>
                      <span className="text-xs text-zinc-400 ml-2">({c.founderName})</span>
                      <p className="text-xs text-zinc-400 mt-1">{c.solution}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-mono font-bold text-amber-400">{c.averageScore}/100</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: AGENDA */}
          {activeTab === 'agenda' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
                <h4 className="text-sm font-bold text-white">Adicionar Sessão</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <input
                    type="text"
                    placeholder="Título da Sessão"
                    value={newSession.title}
                    onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                    className="bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Orador"
                    value={newSession.speakerName}
                    onChange={(e) => setNewSession({ ...newSession, speakerName: e.target.value })}
                    className="bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Empresa / Cargo"
                    value={newSession.speakerCompany}
                    onChange={(e) => setNewSession({ ...newSession, speakerCompany: e.target.value })}
                    className="bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!newSession.title) return;
                    onAddAgendaSession({ ...newSession, speakerRole: newSession.speakerCompany });
                    setNewSession({ ...newSession, title: '', speakerName: '', speakerCompany: '' });
                  }}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#BE123C] rounded-lg"
                >
                  Gravar Sessão
                </button>
              </div>

              <div className="space-y-2">
                {agenda.map((s) => (
                  <div key={s.id} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex justify-between text-xs">
                    <span><strong>{s.startTime}</strong> - {s.title} ({s.speakerName})</span>
                    <button onClick={() => onDeleteAgendaSession(s.id)} className="text-zinc-500 hover:text-rose-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-5 max-w-2xl">
              <h4 className="text-base font-bold text-white">Configurações Gerais da 79.ª Edição</h4>
              {settingsSavedMessage && (
                <div className="p-3 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs">
                  Definições guardadas com sucesso!
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="text-zinc-300 font-semibold">Data Oficial do Evento</label>
                  <input
                    type="text"
                    value={editingSettings.eventDateText}
                    onChange={(e) => setEditingSettings({ ...editingSettings, eventDateText: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-300 font-semibold">Local Oficial / Cidade</label>
                  <input
                    type="text"
                    value={editingSettings.venueName}
                    onChange={(e) => setEditingSettings({ ...editingSettings, venueName: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-300 font-semibold">Telefone Oficial</label>
                  <input
                    type="text"
                    value={editingSettings.organizerPhone}
                    onChange={(e) => setEditingSettings({ ...editingSettings, organizerPhone: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-300 font-semibold">Preço do Certificado da Conferência (Kz)</label>
                  <input
                    type="number"
                    value={editingSettings.conferenceCertificatePriceAoa}
                    onChange={(e) => setEditingSettings({ ...editingSettings, conferenceCertificatePriceAoa: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold text-white bg-[#BE123C] hover:bg-rose-600 rounded-xl flex items-center space-x-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Alterações</span>
              </button>
            </form>
          )}

          {/* TAB: AUDIT */}
          {activeTab === 'audit' && (
            <div className="space-y-3 max-w-3xl">
              <h4 className="text-sm font-bold text-white">Registo de Auditoria Operacional</h4>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 divide-y divide-zinc-800/80 text-xs">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3 flex items-start justify-between">
                    <div>
                      <span className="font-bold text-amber-400">{log.action}: </span>
                      <span className="text-zinc-200">{log.details}</span>
                      <div className="text-[11px] text-zinc-500 mt-0.5">Operador: {log.actor}</div>
                    </div>
                    <span className="font-mono text-[11px] text-zinc-500 shrink-0 ml-4">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal: Annul Certificate confirmation */}
        {annulModalCert && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-md w-full p-5 space-y-4">
              <div className="flex items-center space-x-2 text-rose-400 font-bold">
                <Ban className="w-5 h-5" />
                <span>Anular Certificado Oficial</span>
              </div>
              <p className="text-xs text-zinc-300">
                Tem a certeza de que deseja anular o certificado <strong>{annulModalCert.id}</strong> pertencente a <strong>{annulModalCert.participantName}</strong>?
              </p>
              <input
                type="text"
                required
                placeholder="Motivo formal da anulação (ex: Inscrição cancelada ou erro)..."
                value={annulReasonInput}
                onChange={(e) => setAnnulReasonInput(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-xs text-white"
              />
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => setAnnulModalCert(null)}
                  className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    onAnnulCertificate(annulModalCert.id, annulReasonInput || 'Anulação administrativa');
                    setAnnulModalCert(null);
                  }}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-rose-700 hover:bg-rose-600 rounded-lg"
                >
                  Confirmar Anulação
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Reissue Certificate with updated name */}
        {reissueModalCert && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-md w-full p-5 space-y-4">
              <div className="flex items-center space-x-2 text-amber-400 font-bold">
                <RefreshCw className="w-5 h-5" />
                <span>Reemitir Certificado</span>
              </div>
              <p className="text-xs text-zinc-300">
                Pode actualizar a ortografia do nome completo antes da reemissão do documento original:
              </p>
              <input
                type="text"
                required
                value={reissueNameInput}
                onChange={(e) => setReissueNameInput(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-xs text-white"
              />
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => setReissueModalCert(null)}
                  className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    onReissueCertificate(reissueModalCert.id, reissueNameInput);
                    setReissueModalCert(null);
                  }}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 rounded-lg"
                >
                  Reemitir Documento
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Central de Notificações & Alertas de Lotação (Regra dos 90%) */}
        {isAlertsDrawerOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-zinc-900 border border-zinc-700 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    <BellRing className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-black text-white">Central de Alertas de Lotação</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-500/20 border border-rose-500/30 text-rose-300 uppercase">
                        Gatilho Automático 90%
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Monitorização contínua de vagas da Conferência Gratuita e do Café Experience.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAlertsDrawerOpen(false)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Protocol Specs Banner */}
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-2">
                <div className="flex items-center justify-between text-zinc-300">
                  <span className="font-semibold flex items-center space-x-1.5">
                    <Mail className="w-4 h-4 text-amber-400" />
                    <span>Email de Notificação Oficial:</span>
                  </span>
                  <span className="font-mono font-bold text-amber-400">gdangola12@gmail.com</span>
                </div>
                <div className="flex items-center justify-between text-zinc-300">
                  <span className="font-semibold flex items-center space-x-1.5">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp de Coordenação:</span>
                  </span>
                  <span className="font-mono font-bold text-emerald-400">+244 921 152 162</span>
                </div>
                <p className="text-[11px] text-zinc-500 pt-1 border-t border-zinc-800/80">
                  Regra activa: Sempre que qualquer modalidade atinge <strong>90%</strong> da capacidade máxima configurada, o sistema gera o alerta, despacha o email formatado e insere um registo indelével na <strong>Auditoria de Ações</strong>.
                </p>
              </div>

              {/* Manual Simulation / Test Triggers */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 p-3 rounded-xl bg-zinc-800/40 border border-zinc-800">
                <span className="text-xs font-bold text-zinc-300">Testar Disparo Manual:</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleTestTrigger('Gratuita')}
                    className="flex-1 sm:flex-none px-3 py-1.5 bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-600/40 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Simular Gratuita (92%)
                  </button>
                  <button
                    onClick={() => handleTestTrigger('Café Experience')}
                    className="flex-1 sm:flex-none px-3 py-1.5 bg-amber-900/60 hover:bg-amber-800 text-amber-200 border border-amber-600/40 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Simular Experience (92%)
                  </button>
                </div>
              </div>

              {/* Alerts List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {capacityAlerts.length === 0 ? (
                  <div className="text-center py-10 space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                    <p className="text-sm font-bold text-white">Nenhum alerta crítico ativo</p>
                    <p className="text-xs text-zinc-400">
                      As modalidades encontram-se atualmente abaixo do patamar de 90% da sua lotação.
                    </p>
                  </div>
                ) : (
                  capacityAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-2xl border transition-all space-y-3 ${
                        alert.status === 'ACTIVO'
                          ? alert.severity === 'ESGOTADO_100'
                            ? 'bg-rose-950/40 border-rose-600/60'
                            : 'bg-red-950/30 border-red-500/40'
                          : 'bg-zinc-950/60 border-zinc-800 opacity-70'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center space-x-2.5">
                          <span
                            className={`w-3 h-3 rounded-full ${
                              alert.status === 'ACTIVO' ? 'bg-rose-500 animate-ping' : 'bg-zinc-600'
                            }`}
                          />
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-bold text-white">{alert.modality}</span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                  alert.modality === 'Gratuita'
                                    ? 'bg-purple-900/60 text-purple-300 border border-purple-600/40'
                                    : 'bg-amber-900/60 text-amber-300 border border-amber-600/40'
                                }`}
                              >
                                {alert.occupancyPercentage}% Ocupado
                              </span>
                              {alert.status === 'RECONHECIDO' && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] bg-zinc-800 text-zinc-400">
                                  Arquivado
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-zinc-400 font-mono">
                              {alert.occupancyCount} de {alert.maxCapacity} vagas ocupadas/reservadas · {alert.timestamp}
                            </span>
                          </div>
                        </div>

                        {/* Status tag */}
                        <span className="text-[10px] font-bold px-2 py-1 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {alert.severity === 'ESGOTADO_100' ? '100% ESGOTADO' : 'LIMIAR 90%'}
                        </span>
                      </div>

                      {/* Log & Email Delivery Evidence */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-black/40 p-2.5 rounded-xl border border-zinc-800/80">
                        <div className="flex items-center space-x-2 text-zinc-300">
                          <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>
                            Email: <strong className="text-white">{alert.emailRecipient}</strong>{' '}
                            {alert.emailSent && <span className="text-emerald-400">(Despachado)</span>}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-zinc-300">
                          <Layers className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>
                            Log Auditoria: <strong className="text-white">{alert.loggedToAudit ? 'Gravado' : 'Pendente'}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end space-x-2 pt-1">
                        <button
                          onClick={() => setPreviewEmailAlert(alert)}
                          className="px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center space-x-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Ver Email Formatado</span>
                        </button>
                        <button
                          onClick={() => handleSendAlertEmail(alert.id)}
                          className="px-3 py-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 bg-amber-950/60 hover:bg-amber-900 border border-amber-600/40 rounded-lg flex items-center space-x-1 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5 text-amber-400" />
                          <span>Reenviar Email</span>
                        </button>
                        {alert.status === 'ACTIVO' && (
                          <button
                            onClick={() => handleDismissAlert(alert.id)}
                            className="px-3 py-1.5 text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 rounded-lg cursor-pointer"
                          >
                            Reconhecer
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-xs text-zinc-500">
                <span>Total de eventos registados: {capacityAlerts.length}</span>
                <button
                  onClick={() => setIsAlertsDrawerOpen(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Pré-visualização do Modelo de Email Formatado */}
        {previewEmailAlert && (
          <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="bg-zinc-900 border border-zinc-700 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-amber-400" />
                  <span className="font-bold text-white text-sm">
                    Pré-visualização do Email Enviado à Gestão
                  </span>
                </div>
                <button
                  onClick={() => setPreviewEmailAlert(null)}
                  className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Email Envelope Header */}
              <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 font-semibold">De:</span>
                  <span className="text-zinc-300 font-mono">notificacoes@cafedoempreendedor.ao</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 font-semibold">Para:</span>
                  <span className="text-amber-400 font-mono font-bold">{previewEmailAlert.emailRecipient}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 font-semibold">Assunto:</span>
                  <span className="text-white font-bold">{previewEmailAlert.emailSubject}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 font-semibold">Data / Hora:</span>
                  <span className="text-zinc-400 font-mono">{previewEmailAlert.timestamp}</span>
                </div>
              </div>

              {/* Email Body Content */}
              <div className="flex-1 overflow-y-auto bg-zinc-950/80 p-4 rounded-xl border border-zinc-800/80 font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">
                {previewEmailAlert.emailBody}
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                <span className="text-[11px] text-zinc-500">
                  Estado: {previewEmailAlert.emailSent ? 'Despachado com sucesso' : 'Simulação'}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      handleSendAlertEmail(previewEmailAlert.id);
                      setPreviewEmailAlert(null);
                    }}
                    className="px-4 py-2 bg-[#BE123C] hover:bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Reenviar Agora</span>
                  </button>
                  <button
                    onClick={() => setPreviewEmailAlert(null)}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
