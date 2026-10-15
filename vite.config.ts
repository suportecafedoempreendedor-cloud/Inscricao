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
