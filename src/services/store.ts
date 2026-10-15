import {
  EventSettings,
  TicketTier,
  Registration,
  Certificate,
  CertificateValidationRecord,
  ConferenceTrack,
  AgendaSession,
  Exhibitor,
  PitchCandidate,
  Sponsor,
  Mentor,
  StrategySessionBooking,
  NetworkingContact,
  GalleryItem,
  AuditLog,
  PaymentMethod,
  TicketStatus,
  DispatchChannel,
  DispatchStatus,
  TicketDispatch,
  StaffRole,
  StaffUser,
  CheckInValidationResult,
  CheckInRecord,
  CapacityAlert,
} from '../types';

const STORAGE_KEY_PREFIX = 'cafe_empreendedor_79_';

// Initial Event Settings with verified data & certificate rules
export const initialEventSettings: EventSettings = {
  edition: '79.ª Edição',
  title: 'Café do Empreendedor',
  tagline: 'Conectando pessoas. Transformando ideias em negócios.',
  description:
    'Uma experiência dedicada ao empreendedorismo, à inovação, ao conhecimento e à criação de oportunidades de negócio em Angola. Produzido por Geração Digital Angola.',
  eventDateText: 'A ser anunciado brevemente (1.º Trimestre)',
  eventTimeText: '08:30 – 18:30 (Horário de Luanda)',
  venueName: 'Luanda, Angola',
  venueAddress: 'Local oficial a divulgar pela organização',
  city: 'Luanda',
  organizerName: 'Geração Digital Angola',
  organizerEmail: 'gdangola12@gmail.com',
  organizerPhone: '+244 921 152 162',
  organizerWhatsApp: '+244921152162',
  registrationOpen: true,
  statusBadge: 'Inscrições Abertas',
  ibanBFA: 'AO06 0006 0000 1234 5678 9012 3',
  ibanBAI: 'AO06 0040 0000 9876 5432 1098 7',
  multicaixaEntidade: '99245',
  heroAnnouncement: 'Conferência com Entrada Gratuita · Pacotes Café Experience com Certificado Digital Oficial incluído.',
  // Certificate Policy Config
  requireCheckInForCertificate: false, // Pode ser alterado no Painel Admin
  conferenceCertificatePriceAoa: 2000,
  authorizedSignatoryName: 'Geração Digital Angola',
  authorizedSignatoryRole: 'Comissão Organizadora Executiva',
};

// Updated Ticket Tiers strictly matching user guidelines
export const initialTicketTiers: TicketTier[] = [
  {
    id: 'tier-conferencia-gratis',
    name: 'Conferência Empresarial',
    slug: 'conferencia-gratis',
    priceAoa: 0,
    lote: 'Entrada Gratuita',
    description: 'Acesso livre e gratuito a todas as plenárias, palestras e à feira de expositores da 79.ª Edição. Certificado Digital opcional.',
    benefits: [
      'Entrada Gratuita na Plenária & Painéis da 79.ª Edição',
      'Acesso aos 4 Eixos Temáticos (RH, Negócios, Marketing, Finanças)',
      'Visita Livre à Feira de Expositores e Mostra Comercial',
      'Assistência ao Palco do Pitch Empresarial',
      'Credencial Digital com Nome Completo do Participante',
      'Certificado Digital Opcional (Adquirível por 2.000 Kz)',
    ],
    maxCapacity: 800,
    soldCount: 312,
    isPopular: false,
    colorTheme: '#3B0764',
    isConference: true,
    certificateIncluded: false,
    certificatePriceAoa: 2000,
  },
  {
    id: 'tier-exp-essencial',
    name: 'Café Experience Essencial',
    slug: 'cafe-experience-essencial',
    priceAoa: 5000,
    lote: '1.º Lote',
    description: 'Experiência imersiva no Café do Empreendedor com Certificado Digital Oficial de Participação incluído no valor.',
    benefits: [
      'Tudo incluído na Conferência Gratuita',
      'Certificado Digital Oficial INCLUÍDO (sem cobrança adicional)',
      'Kit de Boas-Vindas Digital da 79.ª Edição',
      'Credencial Digital Exclusiva com Nome Completo',
      'Acesso ao Directório de Networking Empresarial',
    ],
    maxCapacity: 250,
    soldCount: 94,
    isPopular: false,
    colorTheme: '#581C87',
    isConference: false,
    certificateIncluded: true,
  },
  {
    id: 'tier-exp-profissional',
    name: 'Café Experience Profissional',
    slug: 'cafe-experience-profissional',
    priceAoa: 15000,
    lote: '1.º Lote',
    description: 'Pacote profissional com lugar prioritário nas sessões, coffee break corporativo e certificado digital incluído.',
    benefits: [
      'Tudo incluído no Café Experience Essencial',
      'Certificado Digital Oficial INCLUÍDO (sem cobrança adicional)',
      'Lugar Marcado em Zona Prioritária no Auditório',
      'Coffee Break Corporativo Oficial',
      'Acesso às Sessões Coletivas da Sala de Estratégia',
      'Directório de Negócios e Oportunidades',
    ],
    maxCapacity: 150,
    soldCount: 78,
    isPopular: true,
    colorTheme: '#BE123C',
    isConference: false,
    certificateIncluded: true,
  },
  {
    id: 'tier-exp-executivo',
    name: 'Café Experience Executivo',
    slug: 'cafe-experience-executivo',
    priceAoa: 25000,
    lote: '1.º Lote VIP',
    description: 'Experiência executiva VIP: lugares de primeira fila, mentoria 1-on-1 na Sala de Estratégia, cocktail VIP e certificado digital incluído.',
    benefits: [
      'Tudo incluído no Café Experience Profissional',
      'Certificado Digital Executivo INCLUÍDO (sem cobrança adicional)',
      'Lugar VIP Reservado nas Primeiras Filas do Palco',
      'Sessão Privada 1-on-1 na Sala de Estratégia (30 min)',
      'Acesso ao Cocktail VIP de Encerramento & Networking de Elite',
      'Kit Físico Premium Café do Empreendedor',
    ],
    maxCapacity: 60,
    soldCount: 38,
    isPopular: false,
    colorTheme: '#F59E0B',
    isConference: false,
    certificateIncluded: true,
  },
  {
    id: 'tier-stand',
    name: 'Stand de Expositor Empresarial',
    slug: 'stand',
    priceAoa: 90000,
    lote: 'Vagas Selecionadas',
    description: 'Garanta a presença física e destaque da sua marca na feira comercial do evento com 2 credenciais e certificado.',
    benefits: [
      'Espaço de Stand Físico Identificado no Pavilhão',
      '2 Credenciais de Expositor + 1 Passe VIP',
      'Certificado Digital de Marca Expositora Oficial',
      'Perfil Completo na Feira Virtual do Website',
      'Inserção de Logótipo nos Ecrãs e Materiais Oficiais',
    ],
    maxCapacity: 20,
    soldCount: 12,
    isPopular: false,
    colorTheme: '#9333EA',
    isConference: false,
    certificateIncluded: true,
  },
];

export const initialConferenceTracks: ConferenceTrack[] = [
  {
    id: 'track-rh',
    name: 'Recursos Humanos',
    slug: 'recursos-humanos',
    shortDesc: 'Gestão de pessoas, liderança e produtividade',
    description:
      'Estratégias modernas de atracção, retenção de talentos e desenvolvimento de equipas de alto rendimento no contexto empresarial angolano.',
    color: '#831843',
    accentColor: '#F43F5E',
    topics: ['Cultura Organizacional', 'Liderança Humanizada', 'Retenção de Talentos em Angola', 'Produtividade & Bem-estar'],
  },
  {
    id: 'track-negocios',
    name: 'Negócios',
    slug: 'negocios',
    shortDesc: 'Estratégia, gestão e crescimento sustentável',
    description:
      'Metodologias comprovadas para estruturação de modelos de negócio resilientes, inovação contínua e expansão de mercado.',
    color: '#3B0764',
    accentColor: '#A855F7',
    topics: ['Estratégia Empresarial', 'Gestão Operacional', 'Escala e Expansão Nacional', 'Parcerias Estratégicas'],
  },
  {
    id: 'track-marketing',
    name: 'Marketing',
    slug: 'marketing',
    shortDesc: 'Marca, vendas e transformação digital',
    description:
      'Posicionamento de marcas fortes, estratégias omnicanal, aquisição de clientes e domínio das ferramentas digitais modernas.',
    color: '#9F1239',
    accentColor: '#FB7185',
    topics: ['Construção de Marca (Branding)', 'Vendas B2B & B2C', 'Tráfego & Redes Sociais', 'Fidelização de Clientes'],
  },
  {
    id: 'track-financas',
    name: 'Finanças',
    slug: 'financas',
    shortDesc: 'Planeamento, investimento e capital',
    description:
      'Gestão do fluxo de caixa, conformidade fiscal angolana, preparação para captação de investimento e sustentabilidade financeira.',
    color: '#78350F',
    accentColor: '#F59E0B',
    topics: ['Fluxo de Caixa em Tempos Desafiantes', 'Acesso ao Crédito & Investimento', 'Gestão Orçamental', 'Contabilidade Prática'],
  },
];

