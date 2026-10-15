import React, { useState, useEffect } from 'react';
import { eventStore } from './services/store';
import {
  EventSettings,
  TicketTier,
  Registration,
  Certificate,
  ConferenceTrack,
  AgendaSession,
  Exhibitor,
  PitchCandidate,
  Sponsor,
  Mentor,
  NetworkingContact,
  GalleryItem,
  AuditLog,
  PitchEvaluation,
} from './types';
import { initialConferenceTracks, initialGallery } from './services/store';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { ConferenceSection } from './components/ConferenceSection';
import { AgendaSection } from './components/AgendaSection';
import { CertificatesPortalSection } from './components/CertificatesPortalSection';
import { ExhibitorsSection } from './components/ExhibitorsSection';
import { PitchSection } from './components/PitchSection';
import { StrategyRoomSection } from './components/StrategyRoomSection';
import { SponsorsSection } from './components/SponsorsSection';
import { NetworkingSection } from './components/NetworkingSection';
import { GallerySection } from './components/GallerySection';
import { Footer } from './components/Footer';
import { RegistrationModal } from './components/RegistrationModal';
import { DigitalTicketModal } from './components/DigitalTicketModal';
import { OfficialCertificateModal } from './components/OfficialCertificateModal';
import { CertificateVerificationModal } from './components/CertificateVerificationModal';
import { TicketLookupModal } from './components/TicketLookupModal';
import { ConferenceCertificatePaymentModal } from './components/ConferenceCertificatePaymentModal';
import { StandBookingModal } from './components/StandBookingModal';
import { PitchApplicationModal } from './components/PitchApplicationModal';
import { SponsorProposalModal } from './components/SponsorProposalModal';
import { JuryScoringModal } from './components/JuryScoringModal';
import { AdminDashboard } from './components/AdminDashboard';
import { TicketDeliveryChannelModal } from './components/TicketDeliveryChannelModal';
import { CheckInStaffPortal } from './components/CheckInStaffPortal';

