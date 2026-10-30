import { pgTable, serial, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

// Users table (linked to Firebase Auth UID)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  displayName: text('display_name'),
  role: text('role').default('PARTICIPANTE'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Registrations table
export const registrations = pgTable('registrations', {
  id: text('id').primaryKey(),
  ticketCode: text('ticket_code').notNull().unique(),
  internalControlCode: text('internal_control_code'),
  ticketStatus: text('ticket_status').default('EMITIDO'),
  ticketTierId: text('ticket_tier_id').notNull(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  whatsapp: text('whatsapp'),
  company: text('company'),
  jobTitle: text('job_title'),
  areaOfExpertise: text('area_of_expertise'),
  amountAoa: integer('amount_aoa').default(0),
  paymentMethod: text('payment_method').default('TRANSFERENCIA_BANCARIA'),
  paymentReference: text('payment_reference'),
  status: text('status').default('PENDENTE'),
  checkInStatus: text('check_in_status').default('PENDENTE'),
  checkInTime: text('check_in_time'),
  checkedInBy: text('checked_in_by'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Exhibitors table
export const exhibitors = pgTable('exhibitors', {
  id: text('id').primaryKey(),
  companyName: text('company_name').notNull(),
  responsibleName: text('responsible_name'),
  sector: text('sector').notNull(),
  productOrServiceToExpose: text('product_or_service_to_expose'),
  description: text('description'),
  standNumber: text('stand_number'),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  province: text('province'),
  municipality: text('municipality'),
  feeConfirmed: boolean('fee_confirmed').default(false),
  amountAoa: integer('amount_aoa').default(25000),
  status: text('status').default('PENDENTE'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Payment Proofs table
export const paymentProofs = pgTable('payment_proofs', {
  id: serial('id').primaryKey(),
  registrationId: text('registration_id'),
  fullName: text('full_name').notNull(),
  phone: text('phone').notNull(),
  amountAoa: integer('amount_aoa').notNull(),
  paymentMethod: text('payment_method').notNull(),
  proofFileUrl: text('proof_file_url').notNull(),
  proofFileName: text('proof_file_name').notNull(),
  notes: text('notes'),
  status: text('status').default('EM_ANALISE'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Certificates table
export const certificates = pgTable('certificates', {
  id: text('id').primaryKey(),
  registrationId: text('registration_id').notNull(),
  ticketCode: text('ticket_code').notNull(),
  participantName: text('participant_name').notNull(),
  edition: text('edition').default('79.ª Edição'),
  theme: text('theme').notNull(),
  certificateType: text('certificate_type').notNull(),
  verificationCode: text('verification_code').notNull().unique(),
  status: text('status').default('VALIDO'),
  createdAt: timestamp('created_at').defaultNow(),
});