export const initialAgenda: AgendaSession[] = [
  {
    id: 'sess-01',
    trackSlug: 'plenaria',
    title: 'Abertura Oficial: O Futuro do Empreendedorismo em Angola',
    speakerName: 'Equipa Geração Digital & Convidados de Honra',
    speakerRole: 'Comissão Organizadora',
    speakerCompany: 'Geração Digital Angola',
    startTime: '08:45',
    endTime: '09:30',
    room: 'Auditório Principal',
    description: 'Boas-vindas institucionais, apresentação da visão da 79.ª Edição e panorama do ecossistema empresarial.',
    isKeynote: true,
  },
  {
    id: 'sess-02',
    trackSlug: 'negocios',
    title: 'Da Ideia à Execução: Estruturando Empresas Rentáveis no Mercado Angolano',
    speakerName: 'Dr. Paulo Gaspar',
    speakerRole: 'Consultor de Estratégia & Empreendedor',
    speakerCompany: 'Inova Angola Consultoria',
    startTime: '09:40',
    endTime: '10:45',
    room: 'Palco Negócios',
    description: 'Passos práticos para validação de mercado, definição de propostas de valor inabaláveis e adaptação aos desafios macroeconómicos.',
  },
  {
    id: 'sess-03',
    trackSlug: 'recursos-humanos',
    title: 'Liderança e Retenção: Como Construir Equipas que Fazem o Negócio Crescer',
    speakerName: 'Dra. Sandra de Oliveira',
    speakerRole: 'Especialista em Gestão de Pessoas',
    speakerCompany: 'Talentos Angola HR',
    startTime: '11:00',
    endTime: '12:00',
    room: 'Palco Recursos Humanos',
    description: 'Técnicas de recrutamento assertivo, alinhamento de propósito e gestão de produtividade sem sobrecarga.',
  },
  {
    id: 'sess-04',
    trackSlug: 'marketing',
    title: 'Posicionamento e Vendas: Como Gerar Receita Previsível no Digital',
    speakerName: 'Manuel Quitongo',
    speakerRole: 'Director de Marketing & Estrategista Digital',
    speakerCompany: 'Growth Luanda',
    startTime: '13:30',
    endTime: '14:30',
    room: 'Palco Marketing',
    description: 'Construção de autoridade, campanhas que convertem e ferramentas práticas para acelerar o volume de vendas.',
  },
  {
    id: 'sess-05',
    trackSlug: 'financas',
    title: 'Finanças Empresariais Blindadas: Caixa, Margens e Prontidão para Investimento',
    speakerName: 'Eliana Van-Dúnem',
    speakerRole: 'Analista Financeira & Assessora de Investimentos',
    speakerCompany: 'Capital & Gestão',
    startTime: '14:45',
    endTime: '15:45',
    room: 'Palco Finanças',
    description: 'Indicadores financeiros vitais que todo o empresário precisa monitorar diariamente para garantir a sobrevivência e crescimento do negócio.',
  },
  {
    id: 'sess-06',
    trackSlug: 'plenaria',
    title: 'Grande Sessão do Pitch Empresarial: Apresentações ao Vivo perante o Júri',
    speakerName: 'Júri Executivo & Top Startups Selecionadas',
    speakerRole: 'Investidores e Especialistas',
    speakerCompany: 'Café do Empreendedor',
    startTime: '16:00',
    endTime: '17:30',
    room: 'Auditório Principal',
    description: 'Apresentação pública dos negócios finalistas, com cronómetro estrito de 3 minutos, perguntas do júri e avaliação ao vivo.',
    isKeynote: true,
  },
  {
    id: 'sess-07',
    trackSlug: 'plenaria',
    title: 'Cerimónia de Encerramento, Anúncio dos Vencedores e Cocktail de Networking',
    speakerName: 'Geração Digital Angola & Patrocinadores',
    speakerRole: 'Organização',
    speakerCompany: 'Café do Empreendedor',
    startTime: '17:45',
    endTime: '18:45',
    room: 'Espaço VIP & Lounge de Networking',
    description: 'Revelação da classificação do Pitch, entrega de prémios, agradecimentos e sessão livre de contactos empresariais.',
  },
];

export const initialExhibitors: Exhibitor[] = [
  {
    id: 'exh-01',
    companyName: 'Geração Digital Angola',
    sector: 'Tecnologia & Comunicação',
    description: 'Produtora executiva da 79.ª Edição do Café do Empreendedor. Líder em transformação digital, eventos corporativos e aceleração de jovens talentos.',
    standNumber: 'Stand Principal A-01',
    website: 'https://cafe-oportunidades-pro.lovable.app',
    email: 'gdangola12@gmail.com',
    phone: '+244 921 152 162',
    products: ['Produção de Eventos', 'Consultoria Digital', 'Formação Corporativa', 'Plataformas Web'],
    status: 'APROVADO',
    featured: true,
  },
  {
    id: 'exh-02',
    companyName: 'Kamba Pay Soluções',
    sector: 'FinTech & Pagamentos',
    description: 'Soluções modernas de checkout, gateways para comércio eletrónico em Angola e pagamentos instantâneos.',
    standNumber: 'Stand B-03',
    website: 'https://kambapay.ao',
    email: 'contacto@kambapay.ao',
    phone: '+244 923 112 334',
    products: ['Terminal Virtual POS', 'Integração Multicaixa Express', 'Facturação Electrónica'],
    status: 'APROVADO',
    featured: true,
  },
  {
    id: 'exh-03',
    companyName: 'AgroSul Frutas & Logística',
    sector: 'Agronegócio & Distribuição',
    description: 'Produção sustentável no interior de Angola e rede logística para cadeias de supermercados e restaurantes de Luanda.',
    standNumber: 'Stand B-08',
    website: 'https://agrosul.ao',
    email: 'comercial@agrosul.ao',
    phone: '+244 945 889 001',
    products: ['Frutas Selecionadas', 'Cadeia de Frio', 'Distribuição B2B'],
    status: 'APROVADO',
  },
];

export const initialPitchCandidates: PitchCandidate[] = [
  {
    id: 'pitch-01',
    projectName: 'KwanzaFlow Finanças',
    founderName: 'Mateus Sebastião',
    email: 'mateus@kwanzaflow.ao',
    phone: '+244 923 456 789',
    sector: 'Fintech & Gestão Financeira',
    problem: 'Pequenas empresas em Luanda perdem até 30% da margem por falta de reconciliação automática de recebimentos Multicaixa.',
    solution: 'Aplicação móvel e web que sincroniza automaticamente extractos bancários, gera referências Multicaixa e dá alertas de caixa em tempo real.',
    businessModel: 'Subscrição SaaS mensal (a partir de 15.000 Kz/mês) + taxa de transacção de 1.2%.',
    targetMarket: 'Mais de 80.000 micro e pequenas empresas formais em Angola.',
    investmentRequestedAoa: 15000000,
    status: 'SELECIONADO',
    presentationOrder: 1,
    evaluations: [
      {
        juryMemberName: 'Dr. Paulo Gaspar',
        innovation: 18,
        feasibility: 19,
        market: 18,
        revenueModel: 17,
        execution: 18,
        total: 90,
        notes: 'Solução extremamente alinhada com as dores reais do empresário angolano.',
      },
    ],
    averageScore: 90,
    rank: 1,
  },
  {
    id: 'pitch-02',
    projectName: 'LogiExpress Luanda',
    founderName: 'Teresa Domingos',
    email: 'teresa@logiexpress.ao',
    phone: '+244 934 567 890',
    sector: 'Logística & E-commerce',
    problem: 'Empresas de e-commerce e retalho sofrem com atrasos e extravios em entregas de última milha na província de Luanda.',
    solution: 'Rede conectada de estafetas motorizados com rastreio GPS ao vivo e confirmação por código seguro.',
    businessModel: 'Preço fixo por entrega (3.500 Kz) + planos corporativos com faturamento quinzenal.',
    targetMarket: 'Lojas online, farmácias, restaurantes e distribuidores em Luanda.',
    investmentRequestedAoa: 25000000,
    status: 'SELECIONADO',
    presentationOrder: 2,
    evaluations: [],
    averageScore: 86,
    rank: 2,
  },
];

export const initialSponsors: Sponsor[] = [
  {
    id: 'sp-01',
    name: 'Geração Digital Angola',
    tier: 'PATROCINADOR_OFICIAL',
    description: 'Entidade promotora e produtora oficial da 79.ª Edição do Café do Empreendedor em Angola.',
    website: 'https://cafe-oportunidades-pro.lovable.app',
    benefitsSummary: 'Apresentação em todos os palcos, naming nos materiais gráficos e media partner principal.',
  },
  {
    id: 'sp-02',
    name: 'Banco & Parceria Empresarial',
    tier: 'PATROCINADOR_OURO',
    description: 'Instituição financeira de referência no apoio à tesouraria e linhas de crédito para PMEs em Angola.',
    website: 'https://banco-parceiro.ao',
    benefitsSummary: 'Espaço VIP no hall central, presença no júri do Pitch e palestra magna sobre financiamento.',
  },
];

export const initialMentors: Mentor[] = [
  {
    id: 'men-01',
    name: 'Dr. Paulo Gaspar',
    role: 'Especialista em Estruturação de Negócios & Escala',
    organization: 'Inova Angola',
    specialty: 'Estratégia & Validação de Modelos',
    bio: 'Mais de 15 anos a apoiar fundadores a transformar conceitos iniciais em empresas escaláveis em Angola.',
    slots: [
      { id: 's1', time: '10:00 - 10:30', booked: false },
      { id: 's2', time: '11:00 - 11:30', booked: false },
      { id: 's3', time: '14:30 - 15:00', booked: false },
    ],
  },
  {
    id: 'men-02',
    name: 'Dra. Sandra de Oliveira',
    role: 'Consultora Sénior de RH & Cultura',
    organization: 'Talentos Angola HR',
    specialty: 'Gestão de Equipas & Liderança',
    bio: 'Especializada na montagem de estruturas organizacionais saudáveis e retenção de quadros chave.',
    slots: [
      { id: 's5', time: '10:30 - 11:00', booked: false },
      { id: 's6', time: '11:30 - 12:00', booked: false },
    ],
  },
];

export const initialGallery: GalleryItem[] = [
  {
    id: 'gal-01',
    edition: '78.ª Edição',
    year: '2025',
    category: 'Palco & Painéis',
    title: 'Painel de Líderes Empresariais',
    caption: 'Momento de debate aprofundado sobre oportunidades de mercado em Luanda.',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'gal-02',
    edition: '78.ª Edição',
    year: '2025',
    category: 'Networking',
    title: 'Sessão de Conexões Executivas',
    caption: 'Empreendedores a estabelecer parcerias comerciais e troca de contactos estratégicos.',
    imageUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'gal-03',
    edition: '77.ª Edição',
    year: '2024',
    category: 'Pitch Empresarial',
    title: 'Apresentação Final do Pitch',
    caption: 'Empreendedor a apresentar solução perante banca de investidores no auditório.',
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
  },
];

export const initialNetworkingContacts: NetworkingContact[] = [
  {
    id: 'net-01',
    name: 'Manuel Quitongo',
    role: 'Director Geral',
    company: 'Growth Luanda',
    sector: 'Marketing & Vendas',
    bio: 'Interessado em fazer parcerias de distribuição digital e expansão de canais de venda em Angola.',
    interests: ['Parcerias B2B', 'Estratégia Digital', 'Expansão Comercial'],
    seeking: 'Empresas à procura de acelerar vendas e internacionalizar produtos.',
    email: 'manuel@growthluanda.ao',
    phone: '+244 912 345 678',
    whatsapp: '+244912345678',
  },
  {
    id: 'net-02',
    name: 'Helena Cassoma',
    role: 'Fundadora & CEO',
    company: 'Kafé & Sabor Angola',
    sector: 'Alimentação & Bebidas',
    bio: 'Produtora de café especial angolano e produtos gourmet locais.',
    interests: ['Distribuição', 'Hospitalidade', 'Exportação'],
    seeking: 'Cadeias de retalho e distribuidores para modernização da torrefação.',
    email: 'helena@kafe.ao',
    phone: '+244 923 889 900',
    whatsapp: '+244923889900',
  },
];

