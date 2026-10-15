import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { Certificate, Registration, TicketTier, EventSettings } from '../types';

/**
 * Generates a high-resolution QR code data URL
 */
export async function generateQrDataUrl(text: string, color = '#1E1B4B'): Promise<string> {
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(
      text,
      {
        width: 300,
        margin: 1,
        color: {
          dark: color,
          light: '#FFFFFF',
        },
      },
      (err, url) => {
        if (err || !url) reject(err);
        else resolve(url);
      }
    );
  });
}

/**
 * Creates a high-fidelity A4 landscape canvas for the Official Certificate
 * Resolution: 2000px x 1414px (A4 ratio ~1.414)
 */
export async function createCertificateCanvas(
  certificate: Certificate,
  settings: EventSettings,
  qrDataUrl?: string
): Promise<HTMLCanvasElement> {
  const width = 2000;
  const height = 1414;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');

  // Background - Luxurious ivory paper
  ctx.fillStyle = '#FCFBF7';
  ctx.fillRect(0, 0, width, height);

  // Outer Border: Deep Royal Purple (#3B0764)
  const borderWidth = 32;
  ctx.fillStyle = '#3B0764';
  ctx.fillRect(0, 0, width, borderWidth);
  ctx.fillRect(0, height - borderWidth, width, borderWidth);
  ctx.fillRect(0, 0, borderWidth, height);
  ctx.fillRect(width - borderWidth, 0, borderWidth, height);

  // Inner Golden Border (#D97706)
  ctx.strokeStyle = '#D97706';
  ctx.lineWidth = 6;
  ctx.strokeRect(50, 50, width - 100, height - 100);

  // Second Inner Thin Border (#BE123C)
  ctx.strokeStyle = 'rgba(190, 18, 60, 0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(62, 62, width - 124, height - 124);

  // Corner Ornaments (Gold)
  const cornerSize = 40;
  ctx.strokeStyle = '#D97706';
  ctx.lineWidth = 5;
  // Top-left
  ctx.beginPath();
  ctx.moveTo(70, 70 + cornerSize);
  ctx.lineTo(70, 70);
  ctx.lineTo(70 + cornerSize, 70);
  ctx.stroke();
  // Top-right
  ctx.beginPath();
  ctx.moveTo(width - 70 - cornerSize, 70);
  ctx.lineTo(width - 70, 70);
  ctx.lineTo(width - 70, 70 + cornerSize);
  ctx.stroke();
  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(70, height - 70 - cornerSize);
  ctx.lineTo(70, height - 70);
  ctx.lineTo(70 + cornerSize, height - 70);
  ctx.stroke();
  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(width - 70 - cornerSize, height - 70);
  ctx.lineTo(width - 70, height - 70);
  ctx.lineTo(width - 70, height - 70 - cornerSize);
  ctx.stroke();

  // Draw Logo / Header Badge
  ctx.textAlign = 'center';

  // Subheader: REPÚBLICA DE ANGOLA · GERAÇÃO DIGITAL
  ctx.font = '700 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#9F1239';
  ctx.fillText('REPÚBLICA DE ANGOLA · GERAÇÃO DIGITAL ANGOLA', width / 2, 170);

  // Event Official Branding
  ctx.font = '800 36px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#1E1B4B';
  ctx.fillText('79.ª EDIÇÃO · CAFÉ DO EMPREENDEDOR', width / 2, 220);

  // Main Certificate Title
  ctx.font = '900 68px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#3B0764';
  ctx.fillText('CERTIFICADO DE PARTICIPAÇÃO', width / 2, 310);

  // Decorative Golden Line under title
  const lineGrad = ctx.createLinearGradient(width / 2 - 250, 0, width / 2 + 250, 0);
  lineGrad.addColorStop(0, '#D97706');
  lineGrad.addColorStop(0.5, '#BE123C');
  lineGrad.addColorStop(1, '#3B0764');
  ctx.fillStyle = lineGrad;
  ctx.fillRect(width / 2 - 250, 335, 500, 5);

  // Intro formula
  ctx.font = '600 26px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#6B7280';
  ctx.fillText('Certifica-se formalmente que', width / 2, 440);

  // Participant Name
  ctx.font = '800 58px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#1E1B4B';
  ctx.fillText(certificate.participantName, width / 2, 530);

  // Participant Line Underline
  ctx.strokeStyle = '#D1D5DB';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 450, 560);
  ctx.lineTo(width / 2 + 450, 560);
  ctx.stroke();

  // Description Text
  ctx.font = '400 28px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#374151';

  const isConference = certificate.type === 'CONFERENCIA';
  if (isConference) {
    ctx.fillText(
      'Participou com sucesso na Conferência Empresarial da 79.ª Edição do Café do Empreendedor,',
      width / 2,
      640
    );
    ctx.fillText(
      'assistindo e integrando os painéis temáticos dedicados a Recursos Humanos, Estratégia de Negócios,',
      width / 2,
      685
    );
    ctx.fillText(
      'Marketing e Finanças Empresariais em Angola.',
      width / 2,
      730
    );
  } else {
    ctx.fillText(
      `Concluiu a experiência de participação executiva no ${certificate.packageName}`,
      width / 2,
      640
    );
    ctx.fillText(
      'da 79.ª Edição do Café do Empreendedor, tendo participado nos fóruns executivos,',
      width / 2,
      685
    );
    ctx.fillText(
      'sessões práticas de estratégia de negócios e momentos de networking empresarial.',
      width / 2,
      730
    );
  }

  // Location & Date
  ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#6B7280';
  ctx.fillText(
    `${certificate.venueText || settings.venueName} · ${certificate.eventDateText || settings.eventDateText}`,
    width / 2,
    810
  );

  // Footer Divider Line
  ctx.strokeStyle = '#E5E7EB';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(140, 1080);
  ctx.lineTo(width - 140, 1080);
  ctx.stroke();

  // LEFT: Authorized Signatory
  ctx.textAlign = 'left';
  ctx.font = 'italic bold 32px "Playfair Display", Georgia, serif';
  ctx.fillStyle = '#3B0764';
  ctx.fillText('Geração Digital', 180, 1150);

  ctx.strokeStyle = '#9CA3AF';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(180, 1170);
  ctx.lineTo(460, 1170);
  ctx.stroke();

  ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#1F2937';
  ctx.fillText(settings.authorizedSignatoryName, 180, 1205);

  ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#6B7280';
  ctx.fillText(settings.authorizedSignatoryRole, 180, 1235);

  // CENTER: Authenticity Seal
  ctx.textAlign = 'center';
  ctx.font = '800 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#B45309';
  ctx.fillText('★ AUTENTICIDADE VERIFICADA ★', width / 2, 1150);

  ctx.font = '700 22px monospace';
  ctx.fillStyle = '#111827';
  ctx.fillText(`N.º: ${certificate.id}`, width / 2, 1195);

  ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#6B7280';
  ctx.fillText(`Emitido aos: ${certificate.issueDate}`, width / 2, 1230);

  // RIGHT: QR Code & Verification
  if (!qrDataUrl) {
    const verificationUrl = `${window.location.origin}?tab=validar-certificado&codigo=${encodeURIComponent(
      certificate.verificationCode || certificate.id
    )}`;
    qrDataUrl = await generateQrDataUrl(verificationUrl);
  }

  // Draw QR code image
  await new Promise<void>((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const qrSize = 130;
      const qrX = width - 180 - qrSize;
      const qrY = 1110;

      // QR White border background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(qrX - 6, qrY - 6, qrSize + 12, qrSize + 12);
      ctx.strokeStyle = '#D1D5DB';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(qrX - 6, qrY - 6, qrSize + 12, qrSize + 12);

      ctx.drawImage(img, qrX, qrY, qrSize, qrSize);

      ctx.textAlign = 'center';
      ctx.font = '600 16px monospace';
      ctx.fillStyle = '#4B5563';
      ctx.fillText(`Cód: ${certificate.verificationCode || certificate.id}`, qrX + qrSize / 2, qrY + qrSize + 22);

      resolve();
    };
    img.onerror = () => resolve();
    img.src = qrDataUrl!;
  });

  return canvas;
}

