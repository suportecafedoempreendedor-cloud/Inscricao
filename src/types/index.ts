export type PaymentStatus = 'PENDENTE' | 'CONFIRMADO' | 'CANCELADO';
export type CheckInStatus = 'PENDENTE' | 'CHECKED_IN';
export type PaymentMethod = 'MULTICAIXA_EXPRESS' | 'REFERENCIA_MULTICAIXA' | 'TRANSFERENCIA_BANCARIA' | 'NO_LOCAL';

export interface EventSettings {
  edition: string;
  title: string;
  tagline: string;
  description: string;
  eventDateText: string;
  eventTimeText: string;
  venueName: string;
  venueAddress: string;
  city: string;
  organizerName: string;
  organizerEmail: string;
  organizerPhone: string;
  organizerWhatsApp: string;
  registrationOpen: boolean;
  statusBadge: string;
  ibanBFA: string;
  ibanBAI: string;
  multicaixaEntidade: string;
  heroAnnouncement: string;
  // Certificate Policy Config
  requireCheckInForCertificate: boolean;
  conferenceCertificatePriceAoa: number;
  authorizedSignatoryName: string;
  authorizedSignatoryRole: string;
}

export interface TicketTier {
  id: string;
  name: string;
  slug: string;
  priceAoa: number;
  lote: string;
  description: string;
  benefits: string[];
  maxCapacity: number;
  soldCount: number;
  isPopular?: boolean;
  colorTheme: string;
  // Certificate & modality properties
  isConference?: boolean;
  certificateIncluded: boolean;
  certificatePriceAoa?: number;
}

export type TicketStatus = 'EMITIDO' | 'UTILIZADO' | 'CANCELADO';
export type DispatchChannel = 'WHATSAPP' | 'EMAIL' | 'AMBOS';
export type DispatchStatus = 'PENDENTE' | 'ENVIADO' | 'ENTREGUE' | 'FALHOU';

export interface TicketDispatch {
  id: string;
  registrationId: string;
  ticketCode: string;
  channel: DispatchChannel;
  recipient: string;
  phone?: string;
  email?: string;
  status: DispatchStatus;
  sentAt: string;
  deliveredAt?: string;
  messageId: string;
  providerName: string;
  errorDetails?: string;
  retryCount: number;
}

export type StaffRole = 'OPERADOR_PORTARIA' | 'SUPERVISOR_CHECKIN' | 'ADMIN';

export interface StaffUser {
  id: string;
  name: string;
  username: string;
  role: StaffRole;
  active: boolean;
  pin: string;
  createdAt: string;
  totalCheckInsValidated: number;
}

export type CheckInValidationResult =
  | 'VALIDO'
  | 'AUTORIZADO'
  | 'AUTORIZACAO_EXCEPCIONAL'
  | 'JA_UTILIZADO'
  | 'INVALIDO'
  | 'PAGAMENTO_PENDENTE'
  | 'CANCELADO';

export interface CheckInRecord {
  id: string;
  registrationId: string;
  ticketCode: string;
  internalControlCode: string;
  participantName: string;
  companyName: string;
  modality: string;
  packageName: string;
  staffUserId: string;
  staffUserName: string;
  timestamp: string;
  result: CheckInValidationResult;
  isOverride?: boolean;
  overrideReason?: string;
  notes?: string;
}

export interface Registration {
  id: string;
  ticketCode: string;
  internalControlCode: string;
  ticketStatus: TicketStatus;
  ticketTierId: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  nif?: string;
  amountAoa: number;
  paymentMethod: PaymentMethod;
  paymentReference: string;
  paymentProofUrl?: string;
  paymentProofName?: string;
  status: PaymentStatus;
  qrCodeData: string;
  checkInStatus: CheckInStatus;
  checkInTime?: string;
  checkedInBy?: string;
  createdAt: string;
  notes?: string;
  // Specific to Conference vs Cafe Experience certificate purchase
  wantsConferenceCertificate?: boolean;
  conferenceCertificatePaid?: boolean;
  conferenceCertificatePaymentRef?: string;
  // Dispatch history
  dispatches?: TicketDispatch[];
}