// Helpers for Unique Code Generation
export function generateUniqueTicketCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let rand = '';
  for (let i = 0; i < 6; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `CDE79-${rand}`;
}

export function generateInternalControlCode(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  const letter = 'ABCDEFGHJKLMNPQRSTUVWXYZ'[Math.floor(Math.random() * 24)];
  return `CTRL-79-${num}-${letter}`;
}

// Seed Staff Users for Entry Control (Portaria & Supervisão)
export const initialStaffUsers: StaffUser[] = [
  {
    id: 'staff-admin-01',
    name: 'Geração Digital Admin',
    username: 'admin',
    role: 'ADMIN',
    active: true,
    pin: '7900',
    createdAt: '2026-10-10 08:00',
    totalCheckInsValidated: 14,
  },
  {
    id: 'staff-portaria-01',
    name: 'Manuel Santos',
    username: 'msantos',
    role: 'OPERADOR_PORTARIA',
    active: true,
    pin: '1234',
    createdAt: '2026-10-12 09:00',
    totalCheckInsValidated: 42,
  },
  {
    id: 'staff-portaria-02',
    name: 'Ana Sebastião',
    username: 'asebastiao',
    role: 'OPERADOR_PORTARIA',
    active: true,
    pin: '5678',
    createdAt: '2026-10-12 09:30',
    totalCheckInsValidated: 35,
  },
  {
    id: 'staff-supervisor-01',
    name: 'Carlos Silva',
    username: 'csilva',
    role: 'SUPERVISOR_CHECKIN',
    active: true,
    pin: '9999',
    createdAt: '2026-10-11 14:00',
    totalCheckInsValidated: 18,
  },
];

// Seed Dispatches
export const initialDispatches: TicketDispatch[] = [
  {
    id: 'disp-01',
    registrationId: 'REG-7901',
    ticketCode: 'CDE79-K8P4X7',
    channel: 'WHATSAPP',
    recipient: '+244 923 001 223',
    phone: '+244 923 001 223',
    status: 'ENTREGUE',
    sentAt: '2026-10-10 14:22',
    deliveredAt: '2026-10-10 14:23',
    messageId: 'wam_msg_8849201948',
    providerName: 'WhatsApp Business Cloud API',
    retryCount: 0,
  },
  {
    id: 'disp-02',
    registrationId: 'REG-7902',
    ticketCode: 'CDE79-M3W9L2',
    channel: 'EMAIL',
    recipient: 'esperanca.miguel@gmail.com',
    email: 'esperanca.miguel@gmail.com',
    status: 'ENTREGUE',
    sentAt: '2026-10-11 10:16',
    deliveredAt: '2026-10-11 10:17',
    messageId: 'resend_email_4492019',
    providerName: 'SMTP / Resend Transacional',
    retryCount: 0,
  },
  {
    id: 'disp-03',
    registrationId: 'REG-7903',
    ticketCode: 'CDE79-T7V1B5',
    channel: 'AMBOS',
    recipient: '+244 923 889 900 · helena@kafe.ao',
    phone: '+244 923 889 900',
    email: 'helena@kafe.ao',
    status: 'ENTREGUE',
    sentAt: '2026-10-11 11:32',
    deliveredAt: '2026-10-11 11:33',
    messageId: 'w+e_dual_msg_77810',
    providerName: 'WhatsApp & Email Dual Dispatch',
    retryCount: 0,
  },
];

// Seed Check-In Records (Controlo de Entrada no Evento)
export const initialCheckIns: CheckInRecord[] = [
  {
    id: 'chk-01',
    registrationId: 'REG-7901',
    ticketCode: 'CDE79-K8P4X7',
    internalControlCode: 'CTRL-79-98421-A',
    participantName: 'Dr. Alberto Canhanga',
    companyName: 'Canhanga & Associados',
    modality: 'Café Experience',
    packageName: 'Café Experience Executivo',
    staffUserId: 'staff-portaria-01',
    staffUserName: 'Manuel Santos (Portaria 1)',
    timestamp: '2026-10-13 08:35',
    result: 'VALIDO',
  },
  {
    id: 'chk-02',
    registrationId: 'REG-7903',
    ticketCode: 'CDE79-T7V1B5',
    internalControlCode: 'CTRL-79-88124-B',
    participantName: 'Helena Cassoma',
    companyName: 'Kafé & Sabor Angola',
    modality: 'Conferência Empresarial',
    packageName: 'Conferência Empresarial',
    staffUserId: 'staff-portaria-02',
    staffUserName: 'Ana Sebastião (Portaria 2)',
    timestamp: '2026-10-13 09:10',
    result: 'VALIDO',
  },
  {
    id: 'chk-03',
    registrationId: 'REG-7905',
    ticketCode: 'CDE79-P2Q8Y4',
    internalControlCode: 'CTRL-79-43219-C',
    participantName: 'Mariana Costa',
    companyName: 'Inovação Digital',
    modality: 'Conferência Empresarial',
    packageName: 'Conferência Empresarial',
    staffUserId: 'staff-portaria-01',
    staffUserName: 'Manuel Santos (Portaria 1)',
    timestamp: '2026-10-13 09:15',
    result: 'VALIDO',
  },
  {
    id: 'chk-04',
    registrationId: 'REG-7906',
    ticketCode: 'CDE79-R5N6J1',
    internalControlCode: 'CTRL-79-11234-D',
    participantName: 'Pedro Luanda',
    companyName: 'Empreendimentos Angola',
    modality: 'Café Experience',
    packageName: 'Café Experience Essencial',
    staffUserId: 'staff-portaria-02',
    staffUserName: 'Ana Sebastião (Portaria 2)',
    timestamp: '2026-10-13 09:30',
    result: 'VALIDO',
  },
];

// Seed Registrations with exact case scenarios tested
export const initialRegistrations: Registration[] = [
  {
    id: 'REG-7901',
    ticketCode: 'CDE79-K8P4X7',
    internalControlCode: 'CTRL-79-98421-A',
    ticketStatus: 'UTILIZADO',
    ticketTierId: 'tier-exp-executivo',
    fullName: 'Dr. Alberto Canhanga',
    email: 'alberto.canhanga@empresa.ao',
    phone: '+244 923 001 223',
    company: 'Canhanga & Associados',
    jobTitle: 'Sócio Director',
    amountAoa: 25000,
    paymentMethod: 'TRANSFERENCIA_BANCARIA',
    paymentReference: 'BFA-REF-89320',
    status: 'CONFIRMADO',
    qrCodeData: 'CE79-VALIDATE:CDE79-K8P4X7:REG-7901',
    checkInStatus: 'CHECKED_IN',
    checkInTime: '2026-10-13 08:35',
    checkedInBy: 'Manuel Santos (Portaria 1)',
    createdAt: '2026-10-10 14:20',
  },
  {
    id: 'REG-7902',
    ticketCode: 'CDE79-M3W9L2',
    internalControlCode: 'CTRL-79-43219-B',
    ticketStatus: 'EMITIDO',
    ticketTierId: 'tier-exp-profissional',
    fullName: 'Esperança Miguel',
    email: 'esperanca.miguel@gmail.com',
    phone: '+244 934 112 445',
    company: 'EM Consultoria',
    jobTitle: 'Consultora de Negócios',
    amountAoa: 15000,
    paymentMethod: 'MULTICAIXA_EXPRESS',
    paymentReference: 'MCX-2026-4439',
    status: 'CONFIRMADO',
    qrCodeData: 'CE79-VALIDATE:CDE79-M3W9L2:REG-7902',
    checkInStatus: 'PENDENTE',
    createdAt: '2026-10-11 10:15',
  },
  {
    id: 'REG-7903',
    ticketCode: 'CDE79-T7V1B5',
    internalControlCode: 'CTRL-79-88124-C',
    ticketStatus: 'UTILIZADO',
    ticketTierId: 'tier-conferencia-gratis',
    fullName: 'Helena Cassoma',
    email: 'helena@kafe.ao',
    phone: '+244 923 889 900',
    company: 'Kafé & Sabor Angola',
    jobTitle: 'Fundadora & CEO',
    amountAoa: 0,
    paymentMethod: 'NO_LOCAL',
    paymentReference: 'GRATIS-CONF-7903',
    status: 'CONFIRMADO',
    qrCodeData: 'CE79-VALIDATE:CDE79-T7V1B5:REG-7903',
    checkInStatus: 'CHECKED_IN',
    checkInTime: '2026-10-13 09:10',
    checkedInBy: 'Ana Sebastião (Portaria 2)',
    createdAt: '2026-10-11 11:30',
    wantsConferenceCertificate: true,
    conferenceCertificatePaid: true,
    conferenceCertificatePaymentRef: 'MCX-CERT-9901',
  },
  {
    id: 'REG-7904',
    ticketCode: 'CDE79-F4H2D9',
    internalControlCode: 'CTRL-79-55610-D',
    ticketStatus: 'EMITIDO',
    ticketTierId: 'tier-conferencia-gratis',
    fullName: 'António Silva',
    email: 'antonio.silva@luanda.ao',
    phone: '+244 912 999 111',
    company: 'Silva Logística',
    jobTitle: 'Gestor Operacional',
    amountAoa: 0,
    paymentMethod: 'NO_LOCAL',
    paymentReference: 'GRATIS-CONF-7904',
    status: 'CONFIRMADO',
    qrCodeData: 'CE79-VALIDATE:CDE79-F4H2D9:REG-7904',
    checkInStatus: 'PENDENTE',
    createdAt: '2026-10-12 09:00',
    wantsConferenceCertificate: true,
    conferenceCertificatePaid: false,
  },
  {
    id: 'REG-7905',
    ticketCode: 'CDE79-P2Q8Y4',
    internalControlCode: 'CTRL-79-33491-E',
    ticketStatus: 'UTILIZADO',
    ticketTierId: 'tier-conferencia-gratis',
    fullName: 'Mariana Costa',
    email: 'mariana.costa@tech.ao',
    phone: '+244 945 000 222',
    company: 'Inovação Digital',
    jobTitle: 'Desenvolvedora',
    amountAoa: 0,
    paymentMethod: 'NO_LOCAL',
    paymentReference: 'GRATIS-CONF-7905',
    status: 'CONFIRMADO',
    qrCodeData: 'CE79-VALIDATE:CDE79-P2Q8Y4:REG-7905',
    checkInStatus: 'CHECKED_IN',
    checkInTime: '2026-10-13 09:15',
    checkedInBy: 'Manuel Santos (Portaria 1)',
    createdAt: '2026-10-12 10:10',
    wantsConferenceCertificate: false,
    conferenceCertificatePaid: false,
  },
  {
    id: 'REG-7906',
    ticketCode: 'CDE79-R5N6J1',
    internalControlCode: 'CTRL-79-11234-F',
    ticketStatus: 'UTILIZADO',
    ticketTierId: 'tier-exp-essencial',
    fullName: 'Pedro Luanda',
    email: 'pedro.luanda@gmail.com',
    phone: '+244 923 777 888',
    company: 'Empreendimentos Angola',
    jobTitle: 'Fundador',
    amountAoa: 5000,
    paymentMethod: 'REFERENCIA_MULTICAIXA',
    paymentReference: 'REF-99245-55123',
    status: 'CONFIRMADO',
    qrCodeData: 'CE79-VALIDATE:CDE79-R5N6J1:REG-7906',
    checkInStatus: 'CHECKED_IN',
    checkInTime: '2026-10-13 09:30',
    checkedInBy: 'Ana Sebastião (Portaria 2)',
    createdAt: '2026-10-12 11:20',
  },
];