/**
 * Creates a high-fidelity portrait pass canvas for the Digital Ticket
 * Resolution: 1200px x 1700px
 */
export async function createTicketCanvas(
  registration: Registration,
  tier: TicketTier,
  settings: EventSettings,
  qrDataUrl?: string
): Promise<HTMLCanvasElement> {
  const width = 1200;
  const height = 1700;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');

  // Background: Deep dark zinc (#0A0A0F)
  ctx.fillStyle = '#0A0A0F';
  ctx.fillRect(0, 0, width, height);

  // Outer border
  ctx.strokeStyle = '#3F3F46';
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  // Top Header Banner with rich burgundy/magenta gradient
  const headerHeight = 220;
  const headGrad = ctx.createLinearGradient(0, 0, width, headerHeight);
  headGrad.addColorStop(0, '#3B0764');
  headGrad.addColorStop(0.5, '#881337');
  headGrad.addColorStop(1, '#BE123C');
  ctx.fillStyle = headGrad;
  ctx.fillRect(20, 20, width - 40, headerHeight);

  // Header Title
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 36px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('79.ª EDIÇÃO · CAFÉ DO EMPREENDEDOR', 60, 95);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('CREDENCIAL & INGRESSO DIGITAL OFICIAL', 60, 135);

  // Tier Badge in Header
  ctx.textAlign = 'right';
  ctx.fillStyle = '#FBBF24';
  ctx.fillRect(width - 360, 60, 300, 48);
  ctx.fillStyle = '#09090B';
  ctx.font = '900 20px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(tier.name.toUpperCase(), width - 210, 92);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 20px monospace';
  ctx.fillText(`CÓD: ${registration.ticketCode}`, width - 60, 150);

  // Attendee Section
  ctx.textAlign = 'left';
  ctx.fillStyle = '#9CA3AF';
  ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('TITULAR DA CREDENCIAL', 60, 310);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 48px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(registration.fullName, 60, 375);

  ctx.fillStyle = '#E5E7EB';
  ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`${registration.jobTitle} · ${registration.company}`, 60, 420);

  ctx.fillStyle = '#9CA3AF';
  ctx.font = '500 20px monospace';
  ctx.fillText(`${registration.email} · ${registration.phone}`, 60, 460);

  // Separator Line
  ctx.strokeStyle = '#27272A';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(60, 500);
  ctx.lineTo(width - 60, 500);
  ctx.stroke();

  // Event Info Grid
  ctx.fillStyle = '#9CA3AF';
  ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('LOCALIZAÇÃO DO EVENTO', 60, 550);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 26px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`${settings.venueName} · ${settings.city}`, 60, 595);

  ctx.fillStyle = '#FBBF24';
  ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(settings.eventDateText, 60, 635);

  // Status Badge
  const isConfirmed = registration.status === 'CONFIRMADO';
  ctx.textAlign = 'right';
  ctx.fillStyle = isConfirmed ? '#064E3B' : '#78350F';
  ctx.fillRect(width - 360, 540, 300, 44);
  ctx.strokeStyle = isConfirmed ? '#059669' : '#D97706';
  ctx.lineWidth = 2;
  ctx.strokeRect(width - 360, 540, 300, 44);

  ctx.fillStyle = isConfirmed ? '#6EE7B7' : '#FCD34D';
  ctx.font = '700 20px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`PAGAMENTO: ${registration.status}`, width - 210, 570);

  // QR Code Box Container
  const qrBoxY = 720;
  ctx.fillStyle = '#18181B';
  ctx.fillRect(60, qrBoxY, width - 120, 600);
  ctx.strokeStyle = '#27272A';
  ctx.lineWidth = 2;
  ctx.strokeRect(60, qrBoxY, width - 120, 600);

  // Generate QR if needed
  if (!qrDataUrl) {
    const secureQrString = `CE79-VALIDATE:${registration.ticketCode}:${registration.id}`;
    qrDataUrl = await generateQrDataUrl(secureQrString, '#111827');
  }

  // Draw QR Image inside Box
  await new Promise<void>((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const qrSize = 340;
      const qrX = width / 2 - qrSize / 2;
      const qrY = qrBoxY + 50;

      // White canvas pad for high scanner contrast
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(qrX - 16, qrY - 16, qrSize + 32, qrSize + 32);

      ctx.drawImage(img, qrX, qrY, qrSize, qrSize);

      ctx.textAlign = 'center';
      ctx.font = '800 24px monospace';
      ctx.fillStyle = '#F3F4F6';
      ctx.fillText(`CÓDIGO DE ACESSO: ${registration.ticketCode}`, width / 2, qrY + qrSize + 60);

      ctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#9CA3AF';
      ctx.fillText(
        'Apresente este código no telemóvel ou impresso para leitura na portaria.',
        width / 2,
        qrY + qrSize + 100
      );

      ctx.font = '500 18px monospace';
      ctx.fillStyle = '#6B7280';
      ctx.fillText(`Ref: ${registration.paymentReference} · ID: ${registration.id}`, width / 2, qrY + qrSize + 140);

      resolve();
    };
    img.onerror = () => resolve();
    img.src = qrDataUrl!;
  });

  // Footer Instructions
  ctx.textAlign = 'left';
  ctx.font = '400 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#6B7280';
  ctx.fillText('• Obrigatório apresentar documento de identidade coincidente com o titular.', 60, 1400);
  ctx.fillText('• Apoio oficial: +244 952 908 204 · Geração Digital Angola', 60, 1435);
  ctx.fillText('• Válido para entrada individual no evento oficial.', 60, 1470);

  return canvas;
}

