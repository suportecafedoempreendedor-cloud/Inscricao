import { db } from './index.js';
import { users, registrations, exhibitors, paymentProofs, certificates } from './schema.js';
import { eq, desc } from 'drizzle-orm';

// User Helpers
export async function getOrCreateUser(uid: string, email: string, displayName?: string) {
  try {
    const result = await db
      .insert(users)
      .values({
        uid,
        email,
        displayName: displayName || null,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          displayName: displayName || null,
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Error in getOrCreateUser:', error);
    throw new Error('Falha ao autenticar utilizador na base de dados.', { cause: error });
  }
}

// Registration Queries
export async function getAllRegistrations() {
  try {
    return await db.select().from(registrations).orderBy(desc(registrations.createdAt));
  } catch (error) {
    console.error('Error in getAllRegistrations:', error);
    throw new Error('Falha ao listar inscrições.', { cause: error });
  }
}

export async function getRegistrationByCode(ticketCode: string) {
  try {
    const res = await db.select().from(registrations).where(eq(registrations.ticketCode, ticketCode));
    return res[0] || null;
  } catch (error) {
    console.error('Error in getRegistrationByCode:', error);
    throw new Error('Falha ao consultar inscrição por código.', { cause: error });
  }
}

export async function insertRegistration(data: typeof registrations.$inferInsert) {
  try {
    const res = await db.insert(registrations).values(data).returning();
    return res[0];
  } catch (error) {
    console.error('Error in insertRegistration:', error);
    throw new Error('Falha ao registar inscrição na base de dados.', { cause: error });
  }
}

export async function updateRegistrationStatus(id: string, status: string, notes?: string) {
  try {
    const res = await db
      .update(registrations)
      .set({
        status,
        notes: notes || undefined,
      })
      .where(eq(registrations.id, id))
      .returning();
    return res[0] || null;
  } catch (error) {
    console.error('Error in updateRegistrationStatus:', error);
    throw new Error('Falha ao atualizar estado da inscrição.', { cause: error });
  }
}

// Exhibitor Queries
export async function getAllExhibitors() {
  try {
    return await db.select().from(exhibitors).orderBy(desc(exhibitors.createdAt));
  } catch (error) {
    console.error('Error in getAllExhibitors:', error);
    throw new Error('Falha ao carregar lista de expositores.', { cause: error });
  }
}

export async function insertExhibitor(data: typeof exhibitors.$inferInsert) {
  try {
    const res = await db.insert(exhibitors).values(data).returning();
    return res[0];
  } catch (error) {
    console.error('Error in insertExhibitor:', error);
    throw new Error('Falha ao registar solicitação de expositor.', { cause: error });
  }
}

// Payment Proof Queries
export async function getAllPaymentProofs() {
  try {
    return await db.select().from(paymentProofs).orderBy(desc(paymentProofs.createdAt));
  } catch (error) {
    console.error('Error in getAllPaymentProofs:', error);
    throw new Error('Falha ao carregar comprovativos de pagamento.', { cause: error });
  }
}

export async function insertPaymentProof(data: typeof paymentProofs.$inferInsert) {
  try {
    const res = await db.insert(paymentProofs).values(data).returning();
    return res[0];
  } catch (error) {
    console.error('Error in insertPaymentProof:', error);
    throw new Error('Falha ao submeter comprovativo de pagamento.', { cause: error });
  }
}

// Certificate Queries
export async function getCertificateByCode(verificationCode: string) {
  try {
    const res = await db.select().from(certificates).where(eq(certificates.verificationCode, verificationCode));
    return res[0] || null;
  } catch (error) {
    console.error('Error in getCertificateByCode:', error);
    throw new Error('Falha ao validar certificado.', { cause: error });
  }
}