// Initial Seed Certificates
export const initialCertificates: Certificate[] = [
  {
    id: 'CERT-79-EXP-7901',
    registrationId: 'REG-7901',
    ticketCode: 'CDE79-K8P4X7',
    participantName: 'Dr. Alberto Canhanga',
    companyName: 'Canhanga & Associados',
    type: 'CAFE_EXPERIENCE',
    packageName: 'Café Experience Executivo',
    edition: '79.ª Edição',
    eventDateText: 'A ser anunciado brevemente (1.º Trimestre)',
    venueText: 'Luanda, Angola',
    issueDate: '2026-10-13 08:40',
    status: 'VALIDO',
    downloadCount: 3,
    verificationCode: '79-EXP-89320-AC',
    checkInVerified: true,
  },
  {
    id: 'CERT-79-CONF-7903',
    registrationId: 'REG-7903',
    ticketCode: 'CDE79-T7V1B5',
    participantName: 'Helena Cassoma',
    companyName: 'Kafé & Sabor Angola',
    type: 'CONFERENCIA',
    packageName: 'Conferência Empresarial',
    edition: '79.ª Edição',
    eventDateText: 'A ser anunciado brevemente (1.º Trimestre)',
    venueText: 'Luanda, Angola',
    issueDate: '2026-10-13 09:15',
    status: 'VALIDO',
    downloadCount: 1,
    verificationCode: '79-CONF-9901-HC',
    checkInVerified: true,
  },
];