/**
 * Downloads a canvas element as a PNG file
 */
export function downloadCanvasAsPng(canvas: HTMLCanvasElement, filename: string): void {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, 'image/png');
}

/**
 * Exports Certificate directly to PDF (Landscape A4)
 */
export async function downloadCertificatePdf(
  certificate: Certificate,
  settings: EventSettings,
  qrDataUrl?: string
): Promise<void> {
  const canvas = await createCertificateCanvas(certificate, settings, qrDataUrl);
  const imgData = canvas.toDataURL('image/jpeg', 0.95);

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

  const safeName = certificate.participantName.trim().replace(/\s+/g, '_');
  pdf.save(`Certificado-${certificate.id}-${safeName}.pdf`);
}

/**
 * Exports Certificate directly to high-res PNG image
 */
export async function downloadCertificateImage(
  certificate: Certificate,
  settings: EventSettings,
  qrDataUrl?: string
): Promise<void> {
  const canvas = await createCertificateCanvas(certificate, settings, qrDataUrl);
  const safeName = certificate.participantName.trim().replace(/\s+/g, '_');
  downloadCanvasAsPng(canvas, `Certificado-${certificate.id}-${safeName}.png`);
}

/**
 * Exports Digital Ticket directly to PDF (Portrait A5)
 */