export default function App() {
  // State from persistent store
  const [settings, setSettings] = useState<EventSettings>(() => eventStore.getSettings());
  const [ticketTiers, setTicketTiers] = useState<TicketTier[]>(() => eventStore.getTicketTiers());
  const [registrations, setRegistrations] = useState<Registration[]>(() =>
    eventStore.getRegistrations()
  );
  const [certificates, setCertificates] = useState<Certificate[]>(() =>
    eventStore.getCertificates()
  );
  const [agenda, setAgenda] = useState<AgendaSession[]>(() => eventStore.getAgenda());
  const [savedSessionIds, setSavedSessionIds] = useState<string[]>(() =>
    eventStore.getSavedSessions()
  );
  const [exhibitors, setExhibitors] = useState<Exhibitor[]>(() => eventStore.getExhibitors());
  const [pitchCandidates, setPitchCandidates] = useState<PitchCandidate[]>(() =>
    eventStore.getPitchCandidates()
  );
  const [sponsors, setSponsors] = useState<Sponsor[]>(() => eventStore.getSponsors());
  const [mentors, setMentors] = useState<Mentor[]>(() => eventStore.getMentors());
  const [contacts, setContacts] = useState<NetworkingContact[]>(() =>
    eventStore.getNetworkingContacts()
  );
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => eventStore.getAuditLogs());

  // Navigation & filter states
  const [activeSection, setActiveSection] = useState<string>('inicio');
  const [selectedTrackFilter, setSelectedTrackFilter] = useState<string>('todas');

  // Modal dialog states
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [preselectedTierId, setPreselectedTierId] = useState<string | undefined>(undefined);
  const [activeTicketForModal, setActiveTicketForModal] = useState<Registration | null>(null);
  const [activeCertificateModal, setActiveCertificateModal] = useState<Certificate | null>(null);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [verificationInitialCode, setVerificationInitialCode] = useState('');
  const [isTicketLookupOpen, setIsTicketLookupOpen] = useState(false);
  const [payingConferenceReg, setPayingConferenceReg] = useState<Registration | null>(null);
  const [isStandBookingOpen, setIsStandBookingOpen] = useState(false);
  const [isPitchApplicationOpen, setIsPitchApplicationOpen] = useState(false);
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);
  const [activeJuryCandidate, setActiveJuryCandidate] = useState<PitchCandidate | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [deliveryRegistration, setDeliveryRegistration] = useState<Registration | null>(null);
  const [isStaffPortalOpen, setIsStaffPortalOpen] = useState(false);

  // Check URL parameters for automated verification or direct tabs (e.g. /admin/checkin)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const codigo = params.get('codigo');
      const tab = params.get('tab');
      const pathname = window.location.pathname;
      const hash = window.location.hash;

      if (
        pathname === '/admin/checkin' ||
        pathname.includes('checkin') ||
        hash === '#admin/checkin' ||
        hash === '#checkin' ||
        tab === 'checkin'
      ) {
        setIsStaffPortalOpen(true);
      } else if (tab === 'validar-certificado' || codigo) {
        setVerificationInitialCode(codigo || '');
        setIsVerificationModalOpen(true);
      }
    } catch {}
  }, []);

  // Smooth scroll handler
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Switch to specific track in agenda
  const handleSelectTrackForAgenda = (trackSlug: string) => {
    setSelectedTrackFilter(trackSlug);
    handleNavigate('agenda');
  };

  // Toggle saving personal agenda sessions
  const handleToggleSaveSession = (sessionId: string) => {
    eventStore.toggleSaveSession(sessionId);
    setSavedSessionIds(eventStore.getSavedSessions());
  };

  // On registration complete -> show ticket delivery channel choice (WhatsApp / Email / Ambos)
  const handleRegistrationComplete = (newRegData: Registration) => {
    const created = eventStore.addRegistration(newRegData);
    setRegistrations(eventStore.getRegistrations());
    setTicketTiers(eventStore.getTicketTiers());
    setCertificates(eventStore.getCertificates());
    setAuditLogs(eventStore.getAuditLogs());
    // Open prompt 5 delivery selection modal
    setDeliveryRegistration(created);
  };

  // Stand booking submission
  const handleStandBookingSubmit = (exhibitorData: Omit<Exhibitor, 'id' | 'status'>) => {
    eventStore.addExhibitor(exhibitorData);
    setExhibitors(eventStore.getExhibitors());
    setAuditLogs(eventStore.getAuditLogs());
  };

  // Pitch candidate application submission
  const handlePitchApplicationSubmit = (
    candidateData: Omit<PitchCandidate, 'id' | 'status' | 'evaluations' | 'averageScore'>
  ) => {
    eventStore.addPitchCandidate(candidateData);
    setPitchCandidates(eventStore.getPitchCandidates());
    setAuditLogs(eventStore.getAuditLogs());
  };

  // Jury evaluation submission
  const handleJuryEvaluationSubmit = (
    candidateId: string,
    evaluation: Omit<PitchEvaluation, 'total'>
  ) => {
    eventStore.addPitchEvaluation(candidateId, evaluation);
    setPitchCandidates(eventStore.getPitchCandidates());
    setAuditLogs(eventStore.getAuditLogs());
  };

  // Mentorship session booking
  const handleBookStrategySession = (
    mentorId: string,
    slotTime: string,
    attendee: { name: string; email: string; phone: string; company: string; challenges: string }
  ) => {
    eventStore.bookStrategySession(mentorId, slotTime, attendee);
    setMentors(eventStore.getMentors());
    setAuditLogs(eventStore.getAuditLogs());
  };

  // Networking profile addition
  const handleAddNetworkingContact = (contact: Omit<NetworkingContact, 'id'>) => {
    eventStore.addNetworkingContact(contact);
    setContacts(eventStore.getNetworkingContacts());
  };

  // Sponsor proposal submission
  const handleSponsorProposalSubmit = (sponsor: Omit<Sponsor, 'id'>) => {
    eventStore.addSponsor(sponsor);
    setSponsors(eventStore.getSponsors());
    setAuditLogs(eventStore.getAuditLogs());
  };

  // Admin Actions
  const handleUpdateSettings = (newSettings: Partial<EventSettings>) => {
    const updated = eventStore.updateSettings(newSettings);
    setSettings(updated);
    setAuditLogs(eventStore.getAuditLogs());
  };

  const handleUpdateRegistrationStatus = (
    id: string,
    status: Registration['status'],
    notes?: string
  ) => {
    eventStore.updateRegistrationStatus(id, status, notes);
    setRegistrations(eventStore.getRegistrations());
    setCertificates(eventStore.getCertificates());
    setAuditLogs(eventStore.getAuditLogs());
  };

  const handleValidateCheckIn = (code: string) => {
    const result = eventStore.validateCheckIn(code, 'Administrador Portaria');
    setRegistrations(eventStore.getRegistrations());
    setCertificates(eventStore.getCertificates());
    setAuditLogs(eventStore.getAuditLogs());
    return result;
  };

  const handleUpdateExhibitorStatus = (
    id: string,
    status: 'APROVADO' | 'REJEITADO',
    stand?: string
  ) => {
    eventStore.updateExhibitorStatus(id, status, stand);
    setExhibitors(eventStore.getExhibitors());
    setAuditLogs(eventStore.getAuditLogs());
  };

  const handleAddAgendaSession = (session: Omit<AgendaSession, 'id'>) => {
    eventStore.addAgendaSession(session);
    setAgenda(eventStore.getAgenda());
    setAuditLogs(eventStore.getAuditLogs());
  };

  const handleDeleteAgendaSession = (id: string) => {
    eventStore.deleteAgendaSession(id);
    setAgenda(eventStore.getAgenda());
    setAuditLogs(eventStore.getAuditLogs());
  };

  // Certificate Actions in Admin
  const handleAnnulCertificate = (id: string, reason: string) => {
    eventStore.annulCertificate(id, reason);
    setCertificates(eventStore.getCertificates());
    setAuditLogs(eventStore.getAuditLogs());
  };

  const handleReissueCertificate = (id: string, updatedName?: string) => {
    eventStore.reissueCertificate(id, updatedName);
    setCertificates(eventStore.getCertificates());
    setAuditLogs(eventStore.getAuditLogs());
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F3F4F6] selection:bg-[#BE123C] selection:text-white">
      {/* Top Navigation */}
      <Navbar
        onOpenRegister={() => {
          setPreselectedTierId(ticketTiers[0]?.id);
          setIsRegisterOpen(true);
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenVerifyModal={() => {
          setVerificationInitialCode('');
          setIsVerificationModalOpen(true);
        }}
        onOpenLookupTicket={() => setIsTicketLookupOpen(true)}
        onOpenStaffPortal={() => setIsStaffPortalOpen(true)}
        onNavigate={handleNavigate}
        activeSection={activeSection}
      />

      {/* Main Sections */}
      <main>
        {/* Hero Section */}
        <HeroSection
          settings={settings}
          onOpenRegister={() => {
            setPreselectedTierId(ticketTiers[0]?.id);
            setIsRegisterOpen(true);
          }}
          onOpenStandBooking={() => setIsStandBookingOpen(true)}
          onOpenPitchForm={() => setIsPitchApplicationOpen(true)}
          onOpenSponsorModal={() => setIsSponsorModalOpen(true)}
        />

        {/* About & Participant Journey */}
        <AboutSection />

        {/* 4 Conference Tracks */}
        <ConferenceSection
          tracks={initialConferenceTracks}
          agenda={agenda}
          onSelectTrackForAgenda={handleSelectTrackForAgenda}
        />

        {/* Interactive Agenda */}
        <AgendaSection
          agenda={agenda}
          savedSessionIds={savedSessionIds}
          onToggleSave={handleToggleSaveSession}
          selectedTrackFilter={selectedTrackFilter}
          onTrackFilterChange={setSelectedTrackFilter}
        />

        {/* Mandatory Certificates Portal Section (Area A & Area B) */}
        <CertificatesPortalSection
          settings={settings}
          onOpenCertificateModal={(cert) => setActiveCertificateModal(cert)}
          onOpenPaymentModalForConference={(reg) => setPayingConferenceReg(reg)}
        />

        {/* Virtual Fair & Exhibitors */}
        <ExhibitorsSection
          exhibitors={exhibitors}
          onOpenStandBooking={() => setIsStandBookingOpen(true)}
        />

        {/* Pitch Empresarial */}
        <PitchSection
          candidates={pitchCandidates}
          onOpenPitchApplication={() => setIsPitchApplicationOpen(true)}
          onOpenJuryScoring={(cand) => setActiveJuryCandidate(cand)}
        />

        {/* Strategy Room & Mentorship */}
        <StrategyRoomSection
          mentors={mentors}
          onBookSession={handleBookStrategySession}
        />

        {/* Sponsors & Partners */}
        <SponsorsSection
          sponsors={sponsors}
          onOpenSponsorModal={() => setIsSponsorModalOpen(true)}
        />

        {/* Networking Directory */}
        <NetworkingSection
          contacts={contacts}
          onAddContact={handleAddNetworkingContact}
        />

        {/* Historical Photo Gallery */}
        <GallerySection items={initialGallery} />
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenLookupTicket={() => setIsTicketLookupOpen(true)}
        onOpenVerifyModal={() => {
          setVerificationInitialCode('');
          setIsVerificationModalOpen(true);
        }}
        onNavigateToCertificates={() => handleNavigate('certificados')}
        onOpenStandBooking={() => setIsStandBookingOpen(true)}
        onOpenPitchForm={() => setIsPitchApplicationOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Ticket Purchase Modal */}
      {isRegisterOpen && (
        <RegistrationModal
          tiers={ticketTiers}
          settings={settings}
          isOpen={isRegisterOpen}
          preselectedTierId={preselectedTierId}
          onClose={() => setIsRegisterOpen(false)}
          onRegistrationComplete={handleRegistrationComplete}
        />
      )}

      {/* Newly Issued or Looked Up Digital Ticket Modal */}
      {activeTicketForModal && (
        <DigitalTicketModal
          registration={activeTicketForModal}
          tier={
            ticketTiers.find((t) => t.id === activeTicketForModal.ticketTierId) || ticketTiers[0]
          }
          settings={settings}
          onClose={() => setActiveTicketForModal(null)}
          onNavigateToCertificates={() => {
            setActiveTicketForModal(null);
            handleNavigate('certificados');
          }}
        />
      )}

      {/* Official Certificate Modal (PDF Generation & Print) */}
      {activeCertificateModal && (
        <OfficialCertificateModal
          certificate={activeCertificateModal}
          settings={settings}
          onClose={() => setActiveCertificateModal(null)}
        />
      )}

      {/* Certificate Authenticity Verification Modal */}
      {isVerificationModalOpen && (
        <CertificateVerificationModal
          initialCode={verificationInitialCode}
          isOpen={isVerificationModalOpen}
          onClose={() => {
            setIsVerificationModalOpen(false);
            setVerificationInitialCode('');
          }}
        />
      )}

      {/* Ticket Lookup Modal */}
      {isTicketLookupOpen && (
        <TicketLookupModal
          isOpen={isTicketLookupOpen}
          onClose={() => setIsTicketLookupOpen(false)}
          onSelectTicket={(reg) => setActiveTicketForModal(reg)}
        />
      )}

      {/* Conference Certificate Payment Modal (2.000 Kz) */}
      {payingConferenceReg && (
        <ConferenceCertificatePaymentModal
          registration={payingConferenceReg}
          settings={settings}
          isOpen={Boolean(payingConferenceReg)}
          onClose={() => setPayingConferenceReg(null)}
          onPaymentSuccess={() => {
            setRegistrations(eventStore.getRegistrations());
            setCertificates(eventStore.getCertificates());
            setAuditLogs(eventStore.getAuditLogs());
            // Immediately open the newly unlocked certificate
            const certRes = eventStore.issueOrGetCertificate(
              eventStore.getRegistrations().find((r) => r.id === payingConferenceReg.id)!
            );
            if (certRes.certificate) {
              setActiveCertificateModal(certRes.certificate);
            }
          }}
        />
      )}

      {/* Stand Reservation Modal */}
      {isStandBookingOpen && (
        <StandBookingModal
          isOpen={isStandBookingOpen}
          onClose={() => setIsStandBookingOpen(false)}
          onSubmit={handleStandBookingSubmit}
        />
      )}

      {/* Pitch Application Modal */}
      {isPitchApplicationOpen && (
        <PitchApplicationModal
          isOpen={isPitchApplicationOpen}
          onClose={() => setIsPitchApplicationOpen(false)}
          onSubmit={handlePitchApplicationSubmit}
        />
      )}

      {/* Sponsorship Inquiry Modal */}
      {isSponsorModalOpen && (
        <SponsorProposalModal
          isOpen={isSponsorModalOpen}
          onClose={() => setIsSponsorModalOpen(false)}
          onSubmit={handleSponsorProposalSubmit}
        />
      )}

      {/* Jury Evaluation Panel Modal */}
      {activeJuryCandidate && (
        <JuryScoringModal
          candidate={activeJuryCandidate}
          isOpen={Boolean(activeJuryCandidate)}
          onClose={() => setActiveJuryCandidate(null)}
          onSubmitEvaluation={handleJuryEvaluationSubmit}
        />
      )}

      {/* Administrator Dashboard & Portaria Validator */}
      {isAdminOpen && (
        <AdminDashboard
          settings={settings}
          ticketTiers={ticketTiers}
          registrations={registrations}
          certificates={certificates}
          exhibitors={exhibitors}
          pitchCandidates={pitchCandidates}
          agenda={agenda}
          auditLogs={auditLogs}
          onUpdateSettings={handleUpdateSettings}
          onUpdateTier={(tier) => {
            eventStore.updateTicketTier(tier);
            setTicketTiers(eventStore.getTicketTiers());
          }}
          onUpdateRegistrationStatus={handleUpdateRegistrationStatus}
          onValidateCheckIn={handleValidateCheckIn}
          onUpdateExhibitorStatus={handleUpdateExhibitorStatus}
          onAddAgendaSession={handleAddAgendaSession}
          onDeleteAgendaSession={handleDeleteAgendaSession}
          onViewCertificate={(cert) => setActiveCertificateModal(cert)}
          onViewTicket={(reg) => setActiveTicketForModal(reg)}
          onOpenCheckInPortal={() => {
            setIsAdminOpen(false);
            setIsStaffPortalOpen(true);
          }}
          onOpenDeliveryModal={(reg) => setDeliveryRegistration(reg)}
          onAnnulCertificate={handleAnnulCertificate}
          onReissueCertificate={handleReissueCertificate}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      {/* Ticket Delivery Channel Modal (WhatsApp / Email / Ambos) */}
      {deliveryRegistration && (
        <TicketDeliveryChannelModal
          registration={deliveryRegistration}
          tier={
            ticketTiers.find((t) => t.id === deliveryRegistration.ticketTierId) || ticketTiers[0]
          }
          settings={settings}
          isOpen={Boolean(deliveryRegistration)}
          onClose={() => setDeliveryRegistration(null)}
          onOpenTicketPass={() => {
            const reg = deliveryRegistration;
            setDeliveryRegistration(null);
            setActiveTicketForModal(reg);
          }}
        />
      )}

      {/* Check-In Staff Portal & Camera Scanner */}
      {isStaffPortalOpen && (
        <CheckInStaffPortal
          settings={settings}
          ticketTiers={ticketTiers}
          isOpen={isStaffPortalOpen}
          onClose={() => setIsStaffPortalOpen(false)}
          onOpenAdminFull={() => {
            setIsStaffPortalOpen(false);
            setIsAdminOpen(true);
          }}
        />
      )}
    </div>
  );
}