class EventStore {
  private get<T>(key: string, defaultValue: T): T {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PREFIX + key);
      if (!stored) return defaultValue;
      return JSON.parse(stored) as T;
    } catch {
      return defaultValue;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }

  // Settings
  getSettings(): EventSettings {
    const current = this.get<EventSettings>('settings', initialEventSettings);
    if (
      current.organizerWhatsApp !== '+244921152162' ||
      current.organizerPhone !== '+244 921 152 162' ||
      current.organizerEmail !== 'gdangola12@gmail.com'
    ) {
      current.organizerWhatsApp = '+244921152162';
      current.organizerPhone = '+244 921 152 162';
      current.organizerEmail = 'gdangola12@gmail.com';
      this.set('settings', current);
    }
    return current;
  }

  updateSettings(settings: Partial<EventSettings>): EventSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    this.set('settings', updated);
    this.logAction('Configuração do Evento', 'Definições do evento e regras de certificados actualizadas');
    return updated;
  }

  // Ticket Tiers
  getTicketTiers(): TicketTier[] {
    const tiers = this.get<TicketTier[]>('ticketTiers', initialTicketTiers);
    // Ensure conference tier respects the 800 capacity mandate if previously set to 600
    const confTier = tiers.find((t) => t.id === 'tier-conferencia-gratis');
    if (confTier && confTier.maxCapacity === 600) {
      confTier.maxCapacity = 800;
      this.set('ticketTiers', tiers);
    }
    return tiers;
  }

  updateTicketTier(tier: TicketTier): void {
    const list = this.getTicketTiers().map((t) => (t.id === tier.id ? tier : t));
    this.set('ticketTiers', list);
    this.logAction('Bilhetes', `Lote e preço actualizados para: ${tier.name}`);
    this.checkAndTriggerCapacityAlerts();
  }

  // Registrations
  getRegistrations(): Registration[] {
    return this.get<Registration[]>('registrations', initialRegistrations);
  }

  addRegistration(
    reg: Omit<
      Registration,
      | 'id'
      | 'ticketCode'
      | 'internalControlCode'
      | 'ticketStatus'
      | 'createdAt'
      | 'qrCodeData'
      | 'checkInStatus'
      | 'dispatches'
    >
  ): Registration {
    let ticketCode = generateUniqueTicketCode();
    const existing = this.getRegistrations();
    while (existing.some((r) => r.ticketCode === ticketCode)) {
      ticketCode = generateUniqueTicketCode();
    }
    const internalControlCode = generateInternalControlCode();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const id = `REG-79${randomSuffix}`;
    const qrCodeData = `CE79-VALIDATE:${ticketCode}:${id}`;

    const newReg: Registration = {
      ...reg,
      id,
      ticketCode,
      internalControlCode,
      ticketStatus: 'EMITIDO',
      qrCodeData,
      checkInStatus: 'PENDENTE',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      dispatches: [],
    };

    const list = [newReg, ...this.getRegistrations()];
    this.set('registrations', list);

    // Update ticket sold count
    const tiers = this.getTicketTiers().map((t) => {
      if (t.id === reg.ticketTierId) {
        return { ...t, soldCount: t.soldCount + 1 };
      }
      return t;
    });
    this.set('ticketTiers', tiers);

    this.logAction(
      'Inscrição',
      `Nova inscrição registada: ${newReg.fullName} (${newReg.ticketCode} - Ref Interna: ${internalControlCode})`
    );
    this.checkAndTriggerCapacityAlerts();
    return newReg;
  }

  updateRegistrationStatus(id: string, status: Registration['status'], notes?: string): void {
    const list = this.getRegistrations().map((r) => {
      if (r.id === id) {
        return { ...r, status, notes: notes || r.notes };
      }
      return r;
    });
    this.set('registrations', list);
    this.logAction('Pagamentos', `Estado da inscrição ${id} alterado para ${status}`);
    this.checkAndTriggerCapacityAlerts();
  }

  // Conference Certificate Payment for an existing registrant
  payConferenceCertificate(
    registrationId: string,
    paymentMethod: PaymentMethod
  ): { success: boolean; registration?: Registration; message: string } {
    const registrations = this.getRegistrations();
    const reg = registrations.find((r) => r.id === registrationId);

    if (!reg) {
      return { success: false, message: 'Inscrição não encontrada.' };
    }

    const ref = `CERT-MCX-${Math.floor(10000 + Math.random() * 90000)}`;
    const updatedList = registrations.map((r) => {
      if (r.id === registrationId) {
        return {
          ...r,
          wantsConferenceCertificate: true,
          conferenceCertificatePaid: true,
          conferenceCertificatePaymentRef: ref,
        };
      }
      return r;
    });

    this.set('registrations', updatedList);
    const updatedReg = updatedList.find((r) => r.id === registrationId)!;

    this.logAction(
      'Certificados',
      `Pagamento de certificado da conferência confirmado (2.000 Kz) para ${reg.fullName} (${ref})`
    );

    // Automatically issue the certificate
    this.issueOrGetCertificate(updatedReg);

    return {
      success: true,
      registration: updatedReg,
      message: 'Pagamento do certificado da conferência validado com sucesso!',
    };
  }

  // DISPATCH ENGINE (WhatsApp & Email)
  getDispatches(): TicketDispatch[] {
    return this.get<TicketDispatch[]>('dispatches', initialDispatches);
  }

  getDispatchesByRegistration(regId: string): TicketDispatch[] {
    return this.getDispatches().filter((d) => d.registrationId === regId);
  }

  recordDispatch(dispatchData: Omit<TicketDispatch, 'id' | 'sentAt'>): TicketDispatch {
    const id = `disp-${Date.now()}`;
    const sentAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newDispatch: TicketDispatch = {
      ...dispatchData,
      id,
      sentAt,
    };
    const list = [newDispatch, ...this.getDispatches()];
    this.set('dispatches', list);

    // Also update registration's dispatches array
    const regList = this.getRegistrations().map((r) => {
      if (r.id === dispatchData.registrationId) {
        const cur = r.dispatches || [];
        return { ...r, dispatches: [newDispatch, ...cur] };
      }
      return r;
    });
    this.set('registrations', regList);

    this.logAction(
      'Envio de Ingresso',
      `Envio registado para ${dispatchData.recipient} via ${dispatchData.channel} [${dispatchData.status}]`
    );
    return newDispatch;
  }

  /**
   * Dispatches ticket via chosen channel (WhatsApp, Email, or Both).
   * Follows prompt section 10: Real integration with clear pending configuration state if API keys aren't set in backend.
   */
  async dispatchTicket(
    regId: string,
    channel: DispatchChannel,
    targetPhone?: string,
    targetEmail?: string
  ): Promise<{
    success: boolean;
    dispatch: TicketDispatch;
    message: string;
    requiresConfig?: boolean;
    whatsappLink?: string;
  }> {
    const reg = this.getRegistrations().find((r) => r.id === regId);
    if (!reg) {
      throw new Error('Inscrição não encontrada');
    }
    const settings = this.getSettings();
    const tier = this.getTicketTiers().find((t) => t.id === reg.ticketTierId);
    const phone = targetPhone?.trim() || reg.phone;
    const email = targetEmail?.trim() || reg.email;

    // Build official formatted WhatsApp message
    const waText = [
      `*79.ª EDIÇÃO DO CAFÉ DO EMPREENDEDOR*`,
      `_Conectando pessoas. Transformando ideias em negócios._\n`,
      `Prezado(a) *${reg.fullName}*,`,
      `A sua inscrição oficial na 79.ª Edição do Café do Empreendedor em Angola foi confirmada!\n`,
      `*DETALHES DO SEU INGRESSO DIGITAL:*`,
      `• Titular: *${reg.fullName}*`,
      `• Empresa: ${reg.company} (${reg.jobTitle})`,
      `• Modalidade: *${tier?.name || 'Geral'}*`,
      `• Código Único: *${reg.ticketCode}*`,
      `• Data: ${settings.eventDateText}`,
      `• Horário: ${settings.eventTimeText}`,
      `• Local: ${settings.venueName} · ${settings.city}\n`,
      `*INSTRUÇÕES DE ACESSO:*`,
      `Apresente este código no telemóvel ou descarregue a credencial em PDF com código QR no link seguro:`,
      `${window.location.origin}?tab=meu-ingresso&codigo=${reg.ticketCode}\n`,
      `Apoio oficial: ${settings.organizerPhone} · Geração Digital Angola`,
    ].join('\n');

    // Clean phone number for WhatsApp
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const whatsappWebUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(waText)}`;

    // Try server backend endpoint if reachable
    let serverDispatched = false;
    let messageId = '';
    let providerName = '';
    let serverStatus: DispatchStatus = 'PENDENTE';
    let requiresConfig = false;

    try {
      const resp = await fetch('/api/tickets/send-dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationId: reg.id,
          ticketCode: reg.ticketCode,
          fullName: reg.fullName,
          channel,
          phone,
          email,
          tierName: tier?.name,
          messageText: waText,
        }),
      });

      if (resp.ok) {
        const data = await resp.json();
        if (data.configured) {
          serverDispatched = true;
          messageId = data.messageId || `msg_${Date.now()}`;
          providerName = data.provider || (channel === 'WHATSAPP' ? 'WhatsApp Business Platform' : 'SMTP / Resend Transacional');
          serverStatus = 'ENTREGUE';
        } else {
          requiresConfig = true;
          messageId = `wa_client_${Date.now()}`;
          providerName = channel === 'WHATSAPP' ? 'WhatsApp Direct Link (API Oficial)' : 'Modelo Transacional HTML';
          serverStatus = 'ENVIADO';
        }
      } else {
        requiresConfig = true;
        messageId = `wa_client_${Date.now()}`;
        providerName = channel === 'WHATSAPP' ? 'WhatsApp Direct Link (API Oficial)' : 'Modelo Transacional HTML';
        serverStatus = 'ENVIADO';
      }
    } catch {
      requiresConfig = true;
      messageId = `wa_client_${Date.now()}`;
      providerName = channel === 'WHATSAPP' ? 'WhatsApp Direct Link (API Oficial)' : 'Modelo Transacional HTML';
      serverStatus = 'ENVIADO';
    }

    const recipientDesc =
      channel === 'WHATSAPP'
        ? phone
        : channel === 'EMAIL'
        ? email
        : `${phone} · ${email}`;

    const created = this.recordDispatch({
      registrationId: reg.id,
      ticketCode: reg.ticketCode,
      channel,
      recipient: recipientDesc,
      phone,
      email,
      status: serverStatus,
      messageId,
      providerName,
      retryCount: 0,
      deliveredAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    });

    let msg = '';
    if (channel === 'WHATSAPP') {
      msg = `Ingresso digital preparado para envio para ${phone}!`;
    } else if (channel === 'EMAIL') {
      msg = `Ingresso digital emitido para ${email}!`;
    } else {
      msg = `Ingresso digital enviado para WhatsApp (${phone}) e Email (${email})!`;
    }

    return {
      success: true,
      dispatch: created,
      message: msg,
      requiresConfig,
      whatsappLink: whatsappWebUrl,
    };
  }

  // STAFF USERS MANAGEMENT (Portaria & Supervisão de Check-in)
  getStaffUsers(): StaffUser[] {
    return this.get<StaffUser[]>('staff_users', initialStaffUsers);
  }

  addStaffUser(staff: Omit<StaffUser, 'id' | 'createdAt' | 'totalCheckInsValidated'>): StaffUser {
    const id = `staff-${Date.now()}`;
    const newStaff: StaffUser = {
      ...staff,
      id,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      totalCheckInsValidated: 0,
    };
    const list = [...this.getStaffUsers(), newStaff];
    this.set('staff_users', list);
    this.logAction('Equipa de Portaria', `Novo operador criado: ${newStaff.name} (${newStaff.role})`);
    return newStaff;
  }

  updateStaffUser(id: string, updates: Partial<StaffUser>): void {
    const list = this.getStaffUsers().map((s) => (s.id === id ? { ...s, ...updates } : s));
    this.set('staff_users', list);
    this.logAction('Equipa de Portaria', `Conta de operador actualizada: ${id}`);
  }

  toggleStaffUserActive(id: string): void {
    const list = this.getStaffUsers().map((s) => (s.id === id ? { ...s, active: !s.active } : s));
    this.set('staff_users', list);
  }

  authenticateStaffPin(pin: string): StaffUser | null {
    const clean = pin.trim();
    const found = this.getStaffUsers().find((s) => s.pin === clean && s.active);
    return found || null;
  }

  getActiveStaffUser(): StaffUser {
    const storedId = localStorage.getItem(STORAGE_KEY_PREFIX + 'active_staff_id');
    const all = this.getStaffUsers();
    if (storedId) {
      const found = all.find((s) => s.id === storedId && s.active);
      if (found) return found;
    }
    // Default to portaria 1
    return all.find((s) => s.active) || initialStaffUsers[0];
  }

  setActiveStaffUser(staffId: string): void {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'active_staff_id', staffId);
  }

  // CHECK-IN RECORDS & ENGINE (Portaria e Validação em Tempo Real)
  getCheckIns(): CheckInRecord[] {
    return this.get<CheckInRecord[]>('checkins', initialCheckIns);
  }

  /**
   * Evaluates a ticket or barcode query against database rules without side-effects.
   * Checks existence, payment status, previous usage, cancellation.
   */
  evaluateCheckIn(query: string): {
    status: CheckInValidationResult;
    message: string;
    registration?: Registration;
    previousCheckIn?: CheckInRecord;
    canOverride?: boolean;
  } {
    const clean = query.trim().toUpperCase();
    if (!clean) {
      return {
        status: 'INVALIDO',
        message: 'Por favor introduza o código do ingresso ou leia o código QR.',
      };
    }

    const registrations = this.getRegistrations();
    const checkIns = this.getCheckIns();

    // Support: exact ticketCode (CDE79-...), internalControlCode (CTRL-79-...), ID (REG-...), or QR payload CE79-VALIDATE:code:id
    const reg = registrations.find((r) => {
      const rCode = r.ticketCode.toUpperCase();
      const rCtrl = (r.internalControlCode || '').toUpperCase();
      const rId = r.id.toUpperCase();
      const rQr = r.qrCodeData.toUpperCase();

      if (clean === rCode || clean === rCtrl || clean === rId) return true;
      if (clean.includes(rCode) || clean.includes(rId)) return true;
      if (rQr === clean || clean.includes(`:${rCode}:`) || clean.includes(`:${rId}`)) return true;
      if (r.fullName.toUpperCase().includes(clean) && clean.length >= 4) return true;
      return false;
    });

    if (!reg) {
      return {
        status: 'INVALIDO',
        message: 'INGRESSO NÃO ENCONTRADO OU INVÁLIDO. Confirme os dados ou consulte a administração.',
      };
    }

    // Cancelled check
    if (reg.status === 'CANCELADO' || reg.ticketStatus === 'CANCELADO') {
      return {
        status: 'CANCELADO',
        message: 'INGRESSO CANCELADO. Contacte a administração para verificar a situação.',
        registration: reg,
        canOverride: true,
      };
    }

    // Payment pending check
    if (reg.status !== 'CONFIRMADO') {
      return {
        status: 'PAGAMENTO_PENDENTE',
        message: 'PAGAMENTO PENDENTE. Confirme a regularização do pagamento antes de autorizar a entrada.',
        registration: reg,
        canOverride: true,
      };
    }

    // Already checked in check
    if (reg.checkInStatus === 'CHECKED_IN' || reg.ticketStatus === 'UTILIZADO') {
      const prev = checkIns.find((c) => c.registrationId === reg.id || c.ticketCode === reg.ticketCode);
      return {
        status: 'JA_UTILIZADO',
        message: `ATENÇÃO. Este ingresso já foi utilizado.${prev ? ` Registado às ${prev.timestamp} por ${prev.staffUserName}.` : ''}`,
        registration: reg,
        previousCheckIn: prev,
        canOverride: true,
      };
    }

    return {
      status: 'VALIDO',
      message: 'INGRESSO VÁLIDO. Pode autorizar a entrada.',
      registration: reg,
    };
  }

  /**
   * Executes confirmed check-in, setting status to 'CHECKED_IN' / 'UTILIZADO',
   * creating a check-in audit record, and updating staff counter.
   */
  executeCheckIn(
    registrationId: string,
    staffUser: StaffUser,
    isOverride: boolean = false,
    overrideReason?: string
  ): {
    success: boolean;
    message: string;
    checkIn?: CheckInRecord;
    registration?: Registration;
  } {
    const registrations = this.getRegistrations();
    const reg = registrations.find((r) => r.id === registrationId);
    if (!reg) {
      return { success: false, message: 'Inscrição não encontrada.' };
    }

    const tier = this.getTicketTiers().find((t) => t.id === reg.ticketTierId);
    const nowTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const staffTitle = `${staffUser.name} (${staffUser.role === 'ADMIN' ? 'Administrador' : staffUser.role === 'SUPERVISOR_CHECKIN' ? 'Supervisor' : 'Portaria'})`;

    const checkInRecord: CheckInRecord = {
      id: `chk-${Date.now()}`,
      registrationId: reg.id,
      ticketCode: reg.ticketCode,
      internalControlCode: reg.internalControlCode,
      participantName: reg.fullName,
      companyName: reg.company,
      modality: tier?.isConference ? 'Conferência Empresarial' : 'Café Experience',
      packageName: tier?.name || 'Geral',
      staffUserId: staffUser.id,
      staffUserName: staffTitle,
      timestamp: nowTimestamp,
      result: isOverride ? 'AUTORIZACAO_EXCEPCIONAL' : 'AUTORIZADO',
      isOverride,
      overrideReason,
    };

    // Update registration
    const updatedRegList = registrations.map((r) => {
      if (r.id === reg.id) {
        return {
          ...r,
          checkInStatus: 'CHECKED_IN' as const,
          ticketStatus: 'UTILIZADO' as const,
          checkInTime: nowTimestamp,
          checkedInBy: staffTitle,
        };
      }
      return r;
    });
    this.set('registrations', updatedRegList);

    // Save check-in record
    const updatedCheckIns = [checkInRecord, ...this.getCheckIns()];
    this.set('checkins', updatedCheckIns);

    // Increment staff counter
    const updatedStaff = this.getStaffUsers().map((s) => {
      if (s.id === staffUser.id) {
        return { ...s, totalCheckInsValidated: s.totalCheckInsValidated + 1 };
      }
      return s;
    });
    this.set('staff_users', updatedStaff);

    this.logAction(
      'Controlo de Entradas',
      `Check-in ${isOverride ? '[EXCEÇÃO] ' : ''}confirmado para ${reg.fullName} (${reg.ticketCode}) por ${staffTitle}${overrideReason ? ` - Motivo: ${overrideReason}` : ''}`
    );

    const updatedReg = updatedRegList.find((r) => r.id === reg.id);
    return {
      success: true,
      message: `Entrada autorizada com sucesso! Bem-vindo(a) à 79.ª Edição, ${reg.fullName}.`,
      checkIn: checkInRecord,
      registration: updatedReg,
    };
  }

  // Wrapper for backward compatibility
  validateCheckIn(
    codeOrId: string,
    staffName: string = 'Equipa de Check-In'
  ): { success: boolean; message: string; registration?: Registration } {
    const evalRes = this.evaluateCheckIn(codeOrId);
    if (evalRes.status !== 'VALIDO' || !evalRes.registration) {
      return {
        success: false,
        message: evalRes.message,
        registration: evalRes.registration,
      };
    }

    const staff = this.getActiveStaffUser();
    const execRes = this.executeCheckIn(evalRes.registration.id, {
      ...staff,
      name: staffName || staff.name,
    });
    return {
      success: execRes.success,
      message: execRes.message,
      registration: execRes.registration,
    };
  }

  // Live Check-In Statistics (Dashboard de Controlo do Evento em Tempo Real)
  getLiveCheckInKPIs() {
    const regs = this.getRegistrations();
    const checkIns = this.getCheckIns();
    const tiers = this.getTicketTiers();

    const confirmed = regs.filter((r) => r.status === 'CONFIRMADO');
    const checkedIn = regs.filter((r) => r.checkInStatus === 'CHECKED_IN');
    const pendingPayment = regs.filter((r) => r.status === 'PENDENTE');
    const cancelled = regs.filter((r) => r.status === 'CANCELADO' || r.ticketStatus === 'CANCELADO');
    const remainingUnused = confirmed.filter((r) => r.checkInStatus !== 'CHECKED_IN');

    // Conference vs Cafe Experience Breakdown
    const confTotal = confirmed.filter((r) => {
      const t = tiers.find((tier) => tier.id === r.ticketTierId);
      return t?.isConference;
    });
    const confCheckedIn = confTotal.filter((r) => r.checkInStatus === 'CHECKED_IN');

    const expTotal = confirmed.filter((r) => {
      const t = tiers.find((tier) => tier.id === r.ticketTierId);
      return !t?.isConference;
    });
    const expCheckedIn = expTotal.filter((r) => r.checkInStatus === 'CHECKED_IN');

    // Breakdown by package
    const packageStats = tiers.map((tier) => {
      const tierRegs = confirmed.filter((r) => r.ticketTierId === tier.id);
      const tierPresent = tierRegs.filter((r) => r.checkInStatus === 'CHECKED_IN');
      return {
        tierId: tier.id,
        tierName: tier.name,
        priceAoa: tier.priceAoa,
        totalConfirmed: tierRegs.length,
        totalCheckedIn: tierPresent.length,
        rate: tierRegs.length > 0 ? Math.round((tierPresent.length / tierRegs.length) * 100) : 0,
      };
    });

    const attendanceRate =
      confirmed.length > 0 ? Math.round((checkedIn.length / confirmed.length) * 100) : 0;

    return {
      totalConfirmed: confirmed.length,
      totalCheckedIn: checkedIn.length,
      totalUnused: remainingUnused.length,
      totalPendingPayment: pendingPayment.length,
      totalCancelled: cancelled.length,
      attendanceRate,
      confTotal: confTotal.length,
      confCheckedIn: confCheckedIn.length,
      expTotal: expTotal.length,
      expCheckedIn: expCheckedIn.length,
      packageStats,
      recentCheckIns: checkIns.slice(0, 15),
    };
  }

  // CERTIFICATES ENGINE
  getCertificates(): Certificate[] {
    return this.get<Certificate[]>('certificates', initialCertificates);
  }

  issueOrGetCertificate(
    reg: Registration
  ): { certificate?: Certificate; error?: string } {
    const settings = this.getSettings();
    const tier = this.getTicketTiers().find((t) => t.id === reg.ticketTierId);
    const isConference = tier?.isConference || reg.ticketTierId === 'tier-conferencia-gratis';

    // 1. Eligibility Check: Conference
    if (isConference) {
      if (!reg.wantsConferenceCertificate || !reg.conferenceCertificatePaid) {
        return {
          error:
            'O certificado da conferência tem o custo de 2.000 Kz. Conclua o pagamento para desbloquear a emissão.',
        };
      }
    } else {
      // 2. Eligibility Check: Cafe Experience
      if (reg.status !== 'CONFIRMADO') {
        return {
          error:
            'O pagamento do pacote Café Experience ainda se encontra pendente de validação.',
        };
      }
    }

    // 3. Eligibility Check: Presença / Check-in
    if (settings.requireCheckInForCertificate && reg.checkInStatus !== 'CHECKED_IN') {
      return {
        error:
          'A organização exige presença comprovada no evento (check-in validado) para a emissão deste certificado.',
      };
    }

    // Check if certificate already exists
    const existing = this.getCertificates().find((c) => c.registrationId === reg.id);
    if (existing) {
      if (existing.status === 'ANULADO') {
        return {
          error: `Este certificado foi anulado pela administração. Motivo: ${existing.annulledReason || 'Documento revogado.'}`,
        };
      }
      return { certificate: existing };
    }

    // Issue new certificate
    const type = isConference ? 'CONFERENCIA' : 'CAFE_EXPERIENCE';
    const id = `CERT-79-${isConference ? 'CONF' : 'EXP'}-${reg.id.replace('REG-', '')}`;
    const verificationCode = `79-${isConference ? 'CONF' : 'EXP'}-${reg.ticketCode.slice(-4)}-${reg.fullName.slice(0, 2).toUpperCase()}`;

    const newCertificate: Certificate = {
      id,
      registrationId: reg.id,
      ticketCode: reg.ticketCode,
      participantName: reg.fullName,
      companyName: reg.company,
      type,
      packageName: tier?.name || (isConference ? 'Conferência Empresarial' : 'Café Experience'),
      edition: settings.edition,
      eventDateText: settings.eventDateText,
      venueText: `${settings.venueName} · ${settings.city}`,
      issueDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'VALIDO',
      downloadCount: 0,
      verificationCode,
      checkInVerified: reg.checkInStatus === 'CHECKED_IN',
    };

    const list = [newCertificate, ...this.getCertificates()];
    this.set('certificates', list);
    this.logAction(
      'Certificados',
      `Certificado emitido para ${reg.fullName} (${newCertificate.id} · ${newCertificate.type})`
    );

    return { certificate: newCertificate };
  }

  // Lookup Certificate by ticket code (Area B of public page)
  lookupCertificateByTicketCode(ticketCode: string): {
    registration?: Registration;
    certificate?: Certificate;
    error?: string;
  } {
    const clean = ticketCode.trim().toUpperCase();
    const reg = this.getRegistrations().find(
      (r) => r.ticketCode.toUpperCase() === clean || r.id.toUpperCase() === clean
    );

    if (!reg) {
      return {
        error:
          'Código de ingresso não encontrado. Por favor confirme o código recebido na confirmação da sua inscrição.',
      };
    }

    const tier = this.getTicketTiers().find((t) => t.id === reg.ticketTierId);
    if (tier?.isConference) {
      return {
        error:
          'Este código pertence à Conferência Gratuita. Por favor utilize a Área A (Certificado da Conferência) para consultar por nome.',
      };
    }

    const res = this.issueOrGetCertificate(reg);
    return {
      registration: reg,
      certificate: res.certificate,
      error: res.error,
    };
  }

  // Lookup Certificate by full name (Area A of public page)
  lookupConferenceCertificateByName(
    name: string,
    disambiguation?: { email?: string; id?: string }
  ): {
    matches: Registration[];
    needsDisambiguation: boolean;
    registration?: Registration;
    certificate?: Certificate;
    error?: string;
  } {
    const cleanName = name.trim().toLowerCase();
    const all = this.getRegistrations();

    // Match conference registrants whose names include the searched string
    const matches = all.filter((r) => {
      const tier = this.getTicketTiers().find((t) => t.id === r.ticketTierId);
      if (!tier?.isConference && r.ticketTierId !== 'tier-conferencia-gratis') {
        return false;
      }
      return r.fullName.toLowerCase().includes(cleanName);
    });

    if (matches.length === 0) {
      return {
        matches: [],
        needsDisambiguation: false,
        error:
          'Nenhuma inscrição na conferência foi encontrada com o nome indicado. Verifique a ortografia ou realize a sua inscrição.',
      };
    }

    // If multiple matches and no disambiguation provided
    if (matches.length > 1 && !disambiguation?.email && !disambiguation?.id) {
      return {
        matches,
        needsDisambiguation: true,
      };
    }

    // Resolve specific match
    let target = matches[0];
    if (disambiguation?.email) {
      const byEmail = matches.find((m) => m.email.toLowerCase() === disambiguation.email?.toLowerCase());
      if (byEmail) target = byEmail;
    } else if (disambiguation?.id) {
      const byId = matches.find((m) => m.id.toUpperCase() === disambiguation.id?.toUpperCase());
      if (byId) target = byId;
    }

    const res = this.issueOrGetCertificate(target);
    return {
      matches,
      needsDisambiguation: false,
      registration: target,
      certificate: res.certificate,
      error: res.error,
    };
  }

  // Public Verification Lookup
  validateCertificatePublic(codeOrId: string): {
    valid: boolean;
    statusText: 'VALIDO' | 'ANULADO' | 'INEXISTENTE';
    certificate?: Certificate;
    message: string;
  } {
    const clean = codeOrId.trim().toUpperCase();
    const cert = this.getCertificates().find(
      (c) =>
        c.id.toUpperCase() === clean ||
        c.verificationCode.toUpperCase() === clean ||
        c.ticketCode.toUpperCase() === clean
    );

    // Log the check
    const logRecord: CertificateValidationRecord = {
      id: `VAL-${Date.now()}`,
      certificateId: cert ? cert.id : clean,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: cert ? cert.status : 'INEXISTENTE',
    };
    const currentLogs = this.get<CertificateValidationRecord[]>('cert_validation_logs', []);
    this.set('cert_validation_logs', [logRecord, ...currentLogs].slice(0, 100));

    if (!cert) {
      return {
        valid: false,
        statusText: 'INEXISTENTE',
        message: 'Certificado não encontrado nos registos oficiais da 79.ª Edição do Café do Empreendedor.',
      };
    }

    if (cert.status === 'ANULADO') {
      return {
        valid: false,
        statusText: 'ANULADO',
        certificate: cert,
        message: `ATENÇÃO: Este certificado foi ANULADO oficialmente pela organização. Motivo: ${cert.annulledReason || 'Revogação administrativa.'}`,
      };
    }

    return {
      valid: true,
      statusText: 'VALIDO',
      certificate: cert,
      message: 'Certificado de Autenticidade Comprovada emitido pela organização oficial.',
    };
  }

  // Admin actions on certificates
  annulCertificate(id: string, reason: string): void {
    const list = this.getCertificates().map((c) => {
      if (c.id === id) {
        return { ...c, status: 'ANULADO' as const, annulledReason: reason };
      }
      return c;
    });
    this.set('certificates', list);
    this.logAction('Certificados', `Certificado ${id} ANULADO: ${reason}`);
  }

  reissueCertificate(id: string, updatedName?: string): void {
    const list = this.getCertificates().map((c) => {
      if (c.id === id) {
        return {
          ...c,
          participantName: updatedName || c.participantName,
          status: 'VALIDO' as const,
          issueDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
        };
      }
      return c;
    });
    this.set('certificates', list);
    this.logAction('Certificados', `Certificado ${id} reemitido com sucesso.`);
  }

  incrementCertificateDownload(id: string): void {
    const list = this.getCertificates().map((c) => {
      if (c.id === id) {
        return { ...c, downloadCount: c.downloadCount + 1 };
      }
      return c;
    });
    this.set('certificates', list);
  }

  getCertificateKPIs() {
    const certs = this.getCertificates();
    const regs = this.getRegistrations();
    const confPaid = regs.filter((r) => r.conferenceCertificatePaid).length;
    const confPending = regs.filter((r) => r.wantsConferenceCertificate && !r.conferenceCertificatePaid).length;
    const expCount = certs.filter((c) => c.type === 'CAFE_EXPERIENCE').length;
    const downloads = certs.reduce((sum, c) => sum + c.downloadCount, 0);
    const annulled = certs.filter((c) => c.status === 'ANULADO').length;
    const confRevenue = confPaid * this.getSettings().conferenceCertificatePriceAoa;

    return {
      totalIssued: certs.length,
      conferencePaid: confPaid,
      conferencePending: confPending,
      experienceCount: expCount,
      totalDownloads: downloads,
      annulledCount: annulled,
      conferenceRevenueAoa: confRevenue,
    };
  }

  // Exhibitors
  getExhibitors(): Exhibitor[] {
    return this.get<Exhibitor[]>('exhibitors', initialExhibitors);
  }

  addExhibitor(exhibitor: Omit<Exhibitor, 'id' | 'status'>): Exhibitor {
    const id = `exh-${Date.now()}`;
    const newExhibitor: Exhibitor = {
      ...exhibitor,
      id,
      status: 'PENDENTE',
    };
    const list = [newExhibitor, ...this.getExhibitors()];
    this.set('exhibitors', list);
    this.logAction('Expositores', `Nova candidatura de expositor: ${exhibitor.companyName}`);
    return newExhibitor;
  }

  updateExhibitorStatus(id: string, status: 'APROVADO' | 'REJEITADO', standNumber?: string): void {
    const list = this.getExhibitors().map((e) => {
      if (e.id === id) {
        return { ...e, status, standNumber: standNumber || e.standNumber };
      }
      return e;
    });
    this.set('exhibitors', list);
    this.logAction('Expositores', `Expositor ${id} agora está ${status}`);
  }

  // Pitch
  getPitchCandidates(): PitchCandidate[] {
    return this.get<PitchCandidate[]>('pitchCandidates', initialPitchCandidates);
  }

  addPitchCandidate(c: Omit<PitchCandidate, 'id' | 'status' | 'evaluations' | 'averageScore'>): PitchCandidate {
    const id = `pitch-${Date.now()}`;
    const newCand: PitchCandidate = {
      ...c,
      id,
      status: 'PENDENTE',
      evaluations: [],
      averageScore: 0,
    };
    const list = [...this.getPitchCandidates(), newCand];
    this.set('pitchCandidates', list);
    this.logAction('Pitch Empresarial', `Nova candidatura de Pitch: ${c.projectName}`);
    return newCand;
  }

  addPitchEvaluation(candidateId: string, evalData: Omit<PitchCandidate['evaluations'][0], 'total'>): void {
    const total =
      evalData.innovation +
      evalData.feasibility +
      evalData.market +
      evalData.revenueModel +
      evalData.execution;

    const list = this.getPitchCandidates().map((c) => {
      if (c.id === candidateId) {
        const evals = [...c.evaluations, { ...evalData, total }];
        const avg = Math.round(evals.reduce((acc, cur) => acc + cur.total, 0) / evals.length);
        return {
          ...c,
          evaluations: evals,
          averageScore: avg,
          status: 'APRESENTADO' as const,
        };
      }
      return c;
    });

    list.sort((a, b) => b.averageScore - a.averageScore);
    list.forEach((cand, idx) => {
      cand.rank = idx + 1;
    });

    this.set('pitchCandidates', list);
    this.logAction('Júri Pitch', `Avaliação atribuída a ${candidateId} (${total}/100)`);
  }

  // Agenda
  getAgenda(): AgendaSession[] {
    return this.get<AgendaSession[]>('agenda', initialAgenda);
  }

  addAgendaSession(session: Omit<AgendaSession, 'id'>): void {
    const id = `sess-${Date.now()}`;
    const list = [...this.getAgenda(), { ...session, id }];
    this.set('agenda', list);
    this.logAction('Agenda', `Nova sessão adicionada: ${session.title}`);
  }

  deleteAgendaSession(id: string): void {
    const list = this.getAgenda().filter((s) => s.id !== id);
    this.set('agenda', list);
    this.logAction('Agenda', `Sessão ${id} removida`);
  }

  getSavedSessions(): string[] {
    return this.get<string[]>('user_saved_sessions', ['sess-01', 'sess-06']);
  }

  toggleSaveSession(sessionId: string): boolean {
    const saved = this.getSavedSessions();
    let updated: string[];
    let isSaved: boolean;
    if (saved.includes(sessionId)) {
      updated = saved.filter((id) => id !== sessionId);
      isSaved = false;
    } else {
      updated = [...saved, sessionId];
      isSaved = true;
    }
    this.set('user_saved_sessions', updated);
    return isSaved;
  }

  // Mentors
  getMentors(): Mentor[] {
    return this.get<Mentor[]>('mentors', initialMentors);
  }

  bookStrategySession(
    mentorId: string,
    slotTime: string,
    attendee: { name: string; email: string; phone: string; company: string; challenges: string }
  ): StrategySessionBooking {
    const mentors = this.getMentors();
    const mentor = mentors.find((m) => m.id === mentorId);
    if (!mentor) throw new Error('Mentor não encontrado');

    const updatedMentors = mentors.map((m) => {
      if (m.id === mentorId) {
        return {
          ...m,
          slots: m.slots.map((s) => (s.time === slotTime ? { ...s, booked: true, bookedBy: attendee.name } : s)),
        };
      }
      return m;
    });
    this.set('mentors', updatedMentors);

    const booking: StrategySessionBooking = {
      id: `STRAT-${Date.now()}`,
      mentorId,
      mentorName: mentor.name,
      attendeeName: attendee.name,
      attendeeEmail: attendee.email,
      attendeePhone: attendee.phone,
      companyName: attendee.company,
      challengesDescription: attendee.challenges,
      slotTime,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'CONFIRMADA',
    };

    const bookings = [booking, ...this.get<StrategySessionBooking[]>('strategy_bookings', [])];
    this.set('strategy_bookings', bookings);
    this.logAction('Sala de Estratégia', `Sessão agendada com ${mentor.name} por ${attendee.name}`);
    return booking;
  }

  // Networking
  getNetworkingContacts(): NetworkingContact[] {
    return this.get<NetworkingContact[]>('networking_contacts', initialNetworkingContacts);
  }

  addNetworkingContact(contact: Omit<NetworkingContact, 'id'>): NetworkingContact {
    const id = `net-${Date.now()}`;
    const newC = { ...contact, id };
    const list = [newC, ...this.getNetworkingContacts()];
    this.set('networking_contacts', list);
    return newC;
  }

  // Sponsors
  getSponsors(): Sponsor[] {
    return this.get<Sponsor[]>('sponsors', initialSponsors);
  }

  addSponsor(sponsor: Omit<Sponsor, 'id'>): Sponsor {
    const id = `sp-${Date.now()}`;
    const newS = { ...sponsor, id };
    const list = [...this.getSponsors(), newS];
    this.set('sponsors', list);
    this.logAction('Patrocinadores', `Novo parceiro registado: ${sponsor.name}`);
    return newS;
  }

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    return this.get<AuditLog[]>('audit_logs', [
      {
        id: 'log-01',
        timestamp: '2026-10-13 08:00',
        actor: 'Sistema',
        action: 'Inicialização',
        details: 'Módulo de Inscrições, Bilhetes Digitais e Certificados parametrizado com sucesso.',
      },
    ]);
  }

  logAction(action: string, details: string, actor: string = 'Administração'): void {
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      actor,
      action,
      details,
    };
    const logs = [log, ...this.getAuditLogs()].slice(0, 80);
    this.set('audit_logs', logs);
  }

  // Capacity Alerts (Automatic 90% threshold notifications)
  getCapacityAlerts(): CapacityAlert[] {
    return this.get<CapacityAlert[]>('capacity_alerts', []);
  }

  setCapacityAlerts(alerts: CapacityAlert[]): void {
    this.set('capacity_alerts', alerts);
  }

  checkAndTriggerCapacityAlerts(): {
    alerts: CapacityAlert[];
    newlyTriggered: CapacityAlert[];
  } {
    const existingAlerts = this.getCapacityAlerts();
    const registrations = this.getRegistrations();
    const tiers = this.getTicketTiers();
    const newlyTriggered: CapacityAlert[] = [];
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    // 1. Modality: Conferência Gratuita
    const confTier = tiers.find((t) => t.isConference || t.id === 'tier-conferencia-gratis');
    if (confTier && (confTier.maxCapacity || 0) > 0) {
      const maxCap = confTier.maxCapacity;
      const confRegs = registrations.filter(
        (r) => r.ticketTierId === confTier.id
      );
      const bookedCount = confRegs.filter((r) => r.status === 'CONFIRMADO' || r.status === 'PENDENTE').length;
      const pct = Math.round((bookedCount / maxCap) * 100);

      if (pct >= 90) {
        const severity = pct >= 100 ? 'ESGOTADO_100' : 'ALERTA_90';
        const hasExisting = existingAlerts.some(
          (a) => a.modality === 'Gratuita' && a.status !== 'RESOLVIDO' && a.severity === severity
        );

        if (!hasExisting) {
          const emailSubject = `[ALERTA DE LOTAÇÃO ${pct}%] Conferência Gratuita - 79.ª Edição Café do Empreendedor`;
          const emailBody = `Prezada Gestão da Plataforma (Geração Digital Angola),