export async function downloadTicketPdf(
  registration: Registration,
  tier: TicketTier,
  settings: EventSettings,
  qrDataUrl?: string
): Promise<void> {
  const canvas = await createTicketCanvas(registration, tier, settings, qrDataUrl);
  const imgData = canvas.toDataURL('image/jpeg', 0.95);

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a5',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

  const safeName = registration.fullName.trim().replace(/\s+/g, '_');
  pdf.save(`Ingresso-${registration.ticketCode}-${safeName}.pdf`);
}

/**
 * Exports Digital Ticket directly to high-res PNG image
 */
export async function downloadTicketImage(
  registration: Registration,
  tier: TicketTier,
  settings: EventSettings,
  qrDataUrl?: string
): Promise<void> {
  const canvas = await createTicketCanvas(registration, tier, settings, qrDataUrl);
  const safeName = registration.fullName.trim().replace(/\s+/g, '_');
  downloadCanvasAsPng(canvas, `Ingresso-${registration.ticketCode}-${safeName}.png`);
}

/**
 * Clean isolated printing helper using an invisible iframe
 * Avoids window.open / popups and prints only the document element
 */
export async function printCanvasDirectly(
  canvas: HTMLCanvasElement,
  title: string,
  orientation: 'landscape' | 'portrait' = 'landscape'
): Promise<void> {
  const imgData = canvas.toDataURL('image/png');

  // Create isolated hidden iframe
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.zIndex = '-9999';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    window.print();
    return;
  }

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html lang="pt-AO">
      <head>
        <title>${title}</title>
        <style>
          @page {
            size: ${orientation === 'landscape' ? 'A4 landscape' : 'A5 portrait'};
            margin: 0;
          }
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: #ffffff;
          }
          img {
            max-width: 100%;
            max-height: 100vh;
            width: auto;
            height: auto;
            display: block;
            margin: auto;
          }
        </style>
      </head>
      <body>
        <img src="${imgData}" alt="${title}" />
      </body>
    </html>
  `);
  doc.close();

  // Wait for image load in iframe then trigger print
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch {
      window.print();
    } finally {
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 3000);
    }
  }, 300);
}
