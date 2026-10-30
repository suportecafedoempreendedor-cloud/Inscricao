import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

function ticketDispatchApiPlugin(): Plugin {
  return {
    name: 'ticket-dispatch-api',
    configureServer(server) {
      server.middlewares.use('/api/tickets/send-dispatch', async (req: any, res: any) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk: any) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const data = JSON.parse(body || '{}');
            const { channel, phone, email, ticketCode, fullName, messageText, tierName } = data;

            const waToken = process.env.WHATSAPP_BUSINESS_TOKEN;
            const waPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
            const resendKey = process.env.RESEND_API_KEY;

            let isConfigured = false;
            let provider = '';
            let messageId = `msg_${Date.now()}`;

            // Real Meta WhatsApp Business Cloud API if configured
            if ((channel === 'WHATSAPP' || channel === 'AMBOS') && waToken && waPhoneId) {
              try {
                const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
                const waRes = await fetch(`https://graph.facebook.com/v20.0/${waPhoneId}/messages`, {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${waToken}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    messaging_product: 'whatsapp',
                    to: cleanPhone,
                    type: 'text',
                    text: { body: messageText },
                  }),
                });
                const waData = await waRes.json();
                if (waData?.messages?.[0]?.id) {
                  messageId = waData.messages[0].id;
                  isConfigured = true;
                  provider = 'WhatsApp Business Cloud API (Meta)';
                }
              } catch (err) {
                console.warn('Meta WhatsApp API error:', err);
              }
            }

            // Real Transactional Email API (Resend) if configured
            if ((channel === 'EMAIL' || channel === 'AMBOS') && resendKey) {
              try {
                const resendRes = await fetch('https://api.resend.com/emails', {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${resendKey}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    from: process.env.SENDER_EMAIL || 'bilhetes@cafedoempreendedor.ao',
                    to: [email],
                    subject: `Ingresso Oficial 79.ª Edição Café do Empreendedor · ${ticketCode}`,
                    html: `
                      <div style="font-family: sans-serif; background-color: #0A0A0F; color: #F3F4F6; padding: 24px;">
                        <h2 style="color: #BE123C;">79.ª Edição do Café do Empreendedor</h2>
                        <p>Prezado(a) <strong>${fullName}</strong>,</p>
                        <p>O seu ingresso digital foi confirmado com sucesso.</p>
                        <p><strong>Código Único:</strong> ${ticketCode}</p>
                        <p><strong>Modalidade:</strong> ${tierName || 'Geral'}</p>
                        <p>Apresente este código no telemóvel na portaria do evento.</p>
                      </div>
                    `,
                  }),
                });
                const resendData = await resendRes.json();
                if (resendData?.id) {
                  messageId = resendData.id;
                  isConfigured = true;
                  provider = provider ? `${provider} + Resend Email` : 'Resend Transacional API';
                }
              } catch (err) {
                console.warn('Resend API error:', err);
              }
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                success: true,
                configured: isConfigured,
                messageId,
                provider: provider || (channel === 'WHATSAPP' ? 'WhatsApp Direct Link Oficial' : 'Modelo Transacional HTML'),
                status: isConfigured ? 'ENTREGUE' : 'CONFIG_PENDING',
                missingKeys: {
                  whatsapp: !waToken || !waPhoneId,
                  email: !resendKey,
                },
              })
            );
          } catch (e: any) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: e.message || 'Erro ao processar envio' }));
          }
        });
      });

      // Notification API endpoint for new registrations to gdangola12@gmail.com
      server.middlewares.use('/api/notifications/new-registration', async (req: any, res: any) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk: any) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const data = JSON.parse(body || '{}');
            const { participant, event } = data;
            const targetAdmin = 'gdangola12@gmail.com';
            const subject = '[NOVA INSCRIÇÃO] Café do Empreendedor — 79.ª Edição';

            const emailHtml = `
              <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #032877; color: #F9F9FB; padding: 28px; border-radius: 12px; border: 2px solid #0173EF;">
                <h2 style="color: #F8D21C; margin-top: 0;">Nova inscrição recebida!</h2>
                <p style="font-size: 15px; color: #FFFFFF;">Uma nova pessoa acabou de se inscrever na 79.ª edição do Café do Empreendedor.</p>
                
                <div style="background-color: #021B54; padding: 18px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0173EF;">
                  <h3 style="color: #65A6F4; margin-top: 0; font-size: 16px;">Dados do participante:</h3>
                  <ul style="list-style: none; padding-left: 0; line-height: 1.8; font-size: 14px;">
                    <li><strong>Nome completo:</strong> ${participant?.fullName || 'N/A'}</li>
                    <li><strong>Número de telefone:</strong> ${participant?.phone || 'N/A'}</li>
                    <li><strong>WhatsApp:</strong> ${participant?.whatsapp || participant?.phone || 'N/A'}</li>
                    <li><strong>Endereço de e-mail:</strong> ${participant?.email || 'N/A'}</li>
                    <li><strong>Profissão ou área de actuação:</strong> ${participant?.jobTitle || 'N/A'}</li>
                    <li><strong>Empresa ou instituição:</strong> ${participant?.company || 'Participante Individual'}</li>
                    <li><strong>Data e hora da inscrição:</strong> ${participant?.createdAt || new Date().toISOString()}</li>
                    <li><strong>Número de identificação da inscrição:</strong> ${participant?.ticketCode || 'N/A'} (${participant?.id || ''})</li>
                    <li><strong>Estado do pagamento:</strong> ${participant?.status || 'PENDENTE'}</li>
                  </ul>
                </div>

                <div style="background-color: #0152D9; padding: 16px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #F8D21C; margin-top: 0; font-size: 16px;">Informações do evento:</h3>
                  <p style="margin: 4px 0;"><strong>Evento:</strong> Café do Empreendedor</p>
                  <p style="margin: 4px 0;"><strong>Edição:</strong> 79.ª</p>
                  <p style="margin: 4px 0;"><strong>Tema:</strong> Empreendedorismo que Gera Resultados</p>
                  <p style="margin: 4px 0;"><strong>Data:</strong> 27 de Novembro de 2026</p>
                  <p style="margin: 4px 0;"><strong>Horário:</strong> 08h30</p>
                  <p style="margin: 4px 0;"><strong>Local:</strong> Mediateca Zé Dú — Cazenga</p>
                  <p style="margin: 10px 0 0 0; padding: 8px; background-color: #032877; border-radius: 6px; font-weight: bold; color: #F8D21C;">
                    👔 DRESS CODE: VESTIR AZUL — OBRIGATÓRIO
                  </p>
                </div>

                <p style="font-size: 13px; color: #65A6F4; margin-bottom: 0;">
                  A inscrição foi registada com sucesso na base de dados. O pagamento, quando aplicável, continua sujeito à verificação pela organização executiva.
                </p>
              </div>
            `;

            let isConfigured = false;
            let messageId = `admin_notif_${Date.now()}`;
            const resendKey = process.env.RESEND_API_KEY;

            if (resendKey) {
              try {
                const resendRes = await fetch('https://api.resend.com/emails', {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${resendKey}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    from: process.env.SENDER_EMAIL || 'notificacoes@cafedoempreendedor.ao',
                    to: [targetAdmin],
                    subject,
                    html: emailHtml,
                  }),
                });
                const resendData = await resendRes.json();
                if (resendData?.id) {
                  messageId = resendData.id;
                  isConfigured = true;
                }
              } catch (err) {
                console.warn('Resend notification API error:', err);
              }
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                success: true,
                recipient: targetAdmin,
                subject,
                messageId,
                sentAt: new Date().toISOString(),
                status: isConfigured ? 'ENVIADO' : 'REGISTADO_LOCAL',
                provider: isConfigured ? 'Resend Transacional API' : 'Serviço de Notificações Integrado',
              })
            );
          } catch (e: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: e.message || 'Erro ao processar notificação' }));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), ticketDispatchApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