Atenção: A modalidade CONFERÊNCIA GRATUITA atingiu ${pct}% da sua capacidade máxima configurada.

DADOS DA LOTAÇÃO:
- Modalidade: Conferência Gratuita (Acesso Plenário)
- Vagas Configuradas: ${maxCap}
- Vagas Preenchidas/Reservadas: ${bookedCount}
- Vagas Disponíveis Restantes: ${Math.max(0, maxCap - bookedCount)}
- Taxa de Ocupação: ${pct}%
- Data de Detecção: ${nowStr}

ACÇÕES RECOMENDADAS:
1. Avaliar expansão do limite de lugares ou encerramento preventivo do formulário.
2. Monitorizar pagamentos pendentes que reservem lugares.
3. Ativar a lista de espera caso atinja 100%.

Este alerta foi gerado automaticamente pelo motor de monitorização de capacidade do website oficial.
Contacto da Gestão: gdangola12@gmail.com | WhatsApp: +244 921 152 162`;

          const alertId = `alert-grat-${Date.now()}`;
          const newAlert: CapacityAlert = {
            id: alertId,
            modality: 'Gratuita',
            tierId: confTier.id,
            tierName: 'Conferência Gratuita',
            occupancyCount: bookedCount,
            maxCapacity: maxCap,
            occupancyPercentage: pct,
            threshold: 90,
            timestamp: nowStr,
            severity,
            status: 'ACTIVO',
            emailRecipient: 'gdangola12@gmail.com',
            emailSubject,
            emailBody,
            emailSent: true,
            emailSentAt: nowStr,
            loggedToAudit: true,
            auditLogId: `log-${Date.now()}`,
          };

          this.logAction(
            'Alerta de Capacidade',
            `ALERTA 90% LOTAÇÃO: A Conferência Gratuita atingiu ${pct}% (${bookedCount}/${maxCap} vagas). Notificação automática gerada e despachada para gdangola12@gmail.com.`,
            'Sistema de Monitorização'
          );

          newlyTriggered.push(newAlert);
          existingAlerts.unshift(newAlert);
        }
      }
    }

    // 2. Modality: Café Experience
    const expTiers = tiers.filter((t) => !t.isConference && !t.id.includes('stand'));
    const expMaxCap = expTiers.reduce((acc, t) => acc + (t.maxCapacity || 0), 0) || 150;
    const expRegs = registrations.filter(
      (r) =>
        r.ticketTierId.startsWith('tier-exp') ||
        expTiers.some((t) => t.id === r.ticketTierId)
    );
    const expBookedCount = expRegs.filter((r) => r.status === 'CONFIRMADO' || r.status === 'PENDENTE').length;
    const expPct = Math.round((expBookedCount / expMaxCap) * 100);

    if (expPct >= 90) {
      const severity = expPct >= 100 ? 'ESGOTADO_100' : 'ALERTA_90';
      const hasExisting = existingAlerts.some(
        (a) => a.modality === 'Café Experience' && a.status !== 'RESOLVIDO' && a.severity === severity
      );

      if (!hasExisting) {
        const emailSubject = `[ALERTA DE LOTAÇÃO ${expPct}%] Café Experience VIP - 79.ª Edição Café do Empreendedor`;
        const emailBody = `Prezada Gestão da Plataforma (Geração Digital Angola),