export interface Certificate {
  id: string;
  registrationId: string;
  ticketCode: string;
  participantName: string;
  companyName: string;
  type: 'CONFERENCIA' | 'CAFE_EXPERIENCE';
  packageName: string;
  edition: string;
  eventDateText: string;
  venueText: string;
  issueDate: string;
  status: 'VALIDO' | 'ANULADO';
  annulledReason?: string;
  downloadCount: number;
  verificationCode: string;
  checkInVerified: boolean;
}

export interface CertificateValidationRecord {
  id: string;
  certificateId: string;
  timestamp: string;
  status: 'VALIDO' | 'ANULADO' | 'INEXISTENTE';
  queriedBy?: string;
}

export interface ConferenceTrack {
  id: string;
  name: string;
  slug: 'recursos-humanos' | 'negocios' | 'marketing' | 'financas';
  shortDesc: string;
  description: string;
  color: string;
  accentColor: string;
  topics: string[];
}

export interface AgendaSession {
  id: string;
  trackSlug: 'recursos-humanos' | 'negocios' | 'marketing' | 'financas' | 'plenaria';
  title: string;
  speakerName: string;
  speakerRole: string;
  speakerCompany: string;
  speakerPhoto?: string;
  startTime: string;
  endTime: string;
  room: string;
  description: string;
  isKeynote?: boolean;
}

export interface Exhibitor {
  id: string;
  companyName: string;
  sector: string;
  description: string;
  standNumber: string;
  logoUrl?: string;
  website?: string;
  email: string;
  phone: string;
  products: string[];
  status: 'APROVADO' | 'PENDENTE' | 'REJEITADO';
  featured?: boolean;
}

export interface PitchEvaluation {
  juryMemberName: string;
  innovation: number;
  feasibility: number;
  market: number;
  revenueModel: number;
  execution: number;
  total: number;
  notes?: string;
}

export interface PitchCandidate {
  id: string;
  projectName: string;
  founderName: string;
  email: string;
  phone: string;
  sector: string;
  problem: string;
  solution: string;
  businessModel: string;
  targetMarket: string;
  investmentRequestedAoa: number;
  pitchDeckUrl?: string;
  videoUrl?: string;
  status: 'PENDENTE' | 'SELECIONADO' | 'APRESENTADO' | 'VENCEDOR' | 'REJEITADO';
  presentationOrder?: number;
  evaluations: PitchEvaluation[];
  averageScore: number;
  rank?: number;
}

export interface Sponsor {
  id: string;
  name: string;
  tier: 'PATROCINADOR_OFICIAL' | 'PATROCINADOR_OURO' | 'PARCEIRO_ESTRATEGICO' | 'APOIO_INSTITUCIONAL' | 'MEDIA_PARTNER';
  description: string;
  website?: string;
  logoUrl?: string;
  benefitsSummary: string;
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  organization: string;
  specialty: string;
  bio: string;
  photoUrl?: string;
  slots: { id: string; time: string; booked: boolean; bookedBy?: string }[];
}

export interface StrategySessionBooking {
  id: string;
  mentorId: string;
  mentorName: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  companyName: string;
  challengesDescription: string;
  slotTime: string;
  createdAt: string;
  status: 'CONFIRMADA' | 'CANCELADA';
}

export interface NetworkingContact {
  id: string;
  name: string;
  role: string;
  company: string;
  sector: string;
  bio: string;
  interests: string[];
  seeking: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  linkedin?: string;
}

export interface GalleryItem {
  id: string;
  edition: string;
  year: string;
  category: 'Palco & Painéis' | 'Networking' | 'Expositores' | 'Pitch Empresarial' | 'Público';
  title: string;
  caption: string;
  imageUrl: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
}

export interface CapacityAlert {
  id: string;
  modality: 'Gratuita' | 'Café Experience';
  tierId?: string;
  tierName?: string;
  occupancyCount: number;
  maxCapacity: number;
  occupancyPercentage: number;
  threshold: number; // 90
  timestamp: string;
  severity: 'ALERTA_90' | 'ESGOTADO_100';
  status: 'ACTIVO' | 'RECONHECIDO' | 'RESOLVIDO';
  emailRecipient: string;
  emailSubject: string;
  emailBody: string;
  emailSent: boolean;
  emailSentAt?: string;
  loggedToAudit: boolean;
  auditLogId?: string;
}