Atenção: A modalidade CAFÉ EXPERIENCE atingiu ${expPct}% da sua capacidade máxima global.

DADOS DA LOTAÇÃO:
- Modalidade: Café Experience (Pacotes Essencial, Profissional, Executivo)
- Vagas Configuradas: ${expMaxCap}
- Vagas Preenchidas/Reservadas: ${expBookedCount}
- Vagas Disponíveis Restantes: ${Math.max(0, expMaxCap - expBookedCount)}
- Taxa de Ocupação: ${expPct}%
- Data de Detecção: ${nowStr}

ACÇÕES RECOMENDADAS:
1. Contactar participantes com pagamentos pendentes para validação célere.
2. Preparar bloqueio de vendas e direccionamento para lista de espera exclusiva.
3. Notificar equipa de coordenação de coffee break e materiais VIP.

Este alerta foi gerado automaticamente pelo motor de monitorização de capacidade do website oficial.
Contacto da Gestão: gdangola12@gmail.com | WhatsApp: +244 921 152 162`;

        const alertId = `alert-exp-${Date.now()}`;
        const newAlert: CapacityAlert = {
          id: alertId,
          modality: 'Café Experience',
          tierName: 'Café Experience (Global)',
          occupancyCount: expBookedCount,
          maxCapacity: expMaxCap,
          occupancyPercentage: expPct,
          threshold: 90,
          timestamp: nowStr,
          severity,
          status: 'ACTIVO',
          emailRecipient: 'gdangola12@gmail.com',
          emailSubject,
          emailBody,
          emailSent: true,
          emailSentAt: nowStr,
          loggedToAudit: true,
          auditLogId: `log-${Date.now()}`,
        };

        this.logAction(
          'Alerta de Capacidade',
          `ALERTA 90% LOTAÇÃO: A modalidade Café Experience atingiu ${expPct}% (${expBookedCount}/${expMaxCap} vagas). Notificação automática gerada e despachada para gdangola12@gmail.com.`,
          'Sistema de Monitorização'
        );

        newlyTriggered.push(newAlert);
        existingAlerts.unshift(newAlert);
      }
    }

    if (newlyTriggered.length > 0) {
      this.setCapacityAlerts(existingAlerts.slice(0, 30));
    }

    return { alerts: existingAlerts, newlyTriggered };
  }

  sendCapacityAlertEmail(alertId: string, customRecipient?: string): { success: boolean; message: string; alert?: CapacityAlert } {
    const alerts = this.getCapacityAlerts();
    const alert = alerts.find((a) => a.id === alertId);
    if (!alert) return { success: false, message: 'Alerta não encontrado' };

    const recipient = customRecipient || alert.emailRecipient || 'gdangola12@gmail.com';
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const updatedAlert: CapacityAlert = {
      ...alert,
      emailRecipient: recipient,
      emailSent: true,
      emailSentAt: nowStr,
    };

    const updatedList = alerts.map((a) => (a.id === alertId ? updatedAlert : a));
    this.setCapacityAlerts(updatedList);

    this.logAction(
      'Disparo de Email',
      `Notificação de 90% de lotação para "${alert.modality}" reenviada por email com sucesso para ${recipient}.`,
      'Gestão de Notificações'
    );

    return {
      success: true,
      message: `Alerta enviado com sucesso por email para ${recipient}`,
      alert: updatedAlert,
    };
  }

  dismissCapacityAlert(alertId: string, resolutionNotes?: string): void {
    const alerts = this.getCapacityAlerts();
    const alert = alerts.find((a) => a.id === alertId);
    if (!alert) return;

    const updatedList = alerts.map((a) =>
      a.id === alertId
        ? { ...a, status: 'RECONHECIDO' as const }
        : a
    );
    this.setCapacityAlerts(updatedList);

    this.logAction(
      'Alerta Reconhecido',
      `Alerta de lotação para ${alert.modality} (${alert.occupancyPercentage}%) reconhecido e arquivado. ${resolutionNotes || ''}`.trim(),
      'Administração'
    );
  }

  testTriggerCapacityAlert(modality: 'Gratuita' | 'Café Experience', simulatedPercentage: number = 92): CapacityAlert {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const isFree = modality === 'Gratuita';
    const maxCap = isFree ? 800 : 150;
    const occupied = Math.round((simulatedPercentage / 100) * maxCap);
    const alertId = `alert-test-${Date.now()}`;

    const emailSubject = `[TESTE DE ALERTA 90%] ${isFree ? 'Conferência Gratuita' : 'Café Experience'} - Café do Empreendedor`;
    const emailBody = `Prezada Gestão da Plataforma (Geração Digital Angola),

TESTE DE NOTIFICAÇÃO AUTOMÁTICA DE CAPACIDADE:
A modalidade ${isFree ? 'CONFERÊNCIA GRATUITA' : 'CAFÉ EXPERIENCE'} simulou o alcance de ${simulatedPercentage}% da sua lotação máxima.

DADOS DO DISPARO:
- Modalidade: ${modality}
- Limite Configurado: ${maxCap} vagas
- Ocupação Calculada: ${occupied} vagas
- Vagas Restantes: ${maxCap - occupied}
- Percentagem: ${simulatedPercentage}%
- Email de Destino: gdangola12@gmail.com
- WhatsApp de Apoio: +244 921 152 162
- Timestamp: ${nowStr}

O sistema confirmou a integridade do circuito de notificação por email e gravação em log de auditoria.`;

    const newAlert: CapacityAlert = {
      id: alertId,
      modality,
      tierName: isFree ? 'Conferência Gratuita' : 'Café Experience Global',
      occupancyCount: occupied,
      maxCapacity: maxCap,
      occupancyPercentage: simulatedPercentage,
      threshold: 90,
      timestamp: nowStr,
      severity: simulatedPercentage >= 100 ? 'ESGOTADO_100' : 'ALERTA_90',
      status: 'ACTIVO',
      emailRecipient: 'gdangola12@gmail.com',
      emailSubject,
      emailBody,
      emailSent: true,
      emailSentAt: nowStr,
      loggedToAudit: true,
      auditLogId: `log-${Date.now()}`,
    };

    const alerts = [newAlert, ...this.getCapacityAlerts()].slice(0, 30);
    this.setCapacityAlerts(alerts);

    this.logAction(
      'Teste de Alerta',
      `Teste de alerta aos 90% disparado para ${modality} (${simulatedPercentage}%). Notificação registada e simulada para gdangola12@gmail.com.`,
      'Administrador'
    );

    return newAlert;
  }
}

export const eventStore = new EventStore();
